"""
Django command to check and report stale content types and permissions
"""
from django.core.management.base import BaseCommand
from django.contrib.contenttypes.models import ContentType
from django.contrib.auth.models import Permission


class Command(BaseCommand):

    def handle(self, *args, **kwargs):
        # Include core Django apps, third-party, & custom apps
        stale_cts = ContentType.objects.exclude(app_label__in=[
            'admin', 'auth', 'contenttypes', 'sessions', 'authtoken',
            'account', 'socialaccount', 'token_blacklist', 'authentication'
        ])

        if stale_cts.exists():
            self.stdout.write("Stale Content Types Found:")
            for ct in stale_cts:
                self.stdout.write(f"- {ct.app_label} | {ct.model}")
        
        stale_permissions = Permission.objects.filter(content_type__in=stale_cts)
        if stale_permissions.exists():
            self.stdout.write("Stale Permissions Found:")
            for perm in stale_permissions:
                self.stdout.write(f"- {perm.codename} | {perm.content_type}")

        if not stale_cts.exists() and not stale_permissions.exists():
            self.stdout.write("No stale content types or permissions found")