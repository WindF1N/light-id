from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.contrib.auth.models import User
from .serializers import *
from .models import Activity


@api_view(['GET'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def activity_list(request):
    if request.method == 'GET':
        data = []
        nextPage = 1
        previousPage = 1
        activity = Activity.objects.filter(to_user=request.user).exclude(from_user=request.user).order_by('-date')
        page = request.GET.get('page', 1)
        paginator = Paginator(activity, 60)
        try:
            data = paginator.page(page)
        except PageNotAnInteger:
            data = paginator.page(1)
        except EmptyPage:
            data = paginator.page(paginator.num_pages)

        serializer = ActivitySerializer(data, context={'request': request}, many=True)

        if data.has_next():
            nextPage = data.next_page_number()
        if data.has_previous():
            previousPage = data.previous_page_number()

        return Response({
            'result': serializer.data,
            'count': paginator.count,
            'numpages' : paginator.num_pages,
            'nextlink': '/api/activity/?page=' + str(nextPage),
            'prevlink': '/api/activity/?page=' + str(previousPage)
        })
