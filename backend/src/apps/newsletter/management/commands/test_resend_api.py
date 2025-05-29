from django.core.management.base import BaseCommand
from django.core.mail import send_mail

from decouple import config


class Command(BaseCommand):
    def handle(self, *args, **options):
        recipient = config("TEST_RECIPIENT_EMAIL")
        if not recipient:
            self.stderr.write(self.style.ERROR("TEST_RECIPIENT_EMAIL not set"))
            return

        send_mail(
            subject="It works!",
            message="This will get sent via Resend",
            from_email=None,  # uses DEFAULT_FROM_EMAIL
            recipient_list=[recipient],
        )
        self.stdout.write(self.style.SUCCESS(f"Email sent to {recipient}"))
