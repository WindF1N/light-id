from django.db import models
from PIL import Image, ImageOps
from django.db.models.signals import post_save
from django.contrib.auth.models import User
import uuid
import os

# Функция для обработки файлов постов
def file_folder_uuid4(instance, filename):
    title = str(uuid.uuid4())
    format = filename.split('.')[-1]
    filename = title + '.' + format
    return '{0}/{1}/{2}'.format('posts', title, filename)

POSTITEM_TYPES = (
    ('image', 'image'),
    ('video', 'video')
)

class PostItem(models.Model):
    type = models.CharField(max_length=50, choices=POSTITEM_TYPES, default='image', verbose_name='Тип')
    file = models.FileField(upload_to=file_folder_uuid4, verbose_name='Файл')
    file_resize = models.FileField(upload_to=file_folder_uuid4, verbose_name='Файл resize', blank=True)
    aspect = models.CharField(max_length=50, verbose_name='Пропорции', blank=True)
    placeholder = models.FileField(upload_to=file_folder_uuid4, verbose_name='Сжатый файл', null=True, blank=True)

    class Meta:
        verbose_name = 'Файлы публикаций'
        verbose_name_plural = 'Файл публикации'

    def __str__(self):
        return str(self.id)


class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='Пользователь')
    items = models.ManyToManyField(PostItem, verbose_name='Файлы', null=True)
    title = models.CharField(max_length=50, verbose_name='Описание', blank=True)
    description = models.TextField(verbose_name='Описание', blank=True)

    date = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Публикация'
        verbose_name_plural = 'Публикации'

    def __str__(self):
        return str(self.date)


def post_save_postitem(sender, instance, *args, **kwargs):
    if not instance.placeholder:
        image = Image.open(instance.file.path).convert('RGB')
        image = ImageOps.exif_transpose(image)
        h, w = image.height, image.width

        resized_image = image.resize((int(w*0.05), int(h*0.05)), Image.LANCZOS)

        placeholder = 'placeholder/' + str(uuid.uuid4()) + '.jpeg'

        resized_image.save(os.path.join(os.path.dirname(instance.file.path), placeholder), "JPEG")
        image.close()

        instance.placeholder = placeholder

        post_save.disconnect(post_save_postitem, sender=sender)
        instance.save()
        post_save.connect(post_save_postitem, sender=sender)

    if not instance.aspect:
        image = Image.open(instance.file.path).convert('RGB')
        image = ImageOps.exif_transpose(image)
        h, w = image.height, image.width
        size = 1080, int((1080 * h) / w)
        instance.aspect = "{0}/{1}".format(1080, int((1080 * h) / w))

        resized_image = image.copy()
        resized_image.thumbnail(size, Image.LANCZOS)

        path = instance.file.path.split('/')
        path.insert(9, 'resize')
        path = '/'.join(path)
        resized_path = os.path.join(os.path.dirname(instance.file.path), 'resize', os.path.basename(instance.file.path))
        resized_dir = os.path.dirname(resized_path)

        if not os.path.exists(resized_dir):
            os.makedirs(resized_dir)

        resized_image.save(resized_path, "JPEG", quality=100, optimize=True)
        instance.file_resize = '/'.join(resized_path.split('/')[-4:])

        post_save.disconnect(post_save_postitem, sender=sender)
        instance.save()
        post_save.connect(post_save_postitem, sender=sender)

post_save.connect(post_save_postitem, sender=PostItem)
