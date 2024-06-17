from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from PIL import Image, ImageOps
import uuid
import os


TRANSPORT_CATEGORIES = (
    ('Контакт-Центр', 'Контакт-Центр'),
    ('Автомобильный ряд', 'Автомобильный ряд'),
    ('Архив', 'Архив'),
    ('Новая база', 'Новая база')
)


# Функция для обработки фотографий транспорта
def file_folder_uuid4(instance, filename):
    title = str(uuid.uuid4())
    format = filename.split('.')[-1]
    filename = title + '.' + format
    return '{0}/{1}/{2}'.format('transport', title, filename)


# Функция для обработки файлов транспорта
def file_folder_uuid4_document(instance, filename):
    title = str(uuid.uuid4())
    format = filename.split('.')[-1]
    filename = title + '.' + format
    return '{0}/{1}/{2}'.format('documents', title, filename)


class DocumentTransport(models.Model):
    file = models.FileField(upload_to=file_folder_uuid4_document, verbose_name='Файл')

    class Meta:
        verbose_name = 'Документ транспорта'
        verbose_name_plural = 'Документ транспорта'

    def __str__(self):
        return str(self.id)


class ImageTransport(models.Model):
    file = models.FileField(upload_to=file_folder_uuid4, verbose_name='Файл')
    file_resize = models.FileField(upload_to=file_folder_uuid4, verbose_name='Файл resize', blank=True)
    aspect = models.CharField(max_length=50, verbose_name='Пропорции', blank=True)
    placeholder = models.FileField(upload_to=file_folder_uuid4, verbose_name='Сжатый файл', null=True, blank=True)

    class Meta:
        verbose_name = 'Фото транспорта'
        verbose_name_plural = 'Фото транспорта'

    def __str__(self):
        return str(self.id)


