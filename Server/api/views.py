import io
from dataclasses import fields
from django.core.serializers import serialize
from django.http import HttpResponse, HttpResponseServerError
from .tokens import send_activation_email, check_token
from .serializers import UserAlgoritmRunSerializer
from .models import UserProfile as User
import io
import os
import zipfile
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
from algos import MCS_Script, Mordred_Features_Script, RDKit_Features_Script,Lasso_Exp,Lasso_Man,XG_Exp,XG_Man,DTR_Exp,DTR_Man
from rdkit import Chem
import concurrent.futures
import pandas as pd
from api import models
from api import permissions
from api import serializers
from datetime import datetime, timedelta

RESULT_SAVING_TIME=4 #in weeks
MAX_PARALLEL_RUNS = 9999
ADMIN_EMAILS = {
    'Report a bug': 'nofarrozenberg1@gmail.com',
    'Report a problem': 'nofarrozenberg2@gmail.com',
    'Suggestion': 'nofarrozenberg3@gmail.com'
}


class ForgotPasswordView(APIView):
    def post(self, request):
        domain = request.headers['Host']
        email = request.data['email']
        user = User.objects.get(email=email)
        if user is not None:
            try:
                send_activation_email(user)
                return Response(status=status.HTTP_200_OK)
            except Exception as e:
                return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR, data={"message":str(e)})
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST, data={"message": '[ForgotPasswordView] This email does not assosiate to any user'})

from django.utils.http import urlsafe_base64_decode    

class ResetPasswordConfirmView(APIView):
    def post(self, request):
        try:
            uidb64 = request.data['uidb64']
            uid = urlsafe_base64_decode(uidb64).decode()
            user = User.objects.get(pk=uid)
            token = request.data['token']
            if user is not None:
                if check_token(user, token):
                    user.set_password(request.data["password"])
                    user.save()
                    return Response(status=status.HTTP_200_OK)
                else:
                    return Response(status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response(status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR, data={"message":str(e)})

class UpdateUserView(APIView):
    permission_classes = ([IsAuthenticated])

    def post(self, request):
        try:
            email = request.data['email']
            user = User.objects.get(email=email)
            if user is not None:

                first_name = request.data.get('first_name')
                if first_name is not None:
                    user.first_name=first_name

                last_name = request.data.get('last_name')
                if last_name is not None:
                    user.last_name=last_name

                position = request.data.get('position')
                if position is not None:
                    user.position=position

                affiliation = request.data.get('affiliation')
                if affiliation is not None:
                    user.affiliation=affiliation

                password = request.data.get('password')
                if password is not None:
                    user.set_password(password)

                user.save()
                return Response(status=status.HTTP_200_OK)
            else:
                return Response(status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR, data={"message":str(e)})


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
    permission_classes = ([IsAuthenticated])

    def post(self, request):
        try:
            logout(request)
            return Response(status=status.HTTP_200_OK, data={"message": "User logged out"})

        except Exception as e:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            data={"message": '[UserLogoutApiView] ' + str(e)})


class getAllUsers(APIView):
    permission_classes = ([IsAuthenticated])

    def post(self, request):
        try:
            if not request.user.is_staff == True:
                return Response(status=status.HTTP_400_BAD_REQUEST,
                                data={"message": 'User {request.user.email} is not staff'})

            users = User.objects.all().values('email', 'id', 'first_name', 'last_name',
                                              'position', 'affiliation', 'is_staff')
            return Response(status=status.HTTP_200_OK, data={users})

        except Exception as e:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR, data={"message": '[getAllUsers]' + str(e)})


class getUser(APIView):
    permission_classes = ([IsAuthenticated])

    def post(self, request):
        try:
            email = request.data['email']
            user = User.objects.get(email=email)
            # if not request.user.email == user.email and not request.user.is_staff:
            #     return Response(status=status.HTTP_400_BAD_REQUEST, data={"message": 'User can see other users profile'})

            return Response(status=status.HTTP_200_OK,
                            data={"id": user.id, "email": user.email, "first_name": user.first_name,
                                  "last_name": user.last_name, "position": user.position,
                                  "affiliation": user.affiliation, "is_staff": user.is_staff})

        except Exception as e:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR, data={"message": '[getUser] ' + str(e)})


