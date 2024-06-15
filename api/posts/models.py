from django.db import models
from PIL import Image, ImageOps
from django.db.models.signals import post_save
from django.contrib.auth.models import User
import uuid

# Функция для обработки файлов постов
def file_folder_uuid4(instance, filename):
    title = str(uuid.uuid4())
    format = filename.split('.')[-1]
    filename = title + '.' + format
    return '{0}/{1}/{2}'.format('posts', title, filename)


class PostItem(models.Model):
    file = models.FileField(upload_to=file_folder_uuid4, verbose_name='Файл')

    class Meta:
        verbose_name = 'Файлы публикаций'
        verbose_name_plural = 'Файл публикации'

    def __str__(self):
        return str(self.id)


class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='Пользователь')
    items = models.ManyToManyField(PostItem, verbose_name='Файлы', null=True)
    description = models.TextField(verbose_name='Описание', blank=True)

    date = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Публикация'
        verbose_name_plural = 'Публикации'

    def __str__(self):
        return str(self.date)


def post_save_postitem(sender, instance, *args, **kwargs):
    image = Image.open(instance.file.path).convert('RGB')
    ImageOps.exif_transpose(image).save(instance.file.path, "JPEG", quality=90, optimize=True)
    image.close()

    image = Image.open(instance.file.path)
    h, w = ImageOps.exif_transpose(image).height, ImageOps.exif_transpose(image).width
    reversing = True

    if h > w:
        print(h, w)
        i = w / 3
        top, bottom = (h - (i * 4)) / 2, h - ((h - (i * 4)) / 2)
        if bottom != h:
            image = image.crop((0, int(top), w, int(bottom)))
            print(top, bottom, image.size)
        w = 1080
        h = 4 * w / 3
        print('1', h, w, image.format)

    elif h < w:
        print(h, w)
        x = w / h
        w = x * 1080
        h = 1080
        reversing = True
        print('2', h, w, image.format)

    elif h == w:
        w = 1080
        h = 1080
        print('3', h, w, image.format)

    if reversing == True:
        image = image.resize((int(w), int(h)))
    else:
        image = image.resize((int(h), int(w)))
    ImageOps.exif_transpose(image).save(instance.file.path, "JPEG")
    image.close()

post_save.connect(post_save_postitem, sender=PostItem)
