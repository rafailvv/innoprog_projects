from django. urls import path
from .views import *

urlpatterns = [
    path('registration/', registration_view, name='registration'),
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),
    path('profile/', profile_view, name='profile'),
    path('edit/', edit_view, name='edit'),

    path("project/all/", projects_view, name='projects'), #выдавать список всех проектов (GET)
    path("project/add/", add_project_view, name='add'), #добавлять проект (POST)
    #path('change_password/', change_password_view, name='change_password'),
    path("login/tg/", login_tg_view, name='login'),
    path("project/<int:id>/", project_view, name='project'),
    path("checkpoint/<int:id>/", checkpoint_view, name='checkpoint'),
    path("submission/<int:id>", submission_view, name='submission'),
    path("feedback/<int:id>", feedback_view, name='feedback'),
    path("project/user/", projects_list_view, name='projects_list'),
    path("company/<int:id>", company_view, name='company'),
    path("company/",all_company_view, name='all_company'),
]

