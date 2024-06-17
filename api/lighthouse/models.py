from django.db import models
from django.urls import reverse
from django.contrib.auth.models import User
from profiles.models import UserProfile
from PIL import Image
from django.db.models.signals import post_save
import uuid

APARTMENT_STATUS = (
    ('Свободна', 'Свободна'),
    ('Занята', 'Занята'),
    ('Бронь', 'Бронь')
)

APARTMENT_RENTAL = (
    ('На длительный срок', 'На длительный срок'),
    ('Посуточно', 'Посуточно')
)

# Функция для договора
def file_folder_uuid4_document(instance, filename):
    title = str(uuid.uuid4())
    format = filename.split('.')[-1]
    filename = title + '.' + format
    return '{0}/{1}/{2}'.format('documents', title, filename)

# Адрес
class Address(models.Model):

    user = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True, verbose_name='Пользователь')
    address = models.CharField(max_length=250, verbose_name='Адрес дома')

    class Meta:
        verbose_name = 'Адрес'
        verbose_name_plural = 'Адреса'

    def __str__(self):
        return str(self.address)

# Этажи
class Floor(models.Model):

    user = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True, verbose_name='Пользователь')
    number = models.DecimalField(max_digits=9, decimal_places=0, verbose_name='Этаж')
    address = models.ForeignKey(Address, on_delete=models.CASCADE, related_name='floor', verbose_name='Адрес дома')

    class Meta:
        verbose_name = 'Этаж'
        verbose_name_plural = 'Этажи'

    def __str__(self):
        return 'Этаж {}'.format(str(self.number))

# Апартаменты
class Apartment(models.Model):

    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='Хозяин')
    address = models.ForeignKey(Address, on_delete=models.CASCADE, related_name='apartment', verbose_name='Адрес дома')
    number = models.DecimalField(max_digits=9, decimal_places=0, verbose_name='Номер квартиры')
    active = models.BooleanField(verbose_name='Активная', default=True)
    status = models.CharField(max_length=100, choices=APARTMENT_STATUS, default='Свободна', verbose_name='Статус')
    floor = models.ForeignKey(Floor, on_delete=models.CASCADE, verbose_name='Этаж')

    class Meta:
        verbose_name = 'Квартира'
        verbose_name_plural = 'Квартиры'

    def __str__(self):
        return 'Квартира №{}'.format(str(self.number))


# История квартиры
class ApartmentHistory(models.Model):

    apartment = models.ForeignKey(Apartment, on_delete=models.CASCADE, verbose_name='Апартаменты', blank=True, related_name='apartment_history')
    userprofile = models.OneToOneField(UserProfile, on_delete=models.CASCADE, blank=True, null=True, verbose_name='Пользователь', related_name='apartment_history_userprofile')
    rental_period = models.CharField(max_length=100, choices=APARTMENT_RENTAL, blank=True, verbose_name='Срок аренды')
    rent = models.DecimalField(max_digits=9, decimal_places=0, blank=True, null=True, verbose_name='Арендная плата')
    deposit = models.DecimalField(max_digits=9, decimal_places=0, blank=True, null=True, verbose_name='Залог')
    booking_start = models.DateField(blank=True, null=True, verbose_name='Бронь от')
    booking_end = models.DateField(blank=True, null=True, verbose_name='Бронь до')
    date_start = models.DateTimeField(blank=True, null=True, verbose_name='Дата заезда')
    date_end = models.DateTimeField(blank=True, null=True, verbose_name='Дата выезда')
    people_count = models.DecimalField(max_digits=9, decimal_places=0, blank=True, null=True, verbose_name='Кол-во человек')
    adults = models.DecimalField(max_digits=9, decimal_places=0, blank=True, null=True, verbose_name='Взрослые')
    babies = models.DecimalField(max_digits=9, decimal_places=0, blank=True, null=True, verbose_name='Дети')
    animals = models.CharField(max_length=100, blank=True, verbose_name='Животные')
    cleaning = models.DecimalField(max_digits=9, decimal_places=0, blank=True, null=True, verbose_name='Клининг')
    transfer = models.DecimalField(max_digits=9, decimal_places=0, blank=True, null=True, verbose_name='Трансфер')

    class Meta:
        verbose_name = 'История квартиры'
        verbose_name_plural = 'История квартиры'

    def __str__(self):
        return 'История квартиры №{}'.format(str(self.apartment.number))

# Коммунальные платежи
class Communal(models.Model):

    apartment = models.ForeignKey(Apartment, on_delete=models.CASCADE, verbose_name='Апартаменты', blank=True, related_name='communal')
    coldwater = models.DecimalField(max_digits=9, decimal_places=2, blank=True, null=True, verbose_name='Холодная вода')
    hotwater = models.DecimalField(max_digits=9, decimal_places=2, blank=True, null=True, verbose_name='Горячая вода')
    electricity = models.DecimalField(max_digits=9, decimal_places=2, blank=True, null=True, verbose_name='Электроэнергия')
    gas = models.DecimalField(max_digits=9, decimal_places=2, blank=True, null=True, verbose_name='Газоснабжение')
    sum = models.DecimalField(max_digits=9, decimal_places=2, blank=True, null=True, verbose_name='Сумма к оплате')
    date = models.DateField(blank=True, null=True, verbose_name='Дата')

    class Meta:
        verbose_name = 'Комм. платёж'
        verbose_name_plural = 'Комм. платежи'

    def __str__(self):
        return 'Комм. платёж №{}'.format(str(self.id))

# Платежи
class Payment(models.Model):

    apartment = models.ForeignKey(Apartment, on_delete=models.CASCADE, verbose_name='Апартаменты', blank=True, related_name='payment')
    sum = models.DecimalField(max_digits=9, decimal_places=2, blank=True, null=True, verbose_name='Сумма к оплате')
    rent = models.DecimalField(max_digits=9, decimal_places=0, blank=True, null=True, verbose_name='Арендная плата')
    duty = models.DecimalField(max_digits=9, decimal_places=0, blank=True, null=True, verbose_name='Долг')
    date = models.DateField(blank=True, null=True, verbose_name='Дата')

    status = models.BooleanField(verbose_name='Оплачено', default=False)
    communal = models.OneToOneField(Communal, on_delete=models.CASCADE, blank=True, null=True, verbose_name='Комм. услуги', related_name='payment_comm')

    class Meta:
        verbose_name = 'Платёж'
        verbose_name_plural = 'Платежи'

    def __str__(self):
        return 'Платёж №{}'.format(str(self.id))
