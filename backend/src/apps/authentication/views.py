from django.contrib.auth.models import User
from rest_framework import generics
from src.apps.authentication.api.serializers import UserSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import get_user_model
from dj_rest_auth.views import LogoutView, PasswordResetView
from allauth.account.views import ConfirmEmailView 

from django.conf import settings
from django.http import HttpResponseRedirect

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
    
def password_reset_confirm_redirect(request, uidb64, token):
    return HttpResponseRedirect(
        f"{settings.PASSWORD_RESET_CONFIRM_REDIRECT_BASE_URL}{uidb64}/{token}/"
    )


    