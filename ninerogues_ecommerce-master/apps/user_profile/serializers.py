from rest_framework import serializers
from .models import UserProfile
from ..user.serializers import UserCreateSerializer


class UserProfileSerializer(serializers.ModelSerializer):
    user = UserCreateSerializer()
    class Meta:
        model = UserProfile
        fields = '__all__'