class CheckPermissions(APIView):
    permission_classes = ([IsAuthenticated])

    def post(self, request):
        try:
            email = request.data['email']
            user = User.objects.get(email=email)
            return Response(status=status.HTTP_200_OK, data={"is_admin": user.is_staff})
        except Exception as e:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            data={"message": '[CheckPermissions] ' + str(e)})


class CreateSystemAdminApiView(APIView):
    permission_classes = ([IsAuthenticated])

    def post(self, request):
        try:
            email = request.data['email']
            if email is not None:
                user = User.objects.get(email=email)
                if user is not None:
                    if not user.is_staff:
                        user.is_staff = True
                        user.save()
                        return Response(status=status.HTTP_200_OK,
                                        data={'message': f'{user.first_name} {user.last_name} is now an admin '})
                    else:
                        return Response(status=status.HTTP_400_BAD_REQUEST,
                                        data={'message': f'User w/ email: {email} is already an admin'})
                else:
                    return Response(status=status.HTTP_400_BAD_REQUEST,
                                    data={'message': f'User w/ email: {email} does not exists'})
            else:
                return Response(status=status.HTTP_400_BAD_REQUEST,
                                data={'message': f'There is no user with email: {email}'})
        except Exception as e:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            data={"message": '[CreateSystemAdminApiView] ' + str(e)})


class RemoveSystemAdminApiView(APIView):
    permission_classes = ([IsAuthenticated])

    def post(self, request):
        try:
            email = request.data['email']
            if email is not None:
                user = User.objects.get(email=email)
                if user is not None:
                    if user.is_staff:
                        user.is_staff = False
                        user.save()
                        return Response(status=status.HTTP_200_OK,
                                        data={'message': f'{user.first_name} {user.last_name} is now a regular user '})
                    else:
                        return Response(status=status.HTTP_400_BAD_REQUEST,
                                        data={'message': f'User w/ email: {email} is already a regular user'})
                else:
                    return Response(status=status.HTTP_400_BAD_REQUEST,
                                    data={'message': f'User w/ email: {email} does not exists'})
            else:
                return Response(status=status.HTTP_400_BAD_REQUEST,
                                data={'message': f'There is no user with id: {email}'})
        except Exception as e:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            data={"message": '[CreateSystemAdminApiView] ' + str(e)})


class DeleteUserFromSystem(APIView):
    permission_classes = ([IsAuthenticated])

    def post(self, request):
        try:
            if IsAdminUser and request.user.is_staff:
                email = request.data['email']
                if email is not None:
                    user = User.objects.get(email=email)
                    user.delete()
                    return Response(status=status.HTTP_200_OK,
                                    data={'message': f'The user with the id #{email} has been deleted'})
                else:
                    return Response(status=status.HTTP_400_BAD_REQUEST, data={"message": "Missing email parameter"})
            else:
                return Response(status=status.HTTP_400_BAD_REQUEST, data={"message": "User is not admin"})
        except Exception as e:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            data={"message": '[DeleteUserFromSystem] ' + str(e)})


class ContactAdmin(APIView):
    permission_classes = ([IsAuthenticated])

    def post(self, request):
        try:
            subject = request.data['subject']
            email = request.data['email']
            message = request.data['message']
            user = User.objects.get(email=email)
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
executor = concurrent.futures.ThreadPoolExecutor(max_workers=MAX_PARALLEL_RUNS)


def Clear_media():
    try:
        files = fs.listdir(fs.location)
        for file in files[1]:
            time_diff = datetime.now() - datetime.fromtimestamp(os.path.getctime(os.path.join(fs.location, file)))
            if file.startswith('Result'):
                if time_diff > timedelta(weeks=RESULT_SAVING_TIME):
                    fs.delete(os.path.join(fs.location, file))
            else:
                if time_diff > timedelta(hours=1):
                    fs.delete(os.path.join(fs.location, file))
    except Exception as e:
        print(e)


def failed_run(rId):
    run = UserAlgoritmRun.objects.get(id=rId)
    run.status = 'failed'
    run.save()


