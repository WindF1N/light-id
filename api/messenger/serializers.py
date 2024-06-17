from django.contrib.humanize.templatetags.humanize import naturaltime
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Lobby, Message
from profiles.serializers import UserSerializer
import locale

locale.setlocale(locale.LC_ALL, "ru_RU.UTF-8")


class LobbySerializer(serializers.ModelSerializer):

    memberone = UserSerializer()
    membertwo = UserSerializer()
    last_message = serializers.SerializerMethodField()
    count_unread = serializers.SerializerMethodField()

    class Meta:
        model = Lobby
        fields = ('id', 'memberone', 'membertwo', 'last_message', 'count_unread')

    def get_last_message(self, obj):
        last_message = MessageSerializer(obj.messages.order_by('-id').first(), context={'request': self.context['request']})
        return last_message.data

    def get_count_unread(self, obj):
        count_unread = obj.messages.filter(read=False).exclude(sender=self.context['request'].user).count()
        return count_unread


class MessageSerializer(serializers.ModelSerializer):

    sender = UserSerializer()
    date = serializers.DateTimeField(format="%d.%m.%Y %H:%M")
    date_messages = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = ('id', 'text', 'sender', 'date', 'start', 'read', 'date_messages')

    def get_date_messages(self, obj):
        if obj == Message.objects.filter(lobby=obj.lobby, date__date=obj.date.date(), start=False).first():
            date_messages = Message.objects.filter(lobby=obj.lobby, date__date=obj.date.date(), start=False).first().date.strftime("%d %B %Y") + " г"
        else:
            date_messages = None

        return date_messages
