from django.contrib import admin
from api import models

admin.site.register(models.UserProfile)
admin.site.register(models.UserAlgoritmRun)