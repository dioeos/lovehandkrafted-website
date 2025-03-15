from django.db.models.signals import post_save
from django.dispatch import receiver
from allauth.account.models import EmailAddress
from django.contrib.auth import get_user_model
from django.db.models.signals import m2m_changed

User = get_user_model()

@receiver(post_save, sender=EmailAddress)
def update_user_verification_status(sender, instance, **kwargs):
    """Update the User model's is_verified field when an email is verified."""
    if instance.verified:  # If email is marked as verified
        user = instance.user
        if user and not user.is_verified:
            user.is_verified = True
            user.save(update_fields=["is_verified"])

@receiver(m2m_changed, sender=User.groups.through)
def update_is_vendor(sender, instance, action, **kwargs):
    """Update the User mode's is_vendor when a user is added to Vendor group"""
    if action in ["post_add", "post_remove", "post_clear"]:
        instance.is_vendor = instance.groups.filter(name="Vendor").exists()
        instance.save()