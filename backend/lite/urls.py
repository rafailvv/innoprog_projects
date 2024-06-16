from django. urls import path
from .views import *

urlpatterns = [
    path('registration/', registration_view, name='registration'),
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),
    path('profile/', profile_view, name='profile'),
    path('edit/', edit_view, name='edit'),
    #path('change_password/', change_password_view, name='change_password'),
]