class Transport(models.Model):

    title = models.CharField(max_length=150, verbose_name='Название', default='Без названия')
    responsible = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='Ответственный', related_name='responsible_transport')
    category = models.CharField(max_length=150, verbose_name='Категория', choices=TRANSPORT_CATEGORIES)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='Собственник', related_name='owner_transport')

    modification = models.CharField(max_length=150, verbose_name="Модификация", blank=True)
    doors = models.CharField(max_length=10, verbose_name='Количество дверей', blank=True)
    age = models.CharField(max_length=150, verbose_name='Поколение', blank=True)
    condition = models.CharField(max_length=150, verbose_name='Состояние', blank=True)
    equipment = models.CharField(max_length=150, verbose_name='Комплектация', blank=True)
    region = models.CharField(max_length=150, verbose_name='Регион', blank=True)
    city = models.CharField(max_length=150, verbose_name='Город', blank=True)
    district = models.CharField(max_length=150, verbose_name='Район', blank=True)
    address = models.TextField(verbose_name='Адрес', blank=True)
    securenumber = models.CharField(max_length=50, verbose_name='Защищённый номер', blank=True)

    pubtype = models.CharField(max_length=150, verbose_name='Тип публикации', blank=True)
    dateinsepction = models.DateField(verbose_name='Дата осмотра', blank=True)
    termcontract = models.DateField(verbose_name='Срок действия договора', blank=True)
    sale = models.CharField(max_length=150, verbose_name='Продажа', blank=True)
    statenumber = models.CharField(max_length=100, verbose_name='Госномер', blank=True)
    vin = models.CharField(max_length=150, verbose_name='VIN или номер кузова', blank=True)
    brand = models.CharField(max_length=150, verbose_name='Марка')
    model = models.CharField(max_length=150, verbose_name='Модель')
    transporttype = models.CharField(max_length=150, verbose_name='Тип ТС', blank=True)
    transportcategory = models.CharField(max_length=150, verbose_name='Категория ТС', blank=True)
    issueyear = models.CharField(max_length=150, verbose_name='Год выпуска')
    enginenumber = models.CharField(max_length=150, verbose_name='Модель/Номер двигателя', blank=True)
    framenumber = models.CharField(max_length=150, verbose_name='Номер шасси/рамы', blank=True)
    bodynumber = models.CharField(max_length=150, verbose_name='Номер кузова', blank=True)
    color = models.CharField(max_length=150, verbose_name='Цвет', blank=True)
    power = models.CharField(max_length=150, verbose_name='Мощность', blank=True)
    enginecapacity = models.CharField(max_length=150, verbose_name='Объём двигателя', blank=True)
    enginetype = models.CharField(max_length=150, verbose_name='Тип двигателя', blank=True)
    transmission = models.CharField(max_length=150, verbose_name='Коробка передач', blank=True)
    driveunit = models.CharField(max_length=150, verbose_name='Привод', blank=True)
    steeringwheel = models.CharField(max_length=150, verbose_name='Руль', blank=True)
    mileage = models.CharField(max_length=150, verbose_name='Пробег', blank=True)
    bodytype = models.CharField(max_length=150, verbose_name='Тип кузова', blank=True)
    pts = models.CharField(max_length=150, verbose_name='ПТС', blank=True)
    ptsowners = models.CharField(max_length=150, verbose_name='Владельцев по ПТС', blank=True)
    registration = models.CharField(max_length=150, verbose_name='Учёт', blank=True)
    description = models.TextField(verbose_name='Описание', blank=True)
    exchange = models.CharField(max_length=150, verbose_name='Возможен обмен', blank=True)
    location = models.CharField(max_length=250, verbose_name='Место расположения', blank=True)
    price = models.CharField(max_length=150, verbose_name='Цена', blank=True)
    priceclassified = models.CharField(max_length=150, verbose_name='Цена на классифайдах', blank=True)
    pricesale = models.CharField(max_length=150, verbose_name='Цена продажи', blank=True)
    pricehands = models.CharField(max_length=150, verbose_name='Цена на руки', blank=True)
    uploadingclassifiers = models.CharField(max_length=150, verbose_name='Выгрузка на Классифайды', blank=True)
    images = models.ManyToManyField(ImageTransport, verbose_name='Фото', blank=True)

    ptsseries = models.CharField(max_length=150, verbose_name='ПТС Серия/Номер', blank=True)
    ptsissuedate = models.DateField(verbose_name='Дата выдачи ПТС', blank=True)
    ptswhoissued = models.TextField(verbose_name='Кем выдан ПТС', blank=True)
    stsseries = models.CharField(max_length=150, verbose_name='СТС Серия/Номер', blank=True)
    stsissuedate = models.DateField(verbose_name='Дата выдачи СТС', blank=True)
    stswhoissued = models.TextField(verbose_name='Кем выдан СТС', blank=True)

    documents = models.ManyToManyField(DocumentTransport, verbose_name='Документы')

    date = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Транспорт'
        verbose_name_plural = 'Транспорт'

    def __str__(self):
        return str(self.title)


def post_save_imagetransport(sender, instance, *args, **kwargs):
    if not instance.placeholder:
        image = Image.open(instance.file.path).convert('RGB')
        h, w = ImageOps.exif_transpose(image).height, ImageOps.exif_transpose(image).width

        image = image.resize((int(w*0.05), int(h*0.05)))

        placeholder = 'placeholder/' + str(uuid.uuid4()) + '.jpeg'

        ImageOps.exif_transpose(image).save(instance.file.path.split('posts/')[0] + placeholder, "JPEG")
        image.close()

        instance.placeholder = placeholder

        post_save.disconnect(post_save_imagetransport, sender=sender)
        instance.save()
        post_save.connect(post_save_imagetransport, sender=sender)

    if not instance.aspect:
        image = Image.open(instance.file.path).convert('RGB')
        h, w = ImageOps.exif_transpose(image).height, ImageOps.exif_transpose(image).width
        size = 1080, (1080 * h) / w
        instance.aspect = "{0}/{1}".format(1080, (1080 * h) / w)
        image = Image.open(instance.file.path).convert('RGB')
        image.thumbnail(size, Image.ANTIALIAS)
        path = instance.file.path.split('/')
        path.insert(9, 'resize')
        path = '/'.join(path)
        if not os.path.exists('/'.join(path.split('/')[:-1])):
            os.mkdir('/'.join(path.split('/')[:-1]))
        image.save(path, "JPEG", quality=100, optimize=True)
        instance.file_resize = '/'.join(path.split('/')[-4:])

        post_save.disconnect(post_save_imagetransport, sender=sender)
        instance.save()
        post_save.connect(post_save_imagetransport, sender=sender)

post_save.connect(post_save_imagetransport, sender=ImageTransport)
