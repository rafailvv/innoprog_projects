import json
import base64
from django.http import JsonResponse
from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import api_view
from django.forms.models import model_to_dict
from rest_framework.response import Response

from .models import User

def encode_password(password):
    encoded_bytes = base64.b64encode(password.encode('utf-8'))
    encoded_password = encoded_bytes.decode('utf-8')
    return encoded_password

def decode_password(encoded_password):
    decoded_bytes = base64.b64decode(encoded_password.encode('utf-8'))
    decoded_password = decoded_bytes.decode('utf-8')
    return decoded_password

# Create your views here.
@api_view (["POST"])
def registration_view(request):
    if request.method == "POST":
        data = request.data
        if User.objects.filter(email=data['email']).exists() or \
                User.objects.filter(username=data['username']).exists() or \
                User.objects.filter(telegram_username=data['username']).exists() or \
                User.objects.filter(phone=data['phone']).exists():
            return JsonResponse ({'error': 'Такой пользователь уже зарегестрирован'}, status=status.HTTP_400_BAD_REQUEST)
        user = User(
            username=data['username'],
            password=encode_password(data['password']),
            email=data['email'],
            first_name=data['first_name'],
            last_name=data['last_name'],
            phone=data['phone'],
            github=data['github'],
            telegram_username=data['telegram']
        )

        user.save()
        return JsonResponse(model_to_dict(user), status=status.HTTP_201_CREATED)

@api_view(["POST"])
def login_view(request):
    if request.method == "POST":
        data = request.data
        if User.objects.filter(username=data['username']).exists():
            user = User.objects.get(username=data['username'])
            if decode_password(user.password) == data['password']:
                request.session["user_id"] = user.id
                return JsonResponse(model_to_dict(user), status=status.HTTP_200_OK)
            else:
                return JsonResponse({'error': 'Неверный пароль'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return JsonResponse({'error': 'Такого пользователя не существует'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(["POST"])
def logout_view(request):
    if request.method == "POST":
        del request.session["user_id"]
        return Response(status=status.HTTP_200_OK)

@api_view(["GET"])
def profile_view(request):
    if request.method == "GET":
        if "user_id" in request.session:
            user = User.objects.get(id=request.session["user_id"])
            return JsonResponse(model_to_dict(user), status=status.HTTP_200_OK)
        else:
            return JsonResponse({'error': 'Пользователь не авторизован'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(["POST"])
def edit_view(request):
    if request.method == 'POST':
        if "user_id" in request.session:
            user = User.objects.get(id=request.session["user_id"])
            data = json.loads(request.body)
            user.first_name = data['first_name']
            user.last_name = data['last_name']
            user.email = data['email']
            user.phone = data['phone']
            user.github = data['github']
            user.telegram_username = data['telegram']
            user.save()
            return JsonResponse(model_to_dict(user), status=status.HTTP_200_OK)
        else:
            return JsonResponse({'error': 'Пользователь не авторизован'}, status=status.HTTP_400_BAD_REQUEST)
