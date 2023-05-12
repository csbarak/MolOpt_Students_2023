from django.contrib.auth.tokens import PasswordResetTokenGenerator

from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.template.loader import render_to_string
from django.conf import settings
from django.core.mail import send_mail


def check_token(user, token):
    token_generator = PasswordResetTokenGenerator()
    return token_generator.check_token(user, token)


def send_activation_email(user):
    token_generator = PasswordResetTokenGenerator()
    token = token_generator.make_token(user)

    uid = urlsafe_base64_encode(force_bytes(user.pk))
    domain = 'localhost:3000'
    subject = "Password Reset Requested"
    name = user.first_name
    domain = domain
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    user = user

    url = f"http://{ domain }/reset-password?uidb64={uid}&token={token}"
    message = f'''Hello {name.title()},
            <br><br>We received a request to reset the password for your account for this email address.
            <br>To initiate the password reset process for your account, click <a href='{url}'>HERE</a>
            <br>This link can only be used once.
            <br>If you need to reset your password again, please request another reset.
            <br>If you did not make this request, you can ignore this email.
            <br><br>Sincerely, The OptMol Team'''
    send_mail(subject, 'message', settings.EMAIL_HOST_USER,
              [user.email],  html_message=message)
