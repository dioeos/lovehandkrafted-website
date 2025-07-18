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
        instance = serializer.instance
        image = self.request.FILES.get('image')

        if image:
            #delete existing image
            if instance.thumbnail:
                try:
                    print("Deleting IMG, before updating")
                    r2_worker_base_url = config("R2_WORKER_BASE_URL")
                    x_cust_auth_key = config("R2_WORKER_AUTH_KEY_SECRET")
                    key = instance.thumbnail.replace(f"{r2_worker_base_url}/", "")
                    delete_url = f"{r2_worker_base_url}/{key}"

                    res = requests.delete(
                        delete_url,
                        headers={
                            "X-Custom-Auth-Key": x_cust_auth_key
                        }
                    )
                except Exception as e:
                    print(f"Error during R2 deletion for update: {e}")

            #add new image
            print("CHANGING IMAGE")
            ext = image.name.split('.')[-1]
            file_key = f"products/{instance.id}.{ext}"
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

            serializer.save(thumbnail=worker_url)
        else:
            #leave existing thumbnail untouched
            serializer.save()

    
    def perform_destroy(self, instance):
        if instance.thumbnail:
            try:
                print("Deleting IMG...")
                r2_workerbase_url = config("R2_WORKER_BASE_URL")
                x_cust_auth_key = config("R2_WORKER_AUTH_KEY_SECRET")
                key = instance.thumbnail.replace(f"{r2_workerbase_url}/", "")
                delete_url = f"{r2_workerbase_url}/{key}"

                res = requests.delete(
                    delete_url,
                    headers={
                        "X-Custom-Auth-Key": x_cust_auth_key
                    }
                )

                if res.status_code != 200:
                    raise Exception("Image deletion from R2 failed")

            except Exception as e:
                print(f"Error during R2 deletion: {e}")

        super().perform_destroy(instance)

