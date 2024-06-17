from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import pre_save


class Lobby(models.Model):

    memberone = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="Участник 1", related_name="memberone")
    membertwo = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="Участник 2", related_name="membertwo")

    class Meta:
        verbose_name = 'Чат'
        verbose_name_plural = 'Чаты'

    def __str__(self):
        return "Чат #{}".format(str(self.id))


class Message(models.Model):

    lobby = models.ForeignKey(Lobby, on_delete=models.CASCADE, verbose_name="Чат", related_name="messages")

    text = models.CharField(max_length=255, verbose_name="Текст")
    sender = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="Отправитель", related_name="sender")
    date = models.DateTimeField(auto_now_add=True)

    start = models.BooleanField(default=False, verbose_name='Стартовое сообщение')
    read = models.BooleanField(default=False, verbose_name="Прочитано")

    class Meta:
        verbose_name = 'Сообщение'
        verbose_name_plural = 'Сообщения'

    def __str__(self):
        return str(self.date)


def pre_save_message(sender, instance, *args, **kwargs):

    if instance.start == True:
        instance.read = True

pre_save.connect(pre_save_message, sender=Message)
