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

    def test_str(self):
        self.assertEqual(str(self.product), "Sample Product")

class ProductTagModelTests(TestCase):
    def setUp(self):
        self.product1 = Product.objects.create(name="P1")
        self.product2 = Product.objects.create(name="P2")
        self.tag = ProductTag.objects.create(name="Home")
        self.tag.products.set([self.product1, self.product2])

    def test_tag_creation(self):
        self.assertEqual(self.tag.name, "Home")
        self.assertTrue(isinstance(self.tag.id, UUID))

    def test_relationship(self):
        self.assertCountEqual(
            self.tag.products.all(),
            [self.product1, self.product2]
        )

        self.assertIn(self.tag, self.product1.tags.all())

    def test_str(self):
        self.assertEqual(str(self.tag), "Home")

