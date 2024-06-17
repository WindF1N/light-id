from django.contrib.humanize.templatetags.humanize import naturaltime
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile


class UserSerializer(serializers.ModelSerializer):

    avatar = serializers.FileField(source='userprofile.avatar_resize', allow_empty_file=True)
    name = serializers.CharField(source='first_name', allow_blank=True, allow_null=True)
    is_sub = serializers.SerializerMethodField()
    subscribers_count = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'username', 'name', 'avatar', 'is_sub', 'subscribers_count')

    def get_is_sub(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return request.user.userprofile in obj.subscribers.all()
        return False

    def get_subscribers_count(self, obj):
        subscribers_count = obj.subscribers.all().count()
        return subscribers_count


class UserFullSerializer(serializers.ModelSerializer):

    avatar = serializers.FileField(source='userprofile.avatar_resize', allow_empty_file=True)
    bio = serializers.CharField(source='userprofile.bio', allow_blank=True, allow_null=True)
    site = serializers.CharField(source='userprofile.site', allow_blank=True, allow_null=True)
    city = serializers.CharField(source='userprofile.city', allow_blank=True, allow_null=True)
    phone = serializers.CharField(source='userprofile.phone', allow_blank=True, allow_null=True)
    name = serializers.CharField(source='first_name', allow_blank=True, allow_null=True)
    sex = serializers.CharField(source='userprofile.sex', allow_blank=True, allow_null=True)
    birth_date = serializers.DateField(source='userprofile.birth_date', format="%Y-%m-%d")
    category = serializers.CharField(source='userprofile.category', allow_blank=True, allow_null=True)
    position = serializers.CharField(source='userprofile.position', allow_blank=True, allow_null=True)
    company = serializers.CharField(source='userprofile.company', allow_blank=True, allow_null=True)
    telegram = serializers.CharField(source='userprofile.telegram', allow_blank=True, allow_null=True)

    active = serializers.ReadOnlyField(source='userprofile.active')

    date_joined = serializers.DateTimeField(format="%d %B %Y")
    posts_count = serializers.SerializerMethodField()
    subscribes_count = serializers.SerializerMethodField()
    subscribers_count = serializers.SerializerMethodField()

    is_sub = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'phone',
                  'name', 'bio', 'avatar', 'site', 'city',
                  'posts_count', 'subscribes_count', 'subscribers_count',
                  'is_sub', 'date_joined', 'last_name',
                  'sex', 'birth_date', 'category',
                  'position', 'company', 'telegram', 'active')

    def get_posts_count(self, obj):
        posts_count = obj.post_set.all().count()
        return posts_count

    def get_subscribes_count(self, obj):
        subscribes_count = obj.userprofile.subscribes.all().count()
        return subscribes_count

    def get_subscribers_count(self, obj):
        subscribers_count = obj.subscribers.all().count()
        return subscribers_count

    def get_is_sub(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return request.user.userprofile in obj.subscribers.all()
        return False

    def get_date_joined(self, obj):
        date_joined = naturaltime(obj.date_joined)
        return date_joined


class UserProfileSerializer(serializers.ModelSerializer):

    name = serializers.CharField(source='user.first_name', allow_blank=True, allow_null=True)
    username = serializers.CharField(source='user.username', allow_blank=True, allow_null=True)
    is_sub = serializers.SerializerMethodField()
    subscribers_count = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = ('id', 'username', 'name', 'avatar', 'is_sub', 'subscribers_count')

    def get_is_sub(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return request.user.userprofile in obj.user.subscribers.all()
        return False

    def get_subscribers_count(self, obj):
        subscribers_count = obj.user.subscribers.all().count()
        return subscribers_count