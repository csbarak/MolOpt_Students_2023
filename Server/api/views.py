import io
from dataclasses import fields
from django.core.serializers import serialize
from django.http import HttpResponse, HttpResponseServerError

from .serializers import UserAlgoritmRunSerializer
from .models import UserProfile as User
import os
import zipfile
import threading
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
from .models import UserAlgoritmRun
from algos.Tree_Expert import Decision_Tree_Improved_1, Decision_Tree_Improved_2, Decision_Tree_Prediction_Script
from algos.Tree_Manual import DecisionTreeRegressor_Manual, DecisionTreeRegressor_Manual_Prediction
from algos.Lasso_Expert import Lasso_Regression_N1, Lasso_Regression_N2, Lasso_Regression_Prediction_Script
from algos.Lasso_Manual import Lasso_Regression_Manual, Lasso_Regression_Manual_Prediction
from algos.XG_Expert import ExpertMode_One, ExpertMode_Two, ExpertMode_Prediction_Script
from algos.XG_Manual import Model_Training_Script, Prediction_Script
from algos import MCS_Script, Mordred_Features_Script, RDKit_Features_Script
from rdkit import Chem
import concurrent.futures
import pandas as pd
from api import models
from api import permissions
from api import serializers

MAX_PARALLEL_RUNS = 5
RUNS_QUEUE = []
ADMIN_EMAILS = {
    'Report a bug': 'nofarrozenberg1@gmail.com',
    'Report a problem': 'nofarrozenberg2@gmail.com',
    'Suggestion': 'nofarrozenberg3@gmail.com'
}


class UserProfileViewSet(viewsets.ModelViewSet):
    """handle creating and updating profiles"""
    serializer_class = serializers.UserProfileSerializer
    queryset = models.UserProfile.objects.all()
    authentication_classes = (TokenAuthentication,)
    permission_classes = (permissions.SeeOwnProfile,)
    # filter_backends = (filters.SearchFilter,)
    # search_fields = ('email', 'first_name', 'last_name')


class UserLoginApiView(ObtainAuthToken):
    """handle creating user authentication tokens"""
    renderer_classes = api_settings.DEFAULT_RENDERER_CLASSES


class UserLogoutApiView(APIView):
    # permission_classes = ([IsAuthenticated])

    def post(self, request):
        try:
            logout(request)
            return Response(status=status.HTTP_200_OK, data={"message": "User logged out"})

        except Exception as e:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            data={"message": '[UserLogoutApiView] ' + str(e)})


class getAllUsers(APIView):
    permission_classes = ([IsAuthenticated])

    def get(self, request):
        try:
            if not request.user.is_staff == True:
                return Response(status=status.HTTP_400_BAD_REQUEST,
                                data={"message": 'User {request.user.email} is not staff'})

            users = User.objects.all().values('email', 'id', 'first_name', 'last_name',
                                              'position', 'affiliation', 'is_staff')
            return Response(status=status.HTTP_200_OK, data={users})

        except Exception as e:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR, data={"message": '[getAllUsers] ' + str(e)})


class getUser(APIView):
    # permission_classes = ([IsAuthenticated])

    def post(self, request):
        try:
            user_id = request.data['user_id']
            user = User.objects.get(email=user_id)
            # if not request.user.email == user.email and not request.user.is_staff:
            #     return Response(status=status.HTTP_400_BAD_REQUEST, data={"message": 'User can see other users profile'})

            return Response(status=status.HTTP_200_OK,
                            data={"id": user.id, "email": user.email, "first_name": user.first_name,
                                  "last_name": user.last_name, "position": user.position,
                                  "affiliation": user.affiliation, "is_staff": user.is_staff})

        except Exception as e:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR, data={"message": '[getUser] ' + str(e)})


class CheckPermissions(APIView):
    # permission_classes = ([IsAuthenticated])

    def post(self, request):
        try:
            pk = request.data['user_id']
            user = User.objects.get(email=pk)
            return Response(status=status.HTTP_200_OK, data={"is_admin": user.is_staff})
        except Exception as e:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            data={"message": '[CheckPermissions] ' + str(e)})


