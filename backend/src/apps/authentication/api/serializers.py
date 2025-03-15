from rest_framework import serializers
from django.contrib.auth.models import User
from django.db import transaction
from dj_rest_auth.registration.serializers import RegisterSerializer
from dj_rest_auth.serializers import LoginSerializer
from django.core.exceptions import ValidationError
from allauth.account.models import EmailAddress
from django.contrib.auth import authenticate
from rest_framework.exceptions import AuthenticationFailed
from dj_rest_auth.serializers import LoginSerializer
from django.contrib.auth import (get_user_model,)
import re

class UserSerializer(serializers.ModelSerializer):
    """Serializer for user object"""

    class Meta:
        model = get_user_model()
        fields = ["email", "password", "first_name", "last_name", "is_vendor"]
        extra_kwargs = {"password": {"write_only": True, "min_length": 5}}

    def create(self, validated_data):
        """Create a user with encrypted password and return the user"""
        return get_user_model().objects.create_user(**validated_data)

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
    username = None #remove username
    email = serializers.EmailField(required=True)
    first_name = serializers.CharField(max_length=255, required=True)
    last_name = serializers.CharField(max_length=255, required=True)

    @transaction.atomic
    def save(self, request):
        user = super().save(request)
        user.first_name = self.data.get("first_name", "")
        user.last_name = self.data.get("last_name", "")
        user.save()
        return user
    
    
    def validate_email(self, email):
        email = email.strip()  # Remove leading/trailing spaces

        # Validate email format
        email_regex = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
        if not re.match(email_regex, email):
            raise ValidationError({"email": ["Please enter a valid email address."]})

        if get_user_model().objects.filter(email=email).exists():
            raise ValidationError({"email": ["An account with this email already exists"]})

        return email
            

class CustomLoginSerializer(LoginSerializer):
    username_field = "email"


    def get_auth_user(self, request, email, password): 
        """Authenticate user with email and password."""
        user = authenticate(email=email, password=password)
        if not user:
            #drf translates into 401 response
            raise AuthenticationFailed("Invalid credentials")
        return user

    def validate(self, attrs):
        email = attrs.get(self.username_field)
        password = attrs.get("password")

        user = self.get_auth_user(self.context.get('request'), email, password)
        if user and not EmailAddress.objects.filter(user=user, verified=True).exists():
            #drf translates into 401 response
            raise AuthenticationFailed("Your email is not verified.")
        
        data = super().validate(attrs)
        data["is_vendor"] = user.is_vendor
        return data
    