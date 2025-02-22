from django.urls import path, include
from .. import views


from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


urlpatterns = [
    # path('csrf/', views.get_csrf, name='authentication-api-csrf'),
    # path('login/', views.login_view, name='authentication-api-login'),
    # path('logout/', views.logout_view, name='authentication-api-logout'),
    # path('session/', views.SessionView.as_view(), name='authentication-api-session'),
    # path('whoami/', views.WhoAmIView.as_view(), name='authentication-api-whoami'),
    path('user/register/', views.UserCreate.as_view(), name='user_create'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api-auth/', include('rest_framework.urls')),
    path('accounts/', include('allauth.urls')),
    path('callback/', views.google_login_callback, name='callback'),
    path('auth/user/', views.UserDetailView.as_view(), name='user_detail'),
    path('google/validate_token', views.validate_google_token)
]