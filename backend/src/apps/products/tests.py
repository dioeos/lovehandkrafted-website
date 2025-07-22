from django.test import TestCase
from django.utils import timezone
from uuid import UUID
from .models import Product, ProductTag

class ProductModelTests(TestCase):
    def setUp(self):
        self.product = Product.objects.create(
            name="Sample Product",
            description="A product for testing",
            default_price="19.99",
            quantity=10,
            thumbnail="https://example.com/image.jpg"
        )

    def test_product_creation(self):
        self.assertEqual(self.product.name, "Sample Product")
        self.assertEqual(self.product.description, "A product for testing")
        self.assertEqual(self.product.default_price, "19.99")
        self.assertTrue(isinstance(self.product.id, UUID))
        self.assertEqual(self.product.quantity, 10)
        self.assertTrue(self.product.active)
        self.assertIsNotNone(self.product.created_at)
        self.assertIsNotNone(self.product.updated_at)
