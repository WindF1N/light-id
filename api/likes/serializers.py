from rest_framework import serializers
from django.contrib.auth.models import User
from .models import LikePost, LikeComment

class LikePostSerializer(serializers.ModelSerializer):

    class Meta:
        model = LikePost
        fields = ('id', 'user', 'post', 'date')


class LikeCommentSerializer(serializers.ModelSerializer):

    class Meta:
        model = LikeComment
        fields = ('id', 'user', 'comment', 'date')
