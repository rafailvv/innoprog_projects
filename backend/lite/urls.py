from django.urls import path
from .views import *

urlpatterns = [
    path('registration/', registration_view, name='registration'),
    path('login/', login_view, name='login'),
    path("login/tg/", login_tg_view, name='login'),
    path('logout/', logout_view, name='logout'),
    path('profile/', profile_view, name='profile'),
    path('edit/', edit_view, name='edit'),
    path('edit/password/', edit_password, name='edit_password'),

    path("company/<int:id>/", company_view, name='company'),
    path("company/", all_company_view, name='all_company'),

    path("project/all/", projects_view, name='projects'),
    path("project/add/", add_project_view, name='add'),
    path("project/<int:id>/", project_view, name='project'),
    path("project/hot/", projects_hot_view, name='projects_hot'),
    path("project/in-progress/", projects_in_progress_view, name='projects_in_progress'),
    path("project/done/", projects_done_view, name='projects_done'),

    path("checkpoint/<int:project_id>/", checkpoint_project_view, name='checkpoint_project'),
    path("checkpoint/<int:id>/", checkpoint_view, name='checkpoint'),

    path("submission/<int:id>/", submission_view, name='submission'),
    path("submission/close/<int:id>/", close_submission_view, name='submission_close'),
    path("submission/open/<int:id>/", open_submission_view, name='submission_open'),
    path("submission/accept/<int:id>/", accept_submission_view, name='submission_accept'),

    path("feedback/like/<int:id>/", like_feedback_view, name='like_feedback'),
    path("feedback/dislike/<int:id>/", dislike_feedback_view, name='dislike_feedback'),
    path("feedback/<int:id>/", feedback_view, name='feedback'),
]
