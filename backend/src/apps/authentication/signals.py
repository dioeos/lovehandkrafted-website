from django.db.models.signals import post_save
from django.dispatch import receiver
from allauth.account.models import EmailAddress
from django.contrib.auth import get_user_model

User = get_user_model()

@receiver(post_save, sender=EmailAddress)
def update_user_verification_status(sender, instance, **kwargs):
    """Update the User model's is_verified field when an email is verified."""
    print("CALLED A SIGNAL")
    if instance.verified:  # If email is marked as verified
        user = instance.user
        if user and not user.is_verified:
            user.is_verified = True
            user.save(update_fields=["is_verified"])
