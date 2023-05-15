from django.urls import path, include
from django.contrib.auth import views as auth_views
from rest_framework.routers import DefaultRouter
from api import views

router = DefaultRouter()

router.register('users', views.UserProfileViewSet)
router.register('runs', views.UserRunsViewSet) 

urlpatterns = [
    ### USERS MANAGEMENT
    path('login/',                          views.UserLoginApiView.as_view(),                       name="login"), 
    path('logout/',                         views.UserLogoutApiView.as_view(),                      name="logout"),
    path('contact-admin/',                  views.ContactAdmin.as_view(),                           name="contact_admin"), 
    path('create_admin/',                   views.CreateSystemAdminApiView.as_view(),               name="create_admin"),          
    path('remove_admin/',                   views.RemoveSystemAdminApiView.as_view(),               name="remove_admin"),          
    path('delete_user/',                    views.DeleteUserFromSystem.as_view(),                   name="delete_user"),              
    path('remove_run/',                     views.UserRemoveRunApiView.as_view(),                   name="remove_run"),  
    path('update_user_info/',               views.UpdateUserView.as_view(),                         name="update_user"),  
    
    ### DATA GETTERS
    path('get_user/',                       views.getUser.as_view(),                                name="get_user"),                           
    path('get_all_users/',                  views.getAllUsers.as_view(),                            name="get_all_users"),                       
    path('get_all_runs/',                   views.UserGetAllRunsApiView.as_view(),                  name="get_all_runs"),
    path('get_user_runs/',                  views.UserGetUserRunsApiView.as_view(),                 name="get_user_runs"),
    path('check_permissions/',              views.CheckPermissions.as_view(),                       name="check_permission"),                  

    ### ALGORITHMS
    path('run_alignment/',                  views.UserRunAlignmentApiView.as_view(),                name="align_alg"),           
    path('run_feature/',                    views.UserRunFeatureExtractionApiView.as_view(),        name="fe_alg"),
    path('run_ML_algorithms/',              views.UserRunMLAlgorithmsApiView.as_view(),             name="ml_alg"),        
    path('run_auto_process/',               views.UserRunAutoProcessApiView.as_view(),              name="auto_alg"),
    path('download_result/',                views.UserDownloadResultApiView.as_view(),              name="download_result"),

    ### RESET PASSWORDS:
    path('reset_password/',                 views.ForgotPasswordView.as_view(),                     name="reset-password"),
    path('reset_password_confirm/',         views.ResetPasswordConfirmView.as_view(),               name="reset-password-confirm"),
    
    path('', include(router.urls))
]