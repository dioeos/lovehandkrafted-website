# import json

# from django.contrib.auth import authenticate, login, logout
# from django.http import JsonResponse
# from django.middleware.csrf import get_token
# from django.views.decorators.http import require_POST
# from rest_framework.authentication import SessionAuthentication, BasicAuthentication
# from rest_framework.permissions import IsAuthenticated
# from rest_framework.views import APIView

# from rest_framework.response import Response
# from rest_framework import status
# from src.apps.authentication.api.serializers import serializers


#!
from django.contrib.auth.models import User
from rest_framework import generics
from src.apps.authentication.api.serializers import UserSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import get_user_model
from dj_rest_auth.views import LogoutView
from allauth.account.views import ConfirmEmailView 

DOMAIN = 'http://localhost'

User = get_user_model()

class UserCreate(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class UserDetailView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user
    

class CustomConfirmEmailView(ConfirmEmailView):
    template_name = "account/email_confirmation_signup_message.html"

    def get_template_names(self):
        return [self.template_name]


class CustomLogoutView(LogoutView):
    
    def logout(self, request):
        response = super().logout(request)

        #delete cookies
        response.delete_cookie("jwt-refresh-token")
        response.delete_cookie("jwt-access-token")

        return response