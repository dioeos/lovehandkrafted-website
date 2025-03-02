from django.urls import path, include, re_path
from .. import views


from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    # path('user/register/', views.UserCreate.as_view(), name='user_create'),
    # path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    # path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # path('api-auth/', include('rest_framework.urls')),
    # path('auth/user/', views.UserDetailView.as_view(), name='user_detail'),

    #!api/authentication/dj-rest-auth/
    path("dj-rest-auth/", include("dj_rest_auth.urls")),
    re_path(
        r"^dj-rest-auth/registration/account-confirm-email/(?P<key>[-:\w]+)/$",
        views.CustomConfirmEmailView.as_view(),
        name="account_confirm_email",
    ),
    #path('dj-rest-auth/account-confirm-email/<str:key>/', views.CustomConfirmEmailView.as_view(), name='account_confirm_email'),

    path("dj-rest-auth/registration/", include("dj_rest_auth.registration.urls"))
]