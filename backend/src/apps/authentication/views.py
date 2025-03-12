from django.contrib.auth.models import User
from rest_framework import generics
from src.apps.authentication.api.serializers import UserSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import get_user_model
from dj_rest_auth.views import LogoutView

from django.conf import settings
from django.http import HttpResponseRedirect

DOMAIN = 'http://localhost'

User = get_user_model()

class UserCreate(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    #allow any to create user
    permission_classes = [AllowAny]

class UserDetailView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    #must be authenticated to view user details
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user
    
class CustomLogoutView(LogoutView):
    permission_classes = [IsAuthenticated]
    
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


# class UserOrderListView(generics.ListAPIView):
#     """API view for authenticated users to see their orders"""
    #queryset = Order.objects.prefetch_related('items__product')
    # serializer_class = OrderSerializer
    # permission_classes = [IsAuthenticated] #credentials are needed