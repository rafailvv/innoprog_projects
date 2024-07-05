import datetime
import json
import base64
from django.http import JsonResponse
from django.shortcuts import render
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.decorators import api_view
from django.forms.models import model_to_dict
from rest_framework.response import Response
from .models import User, Project, Checkpoint, Submission, Feedback
from .serializers import ProjectsSerializer, UserSerializer, LoginSerializer, UserTgSerializer, CheckpointSerializer, \
    CheckpointRequestSerializer, SubmissionSerializer, SubmissionRequestSerializer, FeedbackSerializer, \
    FeedbackRequestSerializer


def encode_password(password):
    encoded_bytes = base64.b64encode(password.encode('utf-8'))
    encoded_password = encoded_bytes.decode('utf-8')
    return encoded_password


def decode_password(encoded_password):
    decoded_bytes = base64.b64decode(encoded_password.encode('utf-8'))
    decoded_password = decoded_bytes.decode('utf-8')
    return decoded_password


@swagger_auto_schema(
    operation_summary="Регистрация пользователя",
    request_body=UserSerializer,
    method='POST',
    responses={
        status.HTTP_201_CREATED: UserSerializer,
        status.HTTP_400_BAD_REQUEST: 'Bad request'
    }
)  # Create your views here.
@api_view(["POST"])
def registration_view(request):
    if request.method == "POST":
        data = request.data
        if User.objects.filter(email=data['email']).exists() or \
                User.objects.filter(username=data['username']).exists() or \
                User.objects.filter(telegram_username=data['username']).exists() or \
                User.objects.filter(phone=data['phone']).exists():
            return JsonResponse({'error': 'Такой пользователь уже зарегестрирован'}, status=status.HTTP_400_BAD_REQUEST)
        user = User(
            username=data['username'],
            password=encode_password(data['password']),
            email=data['email'],
            first_name=data['first_name'],
            last_name=data['last_name'],
            phone=data['phone'],
            github=data['github'],
            telegram_username=data['telegram_username']
        )

        user.save()
        return JsonResponse(model_to_dict(user), status=status.HTTP_201_CREATED)


@swagger_auto_schema(
    operation_summary="Вход в аккаунт",
    request_body=LoginSerializer,
    method='POST',
    responses={
        status.HTTP_201_CREATED: UserSerializer,
        status.HTTP_400_BAD_REQUEST: 'Bad request'
    }
)
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


@swagger_auto_schema(
    operation_summary="Выход из аккаунта",
    method='POST',
    responses={
        status.HTTP_200_OK: UserSerializer,
        status.HTTP_400_BAD_REQUEST: 'Bad request'
    }
)
@api_view(["POST"])
def logout_view(request):
    if request.method == "POST":
        del request.session["user_id"]
        return Response(status=status.HTTP_200_OK)


@swagger_auto_schema(
    operation_summary="Просмотр профиля пользователя",
    method='GET',
    responses={
        status.HTTP_201_CREATED: UserSerializer,
        status.HTTP_400_BAD_REQUEST: 'Bad request'
    }
)
@api_view(["GET"])
def profile_view(request):
    if request.method == "GET":
        if "user_id" in request.session:
            user = User.objects.get(id=request.session["user_id"])
            return JsonResponse(model_to_dict(user), status=status.HTTP_200_OK)
        else:
            return JsonResponse({'error': 'Пользователь не авторизован'}, status=status.HTTP_400_BAD_REQUEST)


@swagger_auto_schema(
    operation_summary="Редактирование данных пользователя",
    request_body=UserSerializer,
    method='POST',
    responses={
        status.HTTP_201_CREATED: UserSerializer,
        status.HTTP_400_BAD_REQUEST: 'Bad request'
    }
)
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
            user.telegram_username = data['telegram_user_name']
            user.save()
            return JsonResponse(model_to_dict(user), status=status.HTTP_200_OK)
        else:
            return JsonResponse({'error': 'Пользователь не авторизован'}, status=status.HTTP_400_BAD_REQUEST)


