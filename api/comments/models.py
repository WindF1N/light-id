from django.db import models
from django.contrib.auth.models import User
from api.posts.models import Post

class Comment(models.Model):

    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='Пользователь')
    post = models.ForeignKey(Post, on_delete=models.CASCADE, verbose_name='Публикация')
    text = models.TextField(verbose_name='Текст')

    date = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Комментарий'
        verbose_name_plural = 'Комментарии'

    def __str__(self):
        return str(self.id)
