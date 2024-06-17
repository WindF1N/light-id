from rest_framework import serializers
from .models import *
from profiles.serializers import UserSerializer

class UserFullSerializer(serializers.ModelSerializer):

    avatar = serializers.FileField(source='userprofile.avatar', allow_empty_file=True)
    phone = serializers.CharField(source='userprofile.phone', allow_blank=True, allow_null=True)
    name = serializers.CharField(source='first_name', allow_blank=True, allow_null=True)
    middle_name = serializers.CharField(source='userprofile.middle_name', allow_blank=True, allow_null=True)

    number = serializers.CharField(source='userprofile.number', allow_blank=True, allow_null=True)
    subdivision = serializers.CharField(source='userprofile.subdivision', allow_blank=True, allow_null=True)
    issue_date = serializers.DateField(source='userprofile.issue_date', format="%d.%m.%Y")
    registration_address = serializers.CharField(source='userprofile.registration_address', allow_blank=True, allow_null=True)
    issued_by = serializers.CharField(source='userprofile.issued_by', allow_blank=True, allow_null=True)
    birth_place = serializers.CharField(source='userprofile.birth_place', allow_blank=True, allow_null=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'phone', 'name', 'last_name', 'avatar', 'middle_name',
                  'number', 'subdivision', 'issue_date', 'registration_address', 'issued_by', 'birth_place')


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ('id', 'address',)


class FloorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Floor
        fields = ('id', 'number',)


class ApartmentHistorySerializer(serializers.ModelSerializer):

    user = serializers.SerializerMethodField()
    date_start = serializers.DateTimeField(format="%d.%m.%Y")
    date_end = serializers.DateTimeField(format="%d.%m.%Y")

    class Meta:
        model = ApartmentHistory
        fields = ('id', 'rental_period', 'rent', 'deposit', 'booking_start', 'booking_end', 'date_start', 'date_end', 'people_count', 'adults', 'babies', 'animals', 'cleaning', 'transfer', 'user')

    def get_user(self, obj):
        return UserFullSerializer(obj.userprofile.user, context={'request': self.context['request']}).data


class CommunalSerializer(serializers.ModelSerializer):

    date = serializers.DateField(format="%d.%m.%Y")

    class Meta:
        model = Communal
        fields = ('id', 'coldwater', 'hotwater', 'electricity', 'gas', 'sum', 'date')


class PaymentSerializer(serializers.ModelSerializer):

    date = serializers.DateField(format="%d.%m.%Y")
    communal = CommunalSerializer()

    class Meta:
        model = Payment
        fields = ('id', 'sum', 'rent', 'duty', 'date', 'status', 'communal')


class ApartmentSerializer(serializers.ModelSerializer):

    user = UserSerializer()
    floor = FloorSerializer()
    address = AddressSerializer()
    history = serializers.SerializerMethodField()
    payments = serializers.SerializerMethodField()

    class Meta:
        model = Apartment
        fields = ('id', 'user', 'number', 'active', 'status', 'floor', 'address', 'history', 'payments')

    def get_history(self, obj):
        history = ApartmentHistorySerializer(ApartmentHistory.objects.filter(apartment=obj).order_by('-id'), context={'request': self.context['request']}, many=True)
        return history.data

    def get_payments(self, obj):
        payments = PaymentSerializer(Payment.objects.filter(apartment=obj).order_by('-id'), context={'request': self.context['request']}, many=True)
        return payments.data
