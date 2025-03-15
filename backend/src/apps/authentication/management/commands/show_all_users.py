
from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

User = get_user_model()

class Command(BaseCommand):
    def handle(self, *args, **options):

        all_users = User.objects.all()

        if len(all_users) > 0:
            for user in all_users:
                user_data = {
                    "ID": user.id,
                    "Email": user.email,
                    "First Name": user.first_name,
                    "Last Name": user.last_name,
                    "Is Active": user.is_active,
                    "Is Verified": user.is_verified,
                    "Is Vendor": user.is_vendor,
                    "Is Staff": user.is_staff,
                }
                self.stdout.write(self.style.SUCCESS(f"{user_data}"))
        else:
            self.stdout.write(self.style.ERROR("Failed to find any users."))
