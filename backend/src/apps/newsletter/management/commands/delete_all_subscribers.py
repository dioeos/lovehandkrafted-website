
from django.core.management.base import BaseCommand
from apps.newsletter.models import Subscriber

class Command(BaseCommand):
    def handle(self, *args, **options):
        Subscriber.objects.all().delete()

        if Subscriber.objects.all().count() == 0:
            self.stdout.write(self.style.SUCCESS("Successfully deleted all subscribers."))
        else:
            self.stdout.write(self.style.ERROR("Failed to delete all subscribers."))