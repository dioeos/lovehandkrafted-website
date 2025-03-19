from django.urls import path, include
from ..import views

urlpatterns = [
    path("subscribe/", views.SubscribeAPIView.as_view()),
    path("send/", views.send_newsletter_view)
]