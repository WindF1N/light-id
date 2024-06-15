from django.contrib import admin
from django.urls import path
from api.profiles.views import profiles_list, profiles_detail, profiles_subscribes, profiles_subscribers
from api.posts.views import posts_list, posts_detail, posts_likes, posts_comments

urlpatterns = [
    path('admin/', admin.site.urls),

    # profiles
    path('api/profiles/', profiles_list),
	path('api/profiles/<username>', profiles_detail),
    path('api/profiles/<username>/subscribes', profiles_subscribes),
    path('api/profiles/<username>/subscribers', profiles_subscribers),

    # posts
    path('api/posts/', posts_list),
    path('api/posts/<id>', posts_detail),
    path('api/posts/<id>/likes', posts_likes),
    path('api/posts/<id>/comments', posts_comments),
]
