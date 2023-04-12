from rest_framework import serializers
from .models import Run

class RunSerializer(serializers.ModelSerializer):


# defines the metadata information that our model has (database) and that must be converted to the User class.
    class Meta: 
        model = Run 
        fields = ('ip', 'email', 'algorithm', 'status', 'time')