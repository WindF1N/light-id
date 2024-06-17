from django.contrib.humanize.templatetags.humanize import naturaltime
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Activity
from profiles.serializers import UserSerializer
from posts.serializers import PostSerializer


class ActivitySerializer(serializers.ModelSerializer):

    from_user = UserSerializer()
    to_user = UserSerializer()
    post = PostSerializer()
    date = serializers.SerializerMethodField()

    class Meta:
        model = Activity
        fields = ('id', 'type', 'from_user', 'to_user', 'post', 'text', 'date')

    def get_date(self, obj):
        date = naturaltime(obj.date)
        return date
