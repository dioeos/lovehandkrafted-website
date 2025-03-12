"""
Django command to set up the Vendor group on server startup
"""

from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group, Permission

class Command(BaseCommand):

    def handle(self, *args, **kwargs):
        vendor_group, created = Group.objects.get_or_create(name="Vendor")

        if vendor_group:
            self.stdout.write("Fetched existing Vendor group")

        if created:
            self.stdout.write("Created new Vendor group")

        permissions_to_add = [
            "access_vendor_dashboard",
            "add_product",
            "send_newsletter",
        ]

        for perm_codename in permissions_to_add:
            try:
                perm = Permission.objects.get(codename=perm_codename)
                vendor_group.permissions.add(perm)
                self.stdout.write(f"Successfully assigned `{perm_codename}` to Vendor group")
            except Permission.DoesNotExist:
                self.stdout.write(f"Failed to assign `{perm_codename}`: Permission does not exist")



