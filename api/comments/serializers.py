from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Comment

class CommentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Comment
        fields = ('id', 'user', 'post', 'text', 'date')
