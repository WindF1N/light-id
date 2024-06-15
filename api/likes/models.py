from django.db import models
from django.contrib.auth.models import User
from api.posts.models import Post
from api.comments.models import Comment

class LikePost(models.Model):

    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='Пользователь')
    post = models.ForeignKey(Post, on_delete=models.CASCADE, verbose_name='Публикация')

    date = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Лайк на публикацию'
        verbose_name_plural = 'Лайки на публикации'

    def __str__(self):
        return str(self.id)


class LikeComment(models.Model):

    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='Пользователь')
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE, verbose_name='Комментарий')

    date = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Лайк на комментарий'
        verbose_name_plural = 'Лайки на комментарии'

    def __str__(self):
        return str(self.id)
