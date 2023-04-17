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
from algos.Tree_Expert import Decision_Tree_Improved_1,Decision_Tree_Improved_2,Decision_Tree_Prediction_Script
from algos.Tree_Manual import DecisionTreeRegressor_Manual,DecisionTreeRegressor_Manual_Prediction
from algos.Lasso_Expert import Lasso_Regression_N1,Lasso_Regression_N2,Lasso_Regression_Prediction_Script
from algos.Lasso_Manual import Lasso_Regression_Manual,Lasso_Regression_Manual_Prediction
from algos.XG_Expert import ExpertMode_One,ExpertMode_Two,ExpertMode_Prediction_Script
from algos.XG_Manual import Model_Training_Script,Prediction_Script
from algos import MCS_Script,Mordred_Features_Script,RDKit_Features_Script
from models import UserAlgoritmRun
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
def Clear_media():
    files = fs.listdir(fs.location)
    for file in files[1]:
        fs.delete(os.path.join(fs.location,file))

class UserRunAlignmentApiView(APIView):
    def post(self, request):
        def runMCS(rId):
            MCS_Script.make_it_run('ref', 'db')
            email = EmailMessage('result', 'result', 'noreplymolopt@gmail.com', ['amit.peled14@gmail.com'])
            email.attach_file(os.path.join(fs.location, 'aligned.sdf'))
            email.send()
            Clear_media()
            run = UserAlgoritmRun.objects.get(id=rId)
            run.status='finished'
            run.save()
        try:
            my_run=UserAlgoritmRun()
            my_run.user_email=request.data['email']
            my_run.status='running'
            my_run.algorithm_name='Alignment'
            my_run.save()
            fs.save('ref', request.data['ref'])
            fs.save('db', request.data['db'])
            thread = Thread(target=runMCS(my_run.id))
            thread.start()
            return Response(status=status.HTTP_200_OK)
        except Exception as e:
            my_run.status='failed'
            my_run.save()
            print(e)
            Clear_media()
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
class UserRunMordredApiView(APIView):
    def post(self,request):
        my_run=UserAlgoritmRun()
        my_run.user_email=request.data['email']
        my_run.status='running'
        my_run.algorithm_name='Mordred'
        my_run.save()
        def runMordred(rId):
            Mordred_Features_Script.make_it_run('mol')
            email=EmailMessage('result','result','noreplymolopt@gmail.com',['xxshahar@gmail.com'])
            with zipfile.ZipFile('result.zip', 'w') as myzip:
                myzip.write('FeaturesExtracted_MORDRED.csv', compress_type=zipfile.ZIP_DEFLATED)
            email.attach_file(os.path.join(fs.location,'result.zip'))
            email.send()
            Clear_media()
            run = UserAlgoritmRun.objects.get(id=rId)
            run.status='finished'
            run.save()
        try:
            fs.save('mol',request.data['mol'])
            thread=Thread(target=runMordred(my_run.id))
            thread.start()
            return Response('good')    
        except Exception as e:
            my_run.status='failed'
            my_run.save()
            print(e)
            Clear_media()
            return Response('bad')

class UserRunRDKitApiView(APIView):
    def post(self,request):
        my_run=UserAlgoritmRun()
        my_run.user_email=request.data['email']
        my_run.status='running'
        my_run.algorithm_name='RDKIT'
        my_run.save()
        def runRD(rId):
            RDKit_Features_Script.make_it_run('mol')
            email=EmailMessage('result','result','noreplymolopt@gmail.com',['xxshahar@gmail.com'])
            with zipfile.ZipFile('result.zip', 'w') as myzip:
                myzip.write('FeaturesExtracted_RDKIT.csv', compress_type=zipfile.ZIP_DEFLATED)
            email.attach_file(os.path.join(fs.location,'result.zip'))
            email.send()
            Clear_media()
            run = UserAlgoritmRun.objects.get(id=rId)
            run.status='finished'
            run.save()
        try:
            fs.save('mol',request.data['mol'])
            thread=Thread(target=runRD(my_run.id))
            thread.start()
            return Response('good')    
        except Exception as e:
            my_run.status='failed'
            my_run.save()
            print(e)
            Clear_media()
            return Response('bad')

            
class UserRunMLAlgorithmsApiView(APIView):
    def post(self,request):
        name=''
        if request.data['xgboost'] is not None:
            name+='xgboost '
        if request.data['lasso'] is not None:
            name+='lasso '
        if request.data['tree'] is not None:
            name+='tree'
        my_run=UserAlgoritmRun()
        my_run.user_email=request.data['email']
        my_run.status='running'
        my_run.algorithm_name=name
        my_run.save()
        def RunAlgos(rId):
            ###TODO:Finish Run Algos###
            Clear_media()
        try:
            fs.save('csv',request.data['csv'])
            thread=Thread(target=RunAlgos(my_run.id))
            thread.start()
            return Response('good')    
        except Exception as e:
            print(e)
            Clear_media()
            my_run.status='failed'
            my_run.save()
            return Response('bad')