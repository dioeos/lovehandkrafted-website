from enum import IntEnum
from rest_framework import serializers
from django.contrib.auth.models import User
from django.db import transaction, IntegrityError
from dj_rest_auth.registration.serializers import RegisterSerializer
from dj_rest_auth.serializers import LoginSerializer
from django.core.exceptions import ValidationError
from allauth.account.models import EmailAddress
from django.contrib.auth import authenticate
from rest_framework.exceptions import AuthenticationFailed
from dj_rest_auth.serializers import LoginSerializer
from django.contrib.auth import (
    get_user_model,
)
from django.contrib.auth.password_validation import validate_password
from allauth.account.adapter import get_adapter
import re, unicodedata


class UserSerializer(serializers.ModelSerializer):
    """Serializer for user object"""

    class Meta:
        model = get_user_model()
        fields = ["email", "password", "first_name", "last_name", "is_vendor"]
        read_only_fields = ["is_vendor"]
        extra_kwargs = {
            "password": {"write_only": True, "validators": [validate_password]}
        }

    def create(self, validated_data):
        """Create a user with encrypted password and return the user"""
        # return get_user_model().objects.create_user(**validated_data)

        password = validated_data.pop("password")
        email = validated_data["email"]

        try:
            with transaction.atomic():
                User = get_user_model()
                user = User.objects.create_user(password=password, **validated_data)

                EmailAddress.objects.update_or_create(
                    user=user,
                    emai=user.email,
                    defaults={"primary": True, "verified": False},
                )

                adapter = get_adapter()
                transaction.on_commit(lambda: adapter.send_confirmation_mail(user, None))
                return user
        except IntegrityError:
            raise serializers.ValidationError(
                {"email": ["This email is already registered."]}
            )

    def update(self, instance, validated_data):
        """Update a user and return the user"""
        password = validated_data.pop("password", None)
        user = super().update(instance, validated_data)

        if password:
            user.set_password(password)
            user.save()

        return user


class CustomRegisterSerializer(RegisterSerializer):
    """Custom serializer for user registration."""

    username = None  # remove username
    email = serializers.EmailField(required=True)
    first_name = serializers.CharField(max_length=255, required=True)
    last_name = serializers.CharField(max_length=255, required=True)

    @transaction.atomic
    def save(self, request):
        email = get_user_model().objects.normalize_email(self.validated_data["email"])
        self.validated_data["email"] = email

        first_name = self.validated_data["first_name"]
        last_name = self.validated_data["last_name"]

        # to catch duplicate insert
        try:
            user = super().save(request)
        except IntegrityError:
            raise serializers.ValidationError(
                {"email": ["A user with that email already exists."]}
            )

        user.first_name = first_name
        user.last_name = last_name
        user.save(update_fields=["first_name", "last_name"])
        return user

    def validate_email(self, email):
        email = email.strip()  # Remove leading/trailing spaces
        email = get_user_model().objects.normalize_email(email)

        # Validate email format
        email_regex = r"^[^\s@]+@[^\s@]+\.[^\s@]+$"
        if not re.match(email_regex, email):
            raise ValidationError({"email": ["Please enter a valid email address."]})

        if get_user_model().objects.filter(email=email).exists():
            raise ValidationError(
                {"email": ["An account with this email already exists"]}
            )

        return email

    NAME_REGEX = re.compile(r"^[A-Za-z]+(?:(?:[ '\u2019-])[A-Za-z]+)*$")

    def validate_first_name(self, first_name):
        name = first_name.strip()

        name = name.replace("\u2019", "'")

        if any(ord(ch) < 32 for ch in name):
            raise serializers.ValidationError(
                "First name contains invalid control characters."
            )

        for ch in name:
            if unicodedata.category(ch).startswith("S"):
                raise serializers.ValidationError(
                    "First name may not contain symbols or emojis."
                )

        if not self.NAME_REGEX.match(name):
            raise serializers.ValidationError(
                "First name may only contain letters, spaces, apostrophes or hyphens."
            )

        return name

    def validate_last_name(self, last_name):
        name = last_name.strip()

        name = name.replace("\u2019", "'")
        if any(ord(ch) < 32 for ch in name):
            raise serializers.ValidationError(
                "Last name contains invalid control characters."
            )
        for ch in name:
            if unicodedata.category(ch).startswith("S"):
                raise serializers.ValidationError(
                    "Last name may not contain symbols or emojis."
                )
        if not self.NAME_REGEX.match(name):
            raise serializers.ValidationError(
                "Last name may only contain letters, spaces, apostrophes or hyphens."
            )
        return name


class CustomLoginSerializer(LoginSerializer):
    username_field = "email"

    def get_auth_user(self, request, email, password):
        """Authenticate user with email and password."""
        user = authenticate(email=email, password=password)
        if not user:
            # drf translates into 401 response
            raise AuthenticationFailed("Invalid credentials")
        return user

    def validate(self, attrs):
        email = attrs.get(self.username_field)
        password = attrs.get("password")

        user = self.get_auth_user(self.context.get("request"), email, password)
        if user and not EmailAddress.objects.filter(user=user, verified=True).exists():
            # drf translates into 401 response
            raise AuthenticationFailed("Your email is not verified.")

        data = super().validate(attrs)
        data["is_vendor"] = user.is_vendor
        return data
