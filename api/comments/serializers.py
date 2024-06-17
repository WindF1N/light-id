from django.contrib.humanize.templatetags.humanize import naturaltime
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Comment

class CommentSerializer(serializers.ModelSerializer):

    avatar = serializers.FileField(source='user.userprofile.avatar', allow_empty_file=True)
    username = serializers.CharField(source='user.username')
    date = serializers.SerializerMethodField()
    likes_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ('id', 'avatar', 'username', 'post', 'text', 'likes_count', 'is_liked', 'date')

    def get_likes_count(self, obj):
        likes_count = obj.likecomment_set.all().count()
        return likes_count

    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likecomment_set.filter(user=request.user).exists()
        return False

    def get_date(self, obj):
        date = naturaltime(obj.date)
        return date