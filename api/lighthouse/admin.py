from django.contrib import admin
from .models import *

class ApartmentHistoryAdmin(admin.StackedInline):
    model = ApartmentHistory

    def has_add_permission(self, request, obj=None):
        return False
    def has_delete_permission(self, request, obj=None):
        return False

class ApartmentAdmin(admin.ModelAdmin):
    inlines = [ApartmentHistoryAdmin]

admin.site.register(Apartment, ApartmentAdmin)
admin.site.register(Address)
admin.site.register(Floor)
admin.site.register(Communal)
admin.site.register(Payment)
