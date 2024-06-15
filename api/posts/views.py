from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from .models import Post, PostItem
from likes.models import LikePost, LikeComment
from comments.models import Comment
from django.contrib.auth.models import User
from .serializers import *
from likes.serializers import *
from comments.serializers import *


@api_view(['GET', 'POST'])
def posts_list(request):
    if request.method == 'GET':
        data = []
        nextPage = 1
        previousPage = 1
        posts = Post.objects.all().order_by('-id')
        page = request.GET.get('page', 1)
        paginator = Paginator(posts, 15)
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
            'nextlink': '/api/posts/?page=' + str(nextPage),
            'prevlink': '/api/posts/?page=' + str(previousPage)
        })

    elif request.method == 'POST':
        serializer = PostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def posts_detail(request, id):

    try:
        post = Post.objects.get(id=id)
    except Post.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = PostSerializer(post, context={'request': request})
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = PostSerializer(post, data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        post.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET', 'POST'])
def posts_likes(request, id):
    if request.method == 'GET':
        data = []
        nextPage = 1
        previousPage = 1
        likes = LikePost.objects.filter(post=Post.objects.get(id=id)).order_by('-id')
        page = request.GET.get('page', 1)
        paginator = Paginator(likes, 15)
        try:
            data = paginator.page(page)
        except PageNotAnInteger:
            data = paginator.page(1)
        except EmptyPage:
            data = paginator.page(paginator.num_pages)

        serializer = LikePostSerializer(data, context={'request': request}, many=True)
        if data.has_next():
            nextPage = data.next_page_number()
        if data.has_previous():
            previousPage = data.previous_page_number()

        if Post.objects.get(id=id).likepost_set.filter(user=request.user):
            is_liked = True
        else:
            is_liked = False

        return Response({
            'result': serializer.data,
            'count': paginator.count,
            'numpages' : paginator.num_pages,
            'is_liked': is_liked,
            'nextlink': '/api/posts/'+ str(id) +'/likes?page=' + str(nextPage),
            'prevlink': '/api/posts/'+ str(id) +'/likes?page=' + str(previousPage)
        })

    elif request.method == 'POST':
        serializer = LikePostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'POST'])
def posts_comments(request, id):
    if request.method == 'GET':
        data = []
        nextPage = 1
        previousPage = 1
        comments = Comment.objects.filter(post=Post.objects.get(id=id)).order_by('-id')
        page = request.GET.get('page', 1)
        paginator = Paginator(comments, 15)
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
            'nextlink': '/api/posts/'+ str(id) +'/comments?page=' + str(nextPage),
            'prevlink': '/api/posts/'+ str(id) +'/comments?page=' + str(previousPage)
        })

    elif request.method == 'POST':
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
