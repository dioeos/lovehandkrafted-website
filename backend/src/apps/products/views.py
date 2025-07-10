from django.shortcuts import render
from rest_framework import status, viewsets
from .models import Product
from .api.serializers import ProductSerializer
from decouple import config
import requests
import uuid

class ProductViewSet(viewsets.ModelViewSet):
    """Product view set that provides CRUD operations for products"""

    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    # permission_classes = [IsA]

    def perform_create(self, serializer):
        image = self.request.FILES.get('image')
        if image:
            ext = image.name.split('.')[-1]
            generated_uuid = uuid.uuid4()
            file_key = f"products/{generated_uuid}.{ext}"
            x_cust_auth_key = config("R2_WORKER_AUTH_KEY_SECRET")
            r2_worker_base_url = config("R2_WORKER_BASE_URL")

            worker_url = f"{r2_worker_base_url}/{file_key}"

            #upload
            res = requests.put(
                worker_url,
                data=image.read(),
                headers={
                    "Content-Type": image.content_type,
                    "X-Custom-Auth-Key": x_cust_auth_key
                }
            )

            if res.status_code != 200:
                raise Exception("Image upload to R2 failed")

            serializer.save(id=generated_uuid, thumbnail=worker_url)
        else:
            serializer.save()
    

    def perform_update(self, serializer):
        return super().perform_update(serializer)
    
    def perform_destroy(self, instance):
        return super().perform_destroy(instance)
