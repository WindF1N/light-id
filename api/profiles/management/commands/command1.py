from django.core.management.base import BaseCommand
from profiles.models import *
from posts.models import *
from django.contrib.auth.models import User

class Command(BaseCommand):
    def handle(self, **options):
        # Пример 4-значного пароля
        new_password = '6219'

        # Имя пользователя, для которого нужно изменить пароль
        username = 'Mr.Romadanov'

        # Находим пользователя по имени пользователя
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            self.stdout.write(self.style.ERROR(f'Пользователь с именем {username} не найден'))
            return

        # Устанавливаем новый пароль
        user.set_password(new_password)
        user.save()

        self.stdout.write(self.style.SUCCESS(f'Пароль для пользователя {username} изменен на {new_password}'))