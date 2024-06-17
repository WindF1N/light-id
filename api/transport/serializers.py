from django.contrib.humanize.templatetags.humanize import naturalday
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Transport, ImageTransport
from profiles.serializers import UserSerializer
from comments.serializers import CommentSerializer

class ImageTransportSerializer(serializers.ModelSerializer):

    file = serializers.FileField(source='file_resize', allow_empty_file=True)

    class Meta:
        model = ImageTransport
        fields = ('id', 'file', 'placeholder', 'aspect')

class TransportSerializer(serializers.ModelSerializer):

    images = ImageTransportSerializer(many=True)
    user = UserSerializer(source='responsible')
    date = serializers.SerializerMethodField()
    comments_count = serializers.SerializerMethodField()
    is_saved = serializers.SerializerMethodField()
    last_comment = serializers.SerializerMethodField()

    class Meta:
        model = Transport
        fields = ('id', 'user', 'images', 'title', 'price', 'city', 'comments_count', 'is_saved', 'date', 'last_comment')

    def get_comments_count(self, obj):
        comments_count = obj.comment_set.all().count()
        return comments_count

    def get_is_saved(self, obj):
        try:
            if obj in self.context['request'].user.userprofile.savedtransports.all():
                is_saved = True
            else:
                is_saved = False
        except:
            is_saved = False
        return is_saved

    def get_date(self, obj):
        date = naturalday(obj.date)
        return date

    def get_last_comment(self, obj):
        if obj.comment_set.order_by('-id').first():
            last_comment = CommentSerializer(obj.comment_set.order_by('-id').first(), context={'request': self.context['request']}).data
        else:
            last_comment = None
        return last_comment
