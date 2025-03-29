from django.core.management.base import BaseCommand
from apps.products.models import ProductTag

class Command(BaseCommand):
    def handle(self, *args, **options):
        ProductTag.objects.all().delete()

        if ProductTag.objects.all().count() == 0:
            self.stdout.write(self.style.SUCCESS("Successfully deleted all product tags."))
        else:
            self.stdout.write(self.style.ERROR("Failed to delete all product tags."))