class CreateSystemAdminApiView(APIView):
    # permission_classes = ([IsAuthenticated])

    def post(self, request):
        try:
            pk = request.data['user_id']
            if pk is not None:
                user = User.objects.get(id=pk)
                if user is not None:
                    if not user.is_staff:
                        user.is_staff = True
                        user.save()
                        return Response(status=status.HTTP_200_OK,
                                        data={'message': f'{user.first_name} {user.last_name} is now an admin '})
                    else:
                        return Response(status=status.HTTP_400_BAD_REQUEST,
                                        data={'message': f'User w/ email: {user.email} is already an admin'})
                else:
                    return Response(status=status.HTTP_400_BAD_REQUEST,
                                    data={'message': f'User w/ email: {user.email} does not exists'})
            else:
                return Response(status=status.HTTP_400_BAD_REQUEST, data={'message': f'There is no user with id: {pk}'})
        except Exception as e:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            data={"message": '[CreateSystemAdminApiView] ' + str(e)})


class RemoveSystemAdminApiView(APIView):
    # permission_classes = ([IsAuthenticated])

    def post(self, request):
        try:
            pk = request.data['user_id']
            if pk is not None:
                user = User.objects.get(id=pk)
                if user is not None:
                    if user.is_staff:
                        user.is_staff = False
                        user.save()
                        return Response(status=status.HTTP_200_OK,
                                        data={'message': f'{user.first_name} {user.last_name} is now a regular user '})
                    else:
                        return Response(status=status.HTTP_400_BAD_REQUEST,
                                        data={'message': f'User w/ email: {user.email} is already a regular user'})
                else:
                    return Response(status=status.HTTP_400_BAD_REQUEST,
                                    data={'message': f'User w/ email: {user.email} does not exists'})
            else:
                return Response(status=status.HTTP_400_BAD_REQUEST, data={'message': f'There is no user with id: {pk}'})
        except Exception as e:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            data={"message": '[CreateSystemAdminApiView] ' + str(e)})


class DeleteUserFromSystem(APIView):
    # permission_classes = ([IsAuthenticated])

    def post(self, request):
        try:
            # if IsAdminUser and request.user.is_staff:     # TODO: Need to get the user requesting to delete..
            pk = request.data['user_id']
            if pk is not None:
                user = User.objects.get(pk=pk)
                print(user)
                user.delete()
                return Response(status=status.HTTP_200_OK,
                                data={'message': f'The user with the id #{pk} has been deleted'})
            else:
                return Response(status=status.HTTP_400_BAD_REQUEST, data={"message": "Missing email parameter"})
            # else:
            #     return Response(status=status.HTTP_400_BAD_REQUEST, data={"message": "User is not authenticated"})
        except Exception as e:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            data={"message": '[DeleteUserFromSystem] ' + str(e)})


class ContactAdmin(APIView):
    # permission_classes = ([IsAuthenticated])

    def post(self, request):
        try:
            subject = request.data['subject']
            pk = request.data['user_id']
            message = request.data['message']
            user = User.objects.get(email=pk)
            user_email = user.email
            body = f"Contact Admin Message From User: {user_email}\nMessage:\n{message}"
            to_email = ADMIN_EMAILS[subject]
            email = EmailMessage(subject, body, user_email, [to_email])
            email.send()
            return Response(status=status.HTTP_200_OK)
        except Exception as e:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR, data={"message": '[ContactAdmin] ' + str(e)})


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
executor = concurrent.futures.ThreadPoolExecutor()


def Clear_media():
    pass
    # files = fs.listdir(fs.location)
    # for file in files[1]:
    #     fs.delete(os.path.join(fs.location,file))


def runMCS(rId, data):
    if len(RUNS_QUEUE) <= MAX_PARALLEL_RUNS:
        MCS_Script.make_it_run('ref' + str(rId), 'ligand' + str(rId), rId)
        email = EmailMessage('MolOpt-Update', 'Your run finished you can download the result through the tasks section',
                             'noreplymolopt@gmail.com', [data['email']])
        email.send()
        Clear_media()
        run = UserAlgoritmRun.objects.get(id=rId)
        run.status = 'finished'
        run.result = "aligned" + str(rId) + ".sdf"
        run.save()
        RUNS_QUEUE.remove(rId)


class UserRunAlignmentApiView(APIView):
    def post(self, request):
        my_run = UserAlgoritmRun()
        my_run.user_email = request.data['email']
        my_run.status = 'running'
        my_run.algorithm_name = 'Alignment'
        my_run.save()
        RUNS_QUEUE.append(my_run.id)
        try:
            fs.save('ref' + str(my_run.id), request.data['ref'])
            fs.save('ligand' + str(my_run.id), request.data['ligand'])
            executor.submit(runMCS, my_run.id, request.data)
            return Response(status=status.HTTP_200_OK)
        except Exception as e:
            my_run.status = 'failed'
            my_run.save()
            RUNS_QUEUE.remove(my_run.id)
            print(e)
            Clear_media()
            return Response(status=status.HTTP_400_BAD_REQUEST)


