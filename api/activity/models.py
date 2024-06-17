from django.db import models
from django.contrib.auth.models import User
from posts.models import Post

ACTIVITY_TYPE_CHOICES = (
    ('like', 'like'),
    ('sub', 'sub'),
    ('comment', 'comment')
)

class Activity(models.Model):

    type = models.CharField(max_length=50, choices=ACTIVITY_TYPE_CHOICES, verbose_name="Тип")

    from_user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="От пользователя", related_name="activity_from_user")
    to_user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="Пользователю", related_name="activity_to_user")

    text = models.CharField(max_length=500, verbose_name="Текст")
    post = models.ForeignKey(Post, on_delete=models.CASCADE, verbose_name="Публикация", blank=True, null=True)

    date = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Активность"
        verbose_name_plural = "Активность"
