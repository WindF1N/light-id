from django.contrib import admin
from .models import *

class MessageAdmin(admin.ModelAdmin):

    list_display=('id','lobby','text','sender','date','start','read',)

admin.site.register(Lobby)
admin.site.register(Message, MessageAdmin)
