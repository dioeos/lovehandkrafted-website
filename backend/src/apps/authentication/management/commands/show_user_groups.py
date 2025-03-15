from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group

User = get_user_model()

class Command(BaseCommand):
    def add_arguments(self, parser):
        parser.add_argument("email", type=str, help="Email of the user")

    def handle(self, *args, **options):
        email = options["email"]

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            self.stderr.write(self.style.ERROR(f"User with email {email} not found."))
            return
        
        user_groups = user.groups.all()

        if len(user_groups) > 0:
            self.stdout.write(self.style.SUCCESS(f"{email} is in the following groups:"))
            for group in user_groups:
                self.stdout.write(group)

        else:
            self.stdout.write(self.style.ERROR(f"{email} is not in any groups."))