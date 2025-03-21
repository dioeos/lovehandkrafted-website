"""
Django command to set up the Vendor group on server startup
"""

from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType
from apps.products.models import Product

class Command(BaseCommand):

    def handle(self, *args, **kwargs):
        vendor_group, created = Group.objects.get_or_create(name="Vendor")

        if vendor_group:
            self.stdout.write("Fetched existing Vendor group")

        if created:
            self.stdout.write("Created new Vendor group")

        permissions_to_add = [
            "add_product",
            "change_product",
            "delete_product",
        ]

        all_groups = Group.objects.exclude(name="Vendor")

        for perm_codename in permissions_to_add:
            try:
                product_content_type = ContentType.objects.get_for_model(Product)
                perm = Permission.objects.get(codename=perm_codename, content_type=product_content_type)

                for group in all_groups:
                    group.permissions.remove(perm)

                vendor_group.permissions.add(perm)
                self.stdout.write(self.style.SUCCESS(f"Successfully assigned `{perm_codename}` to Vendor group"))
            except Permission.DoesNotExist:
                self.stdout.write(self.style.ERROR(f"Failed to assign `{perm_codename}`: Permission does not exist"))



