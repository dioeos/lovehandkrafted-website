from django.core.management.base import BaseCommand
from apps.products.models import Product

class Command(BaseCommand):
    def handle(self, *args, **options):
        Product.objects.all().delete()

        if Product.objects.all().count() == 0:
            self.stdout.write(self.style.SUCCESS("Successfully deleted all users."))
        else:
            self.stdout.write(self.style.ERROR("Failed to delete all products."))