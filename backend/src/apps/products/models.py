from django.db import models
from django.utils.text import slugify
import uuid
from django.db.models.functions import Lower

class Product(models.Model):
    """Represents an individual product item"""
    id = models.UUIDField(primary_key=True, unique=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True, db_index=True, blank=True, null=True)
    description = models.TextField(blank=True)
    active = models.BooleanField(default=True)
    default_price = models.CharField(max_length=100, blank=True, null=True)
    thumbnail = models.URLField(blank=True, null=True)
    quantity = models.IntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("-created_at",)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            base = slugify(self.name)
            slug = base
            n = 2
            while Product.objects.filter(slug=slug).exists():
                slug = f"{base}-{n}"
                n += 1
            self.slug = slug
        super().save(*args, **kwargs)
    

class ProductTag(models.Model):
    """Represents tags that can be assigned to products"""
    id = models.UUIDField(primary_key=True, unique=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, unique=False)
    products = models.ManyToManyField(Product, related_name="tags")
    product_count = models.IntegerField(default=0)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                Lower('name'),
                name='uniq_producttag_name_ci',   # case-insensitive unique
            )
        ]

    def __str__(self):
        return self.name

