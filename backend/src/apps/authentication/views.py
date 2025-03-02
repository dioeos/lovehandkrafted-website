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
from django.shortcuts import redirect
from django.contrib.auth.models import User
from rest_framework import generics
from src.apps.authentication.api.serializers import UserSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from allauth.socialaccount.models import SocialToken, SocialAccount
from django.contrib.auth.decorators import login_required
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view
from django.contrib.auth import get_user_model
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.response import Response
import json

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
    

from allauth.account.views import ConfirmEmailView 
class CustomConfirmEmailView(ConfirmEmailView):
    template_name = "account/email_confirmation_signup_message.html"

    def get_template_names(self):
        return [self.template_name]


# @api_view(['POST'])
# def logout_view(request):
#     try:
#         refresh_token = request.data.get('refresh_token')
#         if not refresh_token:
#             return Response({'detail': 'Refresh token is required'}, status=400)
        
#         token = RefreshToken(refresh_token)
#         token.blacklist()

#         return Response({'detail': 'Successfully logged out'}, status=200)
#     except Exception as e:
#         return Response({'detail': str(e)}, status=400)
    
#to redirect back to frontend
#! once django-allauth processes login, backend logs in user
#* checks if user has Google account, retrieves Google access token, generates JWT token (frontend auth), redirects to frontend w/ token
# @login_required
# def google_login_callback(request):
#     user = request.user
#     social_accounts = SocialAccount.objects.filter(user=user)
#     print("Social Account for user:", social_accounts)

#     social_account = social_accounts.first()

#     if not social_account:
#         print("No social account for user:", user)
#         return redirect(f'{DOMAIN}/login/callback/?error=NoSocialAccount')
    
#     token = SocialToken.objects.filter(account=social_account, account__providers='google').first()

#     if token:
#         print('Google token found:', token.token)
#         refresh = RefreshToken.for_user(user)
#         access_token = str(refresh.access_token)
#         return redirect(f'{DOMAIN}/login/callback/?access_token={access_token}')
#     else:
#         print('No google topken found for user:', user)
#         return redirect(f'{DOMAIN}/login/callback/?error=NoGoogleToken')

# @csrf_exempt
# def validate_google_token(request):
#     if request.method == 'POST':
#         try:
#             data= json.loads(request.body)
#             google_access_token = data.get('access_token')
#             print(google_access_token)

#             if not google_access_token:
#                 return JsonResponse({'detail': 'Access Token is missing'}, status=400)
#             return JsonResponse({'valid': True})
#         except json.JSONDecodeError:
#             return JsonResponse({'detail': 'Invalid JSON'}, status=400)
#     return JsonResponse({'detail': 'Method not allowed'}, status=405)


