from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Post, PostItem

class PostItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = PostItem
        fields = ('id', 'file')

class PostSerializer(serializers.ModelSerializer):

    items = PostItemSerializer(many=True)
    date = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S")

    class Meta:
        model = Post
        fields = ('id', 'user', 'items', 'description', 'date')
