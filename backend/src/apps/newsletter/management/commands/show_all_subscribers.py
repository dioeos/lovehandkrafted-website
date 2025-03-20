from django.core.management.base import BaseCommand
from apps.newsletter.models import Subscriber

class Command(BaseCommand):
    def handle(self, *args, **options):
        all_subscribers = Subscriber.objects.all()

        if len(all_subscribers) > 0:
            for subscriber in all_subscribers:
                subscriber_data = {
                    "ID": subscriber.id,
                    "Email": subscriber.email,
                    "Joined Date": subscriber.joined_date,
                    "Is Active": subscriber.is_active,
                }
                self.stdout.write(self.style.SUCCESS(f"{subscriber_data}"))
        else:
            self.stdout.write(self.style.ERROR("Failed to find any subscribers."))