def runMCS(rId, data):
    try:
        MCS_Script.make_it_run(f'ref{rId}', f'ligand{rId}', rId)
        run = UserAlgoritmRun.objects.get(id=rId)
        if run.algorithm_name=='Alignment':
            email = EmailMessage('MolOpt-Update', 'Your run finished you can download the result through the tasks section',
                                'noreplymolopt@gmail.com', [data['email']])
            email.send()
            zip_file_path = os.path.join(fs.location, f'Result{rId}.zip')
            with zipfile.ZipFile(zip_file_path, 'w', zipfile.ZIP_DEFLATED) as result:
                    if os.path.exists(os.path.join(fs.location,f'aligned{rId}.sdf')):
                        result.write(fs.path(f'aligned{rId}.sdf'), arcname=os.path.basename(f'aligned{rId}.sdf'))
            run.status = 'finished'
            run.result = zip_file_path
            run.save()
            Clear_media()
    except Exception as e:
        print('Failed Alignment: ',e)
        failed_run(rId)



class UserRunAlignmentApiView(APIView):
    def post(self, request):
        my_run = UserAlgoritmRun()
        my_run.user_email = request.data['email']
        my_run.status = 'running'
        my_run.algorithm_name = 'Alignment'
        my_run.save()
        try:
            fs.save('ref' + str(my_run.id), request.data['ref'])
            fs.save('ligand' + str(my_run.id), request.data['ligand'])
            executor.submit(runMCS, my_run.id, request.data)
            return Response(status=status.HTTP_200_OK)
        except Exception as e:
            print('Failed Alignment: ',e)
            my_run.status = 'failed'
            my_run.save()
            Clear_media()
            return Response(status=status.HTTP_400_BAD_REQUEST)


def runFeature(rId, data):
    try:
        run = UserAlgoritmRun.objects.get(id=rId)
        if run.algorithm_name=='Feature Extraction':
            with concurrent.futures.ThreadPoolExecutor(max_workers=2) as ex:
                if data['Mordred']=='true':
                    f1=ex.submit(Mordred_Features_Script.make_it_run,f'mol{rId}',rId,False)
                if data['RDKit']=='true':
                    f2=ex.submit(RDKit_Features_Script.make_it_run,f'mol{rId}', rId,False)
                if data['Mordred']=='true':
                    concurrent.futures.wait([f1])
                if data['RDKit']=='true': 
                    concurrent.futures.wait([f2])
            email = EmailMessage('MolOpt-Update', 'Your run finished you can download the result through the tasks section',
                                'noreplymolopt@gmail.com', [data['email']])
            email.send()
            zip_file_path = os.path.join(fs.location, f'Result{rId}.zip')
            featureBind(rId)
            with zipfile.ZipFile(zip_file_path, 'w', zipfile.ZIP_DEFLATED) as result:
                if os.path.exists(os.path.join(fs.location,f'FeaturesExtracted{rId}.csv')):
                    result.write(fs.path(f'FeaturesExtracted{rId}.csv'), arcname=os.path.basename(f'FeaturesExtracted{rId}.csv'))
            run.status = 'finished'
            run.result = zip_file_path
            run.save()
            Clear_media()
        else:
            with concurrent.futures.ThreadPoolExecutor(max_workers=2) as ex:
                if data['Mordred']=='true':
                    f1=ex.submit(Mordred_Features_Script.make_it_run,f'aligned{rId}.sdf', rId,True)
                if data['RDKit']=='true':
                    f2=ex.submit(RDKit_Features_Script.make_it_run,f'aligned{rId}.sdf', rId,True)
                if data['Mordred']=='true':
                    concurrent.futures.wait([f1])
                if data['RDKit']=='true': 
                    concurrent.futures.wait([f2])
    except:
        failed_run(rId)

class UserRunFeatureExtractionApiView(APIView):
    def post(self, request):
        my_run = UserAlgoritmRun()
        my_run.user_email = request.data['email']
        my_run.status = 'running'
        my_run.algorithm_name = 'Feature Extraction'
        my_run.save()
        try:
            fs.save('mol' + str(my_run.id), request.data['mol'])
            executor.submit(runFeature, my_run.id, request.data)
            return Response(status=status.HTTP_200_OK)
        except:
            my_run.status = 'failed'
            my_run.save()
            Clear_media()
            return Response(status=status.HTTP_400_BAD_REQUEST)
