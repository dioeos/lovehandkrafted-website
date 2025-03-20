from django.db import models
import uuid

class Product(models.model):
    """Represents an individual product item"""
    id = models.UUIDField(primary_key=True, unique=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    active = models.BooleanField(default=True)
    default_price = models.CharField(max_length=100, blank=True, null=True)
    thumbnail = models.URLField(blank=True, null=True)
    quantity = models.IntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        order = ("-created_at",)

    def __str__(self):
        return self.name
    

