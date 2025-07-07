from django.contrib.auth.models import User
from rest_framework import generics
from src.apps.authentication.api.serializers import UserSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import get_user_model
from dj_rest_auth.views import LogoutView
from rest_framework.views import APIView
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from django.conf import settings
from django.http import HttpResponseRedirect

DOMAIN = "http://localhost"

User = get_user_model()


class UserCreate(generics.CreateAPIView):
    """
    POST /api/authentication/register/ -> Creates a new user via registration
    """

    queryset = User.objects.all()
    serializer_class = UserSerializer
    # allow any to create user
    permission_classes = [AllowAny]


class UserDetailView(generics.RetrieveUpdateAPIView):
    """
    GET/PATCH the currently logged-in user
    """

    queryset = User.objects.all()
    serializer_class = UserSerializer
    # must be authenticated to view user details
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class CustomLogoutView(LogoutView):
    """
    POST /api/authentication/logout/ -> Django logout method + clear cookies
    """

    permission_classes = [IsAuthenticated]

    def logout(self, request):
        response = super().logout(request)

        # delete cookies
        response.delete_cookie("jwt-refresh-token")
        response.delete_cookie("jwt-access-token")

        return response


class CookieTokenRefreshView(APIView):
    """
    POST /api/authentication/token/refresh/ -> Read refresh token from cookie, return new access
    """

    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get(settings.SIMPLE_JWT["AUTH_COOKIE_REFRESH"])

        if not refresh_token:
            raise AuthenticationFailed("No refresh token found in cookies")

        try:
            refresh = RefreshToken(refresh_token)
            access_token = str(refresh.access_token)
        except Exception as e:
            raise AuthenticationFailed("Invalid refresh token")

        # Return the new access token (without setting a new refresh token)
        return Response({"access": access_token})


def password_reset_confirm_redirect(request, uidb64, token):
    return HttpResponseRedirect(
        f"{settings.PASSWORD_RESET_CONFIRM_REDIRECT_BASE_URL}{uidb64}/{token}/"
    )


# class UserOrderListView(generics.ListAPIView):
#     """API view for authenticated users to see their orders"""
# queryset = Order.objects.prefetch_related('items__product')
# serializer_class = OrderSerializer
# permission_classes = [IsAuthenticated] #credentials are needed
