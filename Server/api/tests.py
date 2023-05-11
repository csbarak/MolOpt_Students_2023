from django.test import TestCase, Client
from django.urls import reverse
from rest_framework import status
from rest_framework.authtoken.models import Token
# import logging
# from api import views
from .models import UserProfile as User
from .models import UserAlgoritmRun

### ======================== TEST VARIABLES ======================== ###
api_path = '/api/'      # Full path: 'http://localhost:8000/api/'
### ================================================================ ###


class RegisterTestCase(TestCase):
    def setUp(self):
        # insert user's registration data
        self.email = 'testuser@gmail.com'
        self.first_name = 'testing'
        self.last_name = 'user'
        self.affiliation = 'None'
        self.position = 'None'
        self.password = 'Password123'

    def test_successful_registration(self):
        url = api_path+'users/'
        data = {'email': self.email, 'password': self.password, 'first_name': self.first_name,
                'last_name': self.last_name, 'affiliation': self.affiliation, 'position': self.position}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        # check that the new user has been created
        self.assertEqual(User.objects.count(), 1)


class LoginTestCase(TestCase):
    def setUp(self):
        # registering a fake user for the test
        self.email = 'testuser@gmail.com'
        self.first_name = 'testing'
        self.last_name = 'user'
        self.affiliation = 'None'
        self.position = 'None'
        self.password = 'Password123'
        self.user = User.objects.create_user(
            self.email, self.first_name, self.last_name, self.affiliation, self.position, self.password)

    def test_successful_login(self):
        url = api_path+'login/'
        data = {'username': self.email, 'password': self.password}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('token', response.data)
        token = Token.objects.get(user=self.user)
        self.assertEqual(response.data['token'], token.key)

    def test_invalid_username(self):
        response = self.client.post(
            reverse('login'), {'username': 'invalid', 'password': self.password})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_invalid_password(self):
        response = self.client.post(
            reverse('login'), {'username': self.email, 'password': 'invalid'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class LogoutTestCase(TestCase):
    def setUp(self):
        # registering a fake user for the test
        self.email = 'testuser@gmail.com'
        self.first_name = 'testing'
        self.last_name = 'user'
        self.affiliation = 'None'
        self.position = 'None'
        self.password = 'Password123'
        self.user = User.objects.create_user(
            self.email, self.first_name, self.last_name, self.affiliation, self.position, self.password)

    def test_successful_logout(self):
        url = api_path+'logout/'
        self.client.login(username=self.email, password=self.password)
        response = self.client.post(url, {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)


# class UpdateUserTestCase(TestCase):
#     def setUp(self):
#         # registering a fake user for the test
#         self.email = 'testuser@gmail.com'
#         self.first_name = 'testing'
#         self.last_name = 'user'
#         self.affiliation = 'None'
#         self.position = 'None'
#         self.password = 'Password123'
#         self.user = User.objects.create_user(
#             self.email, self.first_name, self.last_name, self.affiliation, self.position, self.password)

#     def test_successful_update(self):
#         url = api_path+'update_user_info/'
#         self.client.login(username=self.email, password=self.password)
#         response = self.client.post(url, {
#             'email': self.email,
#             'first_name': 'The',
#             'last_name': 'User',
#             'affiliation': 'Is',
#             'position': 'Updated',
#             'password': 'Successfully123',
#         }, format='json')

#         user = self.client.get_user(email=self.email)
#         # validate changes
#         self.assertEqual(user['first_name'], 'The')
#         self.assertEqual(user['last_name'], 'User')
#         self.assertEqual(user['affiliation'], 'Is')
#         self.assertEqual(user['position'], 'Updated')
#         response = self.client.login(
#             username=self.email, password='Successfully123')
#         self.assertEqual(response.status_code, status.HTTP_200_OK)


# Getters tests
class AuthenticatedViewTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.email = 'testuser@gmail.com'
        self.first_name = 'testing'
        self.last_name = 'user'
        self.affiliation = 'None'
        self.position = 'None'
        self.password = 'Password123'
        self.user = User.objects.create_user(
            self.email, self.first_name, self.last_name, self.affiliation, self.position, self.password)
        self.client.login(username=self.email, password=self.password)

    def test_get_user(self):
        url = reverse('get_user')
        response = self.client.post(url, {'email': self.email})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # validate user gotten
        # only one user was created for this test
        self.assertEqual(response.json()['id'], 1)
        self.assertEqual(response.json()['email'], self.email)
        self.assertEqual(response.json()['first_name'], self.first_name)
        self.assertEqual(response.json()['last_name'], self.last_name)
        self.assertEqual(response.json()['affiliation'], self.affiliation)
        self.assertEqual(response.json()['position'], self.position)
        self.assertEqual(response.json()['is_staff'], False)

    def test_get_user_tasks(self):
        # create a task
        algo_name = 'Machine Learning'
        algo_status = 'running'
        my_run = UserAlgoritmRun()
        my_run.user_email = self.email
        my_run.status = algo_status
        my_run.algorithm_name = algo_name
        my_run.save()

        url = reverse('get_user_runs')
        response = self.client.post(url, {'email': self.email})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 1)

        # validate task gotten
        # only one task was created for this test
        self.assertEqual(response.json()[0]['id'], 1)
        self.assertEqual(response.json()[0]['user_email'], self.email)
        self.assertEqual(response.json()[0]['algorithm_name'], algo_name)
        self.assertEqual(response.json()[0]['status'], algo_status)
        # self.assertEqual(response.json()[0]['time'], '')
        # self.assertEqual(response.json()[0]['result'], '')

    def test_get_permission_level(self):
        url = reverse('check_permission')
        response = self.client.post(url, {'email': self.email})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['is_admin'], False)

    # TODO: Needs to add an admin user for these test!
    # ================================================

    # def test_get_all_users(self):
    #     url = reverse('get_all_users')
    #     response = self.client.post(url, {'email': self.email})
    #     self.assertEqual(response.status_code, 200)
    #     self.assertEqual(len(response.json()), 1)

    # def test_get_all_tasks(self):
    #     task = Task.objects.create(title='Test Task', description='Test Description', assignee=self.user)
    #     url = reverse('get_all_tasks')
    #     response = self.client.get(url)
    #     self.assertEqual(response.status_code, 200)
    #     self.assertEqual(len(response.json()), 1)
