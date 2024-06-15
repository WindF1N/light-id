from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile


class UserSerializer(serializers.ModelSerializer):

    avatar = serializers.FileField(source='userprofile.avatar', allow_empty_file=True)
    bio = serializers.CharField(source='userprofile.bio', allow_blank=True, allow_null=True)
    phone = serializers.CharField(source='userprofile.phone', allow_blank=True, allow_null=True)
    name = serializers.CharField(source='first_name', allow_blank=True, allow_null=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'phone', 'name', 'bio', 'avatar')


class UserProfileSerializer(serializers.ModelSerializer):

    name = serializers.CharField(source='user.first_name', allow_blank=True, allow_null=True)
    email = serializers.CharField(source='user.email', allow_blank=True, allow_null=True)
    username = serializers.CharField(source='user.username', allow_blank=True, allow_null=True)

    class Meta:
        model = UserProfile
        fields = ('username', 'email', 'phone', 'name', 'bio', 'avatar')
