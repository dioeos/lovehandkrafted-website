from rest_framework import serializers
from django.contrib.auth.models import User
from django.db import transaction
from dj_rest_auth.registration.serializers import RegisterSerializer


#ensures valid input
# class AddSerializer(serializers.Serializer):
#     x = serializers.FloatField()
#     y = serializers.FloatField()

# class UserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         fields = ('id', 'username', 'password')
#         extra_kwargs = { 'password': {'write_only': True}}

#     def create(self, validated_data):
#         password = validated_data.pop('password') 
#         user = User(**validated_data)
#         user.set_password(password)  
#         user.save()
#         return user  
from django.contrib.auth import (get_user_model,)

class UserSerializer(serializers.ModelSerializer):
    """Serializer for user object"""

    class Meta:
        model = get_user_model()
        fields = ["email", "password", "name"]
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
    name = serializers.CharField(max_length=255)

    # Define transaction.atomic to rollback the save operation in case of error
    @transaction.atomic
    def save(self, request):
        user = super().save(request)
        user.name = self.data.get("name")
        user.save()
        return user