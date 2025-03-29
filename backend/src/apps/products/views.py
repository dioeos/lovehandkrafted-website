from django.shortcuts import render
from rest_framework import status, viewsets
from .models import Product
from .api.serializers import ProductSerializer

class ProductViewSet(viewsets.ModelViewSet):
    """Product view set that provides CRUD operations for products"""

    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    # permission_classes = [IsA]

    def perform_create(self, serializer):
        print("Performing create in ViewSet")
        return super().perform_create(serializer)
    
    def perform_update(self, serializer):
        return super().perform_update(serializer)
    
    def perform_destroy(self, instance):
        return super().perform_destroy(instance)