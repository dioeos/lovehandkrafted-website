"""
List all content types in Django application to keep track of all models in project
"""

from django.core.management.base import BaseCommand
from django.contrib.contenttypes.models import ContentType

class Command(BaseCommand):

    def handle(self, *args, **kwargs):
        for ct in ContentType.objects.all():
            self.stdout.write(f"{ct.id}: {ct.app_label} | {ct.model}")