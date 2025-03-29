from rest_framework.permissions import BasePermission
from django.contrib.auth.models import Group

class IsVendor(BasePermission):
    """Custom permission to grant access only to users in the 'Vendor' group"""

    def has_permission(self, request, view):
        #User must be authenticated and in the 'Vendor' group
        return request.user.is_authenticated and request.user.groups.filter(name="Vendor").exists()