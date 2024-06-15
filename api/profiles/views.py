from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from .models import UserProfile
from django.contrib.auth.models import User
from .serializers import *

@api_view(['GET', 'POST'])
def profiles_list(request):
    if request.method == 'GET':
        data = []
        nextPage = 1
        previousPage = 1
        profiles = User.objects.all()
        page = request.GET.get('page', 1)
        paginator = Paginator(profiles, 15)
        try:
            data = paginator.page(page)
        except PageNotAnInteger:
            data = paginator.page(1)
        except EmptyPage:
            data = paginator.page(paginator.num_pages)

        serializer = UserSerializer(data, context={'request': request}, many=True)
        if data.has_next():
            nextPage = data.next_page_number()
        if data.has_previous():
            previousPage = data.previous_page_number()

        return Response({
            'result': serializer.data,
            'count': paginator.count,
            'numpages' : paginator.num_pages,
            'nextlink': '/api/profiles/?page=' + str(nextPage),
            'prevlink': '/api/profiles/?page=' + str(previousPage)
        })

    elif request.method == 'POST':
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            print(serializer.data['username'])

            new_user = User.objects.create(
                username = serializer.data['username'],
                first_name = serializer.data['name'],
                email = serializer.data['email']
            )

            new_profile = UserProfile.objects.create(
                user = new_user,
                avatar = serializer.data['avatar'],
                bio = serializer.data['bio'],
                phone = serializer.data['phone']
            )

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def profiles_detail(request, username):

    try:
        profile = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = UserSerializer(profile, context={'request': request})
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = UserSerializer(profile, data=request.data, context={'request': request})
        if serializer.is_valid():
            profile.username = request.data['username']
            profile.first_name = request.data['name']
            profile.email = request.data['email']
            profile.save()
            profile.userprofile.avatar = request.data['avatar']
            profile.userprofile.bio = request.data['bio']
            profile.userprofile.phone = request.data['phone']
            profile.userprofile.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        profile.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET', 'POST'])
def profiles_subscribes(request, username):

    try:
        subscribes = User.objects.get(username=username).userprofile.subscribes.all()
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        data = []
        nextPage = 1
        previousPage = 1
        page = request.GET.get('page', 1)
        paginator = Paginator(subscribes, 15)
        try:
            data = paginator.page(page)
        except PageNotAnInteger:
            data = paginator.page(1)
        except EmptyPage:
            data = paginator.page(paginator.num_pages)

        serializer = UserSerializer(data, context={'request': request}, many=True)

        if data.has_next():
            nextPage = data.next_page_number()
        if data.has_previous():
            previousPage = data.previous_page_number()

        return Response({
            'result': serializer.data,
            'count': paginator.count,
            'numpages' : paginator.num_pages,
            'nextlink': '/api/profiles/'+ str(username) +'/subscribes?page=' + str(nextPage),
            'prevlink': '/api/profiles/'+ str(username) +'/subscribes?page=' + str(previousPage)
        })

    elif request.method == 'POST':
        if not 'username' in request.data:
            return Response(status=status.HTTP_404_NOT_FOUND)

        try:
            user = User.objects.get(username=request.data['username'])
        except User.DoesNotExist:
            return Response({'error': 'Пользователь {} не найден'.format(request.data['username'])}, status=status.HTTP_404_NOT_FOUND)

        if 'type' in request.data:
            if request.data['type'] == 'add':
                serializer = UserSerializer(user)
                User.objects.get(username=username).userprofile.subscribes.add(user)
                return Response(serializer.data)

            elif request.data['type'] == 'remove':
                serializer = UserSerializer(user)
                User.objects.get(username=username).userprofile.subscribes.remove(user)
                return Response(serializer.data)

        serializer = UserSerializer(user)
        User.objects.get(username=username).userprofile.subscribes.add(user)
        return Response(serializer.data)


@api_view(['GET', 'POST'])
def profiles_subscribers(request, username):

    try:
        subscribers = User.objects.get(username=username).subscribers.all()
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        data = []
        nextPage = 1
        previousPage = 1
        page = request.GET.get('page', 1)
        paginator = Paginator(subscribers, 15)
        try:
            data = paginator.page(page)
        except PageNotAnInteger:
            data = paginator.page(1)
        except EmptyPage:
            data = paginator.page(paginator.num_pages)

        serializer = UserProfileSerializer(data, context={'request': request}, many=True)

        if data.has_next():
            nextPage = data.next_page_number()
        if data.has_previous():
            previousPage = data.previous_page_number()

        return Response({
            'result': serializer.data,
            'count': paginator.count,
            'numpages' : paginator.num_pages,
            'nextlink': '/api/profiles/'+ str(username) +'/subscribes?page=' + str(nextPage),
            'prevlink': '/api/profiles/'+ str(username) +'/subscribes?page=' + str(previousPage)
        })

    elif request.method == 'POST':
        if not 'username' in request.data:
            return Response(status=status.HTTP_404_NOT_FOUND)

        try:
            user = User.objects.get(username=request.data['username'])
        except User.DoesNotExist:
            return Response({'error': 'Пользователь {} не найден'.format(request.data['username'])}, status=status.HTTP_404_NOT_FOUND)

        if 'type' in request.data:
            if request.data['type'] == 'add':
                serializer = UserSerializer(user)
                User.objects.get(username=username).subscribers.add(user.userprofile)
                return Response(serializer.data)

            elif request.data['type'] == 'remove':
                serializer = UserSerializer(user)
                User.objects.get(username=username).subscribers.remove(user.userprofile)
                return Response(serializer.data)

        serializer = UserSerializer(user)
        User.objects.get(username=username).subscribers.add(user.userprofile)
        return Response(serializer.data)
