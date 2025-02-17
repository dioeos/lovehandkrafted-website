from django.urls import path
from .. import views


urlpatterns = [
    path('csrf/', views.get_csrf, name='authentication-api-csrf'),
    path('login/', views.login_view, name='authentication-api-login'),
    path('logout/', views.logout_view, name='authentication-api-logout'),
    path('session/', views.SessionView.as_view(), name='authentication-api-session'),
    path('whoami/', views.WhoAmIView.as_view(), name='authentication-api-whoami'),
]