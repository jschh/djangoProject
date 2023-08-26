from django.contrib import admin
from .models import Witz

@admin.register(Witz)
class WitzAdmin(admin.ModelAdmin):
    list_display = ['text']
