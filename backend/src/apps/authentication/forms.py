# from allauth.account.forms import ResetPasswordForm

# from allauth.account.utils import (filter_users_by_email, user_pk_to_url_str, user_username)
# from allauth.utils import build_absolute_uri
# from allauth.account.adapter import get_adapter
# from allauth.account.forms import default_token_generator
# from allauth.account import app_settings
# from django.contrib.sites.shortcuts import get_current_site

# class CustomAllAuthPasswordResetForm(ResetPasswordForm):
#     print("Custom Reset Form")

#     def clean_email(self):
#         """Invalid email should not raise error, as this would leak users"""
#         print("Clean email method called()")
#         email = self.cleaned_data["email"]
#         email = get_adapter().clean_email(email)
#         self.users = filter_users_by_email(email, is_active=True)
#         return email
    
#     def save(self, request, **kwargs):
#         print("CustomAllAuthPasswordResetForm save() method CALLED!")
#         current_site = get_current_site(request)
#         token_generator = kwargs.get('token_generator', default_token_generator)

#         for user in self.users:
#             temp_key = token_generator.make_token(user)

#             path = f"http://localhost/account/reset-password/{temp_key}/"

#             reset_url = build_absolute_uri(None, path)

#             #values which are passed to password_reset_key_message.txt

#             context = {
#                 "current_site": current_site,
#                 "user": user,
#                 "password_reset_url": reset_url,
#                 "request": request,
#                 "path": path,
#             }

#             get_adapter(request).send_mail(
#                 "account/email/password_reset_key", user.email, context
#             )

            