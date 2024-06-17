from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.authentication import JWTAuthentication

from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from .models import Post, PostItem
from likes.models import LikePost, LikeComment
from activity.models import Activity
from comments.models import Comment
from django.contrib.auth.models import User
from .serializers import *
from likes.serializers import *
from comments.serializers import *

from django.db.models import Q
from itertools import chain

import base64
from django.core.files.base import ContentFile


@api_view(['GET', 'POST', 'DELETE'])
@authentication_classes([JWTAuthentication])
def posts_list(request):
    if request.method == 'GET':
        # Allow any user to access this view
        permission_classes([AllowAny])

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
            'prevlink': '/api/posts/?page=' + str(previousPage),
        })

    elif request.method == 'POST':
        # Require authentication for POST requests
        permission_classes([IsAuthenticated])

        files = request.FILES.getlist('files', None)
        title = request.POST.get('title', '')[:50]
        description = request.POST.get('description', '')
        base64_ = request.POST.getlist('base64', None)

        new_post = Post.objects.create(
            user = request.user,
            title = title,
            description = description
        )

        if files:
            for file in files:
                new_post.items.add(PostItem.objects.create(file=file))
        if base64_:
            for file in base64_:
                data = ContentFile(base64.b64decode(file), name='temp.jpg')
                new_post.items.add(PostItem.objects.create(file=data))

        serializer = PostSerializer(new_post, context={'request': request})

        return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def posts_detail(request, id):

    try:
        post = Post.objects.get(id=id)
    except Post.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = PostSerializer(post, context={'request': request})
        return Response(serializer.data)

    elif request.method == 'PUT':
        title = request.data.get('title', '')
        description = request.data.get('description', '')
        post.title = title
        post.description = description
        post.save()
        serializer = PostSerializer(post, context={'request': request})
        return Response(serializer.data)

    elif request.method == 'DELETE':
        post.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET', 'POST'])
@authentication_classes([JWTAuthentication])
def posts_list_user(request, username):
    if request.method == 'GET':
        permission_classes([AllowAny])
        data = []
        nextPage = 1
        previousPage = 1
        postid = request.GET.get('postid', None)
        if postid:
            post = Post.objects.filter(id=postid, user=User.objects.get(username=username)).order_by('-id')
            posts = Post.objects.filter(user=User.objects.get(username=username)).exclude(id=postid).order_by('-id')
            posts = list(chain(post, posts))
        else:
            posts = Post.objects.filter(user=User.objects.get(username=username)).order_by('-id')
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

        if postid:
            nextlink = '/api/posts/user/'+username+'?page=' + str(nextPage) + '&postid=' + str(postid)
            prevlink = '/api/posts/user/'+username+'?page=' + str(previousPage) + '&postid=' + str(postid)
        else:
            nextlink = '/api/posts/user/'+username+'?page=' + str(nextPage)
            prevlink = '/api/posts/user/'+username+'?page=' + str(previousPage)

        return Response({
            'result': serializer.data,
            'count': paginator.count,
            'numpages' : paginator.num_pages,
            'nextlink': nextlink,
            'prevlink': prevlink,
        })

    elif request.method == 'POST':
        permission_classes([IsAuthenticated])
        serializer = PostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def posts_likes(request, id):
    if request.method == 'GET':
        data = []
        nextPage = 1
        previousPage = 1
        likes = LikePost.objects.filter(post=Post.objects.get(id=id)).order_by('-id')
        page = request.GET.get('page', 1)
        paginator = Paginator(likes, 30)
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
        if Post.objects.get(id=id).likepost_set.filter(user=request.user):
            Post.objects.get(id=id).likepost_set.filter(user=request.user).delete()
            Activity.objects.filter(type = "like", from_user = request.user, to_user = Post.objects.get(id=id).user, text = "нравится ваша публикация.", post = Post.objects.get(id=id)).delete()
            return Response({'count': Post.objects.get(id=id).likepost_set.count(), 'message': 'delete'})
        else:
            serializer = LikePostSerializer(data={
                'user': request.user.id,
                'post': Post.objects.get(id=id).id
            })
            if serializer.is_valid():
                serializer.save()

                Activity.objects.create(
                    type = "like",
                    from_user = request.user,
                    to_user = Post.objects.get(id=id).user,
                    text = "нравится ваша публикация.",
                    post = Post.objects.get(id=id)
                )

                return Response({'count': Post.objects.get(id=id).likepost_set.count(), 'message': 'add'})

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'POST'])
@authentication_classes([JWTAuthentication])
def posts_comments(request, id):
    if request.method == 'GET':
        # Allow any user to access this view
        permission_classes([AllowAny])

        data = []
        nextPage = 1
        previousPage = 1
        comments = Comment.objects.filter(post=Post.objects.get(id=id)).order_by('-id')
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
            'nextlink': '/api/posts/'+ str(id) +'/comments?page=' + str(nextPage),
            'prevlink': '/api/posts/'+ str(id) +'/comments?page=' + str(previousPage)
        })

    elif request.method == 'POST':

        # Allow any user to access this view
        permission_classes([IsAuthenticated])

        post = Post.objects.get(id=id)

        new_comment = Comment.objects.create(
            post = post,
            user = request.user,
            text = request.data['text']
        )

        serializer = CommentSerializer(new_comment, context={'request': request})

        Activity.objects.create(
            type = "comment",
            from_user = request.user,
            to_user = Post.objects.get(id=id).user,
            text = "прокомментировал(-а): {}".format(request.data['text']),
            post = Post.objects.get(id=id)
        )

        return Response({'result': serializer.data}, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@authentication_classes([JWTAuthentication])
def search_posts(request):
    if request.method == 'GET':

        permission_classes([AllowAny])
        
        search = request.GET.get('search', '')

        data = []
        nextPage = 1
        previousPage = 1
        posts = Post.objects.filter(Q(description__icontains=search)).order_by('-id')
        page = request.GET.get('page', 1)
        paginator = Paginator(posts, 30)

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
            'nextlink': '/api/posts/search?search='+ str(search) +'&page=' + str(nextPage),
            'prevlink': '/api/posts/search?search='+ str(search) +'&page=' + str(previousPage),
        })
