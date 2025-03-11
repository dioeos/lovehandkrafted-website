from allauth.account.adapter import DefaultAccountAdapter
from django.conf import settings
from django.utils.encoding import force_str
from django.contrib.sites.shortcuts import get_current_site
from allauth.account.adapter import DefaultAccountAdapter

class CustomAccountAdapter(DefaultAccountAdapter):
    """Adapter to customize allauth emails"""

    def send_mail(self, template_prefix, email, context):
        """Customizes the send mail function"""
        from allauth.account.models import EmailAddress
        email_obj = EmailAddress.objects.get(email=email)
        user = email_obj.user
        context["user"] = user
        super().send_mail(template_prefix, email, context)

    def format_email_subject(self, subject):
        """Customizes the email subject format"""
        prefix = settings.EMAIL_SUBJECT_PREFIX
        if prefix is None:
            site = get_current_site(self.request)
            prefix = "[{name}]".format(name=site.name)
        #print(f"==========Formating email with {prefix}========")
        return prefix + force_str(subject).title()


    def get_email_confirmation_url(self, request, emailconfirmation):
        """Constructs the email confirmation (activation) url"""
        frontend_url = settings.FRONTEND_URL
        uid = emailconfirmation.email_address.user.pk
        token = emailconfirmation.key
        return f"{frontend_url}/account/confirm-email/{uid}/{token}"
    
    def render_mail(self, template_prefix, email, context, headers=None):
        #print(f"===========Rendering email with template: {template_prefix} =========")
        return super().render_mail(template_prefix, email, context, headers)
    