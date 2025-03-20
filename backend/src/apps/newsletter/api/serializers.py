from rest_framework import serializers
from ..models import Subscriber

class SubscriberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscriber
        fields = ["email"]

    def create(self, validated_data):
        """Custom create logic"""
        subscriber = Subscriber.objects.create(**validated_data)
        return subscriber

    def validate_email(self, value):
        """Custom validate logic"""
        if Subscriber.objects.filter(email=value).exists():
            raise serializers.ValidationError("This email is already subscribed.")
        return value
