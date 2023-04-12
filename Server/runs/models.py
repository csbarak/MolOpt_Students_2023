from django.db import models

class Run(models.Model):
    email = models.EmailField()
    algorithm = models.CharField("Algorithm", max_length=15)
    status = models.CharField("status", max_length=15)
    time = models.DateField("Time", auto_now_add=True)