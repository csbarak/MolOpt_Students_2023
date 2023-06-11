from django.apps import AppConfig

class ApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'
    def ready(self):
        from .models import UserAlgoritmRun
        runs = UserAlgoritmRun.objects.filter(status='running')
        runs.update(status='failed')
