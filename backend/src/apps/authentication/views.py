from django.contrib.auth.models import User
from rest_framework import generics
from src.apps.authentication.api.serializers import UserSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import get_user_model
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


from datetime import datetime, timezone as dt_timezone
from django.conf import settings
from django.utils import timezone
from django.db import IntegrityError
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken

class CustomLogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        rest_auth = getattr(settings, "REST_AUTH", {}) or {}
        refresh_cookie_name = rest_auth.get("JWT_AUTH_REFRESH_COOKIE", "jwt-refresh-token")
        access_cookie_name  = rest_auth.get("JWT_AUTH_COOKIE", "jwt-access-token")

        cookie_domain = getattr(settings, "SESSION_COOKIE_DOMAIN", None)
        cookie_path   = getattr(settings, "SESSION_COOKIE_PATH", "/")
        cookie_samesite = getattr(settings, "CSRF_COOKIE_SAMESITE", None)

        refresh_token = request.COOKIES.get(refresh_cookie_name)

        if refresh_token:
            try:
                token = RefreshToken(refresh_token)
                jti = token["jti"]
                exp_dt = datetime.fromtimestamp(token["exp"], tz=dt_timezone.utc)

                outstanding, _ = OutstandingToken.objects.get_or_create(
                    jti=jti,
                    defaults={
                        "user": request.user,
                        "token": str(token),
                        "created_at": timezone.now(),
                        "expires_at": exp_dt,
                    },
                )
                BlacklistedToken.objects.get_or_create(token=outstanding)

            except IntegrityError:
                pass  # already inserted by a concurrent request
            except Exception:
                pass  # malformed/expired, still clear cookies

        resp = Response({"detail": "Successfully logged out."}, status=status.HTTP_205_RESET_CONTENT)

        resp.delete_cookie(access_cookie_name,  domain=cookie_domain, path=cookie_path, samesite=cookie_samesite)
        resp.delete_cookie(refresh_cookie_name, domain=cookie_domain, path=cookie_path, samesite=cookie_samesite)
        return resp
