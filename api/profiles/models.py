from django.db import models
from django.contrib.auth.models import User
from api.posts.models import Post
from django.db.models.signals import post_save
from PIL import Image, ImageOps
import uuid

# Функция для обработки фото профиля
def file_folder_uuid4_avatar(instance, filename):
    title = str(uuid.uuid4())
    filename = title + '.' + 'jpg'
    return '{0}/{1}/{2}'.format('avatars', title, filename)


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, verbose_name='Пользователь', related_name='userprofile')
    avatar = models.ImageField(upload_to=file_folder_uuid4_avatar, verbose_name='Фото профиля', blank=True)
    bio = models.TextField(verbose_name='Био', blank=True)
    phone = models.CharField(max_length=30, verbose_name='Телефон', blank=True)
    subscribes = models.ManyToManyField(User, verbose_name='Подписки', related_name='subscribers', blank=True)
    savedposts = models.ManyToManyField(Post, verbose_name='Сохранённое', blank=True)

    class Meta:
        verbose_name = 'Профиль'
        verbose_name_plural = 'Профили'

    def __str__(self):
        return self.user.username

    def get_absolute_url(self):
        return reverse('profile', kwargs={'username': self.user.username})


def post_save_userprofile(sender, instance, *args, **kwargs):
    if instance.avatar:
        image = Image.open(instance.avatar.path).convert('RGB')
        ImageOps.exif_transpose(image).save(instance.avatar.path, "JPEG", quality=90, optimize=True)
        image.close()

        image = Image.open(instance.avatar.path)
        h, w = ImageOps.exif_transpose(image).height, ImageOps.exif_transpose(image).width
        reversing = True

        if h > w:
            print(h, w)
            i = w / 3
            top, bottom = (h - (i * 4)) / 2, h - ((h - (i * 4)) / 2)
            if bottom != h:
                image = image.crop((0, int(top), w, int(bottom)))
                print(top, bottom, image.size)
            w = 150
            h = 4 * w / 3
            print('1', h, w, image.format)

        elif h < w:
            print(h, w)
            x = w / h
            w = x * 150
            h = 150
            reversing = True
            print('2', h, w, image.format)

        elif h == w:
            w = 150
            h = 150
            print('3', h, w, image.format)

        if reversing == True:
            image = image.resize((int(w), int(h)))
        else:
            image = image.resize((int(h), int(w)))
        ImageOps.exif_transpose(image).save(instance.avatar.path, "JPEG")
        image.close()

post_save.connect(post_save_userprofile, sender=UserProfile)
