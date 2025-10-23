from django.urls import base, path, include
from .. import views
from rest_framework.routers import DefaultRouter

products_router = DefaultRouter()
products_router.register(r'products', views.ProductViewSet, basename='products')

tags_router = DefaultRouter()
tags_router.register(r'tags', views.ProductTagViewSet, basename='tags')

urlpatterns = [
    path("", include(tags_router.urls)),
    path("", include(products_router.urls)),
]