def runFeature(rId, data):
    if len(RUNS_QUEUE) <= MAX_PARALLEL_RUNS:
        res = ''
        if data['Mordred']:
            Mordred_Features_Script.make_it_run('mol' + str(rId), rId)
            res += 'FeaturesExtracted_MORDRED' + str(rId) + '.csv'
        if data['RDKit']:
            RDKit_Features_Script.make_it_run('mol' + str(rId), rId)
            if len(res) != 0:
                res += '@'
            res += 'FeaturesExtracted_RDKIT' + str(rId) + '.csv'
        email = EmailMessage('MolOpt-Update', 'Your run finished you can download the result through the tasks section',
                             'noreplymolopt@gmail.com', [data['email']])
        email.send()
        Clear_media()
        run = UserAlgoritmRun.objects.get(id=rId)
        run.status = 'finished'
        run.result = res
        run.save()
        RUNS_QUEUE.remove(rId)


class UserRunFeatureExtractionApiView(APIView):
    def post(self, request):
        my_run = UserAlgoritmRun()
        my_run.user_email = request.data['email']
        my_run.status = 'running'
        my_run.algorithm_name = 'Feature Extraction'
        my_run.save()
        try:
            fs.save('mol' + str(my_run.id), request.data['mol'])
            RUNS_QUEUE.append(my_run.id)
            executor.submit(runFeature, my_run.id, request.data)
            return Response(status=status.HTTP_200_OK)
        except Exception as e:
            my_run.status = 'failed'
            my_run.save()
            print(e)
            Clear_media()
            return Response(status=status.HTTP_400_BAD_REQUEST)


def runAlgos(rId, data):
    if len(RUNS_QUEUE) <= MAX_PARALLEL_RUNS:
        res = ''
        if data['xgboost']['isXGBoost']:
            xg = data['xgboost']['xgboostValue']
            res += f'Predicted_Results_XG{id}.csv'
            if not data['xgboost']['isAuto']:
                Model_Training_Script.make_it_train('csv' + str(rId), xg['features'], xg['learningRate'],
                                                    xg['maxDepth'], xg['lambda'], xg['alpha'], xg['dropRate'], rId)
                Prediction_Script.make_it_rain('csv' + str(rId), xg['features'], rId)
            else:
                ExpertMode_One.make_it_rain('csv' + str(rId), rId)
                ExpertMode_Two.make_it_rain('csv' + str(rId), xg['numberOfFeatures'], rId)
                ExpertMode_Prediction_Script.make_it_rain('csv' + str(rId), xg['numberOfFeatures'], rId)
        if data['lasso']['isLasso']:
            if len(res) != 0:
                res += '@'
            res += f'Predicted_Results_Lasso{id}.csv'
            lasso = data['lasso']['lassoValue']
            if not data['lasso']['isAuto']:
                Lasso_Regression_Manual.make_it_rain('csv' + str(rId), lasso['features'], lasso['alpha'], rId)
                Lasso_Regression_Manual_Prediction.make_it_rain('csv' + str(rId), lasso['features'], rId)
            else:
                Lasso_Regression_N1.make_it_rain('csv' + str(rId), rId)
                Lasso_Regression_N2.make_it_rain('csv' + str(rId), lasso['numberOfFeatures'], rId)
                Lasso_Regression_Prediction_Script.make_it_rain('csv' + str(rId), lasso['numberOfFeatures'], rId)
        if data['dtr']['isDTR']:
            if len(res) != 0:
                res += '@'
            tree = data['dtr']['dtrValue']
            res += f'Predicted_Results_dtr{id}.csv'
            if not data['dtr']['isAuto']:
                DecisionTreeRegressor_Manual.make_it_train('csv' + str(rId), tree['features'], tree['maxDepth'],
                                                           tree['minSample'], tree['minSampleLeaf'],
                                                           tree['minWeightFraction'], rId)
                DecisionTreeRegressor_Manual_Prediction.make_it_rain('csv' + str(rId), tree['features'], rId)
            else:
                Decision_Tree_Improved_1.make_it_rain('csv' + str(rId), rId)
                Decision_Tree_Improved_2.make_it_rain('csv' + str(rId), tree['numberOfFeatures'], rId)
                Decision_Tree_Prediction_Script.make_it_rain('csv' + str(rId), tree['numberOfFeatures'], rId)
        run = UserAlgoritmRun.objects.get(id=rId)
        run.status = 'finished'
        run.result = res
        run.save()
        RUNS_QUEUE.remove(rId)
        email = EmailMessage('MolOpt-Update', 'Your run finished you can download the result through the tasks section',
                             'noreplymolopt@gmail.com', [data['email']])
        email.send()
        Clear_media()


