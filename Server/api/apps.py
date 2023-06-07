from django.apps import AppConfig
from django.db.backends.signals import connection_created
from django.dispatch import receiver

@receiver(connection_created)
def fix_runs(sender, **kwargs):
    from .models import UserAlgoritmRun
    runs = UserAlgoritmRun.objects.filter(status='running')
    runs.update(status='failed')

class ApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'
    def ready(self):
        connection_created.connect(fix_runs, sender=self)
