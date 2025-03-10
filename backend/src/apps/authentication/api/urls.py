from django.urls import path, include, re_path
from .. import views

from dj_rest_auth.views import LoginView

from dj_rest_auth.views import PasswordResetView, PasswordResetConfirmView

urlpatterns = [
    #!api/authentication/dj-rest-auth/
    path("dj-rest-auth/", include("dj_rest_auth.urls")),

    re_path(r"^dj-rest-auth/registration/account-confirm-email/(?P<key>[-:\w]+)/$", views.CustomConfirmEmailView.as_view(), name="account_confirm_email"),


    path("dj-rest-auth/logout/", views.CustomLogoutView.as_view()),


    path("dj-rest-auth/registration/", include("dj_rest_auth.registration.urls")),

    # ---- Password Reset Routes ----
    path("dj-rest-auth/password/reset/", PasswordResetView.as_view(), name="rest_password_reset"),
    path("dj-rest-auth/password/reset/confirm/<str:uidb64>/<str:token>/", views.password_reset_confirm_redirect, name="password_reset_confirm"),
    path("dj-rest-auth/password/reset/confirm/", PasswordResetConfirmView.as_view(), name="password_reset_confirm"),

]