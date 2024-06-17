from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.authentication import JWTAuthentication

from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from .models import UserProfile
from activity.models import Activity
from django.contrib.auth.models import User
from .serializers import *
from posts.serializers import *

from django.db.models import Q

import base64
from django.core.files.base import ContentFile


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def user(request):
    if request.method == 'GET':
        if request.user.is_superuser:
            users_count = User.objects.count()
        else:
            users_count = None

        return Response({
            'data': UserFullSerializer(request.user, context={'request': request}).data,
            'users_count': users_count
        })
    if request.method == 'POST': 
        avatar = request.POST.get('new_avatar', None)
        avatar_ = request.FILES.get('files', None)
        first_name = request.POST.get('name', None)
        first_name_ = request.POST.get('first_name', None)
        last_name = request.POST.get('last_name', None)
        username = request.POST.get('username', None)
        sex = request.POST.get('sex', None)
        birth_date = request.POST.get('birth_date', None)
        city = request.POST.get('city', None)
        bio = request.POST.get('bio', None)
        category = request.POST.get('category', None)
        position = request.POST.get('position', None)
        company = request.POST.get('company', None)
        phone = request.POST.get('phone', None)
        telegram = request.POST.get('telegram', None)
        site = request.POST.get('site', None)

        if avatar != None:
            data = ContentFile(base64.b64decode(avatar), name='temp.jpg')
            request.user.userprofile.avatar = data
        if avatar_ != None:
            request.user.userprofile.avatar = avatar_
        if first_name != None:
            request.user.first_name = first_name
        if first_name_ != None:
            request.user.first_name = first_name_
        if last_name != None:
            request.user.last_name = last_name
        if username != None:
            if not User.objects.filter(username=username).exclude(username=request.user.username):
                request.user.username = username
            else:
                return Response({
                    'error': "username is taken by another user"
                }, status=status.HTTP_400_BAD_REQUEST)
        if sex != None:
            request.user.userprofile.sex = sex
        if birth_date != None:
            request.user.userprofile.birth_date = birth_date
        if city != None:
            request.user.userprofile.city = city
        if bio != None:
            request.user.userprofile.bio = bio
        if category != None:
            request.user.userprofile.category = category
        if position != None:
            request.user.userprofile.position = position
        if company != None:
            request.user.userprofile.company = company
        if phone != None:
            request.user.userprofile.phone = phone.replace(' ', '').replace('-', '')
        if telegram != None:
            request.user.userprofile.telegram = telegram
        if site != None:
            request.user.userprofile.site = site

        request.user.save()
        request.user.userprofile.save()

        return Response({
            'data': UserFullSerializer(request.user, context={'request': request}).data,
        })

@api_view(['GET'])
@authentication_classes([JWTAuthentication])
def check_user(request, phone):
    if request.method == 'GET':
        if User.objects.filter(userprofile__phone=phone).exists():
            return Response({
                'data': UserFullSerializer(User.objects.get(userprofile__phone=phone), context={'request': request}).data
            })
        else:
            return Response({
                'data': None
            })

@api_view()
def user_by_usernmae(request, username):
    return Response({
        'data': UserFullSerializer(User.objects.get(username=username), context={'request': request}).data
    })


@api_view(['GET', 'POST'])
@authentication_classes([JWTAuthentication])
def profiles_list(request):
    if request.method == 'GET':
        permission_classes([AllowAny])
        data = []
        nextPage = 1
        previousPage = 1
        profiles = User.objects.all().exclude(username=request.user.username)
        page = request.GET.get('page', 1)
        paginator = Paginator(profiles, 30)
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
        permission_classes([IsAuthenticated])
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
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


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def savedposts_list(request):
    if request.method == 'GET':
        data = []
        nextPage = 1
        previousPage = 1
        savedposts = request.user.userprofile.savedposts.all()
        page = request.GET.get('page', 1)
        paginator = Paginator(savedposts, 30)
        try:
            data = paginator.page(page)
        except PageNotAnInteger:
            data = paginator.page(1)
        except EmptyPage:
            data = paginator.page(paginator.num_pages)

        serializer = PostSerializer(data, context={'request': request}, many=True)
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
        post_id = request.data['post_id']

        try:
            post = Post.objects.get(id=post_id)
        except Post.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        if post not in request.user.userprofile.savedposts.all():
            request.user.userprofile.savedposts.add(post)
            return Response({'message': 'add'}, status=status.HTTP_201_CREATED)
        else:
            request.user.userprofile.savedposts.remove(post)
            return Response({'message': 'delete'}, status=status.HTTP_201_CREATED)




@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
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


@api_view(['GET'])
def profiles_subscribes(request, username):

    try:
        subscribes = User.objects.get(username=username).userprofile.subscribes.all().order_by('-id')
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        data = []
        nextPage = 1
        previousPage = 1
        page = request.GET.get('page', 1)
        paginator = Paginator(subscribes, 30)
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


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def profiles_subscribers(request, username):

    try:
        subscribers = User.objects.get(username=username).subscribers.all().order_by('-id')
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        data = []
        nextPage = 1
        previousPage = 1
        page = request.GET.get('page', 1)
        paginator = Paginator(subscribers, 30)
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
            'nextlink': '/api/profiles/'+ str(username) +'/subscribers?page=' + str(nextPage),
            'prevlink': '/api/profiles/'+ str(username) +'/subscribers?page=' + str(previousPage)
        })

    elif request.method == 'POST':

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        if request.user.userprofile not in user.subscribers.all():
            user.subscribers.add(request.user.userprofile)
            Activity.objects.create(
                type = "sub",
                from_user = request.user,
                to_user = user,
                text = "подписался(-ась) на вас."
            )
        else:
            user.subscribers.remove(request.user.userprofile)
            Activity.objects.filter(type = "sub", from_user = request.user, to_user = user, text = "подписался(-ась) на вас.").delete()

        return Response({'count': user.subscribers.count()})


@api_view(['GET'])
def search_users(request):
    if request.method == 'GET':
        search = request.GET.get('search', '')

        data = []
        nextPage = 1
        previousPage = 1
        profiles = User.objects.filter(Q(username__icontains=search) | Q(first_name__icontains=search)).order_by('-id')
        page = request.GET.get('page', 1)
        paginator = Paginator(profiles, 30)

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
            'nextlink': '/api/profiles/search?search='+ str(search) +'&page=' + str(nextPage),
            'prevlink': '/api/profiles/search?search='+ str(search) +'&page=' + str(previousPage),
        })
