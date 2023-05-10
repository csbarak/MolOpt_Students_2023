from django.db import models
# from djongo import models as djmodels
from django.contrib.auth.models import AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin
from django.contrib.auth.models import BaseUserManager
from django.conf import settings


class UserProfileManager(BaseUserManager):
    """Manager for user profiles"""

    def create_user(self, email, first_name, last_name, affiliation, position, password=None):
        """Create a new user"""
        print(email)
        if not email:
            raise ValueError('User must have an email address')

        if not password:
            raise ValueError('User must have a password')

        email = self.normalize_email(email)
        user = self.model(email=email, first_name=first_name, last_name=last_name,
                          affiliation=affiliation, position=position)  # create new model object for user

        # encrypt the password ( using the encryption in abstractBaseUser )
        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, email, first_name, last_name, affiliation, position, password):
        """Create and save a new superuser with given details"""
        user = self.create_user(
            email, first_name, last_name, affiliation, position, password)

        user.is_superuser = True
        user.is_staff = True
        user.save(using=self._db)

        return user


class UserProfile(AbstractBaseUser, PermissionsMixin):
    """"Database model for users in the system"""
    email = models.EmailField(max_length=255, unique=True)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    affiliation = models.CharField(max_length=255)
    position = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserProfileManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name', 'affiliation', 'position']

    def get_full_name(self):
        """Retrieve the full name of the user"""
        return self.first_name + ' ' + self.last_name

    def get_short_name(self):
        """Retrieve the full name of the user"""
        return self.first_name

    def __str__(self):
        """Return string representation of our user"""
        return self.email


class UserAlgoritmRun(models.Model):
    """User algoritm run document - allowed insure to not create feed to user that not exists"""
    # --> on_delete: if we want that runs history wii not be deleted when deleting user - DO_NOTHING | SET_NULL | PROTECT
    id = models.AutoField(primary_key=True)
    # user_email = models.ForeignKey(
    #     settings.AUTH_USER_MODEL,
    #     on_delete=models.CASCADE
    # )
    user_email = models.EmailField(max_length=255)
    algorithm_name = models.CharField(max_length=255)
    status = models.CharField(max_length=255)
    time = models.DateTimeField(auto_now_add=True)
    result = models.CharField(max_length=255)

    def __str__(self):
        """Return the model as a string"""
        return 'Algorithm ' + self.algorithm_id + ' created on ' + self.created_on
