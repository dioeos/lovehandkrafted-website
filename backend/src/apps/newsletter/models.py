from django.db import models

# Create your models here.

class Subscriber(models.Model):
    email = models.EmailField(max_length=255, unique=True)
    joined_date = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.email