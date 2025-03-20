from django.core.management.base import BaseCommand
from django.conf import settings

class Command(BaseCommand):
    def handle(self, *args, **options):
        apps = settings.INSTALLED_APPS

        if apps:
            self.stdout.write(self.style.SUCCESS("The following apps are installed:"))
            for app in apps:
                self.stdout.write(app)
        else:
            self.stdout.write(self.style.ERROR("There are no installed apps."))
