from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group

User = get_user_model()

class Command(BaseCommand):
    def add_arguments(self, parser):
        parser.add_argument("email", type=str, help="Email of the user")
        parser.add_argument(
            "--remove", action="store_true", help="Remove the user from the Vendor group"
        )

    def handle(self, *args, **options):
        email = options["email"]
        remove = options["remove"]

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            self.stderr.write(self.style.ERROR(f"User with email {email} not found."))
            return

        vendor_group, created = Group.objects.get_or_create(name="Vendor")

        if remove:
            user.groups.remove(vendor_group)
            self.stdout.write(self.style.SUCCESS(f"Removed {email} from the Vendor group."))
        else:
            user.groups.add(vendor_group)
            self.stdout.write(self.style.SUCCESS(f"Added {email} to the Vendor group."))