def runXG(rId,data):
    print(data)
    if data['xgboost_isAuto']=='false':
        try:
            XG_Man.make_it_rain(f'learning{rId}',f'prediction{rId}', data['xgboost_features'], float(data['xgboost_learningRate']),
                                            float(data['xgboost_maxDepth']), float(data['xgboost_lambda']), float(data['xgboost_alpha']), float(data['xgboost_dropRate']), rId)
        except Exception as e:
            print(e)
        # Prediction_Script.make_it_rain(f'prediction{rId}', data['xgboost_features'], rId)
    else:
        XG_Exp.make_it_rain(f'learning{rId}',f'prediction{rId}', int(data['xgboost_numberOfFeatures']), rId)
        # ExpertMode_Two.make_it_rain(f'learning{rId}' , int(data['xgboost_numberOfFeatures']), rId)
        # ExpertMode_Prediction_Script.make_it_rain(f'prediction{rId}', int(data['xgboost_numberOfFeatures']), rId)
def runLasso(rId,data):
    if data['lasso_isAuto']=='false':
        Lasso_Man.make_it_rain(f'learning{rId}',f'prediction{rId}', data['lasso_autoFeatures'], float(data['lasso_alphaValue']), rId)
        # Lasso_Regression_Manual_Prediction.make_it_rain('prediction', data['lasso_features'], rId)
    else:
        Lasso_Exp.make_it_rain(f'learning{rId}', f'prediction{rId}', int(data['lasso_autoNumberOfFeatures']),rId)
        # Lasso_Regression_N2.make_it_rain(f'learning{rId}', int(data['lasso_autoNumberOfFeatures']), rId)
        # Lasso_Regression_Prediction_Script.make_it_rain(f'prediction{rId}', int(data['lasso_autoNumberOfFeatures']), rId)
def runDTR(rId,data):
    if data['dtr_isAuto']=='false':
        try:
            DTR_Man.make_it_rain(f'learning{rId}',f'prediction{rId}', data['dtr_autoFeatures'], int(data['dtr_maxDepth']),
                                                    int(data['dtr_minSample']), int(data['dtr_minSampleLeaf']),
                                                    float(data['dtr_minWeightFraction']), rId)
        except Exception as e:
            print(e)
        # DecisionTreeRegressor_Manual_Prediction.make_it_rain(f'prediction{rId}', data['dtr_autoFeatures'], rId)
    else:
        DTR_Exp.make_it_rain(f'learning{rId}',f'prediction{rId}', int(data['dtr_autoNumberOfFeatures']), rId)
        # Decision_Tree_Improved_2.make_it_rain(f'learning{rId}', int(data['dtr_autoNumberOfFeatures']), rId)
        # Decision_Tree_Prediction_Script.make_it_rain(f'prediction{rId}', int(data['dtr_autoNumberOfFeatures']), rId)

def runAlgos(rId, data):
    try:
        with concurrent.futures.ThreadPoolExecutor(max_workers=3) as ex:
            res = []
            if data['xgboost_isXGBoost']=='true':
                res.append(f'Predicted_Results_XG{rId}.csv')
                f1=ex.submit(runXG,rId,data)
            if data['lasso_isLasso']=='true':
                res.append(f'Predicted_Results_Lasso{rId}.csv')
                f2=ex.submit(runLasso,rId,data)
            if data['dtr_isDTR']=='true':
                res.append(f'Predicted_Results_dtr{rId}.csv')
                f3=ex.submit(runDTR,rId,data)
        if data['xgboost_isXGBoost']=='true':
            concurrent.futures.wait([f1])
        if data['lasso_isLasso']=='true':
            concurrent.futures.wait([f2])
        if data['dtr_isDTR']=='true':
            concurrent.futures.wait([f3])
        email = EmailMessage('MolOpt-Update', 'Your run finished you can download the result through the tasks section',
                                'noreplymolopt@gmail.com',[data['email']])
        email.send()
        run = UserAlgoritmRun.objects.get(id=rId)
        zip_file_path = os.path.join(fs.location, f'Result{rId}.zip')
        with zipfile.ZipFile(zip_file_path, 'w', zipfile.ZIP_DEFLATED) as result:
                for f in res:
                    if os.path.exists(os.path.join(fs.location,f)):
                        result.write(fs.path(f), arcname=os.path.basename(f))
        run.status = 'finished'
        run.result = zip_file_path
        run.save()
    except:
        failed_run(rId)
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
            fs.save('learning' + str(my_run.id), request.data['learning'])
            fs.save('prediction' + str(my_run.id), request.data['prediction'])
            executor.submit(runAlgos, my_run.id, request.data)
            return Response(status=status.HTTP_200_OK)
        except Exception as e:
            my_run.status = 'failed'
            my_run.save()
            Clear_media()
            return Response(status=status.HTTP_400_BAD_REQUEST)


