from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from likes.models import LikeComment
from .models import Comment
from django.contrib.auth.models import User
from .serializers import *
from likes.serializers import *


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def comments_likes(request, id):
    if request.method == 'GET':
        data = []
        nextPage = 1
        previousPage = 1
        likes = LikeComment.objects.filter(comment=Comment.objects.get(id=id)).order_by('-id')
        page = request.GET.get('page', 1)
        paginator = Paginator(likes, 15)
        try:
            data = paginator.page(page)
        except PageNotAnInteger:
            data = paginator.page(1)
        except EmptyPage:
            data = paginator.page(paginator.num_pages)

        serializer = LikeCommentSerializer(data, context={'request': request}, many=True)
        if data.has_next():
            nextPage = data.next_page_number()
        if data.has_previous():
            previousPage = data.previous_page_number()

        if Comment.objects.get(id=id).likecomment_set.filter(user=request.user):
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
        if Comment.objects.get(id=id).likecomment_set.filter(user=request.user):
            Comment.objects.get(id=id).likecomment_set.filter(user=request.user).delete()
            return Response({'message': 'OK'}, status=status.HTTP_201_CREATED)
        else:
            serializer = LikeCommentSerializer(data={
                'user': request.user.id,
                'comment': Comment.objects.get(id=id).id
            })
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
