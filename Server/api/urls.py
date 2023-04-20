from django.urls import path, include
from django.contrib.auth import views as auth_views

from rest_framework.routers import DefaultRouter
from api import views


router = DefaultRouter()
# /api/users - shows all users
# /api/users/user_id - shows user
# /api/runs - shows all runs
# /api/users/user_id - shows user's runs
router.register('users', views.UserProfileViewSet)
router.register('runs', views.UserRunsViewSet) 


urlpatterns = [
    ### post:
    # path('users/',                      views.UserProfileViewSet),                           # body of the api is all the new user birthdate, phone, country, languages, gender.
    path('get_user/',                   views.getUser.as_view()),                           # body of the api is all the new user birthdate, phone, country, languages, gender.
    path('get_all_users/',              views.getAllUsers.as_view()),                       # body of the api is all the new user birthdate, phone, country, languages, gender.
    path('check_permissions/',          views.CheckPermissions.as_view()),                  # body of the api is all the new user birthdate, phone, country, languages, gender.
    path('create_admin/',               views.CreateSystemAdminApiView.as_view()),          # body of the api is all the new user birthdate, phone, country, languages, gender.
    path('remove_admin/',               views.RemoveSystemAdminApiView.as_view()),          # body of the api is all the new user birthdate, phone, country, languages, gender.
    path('delete_user/',                views.DeleteUserFromSystem.as_view()),              # body of the api is all the new user birthdate, phone, country, languages, gender.
    path('run_alignment/',              views.UserRunAlignmentApiView.as_view()),           # body of the api is 2 files
    path('run_Mordred/',                views.UserRunMordredApiView.as_view()),             # body of the api is 1 file and list of packages to run
    path('run_RDKit/',                  views.UserRunRDKitApiView.as_view()),               # body of the api is 1 file and list of packages to run
    path('run_ML_algorithms/',          views.UserRunMLAlgorithmsApiView.as_view()),        # body of the api is 1 file and list of dictionaries (dict foreach alg)
    
    ### get:
    # path('tasks/',                    views.TasksApiView.as_view()),
    # path('users/',                    views.UsersApiView.as_view()),
    # path('admin_inbox/',              views.AdminInboxApiView.as_view()),
    
    
    ### RESET PASSWORDS:
    path('reset_password/',             auth_views.PasswordResetView.as_view(),            name="reset_password"),               # reset_password
    path('reset_password_sent/',        auth_views.PasswordResetDoneView.as_view(),        name="password_reset_done"),          # reset_password
    path('reset/<uidb64>/<token>/',     auth_views.PasswordResetConfirmView.as_view(),     name="password_reset_confirm"),       # reset_password
    path('reset_password_complete/',    auth_views.PasswordResetConfirmView.as_view(),     name="password_reset_complete"),      # reset_password
    
    
    
    path('contact-admin/', views.ContactAdmin.as_view()), # body of the api is the user email and password
    path('login/', views.UserLoginApiView.as_view()), # body of the api is the user email and password
    path('logout/', views.UserLogoutApiView.as_view()),
    path('', include(router.urls))
]