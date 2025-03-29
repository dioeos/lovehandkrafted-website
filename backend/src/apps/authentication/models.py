from django.db import models

from django.conf import settings
from django.db import models

from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)
from allauth.account.models import EmailAddress

class UserManager(BaseUserManager):
    """Custom manager to handle authentication system. Uses email rather than username for unique identifier"""

    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Email address is mandatory for users.")
        user = self.model(email=self.normalize_email(email), **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, password):
        user = self.create_user(email=email, password=password)
        user.first_name = "LHK ADMIN"
        user.last_name = ""
        user.is_staff = True
        user.is_superuser = True
        user.is_verified = True
        user.is_vendor = True
        user.save(using=self._db)
        EmailAddress.objects.update_or_create(
            user=user, email=user.email, defaults={"verified": True, "primary": True}
        )
        return user
    
class User(AbstractBaseUser, PermissionsMixin):
    """The app custom user model"""

    #email field must be unique as it is the unique identgifier
    email = models.EmailField(max_length=255, unique=True)
    first_name = models.CharField(max_length=255, default="")
    last_name = models.CharField(max_length=255, default="")
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False) #access to django admin site
    is_verified = models.BooleanField(default=False)
    is_vendor = models.BooleanField(default=False)
    
    objects = UserManager()

    # use email field as unique username identifier
    USERNAME_FIELD = "email"

    class Meta:
        permissions = [
            #custom perm "access_vendor_dashboard"
            # ("access_vendor_dashboard", "Can access vendor dashboard"),
            # ("add_product", "Can add products to the site"),
            # ("send_newsletter", "Can send newsletters to suscribers"),
        ]