class UserRunMLAlgorithmsApiView(APIView):
    def post(self, request):
        name = 'Machine Learning'
        my_run = UserAlgoritmRun()
        my_run.user_email = request.data['email']
        my_run.status = 'running'
        my_run.algorithm_name = name
        my_run.save()
        try:
            fs.save('csv' + str(my_run.id), request.data['csv'])
            RUNS_QUEUE.append(my_run.id)
            executor.submit(runAlgos, my_run.id, request.data)
            return Response(status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            Clear_media()
            my_run.status = 'failed'
            my_run.save()
            return Response(status=status.HTTP_400_BAD_REQUEST)


def runAutoProcess(rId, data):
    if len(RUNS_QUEUE) <= MAX_PARALLEL_RUNS:
        # runMCS(rId,data)
        sdfMolConvert('aligned')
        runFeature(rId, data)
        cleanCSV('csv')
        runAlgos(rId, data)
        run = UserAlgoritmRun.objects.get(id=rId)
        run.status = 'finished'
        run.save()
        RUNS_QUEUE.remove(rId)
        email = EmailMessage('MolOpt-Update', 'Your run finished you can download the result through the tasks section',
                             'noreplymolopt@gmail.com', [data['email']])
        email.send()
        Clear_media()


class UserRunAutoProcessApiView(APIView):
    def post(self, request):
        name = 'Auto Process'
        my_run = UserAlgoritmRun()
        my_run.user_email = request.data['email']
        my_run.status = 'running'
        my_run.algorithm_name = name
        my_run.save()
        try:
            fs.save('ref', request.data['ref'])
            fs.save('ligand', request.data['ligand'])
            RUNS_QUEUE.append(my_run.id)
            thread = threading.Thread(target=runAutoProcess(my_run.id, request.data))
            thread.start()
            return Response(status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            Clear_media()
            my_run.status = 'failed'
            my_run.save()
            return Response(status=status.HTTP_400_BAD_REQUEST)


def sdfMolConvert(file):
    sdf = Chem.SDMolSupplier(file + ".sdf")
    mol = Chem.Mol2Writer(open(file + ".mol2", "w"))
    for mol in sdf:
        mol.write(mol)
    mol.close()


def cleanCSV(file):
    df = pd.read_csv(file + ".csv")
    for col in df.columns:
        try:
            pd.to_numeric(df[col])
        except ValueError:
            df = df.drop(col, axis=1)
    df.to_csv(file + ".csv", index=False)


class UserGetUserRunsApiView(APIView):
    def post(self, request):
        print(request.data)
        runs = UserAlgoritmRun.objects.filter(user_email=request.data['email'])
        serializer = UserAlgoritmRunSerializer(runs, many=True)
        return Response(serializer.data)


class UserGetAllRunsApiView(APIView):
    def get(self, request):
        runs = UserAlgoritmRun.objects.all()
        serializer = UserAlgoritmRunSerializer(runs, many=True)
        return Response(serializer.data)


class UserDownloadResultApiView(APIView):
    def post(self, request):
        rId = request.data['id']
        run = UserAlgoritmRun.objects.get(id=rId)
        files = run.result.split('@')
        print(files)

        zip_file_path = os.path.join(fs.location, f'Result{rId}.zip')

        with zipfile.ZipFile(zip_file_path, 'w', zipfile.ZIP_DEFLATED) as result:
            for f in files:
                if os.path.exists(os.path.join(fs.location, f)):
                    result.write(fs.path(f), arcname=os.path.basename(f))

        # Test the integrity of the generated ZIP file
        with zipfile.ZipFile(zip_file_path, 'r') as zip_obj:
            if zip_obj.testzip() is not None:
                # The ZIP file is invalid or incomplete
                return HttpResponseServerError('Generated ZIP file is invalid')

        # If the ZIP file is valid, create a response object to download it
        with open(zip_file_path, 'rb') as f:
            response = HttpResponse(f, content_type='application/zip')
            response['Content-Disposition'] = f'attachment; filename=test.zip'
            return response
