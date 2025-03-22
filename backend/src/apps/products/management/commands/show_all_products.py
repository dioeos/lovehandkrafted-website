from django.core.management.base import BaseCommand
from apps.products.models import Product

class Command(BaseCommand):
    def handle(self, *args, **options):
        all_products = Product.objects.all()

        if len(all_products) > 0:
            for product in all_products:
                product_data = {
                    "ID": product.id,
                    "Name": product.name,
                    "Description": product.description,
                    "Active": product.active,
                    "Default_Price": product.default_price,
                    "Quantity": product.quantity,
                    "Created At": product.created_at,
                    "Updated At": product.updated_at,
                    "Tags": product.tags.all()
                }
                self.stdout.write(self.style.SUCCESS(f"{product_data}"))
        else:
            self.stdout.write(self.style.ERROR("Failed to find any products."))
