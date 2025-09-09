from django.test import TestCase
from django.core.exceptions import ValidationError
from django.db.utils import IntegrityError
from datetime import datetime
from rest_framework.test import APITestCase
from rest_framework import status
from apps.newsletter.api.serializers import Subscriber, SubscriberSerializer

from .models import Subscriber

class SubscriberModelTests(TestCase):
    def setUp(self):
        self.subscriber = Subscriber.objects.create(
            email="testemail@gmail.com"
        )

    def test_creation_defaults(self):
        self.assertEqual(self.subscriber.email, "testemail@gmail.com")
        self.assertTrue(self.subscriber.is_active)
        self.assertIsInstance(self.subscriber.joined_date, datetime)

    def test_str(self):
        self.assertEqual(str(self.subscriber), "testemail@gmail.com")

    def test_unique_email_rule(self):
        with self.assertRaises(IntegrityError):
            Subscriber.objects.create(email="testemail@gmail.com")

    def test_invalid_email_full_clean(self):
        bad = Subscriber(email="not-an-email")
        with self.assertRaises(ValidationError):
            bad.full_clean()

class SubscriberSerializerTests(TestCase):
    def test_serializer_with_valid_data(self):
        data = {
            "email": "test@example.com"
        }
        serializer = SubscriberSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        obj = serializer.save()
        self.assertEqual(obj.email, data["email"])
        self.assertTrue(obj.is_active)

    def test_serializer_with_invalid_email(self):
        data = {
            "email" : "dawdaw"
        }
        serializer = SubscriberSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("email", serializer.errors)
    
class UserSubscriberEndpointTests(APITestCase):
    def setUp(self):
        self.subscribe_url = "/api/newsletter/subscribe/"

    def test_subscribe_success(self):
        """Tests that subscribe endpoint succeeds"""
        payload = {
            "email" : "test1@example.com"
        }
        response = self.client.post(self.subscribe_url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Subscriber.objects.filter(email=payload["email"]).exists())

    def test_subscribe_duplicate(self):
        """Test duplicate subscribe endpoint fails"""
        Subscriber.objects.create(email="test2@example.com")
        response = self.client.post(
            self.subscribe_url,
            {"email": "test2@example.com"},
            format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("email", response.data)

    def test_subscribe_invalid_email(self):
        """Test subscribe endpoint with invalid email"""
        response = self.client.post(
            self.subscribe_url,
            {"email": "adwadawd"},
            format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("email", response.data)


from django.contrib.auth import get_user_model 

class AdminSubscriberEndpointTests(APITestCase):
    def setUp(self):
        self.send_url = "/api/newsletter/send/"

        admin = get_user_model().objects.create_user(
            email="admin@example.com",
            password="password"
        )
        admin.first_name = "Admin"
        admin.last_name = "1"
        admin.is_staff = False
        admin.is_verified = True
        admin.is_vendor = True

    def test_send_requires_authentication(self):
        """Anonymous users should be 401 unauthorized"""
        response = self.client.post(self.send_url, {}, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_send_invalid_authentication(self):
        """User logged in but non-vendor users should be forbidden"""
        user = get_user_model().objects.create_user(
            email="user@example.com",
            password="password",
            is_verified= True
        )
        self.client.force_authenticate(user=user)
        response = self.client.post(self.send_url, {}, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_send_succeeds_for_vendors(self):
        """Users with vendor permissions should be able to send newsletters"""
        vendor = get_user_model().objects.create_user(
            email="vendor@example.com",
            password="password",
            is_vendor=True,
            is_verified=True,
            is_staff=False
        )
        self.client.force_authenticate(user=vendor)

        Subscriber.objects.create(email="sub1@example.com")
        Subscriber.objects.create(email="sub2@example.com")

        payload = {
            "subject": "Weekly Update",
            "content": "Hello subscribers!"
        }

        response = self.client.post(self.send_url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("sent_count", response.data)
        self.assertEqual(response.data["sent_count"], 2)

    def test_send_succeeds_for_staff(self):
        """Users with staff permission should be able to send newsletters"""
        staff = get_user_model().objects.create_user(
            email="vendor@example.com",
            password="password",
            is_vendor=True,
            is_verified=True,
            is_staff=True
        )
        self.client.force_authenticate(user=staff)

        Subscriber.objects.create(email="sub3@example.com")
        Subscriber.objects.create(email="sub4@example.com")

        payload = {
            "subject": "Weekly Update",
            "content": "Hello subscribers!"
        }

        response = self.client.post(self.send_url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("sent_count", response.data)
        self.assertEqual(response.data["sent_count"], 2)



