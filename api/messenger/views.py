from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from .models import Lobby, Message
from django.contrib.auth.models import User
from .serializers import *
from profiles.serializers import UserSerializer
from django.db.models import Q, Max


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def lobby_list(request):
    if request.method == 'GET':
        data = []
        nextPage = 1
        previousPage = 1
        lobbies = Lobby.objects.filter(Q(memberone=request.user) | Q(membertwo=request.user)).annotate(last_message=Max('messages__date')).order_by('-last_message')
        page = request.GET.get('page', 1)
        paginator = Paginator(lobbies, 50)
        try:
            data = paginator.page(page)
        except PageNotAnInteger:
            data = paginator.page(1)
        except EmptyPage:
            data = paginator.page(paginator.num_pages)

        serializer = LobbySerializer(data, context={'request': request}, many=True)
        if data.has_next():
            nextPage = data.next_page_number()
        if data.has_previous():
            previousPage = data.previous_page_number()

        return Response({
            'result': serializer.data,
            'count': paginator.count,
            'numpages' : paginator.num_pages,
            'nextlink': '/api/lobbies/?page=' + str(nextPage),
            'prevlink': '/api/lobbies/?page=' + str(previousPage),
        })

    elif request.method == 'POST':

        if 'username' in request.data:
            if type(request.data['username']) is str:
                if len(request.data['username']) > 0:

                    try:
                        user = User.objects.get(username=request.data['username'])
                    except User.DoesNotExist:
                        return Response(status=status.HTTP_404_NOT_FOUND)

                    if not Lobby.objects.filter(Q(memberone=request.user, membertwo=user) |
                                                Q(memberone=user, membertwo=request.user)):
                        new_lobby = Lobby.objects.create(memberone=request.user, membertwo=user)
                        new_message = Message.objects.create(
                            lobby = new_lobby,
                            text = "Чат создан",
                            sender = request.user,
                            start = True
                        )
                        serializer = LobbySerializer(new_lobby, context={'request': request})

                    else:
                        lobby = Lobby.objects.get(Q(memberone=request.user, membertwo=user) |
                                                  Q(memberone=user, membertwo=request.user))
                        serializer = LobbySerializer(lobby, context={'request': request})

                    return Response({
                        'result': serializer.data
                    })

                else:
                    return Response(status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response(status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.data)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def messages_list(request, id):
    if request.method == 'GET':
        try:
            Lobby.objects.get(id=id)
        except Lobby.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        data = []
        nextPage = 1
        previousPage = 1
        messages = Lobby.objects.get(id=id).messages.all().order_by('-id')
        page = request.GET.get('page', 1)
        paginator = Paginator(messages, 30)
        try:
            data = paginator.page(page)
        except PageNotAnInteger:
            data = paginator.page(1)
        except EmptyPage:
            data = paginator.page(paginator.num_pages)

        serializer = MessageSerializer(data, context={'request': request}, many=True)
        if data.has_next():
            nextPage = data.next_page_number()
        if data.has_previous():
            previousPage = data.previous_page_number()

        if Lobby.objects.get(id=id).memberone == request.user:
            user = Lobby.objects.get(id=id).membertwo
        elif Lobby.objects.get(id=id).membertwo == request.user:
            user = Lobby.objects.get(id=id).memberone

        user = UserSerializer(user, context={'request':request})

        return Response({
            'result': serializer.data,
            'user': user.data,
            'count': paginator.count,
            'numpages' : paginator.num_pages,
            'nextlink': '/api/lobbies/'+ str(id) +'?page=' + str(nextPage),
            'prevlink': '/api/lobbies/'+ str(id) +'?page=' + str(previousPage),
        })

    elif request.method == 'POST':

        try:
            Lobby.objects.get(id=id)
        except Lobby.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        if 'text' in request.data:
            if len(request.data['text']) > 0:
                new_message = Message.objects.create(
                    lobby = Lobby.objects.get(id=id),
                    text = request.data['text'],
                    sender = request.user
                )
                serializer = MessageSerializer(new_message, context={'request': request})
                return Response({
                    'result': serializer.data
                })

            else:
                return Response({
                    'error': '"text" is null'
                }, status=status.HTTP_400_BAD_REQUEST)

        else:
            return Response({
                'error': '"text" is null'
            }, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def read_message(request, id):
    if request.method == 'POST':
        try:
            message = Message.objects.get(id=id)
        except Message.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        message.read = True
        message.save()

        return Response({
            'read': True,
            'msg_id': message.id
        })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def unread_messages(request, id):
    if request.method == 'GET':
        try:
            Lobby.objects.get(id=id)
        except Lobby.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        messages = Lobby.objects.get(id=id).messages.filter(read=False).exclude(sender=request.user).order_by('-id')
        serializer = MessageSerializer(messages, context={'request': request}, many=True)

        return Response({
            'result': serializer.data
        })
