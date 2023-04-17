from rest_framework import serializers

from api import models


class UserProfileSerializer(serializers.ModelSerializer):
    """Serialize a user profile object"""

    class Meta:
        model = models.UserProfile
        fields = ('id', 'email', 'first_name',
                  'last_name', 'affiliation', 'position', 'password')
        extra_kwargs = {
            'password': {
                'write_only': True,
                'style': {'input_type': 'password'}
            },
        }

    def create(self, validated_data):
        """Create and return a new user"""
        user = models.UserProfile.objects.create_user(
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            affiliation=validated_data['affiliation'],
            position=validated_data['position'],
            password=validated_data['password']
        )
        return user

    def update(self, instance, validate_data):
        """Handle updating user account"""
        if 'password' in validate_data:
            password = validate_data.pop('password')
            instance.set_password(password)
        if 'email' in validate_data:
            validate_data.pop('email')

        return super().update(instance, validate_data)


class UserAlgoritmRunSerializer(serializers.ModelSerializer):
    """Serializer profile feed item"""
    class Meta:
        model = models.UserAlgoritmRun
        fields = ('id', 'user_email',
                  'algorithm_name', 'status', 'time')
        extra_kwargs = {
            'user_email': {'read_only': True},
            'algorithm_name': {'read_only': True},
            'time': {'read_only': True},
        }

    def update(self, instance, validate_data):
        """Handle updating user runs - we can only update status field"""
        if 'status' in validate_data:
            return super().update(instance, validate_data['status'])

        else:
            return False