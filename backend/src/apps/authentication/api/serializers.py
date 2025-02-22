from rest_framework import serializers
from django.contrib.auth.models import User


#ensures valid input
# class AddSerializer(serializers.Serializer):
#     x = serializers.FloatField()
#     y = serializers.FloatField()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'password')
        extra_kwargs = { 'password': {'write_only': True}}

        def create(self, validated_data):
            user = User.objects.create_user(**validated_data)
            return user