import os
import zipfile
from threading import Thread

from django.core.files.storage import FileSystemStorage
from django.core.mail import EmailMessage
from rest_framework import filters, status, viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework.settings import api_settings
from rest_framework.views import APIView
from django.contrib.auth import logout
from .models import UserProfile


# Create your views here.
from algos import MCS_Script, RDKit_Features_Script, Mordred_Features_Script, Decision_Tree_Improved_1, \
    Decision_Tree_Improved_2, Decision_Tree_Prediction_Script
from api import models
from api import permissions
from api import serializers

ADMIN_EMAILS = {
    'suggestion': 'nofarrozenberg1@gmail.com',
    'problem': 'nofarrozenberg2@gmail.com',
    'other': 'nofarrozenberg3@gmail.com'
}


class UserProfileViewSet(viewsets.ModelViewSet):
    """handle creating and updating profiles"""
    serializer_class = serializers.UserProfileSerializer
    queryset = models.UserProfile.objects.all()
    # authentication_classes = (TokenAuthentication,)
    permission_classes = (permissions.SeeOwnProfile,)
    filter_backends = (filters.SearchFilter,)
    search_fields = ('email', 'first_name', 'last_name')


class UserLoginApiView(ObtainAuthToken):
    """handle creating user authentication tokens"""
    renderer_classes = api_settings.DEFAULT_RENDERER_CLASSES


class UserLogoutApiView(APIView):
    print("[UserLogoutApiView]")
    permission_classes = ([IsAuthenticated])

    def post(self, request):
        try:
            logout(request)
            return Response(status=status.HTTP_200_OK, data={"message": "User logged out"})

        except Exception as e:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR, data={"message": str(e)})


class CreateSystemAdminApiView(APIView):
    print("[CreateSystemAdminApiView] Start")
    permission_classes = ([IsAuthenticated])

    def post(self, request):
        try:
            if IsAdminUser and request.user.is_staff:
                email = request.data['email']
                if email is not None:
                    user = UserProfile.objects.get(email__exact=email)
                    if user is not None:
                        user.is_staff = True
                        user.save()
                        return Response(status=status.HTTP_200_OK, data={'message': f'{user.first_name} {user.last_name} is admin '})

                    else:
                        return Response(status=status.HTTP_400_BAD_REQUEST, data={"message": "User w/ email: {email} does not exists"})
                else:
                    return Response(status=status.HTTP_400_BAD_REQUEST, data={"message": "Missing email parameter"})
            else:
                return Response(status=status.HTTP_400_BAD_REQUEST, data={"message": "User is not authenticated"})
        except Exception as e:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR, data={"message": str(e)})


class RemoveSystemAdminApiView(APIView):
    print("[CreateSystemAdminApiView] Start")
    permission_classes = ([IsAuthenticated])

    def post(self, request):
        try:
            if IsAdminUser and request.user.is_staff:
                email = request.data['email']
                if email is not None:
                    user = UserProfile.objects.get(email__exact=email)
                    if user is not None:
                        user.is_staff = False
                        user.save()
                        return Response(status=status.HTTP_200_OK, data={'message': f'{user.first_name} {user.last_name} is not admin '})

                    else:
                        return Response(status=status.HTTP_400_BAD_REQUEST, data={"message": "User w/ email: {email} does not exists"})
                else:
                    return Response(status=status.HTTP_400_BAD_REQUEST, data={"message": "Missing email parameter"})
            else:
                return Response(status=status.HTTP_400_BAD_REQUEST, data={"message": "User is not authenticated"})
        except Exception as e:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR, data={"message": str(e)})


class DeleteUserFromSystem(APIView):
    print("[CreateSystemAdminApiView] Start")
    permission_classes = ([IsAuthenticated])

    def post(self, request):
        try:
            if IsAdminUser and request.user.is_staff:
                email = request.data['email']
                if email is not None:
                    user = UserProfile.objects.filter(email=email).delete()
                    return Response(status=status.HTTP_200_OK, data={'message': f'{user.first_name} {user.last_name} is not admin '})
                else:
                    return Response(status=status.HTTP_400_BAD_REQUEST, data={"message": "Missing email parameter"})
            else:
                return Response(status=status.HTTP_400_BAD_REQUEST, data={"message": "User is not authenticated"})
        except Exception as e:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR, data={"message": str(e)})


