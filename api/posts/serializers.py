from django.contrib.humanize.templatetags.humanize import naturalday
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Post, PostItem
from profiles.serializers import UserSerializer
from comments.serializers import CommentSerializer

class PostItemSerializer(serializers.ModelSerializer):

    file = serializers.FileField(source='file_resize', allow_empty_file=True)

    class Meta:
        model = PostItem
        fields = ('id', 'file', 'placeholder', 'type', 'aspect')

class PostSerializer(serializers.ModelSerializer):

    items = PostItemSerializer(many=True)
    user = UserSerializer()
    date = serializers.SerializerMethodField()
    likes_count = serializers.SerializerMethodField()
    comments_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    is_saved = serializers.SerializerMethodField()
    last_comment = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ('id', 'user', 'items', 'title', 'description', 'likes_count', 'comments_count', 'is_liked', 'is_saved', 'date', 'last_comment')

    def get_likes_count(self, obj):
        likes_count = obj.likepost_set.all().count()
        return likes_count

    def get_comments_count(self, obj):
        comments_count = obj.comment_set.all().count()
        return comments_count

    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likepost_set.filter(user=request.user).exists()
        return False

    def get_is_saved(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj in request.user.userprofile.savedposts.all()
        return False

    def get_date(self, obj):
        date = naturalday(obj.date)
        return date

    def get_last_comment(self, obj):
        last_comment = obj.comment_set.order_by('-id').first()
        if last_comment:
            return CommentSerializer(last_comment, context={'request': self.context['request']}).data
        return None