def runAutoProcess(rId, data):
    runMCS(rId,data)
    runFeature(rId, data)
    cleanCSV(rId)
    runAlgos(rId, data)


class UserRunAutoProcessApiView(APIView):
    def post(self, request):
        my_run = UserAlgoritmRun()
        my_run.user_email = request.data['email']
        my_run.status = 'running'
        my_run.algorithm_name = 'Auto Process'
        my_run.save()
        try:
            fs.save('ref'+str(my_run.id), request.data['ref'])
            fs.save('ligand'+str(my_run.id), request.data['ligand'])
            fs.save('learning'+str(my_run.id),request.data['learning'])
            executor.submit(runAutoProcess, my_run.id, request.data)
            return Response(status=status.HTTP_200_OK)
        except Exception as e:
            my_run.status = 'failed'
            my_run.save()
            Clear_media()
            return Response(status=status.HTTP_400_BAD_REQUEST)
def cleanCSV(id):
    try:
        if fs.exists(f'FeaturesExtracted_MORDRED{id}.csv'):
            df = pd.read_csv(f'FeaturesExtracted_MORDRED{id}.csv')
            if fs.exists(f'FeaturesExtracted_RDKIT{id}.csv'):
                df.append(pd.read_csv(f'FeaturesExtracted_RDKIT{id}.csv'))
        else:
            df = pd.read_csv(f'FeaturesExtracted_RDKIT{id}.csv')
        for col in df.columns:
            try:
                pd.to_numeric(df[col])
            except ValueError:
                df = df.drop(col, axis=1)
        df.to_csv(f'prediction{id}', index=False)
    except:
        failed_run(id)

def featureBind(id):
    try:
        if fs.exists(f'FeaturesExtracted_MORDRED{id}.csv'):
            df = pd.read_csv(f'FeaturesExtracted_MORDRED{id}.csv')
            if fs.exists(f'FeaturesExtracted_RDKIT{id}.csv'):
                df.append(pd.read_csv(f'FeaturesExtracted_RDKIT{id}.csv'))
        else:
            df = pd.read_csv(f'FeaturesExtracted_RDKIT{id}.csv')
        for col in df.columns:
            try:
                pd.to_numeric(df[col])
            except ValueError:
                df = df.drop(col, axis=1)
        df.to_csv(f'FeaturesExtracted{id}.csv', index=False)
    except:
        failed_run(id)

class UserGetUserRunsApiView(APIView):
    def post(self,request):
        runs=UserAlgoritmRun.objects.filter(user_email=request.data['email'])
        serializer = UserAlgoritmRunSerializer(runs, many=True)
        return Response(serializer.data)


class UserGetAllRunsApiView(APIView):
    def post(self,request):
        runs=UserAlgoritmRun.objects.all()
        serializer = UserAlgoritmRunSerializer(runs, many=True)
        return Response(serializer.data)
    

class UserRemoveRunApiView(APIView):
    def post(self,request):
        try:
            run=UserAlgoritmRun.objects.get(id=request.data['id'])
            run.delete()
            return Response(status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class UserDownloadResultApiView(APIView):
    def post(self, request):
        rId = request.data['id']
        run = UserAlgoritmRun.objects.get(id=rId)
        # Test the integrity of the generated ZIP file
        with zipfile.ZipFile(run.result, 'r') as zip_obj:
            if zip_obj.testzip() is not None:
                # The ZIP file is invalid or incomplete
                return HttpResponseServerError('Generated ZIP file is invalid')

        # If the ZIP file is valid, create a response object to download it
        with open(run.result, 'rb') as f:
            response = HttpResponse(f, content_type='application/zip')
            response['Content-Disposition'] = f'attachment; filename=test.zip'
            return response


class UserRemoveRunApiView(APIView):
    def post(self, request):
        try:
            run = UserAlgoritmRun.objects.get(id=request.data['id'])
            run.delete()
            return Response(status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)