class ContactAdmin(APIView):
    print("[ContactAdmin] Start")
    permission_classes = ([IsAuthenticated])

    def post(self, request):
        try:
            subject = request.data['subject']
            user_email = request.data['email']
            body = f"Contact Admin Message From User: {user_email}\nMessage:\n{request.data['message']}"
            to_email = ADMIN_EMAILS[subject]
            email = EmailMessage(subject, body, user_email, [to_email])
            email.send()
            return Response(status=status.HTTP_200_OK)
        except Exception as e:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR, data={"message": str(e)})


class UserRunsViewSet(viewsets.ModelViewSet):
    """handle creating reading and updating profile feed items"""
    authentication_classes = (TokenAuthentication,)
    serializer_class = serializers.UserAlgoritmRunSerializer
    queryset = models.UserAlgoritmRun.objects.all()
    permission_classes = (IsAuthenticated,)

    def perform_create(self, serializer):
        """Sets the user profile to the logged in user"""
        serializer.save(user_profile=self.request.user)


fs = FileSystemStorage()


def clear_media():
    files = fs.listdir(fs.location)
    for file in files[1]:
        fs.delete(os.path.join(fs.location, file))


class UserRunAlignmentApiView(APIView):
    def post(self, request):
        def runMCS():
            print("MCS")
            MCS_Script.make_it_run('ref', 'db')
            email = EmailMessage('result', 'result', 'noreplymolopt@gmail.com', ['amit.peled14@gmail.com'])
            email.attach_file(os.path.join(fs.location, 'aligned.sdf'))
            email.send()
            clear_media()

        try:
            fs.save('ref', request.data['ref'])
            fs.save('db', request.data['db'])
            # save run
            thread = Thread(target=runMCS)
            thread.start()
            return Response(status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            clear_media()
            # save failed run
            return Response(status=status.HTTP_400_BAD_REQUEST)


class UserRunMordredApiView(APIView):
    def post(self, request):
        def runMordred():
            # save run
            Mordred_Features_Script.make_it_run('mol')
            email = EmailMessage('result', 'result', 'noreplymolopt@gmail.com', ['amit.peled14@gmail.com'])
            with zipfile.ZipFile('result.zip', 'w') as myzip:
                myzip.write('FeaturesExtracted_MORDRED.csv', compress_type=zipfile.ZIP_DEFLATED)
            email.attach_file(os.path.join(fs.location, 'result.zip'))
            email.send()
            clear_media()

        try:
            fs.save('mol', request.data['mol'])
            thread = Thread(target=runMordred)
            thread.start()
            # update run
            return Response(status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            # save failed run
            clear_media()
            return Response(status=status.HTTP_400_BAD_REQUEST)


class UserRunRDKitApiView(APIView):
    def post(self, request):
        def runRD():
            # save run
            RDKit_Features_Script.make_it_run('mol')
            email = EmailMessage('result', 'result', 'noreplymolopt@gmail.com', ['amit.peled14@gmail.com'])
            with zipfile.ZipFile('result.zip', 'w') as myzip:
                myzip.write('FeaturesExtracted_RDKIT.csv', compress_type=zipfile.ZIP_DEFLATED)
            email.attach_file(os.path.join(fs.location, 'result.zip'))
            email.send()
            clear_media()

        try:
            fs.save('mol', request.data['mol'])
            thread = Thread(target=runRD)
            thread.start()
            # update run
            return Response(status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            # save failed run
            clear_media()
            return Response(status=status.HTTP_400_BAD_REQUEST)


class UserRunMLAlgorithmsApiView(APIView):
    def post(self, request):
        def RunDecision():
            Decision_Tree_Improved_1.make_it_rain('csv')
            Decision_Tree_Improved_2.make_it_rain('csv', 5)
            Decision_Tree_Prediction_Script.make_it_rain('csv', 5)
            email = EmailMessage('result', 'result', 'noreplymolopt@gmail.com', ['amit.peled14@gmail.com'])
            with zipfile.ZipFile('result.zip', 'w') as myzip:
                myzip.write('Predicted_Results.csv', compress_type=zipfile.ZIP_DEFLATED)
            email.attach_file(os.path.join(fs.location, 'result.zip'))
            email.send()
            clear_media()
            # save run

        try:
            fs.save('csv', request.data['csv'])
            thread = Thread(target=RunDecision)
            thread.start()
            # update run
            return Response(status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            clear_media()
            # save failed run
            return Response(status=status.HTTP_400_BAD_REQUEST)
