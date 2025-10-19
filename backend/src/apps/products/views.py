from .models import Product
from .api.serializers import ProductSerializer

from rest_framework import viewsets
from rest_framework.exceptions import ValidationError
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.conf import settings
from django.db import transaction

import os
import uuid
import requests
from requests.adapters import HTTPAdapter, Retry


def r2_session() -> requests.Session:
    s = requests.Session()
    retries = Retry(
        total=3,
        backoff_factor=0.5,
        status_forcelist=(500, 502, 503, 504),
        allowed_methods=frozenset({"PUT", "DELETE"}),
    )
    s.mount("http://", HTTPAdapter(max_retries=retries))
    s.mount("https://", HTTPAdapter(max_retries=retries))
    return s


def validate_product_image(file_upload, max_mb=10):
    if not file_upload:
        return
    if file_upload.size > max_mb * 1024 * 1024:
        raise ValidationError({"image": [f"Image exceeds {max_mb}MB."]})
    name = file_upload.name or ""
    ext = os.path.splitext(name)[1].lower().lstrip(".")
    allowed_ext = {"jpg", "jpeg", "png", "webp"}
    if ext not in allowed_ext:
        raise ValidationError({"image": ["Unsupported image type."]})


def object_key_for_product(product_id: uuid.UUID, ext: str) -> str:
    return f"products/{product_id}.{ext}"


def public_url_from_key(key: str) -> str:
    base = settings.R2_WORKER_BASE_URL.rstrip("/")
    return f"{base}/{key}"


def key_from_url(url: str) -> str:
    base = settings.R2_WORKER_BASE_URL.rstrip("/") + "/"
    if url.startswith(base):
        return url[len(base):]
    return url.split("/", url.count("/") - 1)[-1]


def upload_to_r2(file_obj, content_type: str, key: str, auth_key: str, timeout=8) -> str:
    url = public_url_from_key(key)
    try:
        file_obj.seek(0)
    except Exception:
        pass

    headers = {"X-Custom-Auth-Key": auth_key}
    if content_type:
        headers["Content-Type"] = content_type

    res = r2_session().put(url, data=file_obj, headers=headers, timeout=timeout)
    if res.status_code != 200:
        raise RuntimeError(f"R2 upload failed ({res.status_code})")
    return url


def delete_from_r2(key: str, auth_key: str, timeout=6):
    url = public_url_from_key(key)
    headers = {"X-Custom-Auth-Key": auth_key}
    res = r2_session().delete(url, headers=headers, timeout=timeout)
    if res.status_code not in (200, 204, 404):
        raise RuntimeError(f"R2 delete failed ({res.status_code})")


class ProductViewSet(viewsets.ModelViewSet):
    """Product view set that provides CRUD operations for products"""
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def perform_create(self, serializer):
        image = self.request.FILES.get("image")
        if image:
            validate_product_image(image)

        with transaction.atomic():
            product = serializer.save()

            if image:
                ext = os.path.splitext(image.name or "")[1].lower().lstrip(".")
                if not ext:
                    raise ValidationError({"image": ["Image must have a file extension."]})

                key = object_key_for_product(product.id, ext)
                auth_key = settings.R2_WORKER_AUTH_KEY_SECRET

                try:
                    image.open()
                except Exception:
                    pass

                try:
                    upload_to_r2(image.file, image.content_type or "application/octet-stream", key, auth_key)
                except Exception:
                    raise ValidationError({"image": ["Image upload failed. Please retry."]})

                product.thumbnail = public_url_from_key(key)
                product.save(update_fields=["thumbnail"])


    
    def perform_update(self, serializer):
        image = self.request.FILES.get("image")

        instance = serializer.instance
        old_thumbnail_url = getattr(instance, "thumbnail", None)

        if not image:
            serializer.save()
            return

        validate_product_image(image)
        ext = os.path.splitext(image.name or "")[1].lower().lstrip(".")
        if not ext:
            raise ValidationError({"image": ["Image must have a file extension."]})

        key = object_key_for_product(instance.id, ext)
        auth_key = settings.R2_WORKER_AUTH_KEY_SECRET

        try:
            image.open()
        except Exception:
            pass
        try:
            try:
                image.file.seek(0)
            except Exception:
                pass
            upload_to_r2(image.file, image.content_type or "application/octet-stream", key, auth_key)
        except Exception:
            raise ValidationError({"image": ["Image upload failed. Please retry."]})

        with transaction.atomic():
            product = serializer.save(thumbnail=public_url_from_key(key))

        if old_thumbnail_url:
            try:
                old_key = key_from_url(old_thumbnail_url)
                delete_from_r2(old_key, auth_key)
            except Exception:
                pass

    def perform_destroy(self, instance):
        auth_key = settings.R2_WORKER_AUTH_KEY_SECRET
        thumb = getattr(instance, "thumbnail", None)

        if thumb:
            try:
                key = key_from_url(thumb)
                delete_from_r2(key, auth_key)
            except Exception:
                pass

        super().perform_destroy(instance)

    # GET /api/products/by-slug/<slug>/
    @action(detail=False, url_path=r"by-slug/(?P<slug>[-a-zA-Z0-9_]+)")
    def by_slug(self, request, slug=None):
        obj = get_object_or_404(Product, slug=slug)
        data = self.get_serializer(obj).data
        return Response(data)
