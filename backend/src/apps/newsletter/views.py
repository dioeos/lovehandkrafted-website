from django.shortcuts import render
from django.conf import settings

# ---- General imports ----
from .models import Subscriber


# ---- Suscribe imports ----
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .api.serializers import SubscriberSerializer
from rest_framework import generics
from rest_framework.permissions import AllowAny
from drf_spectacular.utils import extend_schema

# ---- Send Newsletter imports ----
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.contrib.auth import get_user_model



User = get_user_model()

class SubscribeAPIView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = SubscriberSerializer
    permission_classes = [AllowAny]

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def send_newsletter_view(request):
    user = request.user

    if not user.is_vendor:
        return Response({"error": "Only vendors can send newsletters."}, status=403)
    
    #extract frontend request data
    subject = request.data.get("subject")
    content = request.data.get("content")
    subscribers = Subscriber.objects.all()

    if not subscribers:
        return Response({"message": "No subscribers found."}, status=400)
    
    sent_count = 0
    for subscriber in subscribers:
        try:

            html_content = render_to_string(
                "emails/newsletter_email.html",
                {"subject": subject, "content": content}
            )

            msg = EmailMultiAlternatives(
                subject,
                "This is a plain text fallback",
                "lovehandkraftedteam@gmail.com",
                [subscriber.email]
            )

            #attach HTML content to email instance
            msg.attach_alternative(html_content, "text/html")
            msg.content_subtype = "html" 
            print(msg.message())
            msg.send()
            sent_count += 1
        except Exception as e:
            #stops on first failure
            return Response({"error": str(e)}, status=500)
        
    return Response(
        {
            "message": "Newsletter sent successfully.",
            "sent_count": sent_count,
        },
        status=200
    )
    