@swagger_auto_schema(
    operation_summary="Просмотр инфо о проекте",
    method='GET',
    responses={
        status.HTTP_200_OK: ProjectsSerializer,
        status.HTTP_400_BAD_REQUEST: 'Bad request'
    }
)
@api_view(["GET"])
def projects_view(request):
    if request.method == "GET":
        project = Project.objects.all()
        serializer = ProjectsSerializer(project, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


@swagger_auto_schema(
    operation_summary="Создание проекта",
    request_body=ProjectsSerializer,
    method='POST',
    responses={
        status.HTTP_201_CREATED: UserSerializer,
        status.HTTP_400_BAD_REQUEST: 'Bad request'
    }
)
@api_view(['POST'])
def add_project_view(request):
    if request.method == 'POST':
        serializer = ProjectsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@swagger_auto_schema(
    operation_summary="Вход через телеграмм",
    request_body=UserTgSerializer,
    method='POST',
    responses={
        status.HTTP_201_CREATED: UserSerializer,
        status.HTTP_400_BAD_REQUEST: 'Bad request'
    }
)
@api_view(['POST'])
def login_tg_view(request):
    if request.method == "POST":
        data = request.data
        if User.objects.filter(telegram_id=data['telegram_id']).exists():
            user = User.objects.get(telegram_id=data['telegram_id'])
            request.session["user_id"] = user.id
            return JsonResponse(model_to_dict(user), status=status.HTTP_200_OK)
        else:
            return JsonResponse({'error': 'Такого пользователя не существует'}, status=status.HTTP_400_BAD_REQUEST)


@swagger_auto_schema(
    operation_summary="Просмотр проекта по id",
    method='GET',
    manual_parameters=[openapi.Parameter('id', openapi.IN_PATH, description="id проекта", type=openapi.TYPE_INTEGER)],
    responses={
        status.HTTP_200_OK: ProjectsSerializer,
        status.HTTP_400_BAD_REQUEST: 'Bad request'
    }
)
@api_view(['GET'])
def project_view(request, id):
    if request.method == "GET":
        try:
            project = Project.objects.get(pk=id)
            serializer = ProjectsSerializer(project)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Project.DoesNotExist:
            return JsonResponse({'error': 'Проект не найден'}, status=status.HTTP_400_BAD_REQUEST)


@swagger_auto_schema(
    operation_summary="Создание чекпоинта к проекту",
    request_body=CheckpointRequestSerializer,
    method='POST',
    manual_parameters=[
        openapi.Parameter("id", openapi.IN_PATH, description="id проекта", type=openapi.TYPE_INTEGER)],
    responses={
        status.HTTP_201_CREATED: CheckpointSerializer,
        status.HTTP_400_BAD_REQUEST: 'Bad request'
    }
)
@swagger_auto_schema(
    operation_summary="Просмотр чекпоинта к проекту",
    method='GET',
    manual_parameters=[
        openapi.Parameter("id", openapi.IN_PATH, description="id проекта", type=openapi.TYPE_INTEGER)],
    responses={
        status.HTTP_200_OK: CheckpointSerializer,
        status.HTTP_400_BAD_REQUEST: 'Bad request'
    }
)
@swagger_auto_schema(
    operation_summary="Удаление чекпоинта по id",
    method='DELETE',
    manual_parameters=[
        openapi.Parameter("id", openapi.IN_PATH, description="id Checkpoint", type=openapi.TYPE_INTEGER)],
    responses={
        status.HTTP_204_NO_CONTENT: "no content",
        status.HTTP_400_BAD_REQUEST: 'Bad request'
    }
)
@api_view(['GET', 'POST', 'DELETE'])
def checkpoint_view(request, id):
    if request.method == "POST":
        try:
            project = Project.objects.get(pk=id)
            request.data['project'] = project.id
            serializer = CheckpointSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Project.DoesNotExist:
            return JsonResponse({'error': 'Проект не найден'}, status=status.HTTP_400_BAD_REQUEST)
    if request.method == "GET":
        try:
            project = Project.objects.get(pk=id)
            checkpoints = Checkpoint.objects.filter(project=project).all()
            serializer = CheckpointSerializer(checkpoints, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Project.DoesNotExist:
            return JsonResponse({'error': 'Проект не найден'}, status=status.HTTP_400_BAD_REQUEST)
    if request.method == "DELETE":
        try:
            checkpoint = Checkpoint.objects.get(pk=id)
            checkpoint.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Checkpoint.DoesNotExist:
            return JsonResponse({'error': 'Чекпоинт не найден'}, status=status.HTTP_400_BAD_REQUEST)


@swagger_auto_schema(
    operation_summary="Создание решения для чекпоинта",
    request_body=SubmissionRequestSerializer,
    method='POST',
    manual_parameters=[
        openapi.Parameter("id", openapi.IN_PATH, description="id checkpoint", type=openapi.TYPE_INTEGER)],
    responses={
        status.HTTP_201_CREATED: SubmissionSerializer,
        status.HTTP_400_BAD_REQUEST: 'Bad request'
    }
)
@swagger_auto_schema(
    operation_summary="Просмотр решения для чекпоинта",
    method='GET',
    manual_parameters=[
        openapi.Parameter("id", openapi.IN_PATH, description="id checkpoint", type=openapi.TYPE_INTEGER)],
    responses={
        status.HTTP_200_OK: SubmissionSerializer,
        status.HTTP_400_BAD_REQUEST: 'Bad request'
    }
)
@swagger_auto_schema(
    operation_summary="Удаление решения по id",
    method='DELETE',
    manual_parameters=[
        openapi.Parameter("id", openapi.IN_PATH, description="id решения", type=openapi.TYPE_INTEGER)],
    responses={
        status.HTTP_204_NO_CONTENT: "no content",
        status.HTTP_400_BAD_REQUEST: 'Bad request'}
)
@swagger_auto_schema(
    operation_summary="Обновление решения по id",
    request_body=SubmissionRequestSerializer,
    method='PUT',
    manual_parameters=[
        openapi.Parameter("id", openapi.IN_PATH, description="id решения", type=openapi.TYPE_INTEGER)],
    responses={
        status.HTTP_200_OK: SubmissionSerializer,
        status.HTTP_400_BAD_REQUEST: 'Bad request'}
)
@api_view(['GET', 'POST', 'DELETE','PUT'])
def submission_view(request, id):
    try:
        user = User.objects.get(id=request.session["user_id"])
    except User.DoesNotExist:
        return JsonResponse({'error': 'Пользователь не авторизован'}, status=status.HTTP_400_BAD_REQUEST)
    if request.method == 'POST':
        try:
            checkpoint = Checkpoint.objects.get(pk=id)
            request.data['checkpoint'] = checkpoint.id
            request.data["user"] = user.id
            request.data["date_time"] = datetime.datetime.now()
            serializer = SubmissionSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Checkpoint.DoesNotExist:
            return JsonResponse({'error': 'Чекпоинт не найден'}, status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'GET':
        try:
            checkpoint = Checkpoint.objects.get(pk=id)
            submissions = Submission.objects.filter(checkpoint=checkpoint).filter(user=user).all()
            serializer = SubmissionSerializer(submissions, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Checkpoint.DoesNotExist:
            return JsonResponse({'error': 'Чекпоинт не найден'}, status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'DELETE':
        try:
            submission = Submission.objects.get(pk=id)
            submission.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Submission.DoesNotExist:
            return JsonResponse({'error': 'Запись не найдена'}, status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'PUT':
        try:
            submission = Submission.objects.get(pk=id)
            request.data['user'] = user.id
            serializer = SubmissionSerializer(submission, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Submission.DoesNotExist:
            return JsonResponse({'error': 'Запись не найдена'}, status=status.HTTP_400_BAD_REQUEST)

@swagger_auto_schema(
    operation_summary="Добавление комментария",
    request_body=FeedbackRequestSerializer,
    method='POST',
    manual_parameters=[
        openapi.Parameter("id", openapi.IN_PATH, description="id решения", type=openapi.TYPE_INTEGER)],
    responses={
        status.HTTP_201_CREATED: FeedbackSerializer,
        status.HTTP_400_BAD_REQUEST: 'Bad request'
    }
)
@swagger_auto_schema(
    operation_summary="Просмотр всех комментариев к решению",
    method='GET',
    manual_parameters=[
        openapi.Parameter("id", openapi.IN_PATH, description="id решения", type=openapi.TYPE_INTEGER)],
    responses={
        status.HTTP_200_OK: FeedbackSerializer,
        status.HTTP_400_BAD_REQUEST: 'Bad request'
    }
)
@swagger_auto_schema(
    operation_summary="Удаление комметария",
    method='DELETE',
    manual_parameters=[
        openapi.Parameter("id", openapi.IN_PATH, description="id комментария", type=openapi.TYPE_INTEGER)],
    responses={
        status.HTTP_204_NO_CONTENT: "no content",
        status.HTTP_400_BAD_REQUEST: 'Bad request'}
)
@swagger_auto_schema(
    operation_summary="Редактирование комментария",
    request_body=FeedbackRequestSerializer,
    method='PUT',
    manual_parameters=[
        openapi.Parameter("id", openapi.IN_PATH, description="id комментария", type=openapi.TYPE_INTEGER)],
    responses={
        status.HTTP_200_OK: FeedbackSerializer,
        status.HTTP_400_BAD_REQUEST: 'Bad request'}
)

@api_view(['GET', 'POST', 'DELETE','PUT'])
def feedback_view(request, id):
    try:
        user = User.objects.get(id=request.session["user_id"])
    except User.DoesNotExist:
        return JsonResponse({'error': 'Пользователь не авторизован'}, status=status.HTTP_400_BAD_REQUEST)
    if request.method == 'POST':
        try:
            submission = Submission.objects.get(pk=id)
            request.data['submission'] = submission.id
            request.data["user"] = user.id
            request.data["date_time"] = datetime.datetime.now()
            serializer = FeedbackSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Project.DoesNotExist:
            return JsonResponse({'error': 'Проект не найден'}, status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'GET':
        try:
            submission = Submission.objects.get(pk=id)
            feedbacks = Feedback.objects.filter(submission=submission).order_by("-date_time").all()
            serializer = FeedbackSerializer(feedbacks, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Submission.DoesNotExist:
            return JsonResponse({'error': 'Запись не найдена'}, status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'PUT':
        try:
            feedback = Feedback.objects.get(pk=id)
            request.data['user'] = user.id
            serializer = FeedbackSerializer(feedback, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Feedback.DoesNotExist:
            return JsonResponse({'error': 'Отзыв не найден'}, status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'DELETE':
        try:
            feedback = Feedback.objects.get(pk=id)
            feedback.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Feedback.DoesNotExist:
            return JsonResponse({'error': 'Отзыв не найден'}, status=status.HTTP_400_BAD_REQUEST)