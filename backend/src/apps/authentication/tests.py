from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from allauth.account.models import EmailAddress
from rest_framework import status

class ModelTests(TestCase):
    """Tests for the user models of the application"""

    def test_create_user_with_email_ok(self):
        """Test creating a user with an email address works"""
        email = "testuser1@example.com"
        password = "testuserPassword1!"
        user = get_user_model().objects.create_user(
            email=email,
            password=password,
        )

        self.assertEqual(user.email, email)
        self.assertTrue(user.check_password(password))

    def test_created_user_email_normalized(self):
        """Test email address of new users is normalized"""
        test_emails = [
            ["testuser1@EXAMPLE.com", "testuser1@example.com"],
            ["TestUser2@Example.com", "TestUser2@example.com"],
            ["TESTUSER3@EXAMPLE.com", "TESTUSER3@example.com"],
            ["testuser4@example.COM", "testuser4@example.com"],
        ]
        for email, expected in test_emails:
            user = get_user_model().objects.create_user(email, "testPwd1!")
            self.assertEqual(user.email, expected)

    def test_create_user_without_email(self):
        """Test creating a user without an email address fails"""
        with self.assertRaises(ValueError):
            get_user_model().objects.create_user("", "testPwd1!")

    def test_create_superuser(self):
        """Test creating a superuser"""
        user = get_user_model().objects.create_superuser(
            "testadmin@example.com",
            "testPwd1!",
        )

        self.assertTrue(user.is_superuser)
        self.assertTrue(user.is_staff)

class CustomLoginSerializerTests(APITestCase):
    def setUp(self):
        self.login_url = "/api/authentication/dj-rest-auth/login/"

    def test_valid_credentials(self):
        """Test login with valid credentials"""
        user = get_user_model().objects.create_user(email="test_valid@example.com", password="password123")
        EmailAddress.objects.create(user=user, email=user.email, verified=True, primary=True)
        response = self.client.post(self.login_url, {"email": "test_valid@example.com", "password": "password123"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    
    def test_invalid_password(self):
        """Test login with invalid password"""
        user = get_user_model().objects.create_user(email="test_valid2@example.com", password="password123")
        EmailAddress.objects.create(user=user, email=user.email, verified=True, primary=True)
        response = self.client.post(self.login_url, {"email": "test_valid2@example.com", "password": "HelloWorld!"})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_login_invalid_credentials(self):
        """Test login with invalid credentials"""
        response = self.client.post(self.login_url, {"email": "invalid@example.com", "password": "wrongpass"})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn("Invalid credentials", response.data.get("detail", []))

    def test_login_unverified_email(self):
        """test login with unverified email"""
        user = get_user_model().objects.create_user(email="test@example.com", password="password123")
        EmailAddress.objects.create(user=user, email=user.email, verified=False, primary=True)

        response = self.client.post(self.login_url, {"email": "test@example.com", "password": "password123"})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn("Your email is not verified.", response.data.get("detail", []))


class CustomRegisterSerializer(APITestCase):
    def setUp(self):
        self.register_url = "/api/authentication/dj-rest-auth/registration/"

    def test_valid_registration(self):
        """Test registration with valid credentials"""
        response = self.client.post(self.register_url, {
            "email": "register@example.com",
            "password1": "password80",
            "password2": "password80",
            "name": "register@example.com",
        })
        #asserts that the response is a redirect (sends confirmation email)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        user_exists = get_user_model().objects.filter(email="register@example.com").exists()
        self.assertTrue(user_exists)
        user = get_user_model().objects.get(email="register@example.com")
        self.assertEqual(user.email, "register@example.com")
        self.assertTrue(user.check_password("password80"))
        self.assertEqual(user.name, "register@example.com")

    def test_invalid_email_registration(self):
        """Test registration with invalid email"""
        response = self.client.post(self.register_url, {
            "email": "thisisnotanemailitisjusttext",
            "password1": "password80",
            "password2": "password80",
            "name": "thisisnotanemailitisjusttext",
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_script_prevention_registration(self):
        """Test registration with script prevention"""
        response = self.client.post(self.register_url, {
            "email": "<script>alert('XSS');</script>",
            "password1": "password80",
            "password2": "password80",
            "name": "<script>alert('XSS');</script>",
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        user_exists = get_user_model().objects.filter(email="<script>alert('XSS');</script>@example.com").exists()
        self.assertFalse(user_exists)

    def test_duplicate_email_registration(self):
        """Test registration with existing account under email"""
        first_response = self.client.post(self.register_url, {
            "email": "email1@example.com",
            "password1": "password80",
            "password2": "password80",
            "name": "email@example.com",
        })
        self.assertEqual(first_response.status_code, status.HTTP_201_CREATED)
        user1_exists = get_user_model().objects.filter(email="email1@example.com")
        self.assertTrue(user1_exists)

        second_response = self.client.post(self.register_url, {
            "email": "email1@example.com",
            "password1": "password80",
            "password2": "password80",
            "name": "email1@example.com",
        })
        self.assertEqual(second_response.status_code, status.HTTP_400_BAD_REQUEST)
        user2_exists = get_user_model().objects.filter(email="email2@example.com")
        self.assertFalse(user2_exists)

    def test_missing_email_registration(self):
        """Test registration with missing email field"""
        response = self.client.post(self.register_url, {
            "email": "",
            "password1": "password80",
            "password2": "password80",
            "name": ""
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_missing_password_registration(self):
        """Test registration with missing password field"""
        response = self.client.post(self.register_url, {
            "email": "example@example.com",
            "password1": "",
            "password2": "",
            "name": "example@example.com"
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_long_inputs_registration(self):
        """Test registraion wtih long inputs"""
        long_name = "a" * 300
        long_email = "a" * 245 + "@example.com"
        response = self.client.post(self.register_url, {
            "email": long_email,
            "password1": "password80",
            "password2": "password80",
            "name": long_name
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_email_with_spaces_registration(self):
        """Test registration with extra spaces"""
        response = self.client.post(self.register_url, {
            "email": " spaces@example.com ",
            "password1": "password80",
            "password2": "password80",
            "name": "spaces@example.com"
        })

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        user_exists = get_user_model().objects.filter(email="spaces@example.com").first()
        self.assertTrue(user_exists)

