from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from .models import Transport, ImageTransport
from likes.models import LikePost, LikeComment
from activity.models import Activity
from comments.models import Comment
from transport.models import Transport
from django.contrib.auth.models import User
from .serializers import *
from likes.serializers import *
from transport.serializers import *
from comments.serializers import *

from django.db.models import Q
from itertools import chain

import base64
from django.core.files.base import ContentFile


@api_view(['GET'])
@authentication_classes([JWTAuthentication])
def transports_list(request):
    if request.method == 'GET':
        data = []
        nextPage = 1
        previousPage = 1
        posts = Transport.objects.all().order_by('-id')
        page = request.GET.get('page', 1)
        paginator = Paginator(posts, 15)
        try:
            data = paginator.page(page)
        except PageNotAnInteger:
            data = paginator.page(1)
        except EmptyPage:
            data = paginator.page(paginator.num_pages)

        serializer = TransportSerializer(data, context={'request': request}, many=True)
        if data.has_next():
            nextPage = data.next_page_number()
        if data.has_previous():
            previousPage = data.previous_page_number()

        return Response({
            'result': serializer.data,
            'count': paginator.count,
            'numpages' : paginator.num_pages,
            'nextlink': '/api/transports/?page=' + str(nextPage),
            'prevlink': '/api/transports/?page=' + str(previousPage),
        })


@api_view(['GET', 'POST'])
def transports_list_user(request, username):
    if request.method == 'GET':
        data = []
        nextPage = 1
        previousPage = 1
        postid = request.GET.get('postid', None)
        if postid:
            post = Transport.objects.filter(id=postid, responsible=User.objects.get(username=username)).order_by('-id')
            posts = Transport.objects.filter(responsible=User.objects.get(username=username)).exclude(id=postid).order_by('-id')
            posts = list(chain(post, posts))
        else:
            posts = Transport.objects.filter(responsible=User.objects.get(username=username)).order_by('-id')
        page = request.GET.get('page', 1)
        paginator = Paginator(posts, 15)
        try:
            data = paginator.page(page)
        except PageNotAnInteger:
            data = paginator.page(1)
        except EmptyPage:
            data = paginator.page(paginator.num_pages)

        serializer = TransportSerializer(data, context={'request': request}, many=True)
        if data.has_next():
            nextPage = data.next_page_number()
        if data.has_previous():
            previousPage = data.previous_page_number()

        if postid:
            nextlink = '/api/transports/user/'+username+'?page=' + str(nextPage) + '&postid=' + str(postid)
            prevlink = '/api/transports/user/'+username+'?page=' + str(previousPage) + '&postid=' + str(postid)
        else:
            nextlink = '/api/transports/user/'+username+'?page=' + str(nextPage)
            prevlink = '/api/transports/user/'+username+'?page=' + str(previousPage)

        return Response({
            'result': serializer.data,
            'count': paginator.count,
            'numpages' : paginator.num_pages,
            'nextlink': nextlink,
            'prevlink': prevlink,
        })

    # elif request.method == 'POST':
    #     serializer = PostSerializer(data=request.data)
    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response(serializer.data, status=status.HTTP_201_CREATED)
    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def savedtransports_list(request):
    # if request.method == 'GET':
    #     data = []
    #     nextPage = 1
    #     previousPage = 1
    #     savedposts = request.user.userprofile.savedposts.all()
    #     page = request.GET.get('page', 1)
    #     paginator = Paginator(savedposts, 30)
    #     try:
    #         data = paginator.page(page)
    #     except PageNotAnInteger:
    #         data = paginator.page(1)
    #     except EmptyPage:
    #         data = paginator.page(paginator.num_pages)
    #
    #     serializer = PostSerializer(data, context={'request': request}, many=True)
    #     if data.has_next():
    #         nextPage = data.next_page_number()
    #     if data.has_previous():
    #         previousPage = data.previous_page_number()
    #
    #     return Response({
    #         'result': serializer.data,
    #         'count': paginator.count,
    #         'numpages' : paginator.num_pages,
    #         'nextlink': '/api/profiles/?page=' + str(nextPage),
    #         'prevlink': '/api/profiles/?page=' + str(previousPage)
    #     })

    if request.method == 'POST':
        transport_id = request.data['transport_id']

        try:
            transport = Transport.objects.get(id=transport_id)
        except Transport.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        if transport not in request.user.userprofile.savedtransports.all():
            request.user.userprofile.savedtransports.add(transport)
            return Response({'message': 'add'}, status=status.HTTP_201_CREATED)
        else:
            request.user.userprofile.savedtransports.remove(transport)
            return Response({'message': 'delete'}, status=status.HTTP_201_CREATED)


@api_view(['GET'])
def transports_comments(request, id):
    if request.method == 'GET':
        data = []
        nextPage = 1
        previousPage = 1
        comments = Comment.objects.filter(transport=Transport.objects.get(id=id)).order_by('-id')
        page = request.GET.get('page', 1)
        paginator = Paginator(comments, 30)
        try:
            data = paginator.page(page)
        except PageNotAnInteger:
            data = paginator.page(1)
        except EmptyPage:
            data = paginator.page(paginator.num_pages)

        serializer = CommentSerializer(data, context={'request': request}, many=True)
        if data.has_next():
            nextPage = data.next_page_number()
        if data.has_previous():
            previousPage = data.previous_page_number()

        return Response({
            'result': serializer.data,
            'count': paginator.count,
            'numpages' : paginator.num_pages,
            'nextlink': '/api/transports/'+ str(id) +'/comments?page=' + str(nextPage),
            'prevlink': '/api/transports/'+ str(id) +'/comments?page=' + str(previousPage)
        })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def transports_comment_add(request, id):
    if request.method == 'POST':
        transport = Transport.objects.get(id=id)

        new_comment = Comment.objects.create(
            transport = transport,
            user = request.user,
            text = request.data['text']
        )

        serializer = CommentSerializer(new_comment, context={'request': request})

        # Activity.objects.create(
        #     type = "comment",
        #     from_user = request.user,
        #     to_user = Post.objects.get(id=id).user,
        #     text = "прокомментировал(-а): {}".format(request.data['text']),
        #     post = Post.objects.get(id=id)
        # )

        return Response({'result': serializer.data}, status=status.HTTP_201_CREATED)
