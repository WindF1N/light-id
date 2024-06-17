from django.contrib import admin
from django.urls import path
from profiles.views import profiles_list, profiles_detail, profiles_subscribes, profiles_subscribers, user, check_user, user_by_usernmae, savedposts_list, search_users
from posts.views import posts_list, posts_detail, posts_likes, posts_comments, posts_list_user, search_posts
from comments.views import comments_likes
from transport.views import transports_list, transports_list_user, savedtransports_list, transports_comments, transports_comment_add
from messenger.views import lobby_list, messages_list, read_message, unread_messages
from activity.views import activity_list
from lighthouse.views import apartments_list, apartment, addresses_list, floors_list, add_guest, remove_guest
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/user', user, name='user'),
    path('api/check_user/<phone>', check_user, name='check_user'),
    path('api/user/<username>', user_by_usernmae, name='user_by_usernmae'),
    path('api/token/obtain', TokenObtainPairView.as_view(), name='token_obtain'),
    path('api/token/refresh', TokenRefreshView.as_view(), name='token_refresh'),

    # profiles
    path('api/profiles/', profiles_list),
    path('api/profiles/search', search_users),
	path('api/profiles/<username>', profiles_detail),
    path('api/profiles/<username>/subscribes', profiles_subscribes),
    path('api/profiles/<username>/subscribers', profiles_subscribers),

    # posts
    path('api/posts/', posts_list),
    path('api/posts/search', search_posts),
    path('api/posts/<id>', posts_detail),
    path('api/posts/<id>/likes', posts_likes),
    path('api/posts/<id>/comments', posts_comments),
    path('api/posts/user/<username>', posts_list_user),
    path('api/savedposts', savedposts_list),

    # messenger
    path('api/lobbies/', lobby_list),
    path('api/lobbies/<id>', messages_list),
    path('api/lobbies/<id>/unread', unread_messages),
    path('api/lobbies/msg/<id>/read', read_message),

    # comments
    path('api/comments/<id>/likes', comments_likes),

    # activity
    path('api/activity/', activity_list),

    # LIGHThouse
    path('api/lighthouse/apartments', apartments_list),
    path('api/lighthouse/apartments/<id>', apartment),
    path('api/lighthouse/apartments/<id>/add/guest', add_guest),
    path('api/lighthouse/apartments/<id>/remove/guest', remove_guest),
    path('api/lighthouse/addresses', addresses_list),
    path('api/lighthouse/floors', floors_list),

    # AutoLIGHT
    path('api/transports/', transports_list),
    path('api/transports/user/<username>', transports_list_user),
    path('api/savedtransports', savedtransports_list),
    path('api/transports/<id>/comments', transports_comments),
    path('api/transports/<id>/comments/add', transports_comment_add),
]
