from django.db import models
from django.contrib.auth.models import User
from posts.models import Post
from transport.models import Transport
from django.db.models.signals import post_save, pre_save
from PIL import Image, ImageOps
import uuid
import os

# Функция для основного разворота паспорта
def file_folder_uuid4_passport_front(instance, filename):
    title = str(uuid.uuid4())
    format = filename.split('.')[-1]
    filename = title + '.' + format
    return '{0}/{1}/{2}'.format('passport-front', title, filename)

# Функция для второго разворота паспорта
def file_folder_uuid4_passport_back(instance, filename):
    title = str(uuid.uuid4())
    format = filename.split('.')[-1]
    filename = title + '.' + format
    return '{0}/{1}/{2}'.format('passport-back', title, filename)

# Функция для обработки фото профиля
def file_folder_uuid4_avatar(instance, filename):
    title = str(uuid.uuid4())
    filename = str(uuid.uuid4()) + '.' + 'jpg'
    return '{0}/{1}/{2}'.format('avatars', title, filename)


# Функция для обработки фото профиля 2
def file_folder_uuid4_avatar_resize(instance, filename):
    title = str(uuid.uuid4())
    title = title + "/resize"
    filename = str(uuid.uuid4()) + '.' + 'jpg'
    return '{0}/{1}/{2}'.format('avatars', title, filename)


# Функция для обработки фото профиля 3
def file_folder_uuid4_avatar_placeholder(instance, filename):
    title = str(uuid.uuid4())
    title = title + "/placeholder"
    filename = str(uuid.uuid4()) + '.' + 'jpg'
    return '{0}/{1}/{2}'.format('avatars', title, filename)


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, verbose_name='Пользователь', related_name='userprofile')
    avatar = models.ImageField(upload_to=file_folder_uuid4_avatar, verbose_name='Фото профиля', blank=True)
    avatar_resize = models.ImageField(upload_to=file_folder_uuid4_avatar_resize, verbose_name='Фото профиля 16 на 9', blank=True)
    avatar_placeholder = models.ImageField(upload_to=file_folder_uuid4_avatar_placeholder, verbose_name='Фото профиля заставка', blank=True)
    middle_name = models.CharField(max_length=30, verbose_name='Отчество', blank=True)

    bio = models.TextField(verbose_name='Био', blank=True)
    phone = models.CharField(max_length=30, verbose_name='Телефон', blank=True)
    site = models.URLField(max_length=250, verbose_name='Сайт', blank=True, null=True)
    city = models.CharField(max_length=200, verbose_name='Город', blank=True)
    street = models.CharField(max_length=200, verbose_name='Улица', blank=True)
    apartmentnumber = models.CharField(max_length=200, verbose_name='Квартира', blank=True)
    sex = models.CharField(max_length=50, verbose_name="Пол", blank=True)
    birth_date = models.DateField(blank=True, null=True, verbose_name="Дата рождения")
    birth_place = models.CharField(max_length=250, blank=True, verbose_name='Место рождения')
    number = models.CharField(max_length=250, blank=True, verbose_name='Серия и номер')
    subdivision = models.CharField(max_length=250, blank=True, verbose_name='Код подразделения')
    issue_date = models.DateField(blank=True, null=True, verbose_name='Дата выдачи')
    issued_by = models.CharField(max_length=500, blank=True, verbose_name='Кем выдан')
    registration_address = models.CharField(max_length=500, blank=True, verbose_name='Адрес регистрации')
    category = models.CharField(max_length=120, verbose_name="Категория", blank=True, null=True)
    position = models.CharField(max_length=120, verbose_name="Должность", blank=True, null=True)
    company = models.CharField(max_length=120, verbose_name="Компания", blank=True, null=True)
    sitecompany = models.CharField(max_length=120, verbose_name="Сайт компании", blank=True, null=True)
    telegram = models.CharField(max_length=120, verbose_name="Telegram", blank=True, null=True)

    subscribes = models.ManyToManyField(User, verbose_name='Подписки', related_name='subscribers', blank=True)
    savedposts = models.ManyToManyField(Post, verbose_name='Сохранённое', blank=True)
    savedtransports = models.ManyToManyField(Transport, verbose_name='Сохранённые авто', blank=True)

    active = models.BooleanField(default=False, verbose_name='Заполненный')

    class Meta:
        verbose_name = 'Профиль'
        verbose_name_plural = 'Профили'

    def __str__(self):
        return self.user.username

    def get_absolute_url(self):
        return reverse('profile', kwargs={'username': self.user.username})


# Паспорт
class Passport(models.Model):

    userprofile = models.ForeignKey(UserProfile, on_delete=models.CASCADE, blank=True, null=True, verbose_name='Пользователь', related_name='passport')
    passport_front = models.FileField(upload_to=file_folder_uuid4_passport_front, blank=True, verbose_name='Основной разворот паспорта')
    passport_back = models.FileField(upload_to=file_folder_uuid4_passport_back, blank=True, verbose_name='Второй разворот паспорта')

    class Meta:
        verbose_name = 'Паспорт'
        verbose_name_plural = 'Паспорта'

    def __str__(self):
        return 'Паспорт №{}'.format(str(self.id))


# Оптимизация изображений
def post_save_passport(sender, instance, *args, **kwargs):

    image = Image.open(instance.passport_front.path).convert('RGB')
    image.save(instance.passport_front.path,"JPEG",quality=80,optimize=True)

post_save.connect(post_save_passport, sender=Passport)


def post_save_user(sender, instance, *args, **kwargs):
    if instance.user.username == 'id' + str(instance.user.id):
        instance.active = False
    else:
        instance.active = True

    if instance.avatar:
        if instance.avatar_resize.name != instance.avatar.name:
            size = (225, 400)
            image = Image.open(instance.avatar.path).convert('RGB')
            image.thumbnail(size, Image.LANCZOS)

            # Создаем путь для сохранения измененного изображения
            resize_path = os.path.join(os.path.dirname(instance.avatar.path), 'resize', os.path.basename(instance.avatar.path))
            resize_dir = os.path.dirname(resize_path)

            # Убеждаемся, что директория существует
            if not os.path.exists(resize_dir):
                os.makedirs(resize_dir)

            # Сохраняем измененное изображение
            image.save(resize_path, "JPEG", quality=100, optimize=True)
            instance.avatar_resize = '/'.join(resize_path.split('/')[-4:])

    # Отключаем сигнал, чтобы избежать рекурсии
    post_save.disconnect(post_save_user, sender=sender)
    instance.save()
    post_save.connect(post_save_user, sender=sender)

post_save.connect(post_save_user, sender=UserProfile)
