from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.authentication import JWTAuthentication

from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.contrib.auth.models import User
from .serializers import *
from .models import *

from datetime import datetime, timedelta

from django.db.models import Q


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def apartments_list(request):
    if request.method == 'GET':
        data = []
        nextPage = 1
        previousPage = 1
        apartments = Apartment.objects.filter(user=request.user)
        page = request.GET.get('page', 1)
        paginator = Paginator(apartments, 30)
        try:
            data = paginator.page(page)
        except PageNotAnInteger:
            data = paginator.page(1)
        except EmptyPage:
            data = paginator.page(paginator.num_pages)

        serializer = ApartmentSerializer(data, context={'request': request}, many=True)
        if data.has_next():
            nextPage = data.next_page_number()
        if data.has_previous():
            previousPage = data.previous_page_number()

        return Response({
            'result': serializer.data,
            'count': paginator.count,
            'numpages' : paginator.num_pages,
            'nextlink': '/api/lighthouse/apartments?page=' + str(nextPage),
            'prevlink': '/api/lighthouse/apartments?page=' + str(previousPage)
        })

    if request.method == 'POST':
        address, _ = Address.objects.get_or_create(user=request.user, address=request.data.get('address', None))
        floor, _ = Floor.objects.get_or_create(user=request.user, address=address, number=int(request.data.get('floor', None)))
        apartment = Apartment.objects.create(
            user=request.user,
            address=address,
            floor=floor,
            number=int(request.data.get('number', None))
        )

        serializer = ApartmentSerializer(apartment, context={'request': request})

        return Response({
            'result': serializer.data
        })


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def apartment(request, id):
    if request.method == 'GET':
        apartment = Apartment.objects.get(id=id)
        serializer = ApartmentSerializer(apartment, context={'request': request})

        return Response({
            'result': serializer.data
        })

    if request.method == 'POST':
        apartment = Apartment.objects.get(id=id)
        active = request.data.get('active', None)

        if active != None:
            apartment.active = active
            apartment.save()

        serializer = ApartmentSerializer(apartment, context={'request': request})
        return Response({
            'result': serializer.data,
            'active': active
        })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def remove_guest(request, id):
    if request.method == 'POST':
        try:
            apartment = Apartment.objects.get(id=id)
        except Apartment.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        apartment.status = 'Свободна'
        apartment.save()

        payment = Payment.objects.filter(apartment=apartment).last()
        payment.status = True
        payment.save()

        serializer = ApartmentSerializer(apartment, context={'request': request})
        return Response({
            'result': serializer.data,
        })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def add_guest(request, id):
    if request.method == 'POST':
        try:
            apartment = Apartment.objects.get(id=id)
        except Apartment.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        if UserProfile.objects.filter(Q(phone="8"+request.data['phone'].replace(' ', '').replace('-', '')[2:])
                                        | Q(phone="+7"+request.data['phone'].replace(' ', '').replace('-', '')[1:])
                                        | Q(phone=request.data['phone'].replace(' ', '').replace('-', ''))):

            userprofile = UserProfile.objects.get(Q(phone="8"+request.data['phone'].replace(' ', '').replace('-', '')[2:])
                                            | Q(phone="+7"+request.data['phone'].replace(' ', '').replace('-', '')[1:])
                                            | Q(phone=request.data['phone'].replace(' ', '').replace('-', '')))
            userprofile.user.first_name = request.data.get('name', None)
            userprofile.user.last_name = request.data.get('last_name', None)
            userprofile.user.save()

            if not userprofile.middle_name:
                userprofile.middle_name = request.data.get('middle_name', None)
            if not userprofile.avatar:
                userprofile.avatar = request.FILES.get('files', None)
            if not userprofile.site:
                userprofile.site = request.data.get('site', None)
            if not userprofile.sitecompany:
                userprofile.sitecompany = request.data.get('sitecompany', None)
            if not userprofile.city:
                userprofile.city = request.data.get('city', None)
            if not userprofile.street:
                userprofile.street = request.data.get('street', None)
            if not userprofile.apartmentnumber:
                userprofile.apartmentnumber = request.data.get('apartmentnumber', None)
            if not userprofile.sex:
                userprofile.sex = request.data.get('sex', None)
            if not userprofile.birth_date:
                userprofile.birth_date = request.data.get('birth_date', None)
            if not userprofile.telegram:
                userprofile.telegram = request.data.get('telegram', None)
            if not userprofile.birth_place:
                userprofile.birth_place = request.data.get('birth_place', None)
            if not userprofile.number:
                userprofile.number = request.data.get('number', None)
            if not userprofile.subdivision:
                userprofile.subdivision = request.data.get('subdivision', None)
            if not userprofile.issue_date:
                userprofile.issue_date = request.data.get('issue_date', None)
            if not userprofile.issued_by:
                userprofile.issued_by = request.data.get('issued_by', None)
            if not userprofile.registration_address:
                userprofile.registration_address = request.data.get('registration_address', None)
            if not userprofile.position:
                userprofile.position = request.data.get('position', None)
            if not userprofile.company:
                userprofile.company = request.data.get('company', None)

            userprofile.save()

        else:
            new_user = User.objects.create(
                username=request.data.get('username', None),
                first_name=request.data.get('name', None),
                last_name=request.data.get('last_name', None),
            )

            new_profile = UserProfile.objects.create(
                user = new_user,
                avatar = request.FILES.get('files', None),
                phone = request.data.get('phone', '').replace(' ', '').replace('-', ''),
                site = request.data.get('site', None),
                sitecompany = request.data.get('sitecompany', None),
                sex = request.data.get('sex', None),
                birth_date = request.data.get('birth_date', None),
                telegram = request.data.get('telegram', None),
                birth_place = request.data.get('birth_place', None),
                number = request.data.get('number', None),
                subdivision = request.data.get('subdivision', None),
                issue_date = request.data.get('issue_date', None),
                issued_by = request.data.get('issued_by', None),
                registration_address = request.data.get('registration_address', None),
                position = request.data.get('position', None),
                company = request.data.get('company', None),
                middle_name = request.data.get('middle_name', None),
                city = request.data.get('city', None),
                street = request.data.get('street', None),
                apartmentnumber = request.data.get('apartmentnumber', None),
            )

            userprofile = new_profile

        new_history = ApartmentHistory.objects.create(
            apartment = apartment,
            userprofile = userprofile,
            rental_period = request.data.get('rental_period', None),
            rent = request.data.get('rent', None),
            deposit = request.data.get('deposit', None),
            date_start = request.data.get('date_start', None),
            date_end = request.data.get('date_end', None),
            people_count = request.data.get('people_count', None),
            adults = request.data.get('adults', None),
            babies = request.data.get('babies', None),
            animals = request.data.get('animals', None),
            booking_start = request.data.get('booking_start', None),
            booking_end = request.data.get('booking_end', None),
            cleaning = request.data.get('cleaning', None),
            transfer = request.data.get('transfer', None)
        )

        new_communal = Communal.objects.create(
            apartment = apartment,
            coldwater = 0.00,
            hotwater = 0.00,
            electricity = 0.00,
            gas = 0.00,
            sum = 0.00,
            date = request.data.get('date_end', None)
        )

        if new_history.rental_period == 'На длительный срок':
            sum = float(new_history.rent)
        elif new_history.rental_period == 'Посуточно':
            delta = datetime.strptime(request.data['date_end'], "%Y-%m-%d") - datetime.strptime(request.data['date_start'], "%Y-%m-%d")
            sum = float(new_history.rent) * int(delta.days)

        sum -= float(new_history.deposit)

        new_payment = Payment.objects.create(
            apartment = apartment,
            communal = new_communal,
            rent = request.data.get('rent', None),
            date = request.data.get('date_end', None),
            duty = 0,
            sum = sum
        )

        apartment.status = 'Занята'
        apartment.save()

        return Response({
            'result': 'OK'
        })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def addresses_list(request):
    if request.method == 'GET':
        addresses = Address.objects.filter(user=request.user)
        serializer = AddressSerializer(addresses, context={'request': request}, many=True)

        return Response({
            'result': serializer.data
        })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def floors_list(request):
    if request.method == 'GET':
        floors = Floor.objects.filter(user=request.user)
        serializer = FloorSerializer(floors, context={'request': request}, many=True)

        return Response({
            'result': serializer.data
        })
