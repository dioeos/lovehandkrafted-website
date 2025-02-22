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
from django.contrib.auth import get_user_model
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
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
    
#to redirect back to frontend
@login_required
def google_login_callback(request):
    user = request.user
    social_accounts = SocialAccount.objects.filter(user=user)
    print("Social Account for user:", social_accounts)

    social_account = social_accounts.first()

    if not social_account:
        print("No social account for user:", user)
        return redirect(f'{DOMAIN}/login/callback/?error=NoSocialAccount')
    
    token = SocialToken.objects.filter(account=social_account, account__providers='google').first()

    if token:
        print('Google token found:', token.token)
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        return redirect(f'{DOMAIN}/login/callback/?access_token={access_token}')
    else:
        print('No google topken found for user:', user)
        return redirect(f'{DOMAIN}/login/callback/?error=NoGoogleToken')

@csrf_exempt
def validate_google_token(request):
    if request.method == 'POST':
        try:
            data= json.loads(request.body)
            google_access_token = data.get('access_token')
            print(google_access_token)

            if not google_access_token:
                return JsonResponse({'detail': 'Access Token is missing'}, status=400)
            return JsonResponse({'valid': True})
        except json.JSONDecodeError:
            return JsonResponse({'detail': 'Invalid JSON'}, status=400)
    return JsonResponse({'detail': 'Method not allowed'}, status=405)


# def get_csrf(request):
#     response = JsonResponse({'detail': 'CSRF cookie set'})
#     response['X-CSRFToken'] = get_token(request)
#     return response


# @require_POST
# def login_view(request):
#     data = json.loads(request.body)
#     username = data.get('username')
#     password = data.get('password')

#     if username is None or password is None:
#         return JsonResponse({'detail': 'Please provide username and password.'}, status=400)

#     user = authenticate(username=username, password=password)

#     if user is None:
#         return JsonResponse({'detail': 'Invalid credentials.'}, status=400)

#     login(request, user)
#     return JsonResponse({'detail': 'Successfully logged in.'})


# def logout_view(request):
#     if not request.user.is_authenticated:
#         return JsonResponse({'detail': 'You\'re not logged in.'}, status=400)

#     logout(request)
#     return JsonResponse({'detail': 'Successfully logged out.'})


# class SessionView(APIView):
#     authentication_classes = [SessionAuthentication, BasicAuthentication]
#     permission_classes = [IsAuthenticated]

#     @staticmethod
#     def get(request, format=None):
#         return JsonResponse({'isAuthenticated': True})


# class WhoAmIView(APIView):
#     authentication_classes = [SessionAuthentication, BasicAuthentication]
#     permission_classes = [IsAuthenticated]

#     @staticmethod
#     def get(request, format=None):
#         return JsonResponse({'username': request.user.username})


# class AddAPIView(APIView):
#     def post(self, request):
#         serializer = serializers.AddSerializer(data=request.data)
#         if serializer.is_valid():
#             x = serializer.validated_data["x"]
#             y = serializer.validated_data["y"]
#             return Response({"result": x + y}, status=status.HTTP_200_OK)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)