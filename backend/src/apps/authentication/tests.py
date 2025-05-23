from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from allauth.account.models import EmailAddress
from rest_framework import status
from apps.authentication.api.serializers import CustomRegisterSerializer


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
        self.login_url = "/api/authentication/login/"

    def test_valid_credentials(self):
        """Test login with valid credentials"""
        user = get_user_model().objects.create_user(
            email="test_valid@example.com", password="password123"
        )
        EmailAddress.objects.create(
            user=user, email=user.email, verified=True, primary=True
        )
        response = self.client.post(
            self.login_url,
            {"email": "test_valid@example.com", "password": "password123"},
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_invalid_password(self):
        """Test login with invalid password"""
        user = get_user_model().objects.create_user(
            email="test_valid2@example.com", password="password123"
        )
        EmailAddress.objects.create(
            user=user, email=user.email, verified=True, primary=True
        )
        response = self.client.post(
            self.login_url,
            {"email": "test_valid2@example.com", "password": "HelloWorld!"},
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_login_invalid_credentials(self):
        """Test login with invalid credentials"""
        response = self.client.post(
            self.login_url, {"email": "invalid@example.com", "password": "wrongpass"}
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn("Invalid credentials", response.data.get("detail", []))

    def test_login_unverified_email(self):
        """test login with unverified email"""
        user = get_user_model().objects.create_user(
            email="test@example.com", password="password123"
        )
        EmailAddress.objects.create(
            user=user, email=user.email, verified=False, primary=True
        )

        response = self.client.post(
            self.login_url, {"email": "test@example.com", "password": "password123"}
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn("Your email is not verified.", response.data.get("detail", []))


class CustomRegisterSerializerTests(APITestCase):
    def setUp(self):
        self.register_url = "/api/authentication/registration/"

    def test_valid_registration(self):
        """Test registration with valid credentials"""
        response = self.client.post(
            self.register_url,
            {
                "email": "register@example.com",
                "password1": "password80",
                "password2": "password80",
                "first_name": "valid",
                "last_name": "registration",
            },
        )
        # asserts that the response is a redirect (sends confirmation email)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        user_exists = (
            get_user_model().objects.filter(email="register@example.com").exists()
        )
        self.assertTrue(user_exists)
        user = get_user_model().objects.get(email="register@example.com")
        self.assertEqual(user.email, "register@example.com")
        self.assertTrue(user.check_password("password80"))
        self.assertEqual(user.first_name, "valid")
        self.assertEqual(user.last_name, "registration")

    def test_invalid_email_registration(self):
        """Test registration with invalid email"""
        response = self.client.post(
            self.register_url,
            {
                "email": "thisisnotanemailitisjusttext",
                "password1": "password80",
                "password2": "password80",
                "first_name": "thisisnotanemailitisjusttext",
                "last_name": "thisisnotlastname",
            },
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_script_prevention_registration(self):
        """Test registration with script prevention"""
        response = self.client.post(
            self.register_url,
            {
                "email": "<script>alert('XSS');</script>",
                "password1": "password80",
                "password2": "password80",
                "first_name": "<script>alert('XSS');</script>",
                "last_name": "<script>alert('XSS');</script>",
            },
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        user_exists = (
            get_user_model()
            .objects.filter(email="<script>alert('XSS');</script>@example.com")
            .exists()
        )
        self.assertFalse(user_exists)

    def test_duplicate_email_registration(self):
        """Test registration with existing account under email"""
        first_response = self.client.post(
            self.register_url,
            {
                "email": "email1@example.com",
                "password1": "password80",
                "password2": "password80",
                "first_name": "register",
                "last_name": "example",
            },
        )
        self.assertEqual(first_response.status_code, status.HTTP_201_CREATED)
        user1_exists = get_user_model().objects.filter(email="email1@example.com")
        self.assertTrue(user1_exists)

        second_response = self.client.post(
            self.register_url,
            {
                "email": "email1@example.com",
                "password1": "password80",
                "password2": "password80",
                "first_name": "register",
                "last_name": "example",
            },
        )
        self.assertEqual(second_response.status_code, status.HTTP_400_BAD_REQUEST)
        user2_exists = get_user_model().objects.filter(email="email2@example.com")
        self.assertFalse(user2_exists)

    def test_missing_email_registration(self):
        """Test registration with missing email field"""
        response = self.client.post(
            self.register_url,
            {
                "email": "",
                "password1": "password80",
                "password2": "password80",
                "first_name": "first",
                "last_name": "last",
            },
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_missing_password_registration(self):
        """Test registration with missing password field"""
        response = self.client.post(
            self.register_url,
            {
                "email": "example@example.com",
                "password1": "",
                "password2": "",
                "first_name": "first",
                "last_name": "last",
            },
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_long_inputs_registration(self):
        """Test registraion wtih long inputs"""
        long_name = "a" * 300
        long_email = "a" * 245 + "r"
        response = self.client.post(
            self.register_url,
            {
                "email": long_email,
                "password1": "password80",
                "password2": "password80",
                "first_name": long_name,
                "last_name": long_name,
            },
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_email_with_spaces_registration(self):
        """Test registration with extra spaces"""
        response = self.client.post(
            self.register_url,
            {
                "email": " spaces@example.com ",
                "password1": "password80",
                "password2": "password80",
                "first_name": "with",
                "last_name": "spaces",
            },
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        user_exists = (
            get_user_model().objects.filter(email="spaces@example.com").first()
        )
        self.assertTrue(user_exists)


class ResetPasswordTests(APITestCase):

    def setUp(self):
        self.reset_password_url = "/api/authentication/password/reset"

    def test_valid_reset_password_request(self):
        """Test reset password with valid email"""
        response = self.client.post(
            self.reset_password_url, {"email": "example@example.com"}
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_invalid_email_input_reset_password_request(self):
        """Test reset password with invalid email input"""
        response = self.client.post(
            self.reset_password_url, {"email": "invalidemailformat"}
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_invalid_email_reset_password_request(self):
        """Test reset password request with invalid email"""
        user = "thisissomefakeemail@example.com"
        response = self.client.post(self.reset_password_url, {"email": user})
        # dj-rest-auth's reset password endpoint sends 200 if email does not exist or does
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class NameValidationTests(TestCase):
    """Tests valid/invalid names for registering"""

    def setUp(self):
        self.base_data = {
            "email": "foo@example.com",
            "password1": "ComplexP@ssw0rd",
            "password2": "ComplexP@ssw0rd",
            "first_name": "Alice",
            "last_name": "Smith",
        }

    def test_valid_names(self):
        data = self.base_data.copy()
        data["first_name"] = "O’Connor"
        data["last_name"] = "Van-Dyke"
        serializer = CustomRegisterSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)

    def test_strips_whitespace(self):
        data = self.base_data.copy()
        data["first_name"] = "  Bob  "
        data["last_name"] = "\tCarol\n"
        serializer = CustomRegisterSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        serializer.is_valid(raise_exception=True)
        self.assertEqual(serializer.validated_data["first_name"], "Bob")
        self.assertEqual(serializer.validated_data["last_name"], "Carol")

    def test_control_characters_rejected(self):
        data = self.base_data.copy()
        data["first_name"] = "D\teitel"
        serializer = CustomRegisterSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("first_name", serializer.errors)
        self.assertIn("control characters", serializer.errors["first_name"][0])

    def test_emoji_rejected(self):
        data = self.base_data.copy()
        data["last_name"] = "💖Star"
        serializer = CustomRegisterSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("last_name", serializer.errors)
        self.assertIn(
            "may not contain symbols or emojis", serializer.errors["last_name"][0]
        )

    def test_invalid_characters_rejected(self):
        data = self.base_data.copy()
        data["first_name"] = "Anne!"
        serializer = CustomRegisterSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("first_name", serializer.errors)
        self.assertIn("only contain letters", serializer.errors["first_name"][0])
