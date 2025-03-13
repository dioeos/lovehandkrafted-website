from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

User = get_user_model()

class Command(BaseCommand):
    def handle(self, *args, **options):
        User.objects.all().delete()

        if User.objects.all().count() == 0:
            self.stdout.write(self.style.SUCCESS("Successfully deleted all users."))
        else:
            self.stdout.write(self.style.ERROR("Failed to delete all users."))



