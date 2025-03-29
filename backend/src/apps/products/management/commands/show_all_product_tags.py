from django.core.management.base import BaseCommand
from apps.products.models import ProductTag

class Command(BaseCommand):
    def handle(self, *args, **options):
        all_tags = ProductTag.objects.all()

        if len(all_tags) > 0:
            for tag in all_tags:
                tag_data = {
                    "id": tag.id,
                    "name": tag.name,
                    "products": tag.products
                }
                self.stdout.write(self.style.SUCCESS(f"{tag_data}\n"))

        else:
            self.stdout.write(self.style.ERROR("Failed to find any product tags."))