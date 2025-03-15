from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

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
        
        permissions = user.get_all_permissions()
        
        if len(permissions) > 0:
            self.stdout.write(self.style.SUCCESS(f"Permissions: {permissions}"))
        else:
            self.stdout.write(self.style.ERROR(f"No permissions for {email}"))
        
        
    