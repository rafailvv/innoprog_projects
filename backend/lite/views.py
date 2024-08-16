import datetime

from django.contrib.auth import authenticate
from django.core.exceptions import ValidationError
from django.http import JsonResponse
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from .models import User, Project, Checkpoint, Submission, Feedback, Company
from .serializers import ProjectSerializer, UserSerializer, LoginSerializer, UserTgSerializer, CheckpointSerializer, \
    CheckpointRequestSerializer, SubmissionSerializer, FeedbackSerializer, \
    FeedbackRequestSerializer, CompanySerializer, UserUpdateSerializer, UserUpdatePasswordSerializer, ValueSerializer, \
    UserOtherSubmissionsSerializer

from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated


@swagger_auto_schema(
    operation_summary="Регистрация пользователя",
    request_body=UserSerializer,
    method='POST',
    responses={
        status.HTTP_201_CREATED: UserSerializer,
        status.HTTP_400_BAD_REQUEST: 'Bad request'
    }
)
@api_view(["POST"])
def registration_view(request):
    if request.method == "POST":
        serializer = UserSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()
            return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@swagger_auto_schema(
    operation_summary="Вход в аккаунт",
    request_body=LoginSerializer,
    method='POST',
    responses={
        status.HTTP_200_OK: openapi.Response(
            description="Token",
            examples={
                'application/json': {
                    'refresh': 'jwt-refresh-token',
                    'access': 'jwt-access-token'
                }
            }
        ),
        status.HTTP_400_BAD_REQUEST: 'Bad request'
    }
)
@api_view(["POST"])
def login_view(request):
    if request.method == "POST":
        serializer = LoginSerializer(data=request.data)

        if serializer.is_valid():
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']

            # Аутентификация пользователя
            user = authenticate(username=username, password=password)

            if user is not None:
                # Генерация токенов
                refresh = RefreshToken.for_user(user)
                return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Неверный логин или пароль'}, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@swagger_auto_schema(
    operation_summary="Обновление доступа пользователю",
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'refresh': openapi.Schema(type=openapi.TYPE_STRING, description='JWT refresh token'),
        },
        required=['refresh']
    ),
    method='POST',
    responses={
        status.HTTP_200_OK: openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'access': openapi.Schema(type=openapi.TYPE_STRING, description='JWT access token')
            }
        ),
        status.HTTP_400_BAD_REQUEST: openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'detail': openapi.Schema(type=openapi.TYPE_STRING, description='Сообщение об ошибке')
            }
        ),
    },
)
@api_view(["POST"])
def refresh_view(request):
    try:
        refresh_token = RefreshToken(request.data['refresh'])
        access_token = refresh_token.access_token
        return Response({'access': str(access_token)}, status=status.HTTP_200_OK)
    except KeyError:
        return Response({'detail': 'Refresh token обязателен'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'detail': 'Неверный refresh token'}, status=status.HTTP_400_BAD_REQUEST)


@swagger_auto_schema(
    operation_summary="Выход из аккаунта",
    method='POST',
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'refresh': openapi.Schema(type=openapi.TYPE_STRING, description='JWT refresh token'),
        },
        required=['refresh']
    ),
    responses={
        status.HTTP_200_OK: openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'detail': openapi.Schema(type=openapi.TYPE_STRING, description='Вышли из аккаунта')
            }
        ),
        status.HTTP_400_BAD_REQUEST: openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'detail': openapi.Schema(type=openapi.TYPE_STRING, description='Сообщение об ошибке')
            }
        )
    }
)
@api_view(["POST"])
def logout_view(request):
    try:
        token = RefreshToken(request.data['refresh'])
        token.blacklist()
        return Response({'detail': 'Вышли из аккаунта'}, status=status.HTTP_200_OK)
    except KeyError:
        return Response({'detail': 'Refresh token обязателен'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'detail': 'Неверный refresh token'}, status=status.HTTP_400_BAD_REQUEST)


@swagger_auto_schema(
    operation_summary="Просмотр профиля пользователя",
    method='GET',
    responses={
        status.HTTP_200_OK: UserSerializer,
        status.HTTP_400_BAD_REQUEST: 'Bad request',
        status.HTTP_401_UNAUTHORIZED: 'Пользователь не авторизирован'
    },
    security=[{'Bearer': []}]
)
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def profile_view(request):
    if request.method == "GET":
        user = request.user
        return JsonResponse(UserSerializer(user).data, status=status.HTTP_200_OK)


@swagger_auto_schema(
    operation_summary="Редактирование данных пользователя",
    request_body=UserUpdateSerializer,
    method='PUT',
    security=[{'Bearer': []}],
    responses={
        status.HTTP_200_OK: UserUpdateSerializer,
        status.HTTP_400_BAD_REQUEST: 'Bad request',
        status.HTTP_401_UNAUTHORIZED: 'Пользователь не авторизирован'
    }
)
@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def edit_view(request):
    if request.method == 'POST':
        user = request.user
        serializer = UserUpdateSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@swagger_auto_schema(
    operation_summary="Изменения пароля пользователя",
    request_body=UserUpdatePasswordSerializer,
    method='PUT',
    responses={
        status.HTTP_200_OK: 'Пароль успешно изменен',
        status.HTTP_400_BAD_REQUEST: 'Bad request',
        status.HTTP_401_UNAUTHORIZED: 'Пользователь не авторизирован'
    }
)
@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def edit_password(request):
    if request.method == 'POST':
        user = request.user
        serializer = UserUpdatePasswordSerializer(data=request.data)

        if serializer.is_valid():
            old_password = serializer.validated_data['old_password']
            new_password = serializer.validated_data['new_password']

            if not user.check_password(old_password):
                return Response({"old_password": "Неверный старый пароль"}, status=status.HTTP_400_BAD_REQUEST)

            try:
                user.set_password(new_password)
                user.save()
                return Response({"detail": "Пароль успешно обновлен"}, status=status.HTTP_200_OK)
            except ValidationError as e:
                return Response({"new_password": e.messages}, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@swagger_auto_schema(
    operation_summary="Просмотр инфо о проекте",
    method='GET',
    responses={
        status.HTTP_200_OK: ProjectSerializer,
        status.HTTP_400_BAD_REQUEST: 'Bad request'
    }
)
@api_view(["GET"])
def projects_view(request):
    project = Project.objects.all()
    serializer = ProjectSerializer(project, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@swagger_auto_schema(
    operation_summary="Создание проекта",
    request_body=ProjectSerializer,
    method='POST',
    responses={
        status.HTTP_201_CREATED: ProjectSerializer,
        status.HTTP_400_BAD_REQUEST: 'Bad request',
        status.HTTP_401_UNAUTHORIZED: 'Пользователь не авторизирован'
    }
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_project_view(request):
    serializer = ProjectSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@swagger_auto_schema(
    operation_summary="Вход через телеграмм",
    request_body=UserTgSerializer,
    method='POST',
    responses={
        status.HTTP_200_OK: UserSerializer,
        status.HTTP_400_BAD_REQUEST: 'Bad request'
    }
)
@api_view(['POST'])
def login_tg_view(request):
    serializer = UserTgSerializer(data=request.data)

    if serializer.is_valid():
        telegram_id = serializer.validated_data['telegram_id']

        try:
            user = User.objects.get(telegram_id=telegram_id)
        except User.DoesNotExist:
            return Response({'error': 'Такого пользователя не существует'}, status=status.HTTP_400_BAD_REQUEST)

        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@swagger_auto_schema(
    operation_summary="Просмотр проекта по id",
    method='GET',
    manual_parameters=[openapi.Parameter('id', openapi.IN_PATH, description="id проекта", type=openapi.TYPE_INTEGER)],
    responses={
        status.HTTP_200_OK: ProjectSerializer,
        status.HTTP_400_BAD_REQUEST: 'Bad request'
    }
)
@api_view(['GET'])
def project_view(request, id):
    try:
        project = Project.objects.get(pk=id)
        serializer = ProjectSerializer(project)
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
        status.HTTP_400_BAD_REQUEST: 'Bad request',
        status.HTTP_401_UNAUTHORIZED: 'Пользователь не авторизирован'
    }
)
@swagger_auto_schema(
    operation_summary="Удаление чекпоинта по id",
    method='DELETE',
    manual_parameters=[
        openapi.Parameter("id", openapi.IN_PATH, description="id Checkpoint", type=openapi.TYPE_INTEGER)],
    responses={
        status.HTTP_204_NO_CONTENT: "no content",
        status.HTTP_400_BAD_REQUEST: 'Bad request',
        status.HTTP_401_UNAUTHORIZED: 'Пользователь не авторизирован'
    }
)
@api_view(['POST', 'DELETE'])
@permission_classes([IsAuthenticated])
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
    if request.method == "DELETE":
        try:
            checkpoint = Checkpoint.objects.get(pk=id)
            checkpoint.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Checkpoint.DoesNotExist:
            return JsonResponse({'error': 'Чекпоинт не найден'}, status=status.HTTP_400_BAD_REQUEST)


@swagger_auto_schema(
    operation_summary="Просмотр чекпоинта к проекту",
    method='GET',
    manual_parameters=[
        openapi.Parameter("project_id", openapi.IN_PATH, description="id проекта", type=openapi.TYPE_INTEGER)],
    responses={
        status.HTTP_200_OK: CheckpointSerializer,
        status.HTTP_400_BAD_REQUEST: 'Bad request'
    }
)
@api_view(['GET'])
def checkpoint_project_view(request, project_id):
    try:
        project = Project.objects.get(pk=project_id)
        checkpoints = Checkpoint.objects.filter(project=project).all()
        serializer = CheckpointSerializer(checkpoints, many=True, context={'user': request.user})
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Project.DoesNotExist:
        return JsonResponse({'error': 'Проект не найден'}, status=status.HTTP_400_BAD_REQUEST)


@swagger_auto_schema(
    operation_summary="Создание решения для чекпоинта",
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'github': openapi.Schema(type=openapi.TYPE_STRING, description='GitHub URL'),
            'file': openapi.Schema(type=openapi.TYPE_FILE, description='File to upload'),
            'name': openapi.Schema(type=openapi.TYPE_STRING)
        },
        required=[]
    ),
    method='POST',
    manual_parameters=[
        openapi.Parameter("id", openapi.IN_PATH, description="ID checkpoint", type=openapi.TYPE_INTEGER)
    ],
    responses={
        status.HTTP_201_CREATED: SubmissionSerializer,
        status.HTTP_400_BAD_REQUEST: openapi.Response('Bad request'),
        status.HTTP_401_UNAUTHORIZED: 'Пользователь не авторизирован'
    }
)
@swagger_auto_schema(
    operation_summary="Просмотр решения для чекпоинта",
    method='GET',
    manual_parameters=[
        openapi.Parameter("id", openapi.IN_PATH, description="id checkpoint", type=openapi.TYPE_INTEGER)],
    responses={
        status.HTTP_200_OK: UserOtherSubmissionsSerializer,
        status.HTTP_400_BAD_REQUEST: 'Bad request',
        status.HTTP_401_UNAUTHORIZED: 'Пользователь не авторизирован'
    }
)
@swagger_auto_schema(
    operation_summary="Удаление решения по id",
    method='DELETE',
    manual_parameters=[
        openapi.Parameter("id", openapi.IN_PATH, description="id решения", type=openapi.TYPE_INTEGER)],
    responses={
        status.HTTP_204_NO_CONTENT: "no content",
        status.HTTP_400_BAD_REQUEST: 'Bad request',
        status.HTTP_404_NOT_FOUND: 'Решение не найдено',
        status.HTTP_403_FORBIDDEN: 'Недостаточно прав',
        status.HTTP_401_UNAUTHORIZED: 'Пользователь не авторизирован'
    }
)
@swagger_auto_schema(
    operation_summary="Обновление решения по id",
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'github': openapi.Schema(type=openapi.TYPE_STRING, description='GitHub URL'),
            'file': openapi.Schema(type=openapi.TYPE_FILE, description='File to upload'),
        },
        required=[]
    ),
    method='PUT',
    manual_parameters=[
        openapi.Parameter("id", openapi.IN_PATH, description="id решения", type=openapi.TYPE_INTEGER)],
    responses={
        status.HTTP_200_OK: SubmissionSerializer,
        status.HTTP_400_BAD_REQUEST: 'Bad request',
        status.HTTP_404_NOT_FOUND: 'Решение не найдено',
        status.HTTP_403_FORBIDDEN: 'Недостаточно прав',
        status.HTTP_401_UNAUTHORIZED: 'Пользователь не авторизирован'
    }
)
@api_view(['GET', 'POST', 'DELETE', 'PUT'])
@permission_classes([IsAuthenticated])
def submission_view(request, id):
    user = request.user
    if request.method == 'POST':
        try:
            checkpoint = Checkpoint.objects.get(pk=id)
            submission = Submission.objects.filter(checkpoint=checkpoint).filter(user=user, is_visible=True).first()
            if submission:
                return JsonResponse({'error': 'Активное решение на данный чекпоинт уже существует'},
                                    status=status.HTTP_400_BAD_REQUEST)

            data = {
                'github': request.data.get('github'),
                'file': request.FILES.get('file'),
                'date_time': datetime.datetime.now(),
                'name': request.data.get('name'),
            }
            serializer = SubmissionSerializer(data=data)
            if serializer.is_valid():
                serializer.save(user=user, checkpoint=checkpoint)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Checkpoint.DoesNotExist:
            return JsonResponse({'error': 'Чекпоинт не найден'}, status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'GET':
        try:
            checkpoint = Checkpoint.objects.get(pk=id)
            submissions = Submission.objects.filter(checkpoint=checkpoint).order_by('-date_time').all()

            user_submissions = [submission for submission in submissions if submission.user == user]
            other_submissions = [submission for submission in submissions if submission.user != user]

            user_submissions_serializer = SubmissionSerializer(user_submissions, many=True)
            other_submissions_serializer = SubmissionSerializer(other_submissions, many=True)

            response_data = {
                'user_submissions': user_submissions_serializer.data,
                'other_submissions': other_submissions_serializer.data
            }

            return Response(response_data, status=status.HTTP_200_OK)
        except Checkpoint.DoesNotExist:
            return JsonResponse({'error': 'Чекпоинт не найден'}, status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'DELETE':
        try:
            submission = Submission.objects.get(pk=id)
            if submission.user != user:
                return JsonResponse({'error': 'Недостаточно прав'}, status=status.HTTP_403_FORBIDDEN)
            submission.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Submission.DoesNotExist:
            return JsonResponse({'error': 'Решение не найдено'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':
        try:
            submission = Submission.objects.get(pk=id)
            if submission.user != user:
                return JsonResponse({'error': 'Недостаточно прав'}, status=status.HTTP_403_FORBIDDEN)
            data = {
                'github': request.data.get('github'),
                'file': request.FILES.get('file'),
                'name': request.data.get('name'),
            }
            serializer = SubmissionSerializer(submission, data=data, partial=True)
            if serializer.is_valid():
                serializer.save(user=user)
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Submission.DoesNotExist:
            return JsonResponse({'error': 'Решение не найдено'}, status=status.HTTP_404_NOT_FOUND)


@swagger_auto_schema(
    operation_summary="Закрыть решение",
    method='POST',
    manual_parameters=[
        openapi.Parameter("id", openapi.IN_PATH, description="id решения", type=openapi.TYPE_INTEGER)],
    responses={
        status.HTTP_201_CREATED: SubmissionSerializer,
        status.HTTP_404_NOT_FOUND: 'Запись не найдена',
        status.HTTP_403_FORBIDDEN: 'Недостаточно прав',
        status.HTTP_401_UNAUTHORIZED: 'Пользователь не авторизирован'
    }
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def close_submission_view(request, id):
    try:
        submission = Submission.objects.get(pk=id)
        if submission.user != request.user:
            return JsonResponse({'error': 'Недостаточно прав'}, status=status.HTTP_403_FORBIDDEN)
        submission.is_visible = False
        submission.save()
        return Response(SubmissionSerializer(submission).data, status=status.HTTP_201_CREATED)
    except Submission.DoesNotExist:
        return JsonResponse({'error': 'Запись не найдена'}, status=status.HTTP_404_NOT_FOUND)


@swagger_auto_schema(
    operation_summary="Открыть решение",
    method='POST',
    manual_parameters=[
        openapi.Parameter("id", openapi.IN_PATH, description="id решения", type=openapi.TYPE_INTEGER)],
    responses={
        status.HTTP_201_CREATED: SubmissionSerializer,
        status.HTTP_401_UNAUTHORIZED: 'Пользователь не авторизирован',
        status.HTTP_404_NOT_FOUND: 'Запись не найдена',
        status.HTTP_403_FORBIDDEN: 'Недостаточно прав'
    }
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def open_submission_view(request, id):
    try:
        submission = Submission.objects.get(pk=id)
        if submission.user != request.user:
            return JsonResponse({'error': 'Недостаточно прав'}, status=status.HTTP_403_FORBIDDEN)
        submission.is_visible = True
        submission.save()
        return Response(SubmissionSerializer(submission).data, status=status.HTTP_201_CREATED)
    except Submission.DoesNotExist:
        return JsonResponse({'error': 'Запись не найдена'}, status=status.HTTP_404_NOT_FOUND)


@swagger_auto_schema(
    operation_summary="Принять и завершить решение",
    method='POST',
    manual_parameters=[
        openapi.Parameter("id", openapi.IN_PATH, description="id решения", type=openapi.TYPE_INTEGER)],
    responses={
        status.HTTP_201_CREATED: SubmissionSerializer,
        status.HTTP_400_BAD_REQUEST: 'Bad request',
        status.HTTP_401_UNAUTHORIZED: 'Пользователь не авторизирован',
        status.HTTP_404_NOT_FOUND: 'Запись не найдена',
        status.HTTP_403_FORBIDDEN: 'Недостаточно прав'
    }
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def accept_submission_view(request, id):
    try:
        submission = Submission.objects.get(pk=id)
        if submission.user != request.user:
            return JsonResponse({'error': 'Недостаточно прав'}, status=status.HTTP_403_FORBIDDEN)
        feedbacks = Feedback.objects.filter(submission=submission)
        for feedback in feedbacks:
            if feedback.like == 0 and feedback.dislike == 0:
                return JsonResponse({
                    'error': 'Перед закрытием решения необходимо, чтобы во всех комментариях был проставлен лайк или дизлайк'},
                    status=status.HTTP_400_BAD_REQUEST)

        feedbacks_4_or_5 = Feedback.objects.filter(submission=submission, grade=4) | Feedback.objects.filter(
            submission=submission, grade=5)
        if len(feedbacks_4_or_5) < 2:
            return JsonResponse({
                'error': 'Перед закрытием решения необходимо, чтобы был оставлено хотя бы два отзыва с оценкой 4 или 5'},
                status=status.HTTP_400_BAD_REQUEST)
        submission.accepted = True
        submission.is_visible = False
        submission.save()
        return Response(SubmissionSerializer(submission).data, status=status.HTTP_201_CREATED)
    except Submission.DoesNotExist:
        return JsonResponse({'error': 'Запись не найдена'}, status=status.HTTP_404_NOT_FOUND)


@swagger_auto_schema(
    operation_summary="Поставить или убрать лайк",
    operation_description="Для того, чтобы поставить лайк, передайте 1 в значение value, чтобы убрать лайк предайте -1",
    method='POST',
    request_body=ValueSerializer,
    manual_parameters=[
        openapi.Parameter("id", openapi.IN_PATH, description="id комментария", type=openapi.TYPE_INTEGER)],
    responses={
        status.HTTP_201_CREATED: FeedbackSerializer,
        status.HTTP_400_BAD_REQUEST: 'Bad request',
        status.HTTP_401_UNAUTHORIZED: 'Пользователь не авторизирован',
        status.HTTP_404_NOT_FOUND: 'Комментарий не найден'
    }
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def like_feedback_view(request, id):
    try:
        feedback = Feedback.objects.get(pk=id)
        serializer = ValueSerializer(data=request.data)
        if serializer.is_valid():
            value = serializer.validated_data.get('value')
            feedback.like += value
            if feedback.like < 0:
                feedback.like = 0
            feedback.save()
            return Response(FeedbackSerializer(feedback).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Feedback.DoesNotExist:
        return JsonResponse({'error': 'Комментарий не найден'}, status=status.HTTP_404_NOT_FOUND)


@swagger_auto_schema(
    operation_summary="Поставить или убрать дизлайк",
    operation_description="Для того, чтобы поставить дизлайк, передайте 1 в значение value, чтобы убрать дизлайк предайте -1",
    method='POST',
    request_body=ValueSerializer,
    manual_parameters=[
        openapi.Parameter("id", openapi.IN_PATH, description="id комментария", type=openapi.TYPE_INTEGER)],
    responses={
        status.HTTP_201_CREATED: FeedbackSerializer,
        status.HTTP_400_BAD_REQUEST: 'Bad request',
        status.HTTP_401_UNAUTHORIZED: 'Пользователь не авторизирован',
        status.HTTP_404_NOT_FOUND: 'Комментарий не найден'
    }
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def dislike_feedback_view(request, id):
    try:
        feedback = Feedback.objects.get(pk=id)
        serializer = ValueSerializer(data=request.data)
        if serializer.is_valid():
            value = serializer.validated_data.get('value')
            feedback.dislike += value
            if feedback.dislike < 0:
                feedback.dislike = 0
            feedback.save()
            return Response(FeedbackSerializer(feedback).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Feedback.DoesNotExist:
        return JsonResponse({'error': 'Комментарий не найден'}, status=status.HTTP_404_NOT_FOUND)


@swagger_auto_schema(
    operation_summary="Добавление комментария",
    request_body=FeedbackRequestSerializer,
    method='POST',
    manual_parameters=[
        openapi.Parameter("id", openapi.IN_PATH, description="id решения", type=openapi.TYPE_INTEGER)],
    responses={
        status.HTTP_201_CREATED: FeedbackSerializer,
        status.HTTP_400_BAD_REQUEST: 'Bad request',
        status.HTTP_401_UNAUTHORIZED: 'Пользователь не авторизирован'
    }
)
@swagger_auto_schema(
    operation_summary="Просмотр всех комментариев к решению",
    method='GET',
    manual_parameters=[
        openapi.Parameter("id", openapi.IN_PATH, description="id решения", type=openapi.TYPE_INTEGER)],
    responses={
        status.HTTP_200_OK: FeedbackSerializer,
        status.HTTP_400_BAD_REQUEST: 'Bad request',
        status.HTTP_401_UNAUTHORIZED: 'Пользователь не авторизирован'
    }
)
@swagger_auto_schema(
    operation_summary="Удаление комметария",
    method='DELETE',
    manual_parameters=[
        openapi.Parameter("id", openapi.IN_PATH, description="id комментария", type=openapi.TYPE_INTEGER)],
    responses={
        status.HTTP_204_NO_CONTENT: "no content",
        status.HTTP_400_BAD_REQUEST: 'Bad request',
        status.HTTP_404_NOT_FOUND: 'Комментарий не найден',
        status.HTTP_403_FORBIDDEN: 'Недостаточно прав',
        status.HTTP_401_UNAUTHORIZED: 'Пользователь не авторизирован'
    }
)
@swagger_auto_schema(
    operation_summary="Редактирование комментария",
    request_body=FeedbackRequestSerializer,
    method='PUT',
    manual_parameters=[
        openapi.Parameter("id", openapi.IN_PATH, description="id комментария", type=openapi.TYPE_INTEGER)],
    responses={
        status.HTTP_200_OK: FeedbackSerializer,
        status.HTTP_400_BAD_REQUEST: 'Bad request',
        status.HTTP_404_NOT_FOUND: 'Комментарий не найден',
        status.HTTP_403_FORBIDDEN: 'Недостаточно прав',
        status.HTTP_401_UNAUTHORIZED: 'Пользователь не авторизирован'
    }
)
@api_view(['GET', 'POST', 'DELETE', 'PUT'])# здесь указаны запросы пут-обновить, делит-удалить, гет-получить, пост отправить
@permission_classes([IsAuthenticated]) # проверка авторизации IsAuthenticated(имортировали), permission_classes-метод(импортировали)
def feedback_view(request, id):
    user = request.user # находим пользователя
    if request.method == 'POST': # метод отправляет запрос в базу данных с обратной связи
        try:
            submission = Submission.objects.get(pk=id) # получает объект с базы данных по id(строчка в таблице)
            if Feedback.objects.filter(user=user, submission=submission).exists(): # запрос в базу данных, чтоб получить обратную связь по решению и по пользователю(тому кто оставляет обратную связь) exists-существует и проверят существует ли этот комментарий от этого пользователя и оставлял ли он его раннеее
                return JsonResponse({'error': 'Вы уже оставляли отзыв'}, status=status.HTTP_400_BAD_REQUEST) #если комментарий повторился, выдаем ошибку

            request.data["date_time"] = datetime.datetime.now() # now-сейчас, фиксируем текущее время
            serializer = FeedbackSerializer(data=request.data) # строка для базы данных
            if serializer.is_valid(): # если все данные соблюдены
                serializer.save(user=user, submission=submission) # сохранение в базу данных
                return Response(serializer.data, status=status.HTTP_201_CREATED) # подтверждение что сохранение прошло успешно
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) # если пропустил строчку выдаст ошибку
        except Submission.DoesNotExist: # если недостоверная информация, выдаст ошибку
            return JsonResponse({'error': 'Проект не найден'}, status=status.HTTP_400_BAD_REQUEST) # само окно ошибки

    if request.method == 'GET':
        try:
            submission = Submission.objects.get(pk=id) # достает из базы ссылку которую оставлял ранее
            feedbacks = Feedback.objects.filter(submission=submission).order_by("-date_time").all() # достает все комментарии и сортирует по дате
            serializer = FeedbackSerializer(feedbacks, many=True)# комментарий и оценка преподователей(так как несколько преподователей пишем many=true), фидбек -список всех моделей
            return Response(serializer.data, status=status.HTTP_200_OK) #выводит все комментарии Response-ответ
        except Submission.DoesNotExist: # DoesNotExist -не существует
            return JsonResponse({'error': 'Запись не найдена'}, status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'PUT':
        try:
            feedback = Feedback.objects.get(pk=id) # находим обьект по йд
            if feedback.user != user: # проверят подходит ли комментарий к текущему пользователю
                return JsonResponse({'error': 'Недостаточно прав'}, status=status.HTTP_403_FORBIDDEN) # если нет. выдает ошибку
            serializer = FeedbackSerializer(feedback, data=request.data, partial=True) # partial-чистично,
            if serializer.is_valid():# valid-остоверность ( если пользователь ввел правильные данные)
                serializer.save(user=user) # сохранения данных пользователя
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Feedback.DoesNotExist: # если фидбек(см.модель) не найдена
            return JsonResponse({'error': 'Отзыв не найден'}, status=status.HTTP_404_NOT_FOUND) # ошибка,

    if request.method == 'DELETE':
        try:
            feedback = Feedback.objects.get(pk=id) # Feedback - обратная связь
            if feedback.user != user:
                return JsonResponse({'error': 'Недостаточно прав'}, status=status.HTTP_403_FORBIDDEN)
            feedback.delete() #  Feedback даёт команду удалить комментарий
            return Response(status=status.HTTP_204_NO_CONTENT) # удаление прошло успешно
        except Feedback.DoesNotExist: # если фидбек(см.модель) не найдена
            return JsonResponse({'error': 'Отзыв не найден'}, status=status.HTTP_404_NOT_FOUND)


@swagger_auto_schema(
    operation_summary="Выполненные проекты пользователя",
    method='GET',
    responses={
        status.HTTP_200_OK: ProjectSerializer(many=True),
        status.HTTP_400_BAD_REQUEST: 'Bad request',
        status.HTTP_401_UNAUTHORIZED: 'Пользователь не авторизирован'
    }
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def projects_done_view(request):
    user = request.user
    all_projects = Project.objects.all().order_by('-id')
    completed_projects = []
    for project in all_projects:
        checkpoints = Checkpoint.objects.filter(project=project)

        all_checkpoints_done = len(checkpoints) > 0
        for checkpoint in checkpoints:
            submissions = Submission.objects.filter(checkpoint=checkpoint, user=user, accepted=True)
            if not submissions.exists():
                all_checkpoints_done = False
                break

        if all_checkpoints_done:
            completed_projects.append(project)

    serializer = ProjectSerializer(completed_projects, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@swagger_auto_schema(
    operation_summary="Проекты пользователя, находящиеся в процессе выполнения",
    method='GET',
    responses={
        status.HTTP_200_OK: ProjectSerializer(many=True),
        status.HTTP_400_BAD_REQUEST: 'Bad request',
        status.HTTP_401_UNAUTHORIZED: 'Пользователь не авторизирован'
    }
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def projects_in_progress_view(request):
    user = request.user
    all_projects = user.projects.all()
    in_progress_projects = []
    serializer = ProjectSerializer(all_projects, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@swagger_auto_schema(
    operation_summary="Рекомендуемые пользователю проекты",
    method='GET',
    responses={
        status.HTTP_200_OK: ProjectSerializer(many=True),
        status.HTTP_400_BAD_REQUEST: 'Bad request',
        status.HTTP_401_UNAUTHORIZED: 'Пользователь не авторизирован'
    }
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def projects_hot_view(request):
    user = request.user
    all_projects = Project.objects.all().order_by('-id')
    hot_projects = []
    for project in all_projects:
        checkpoints = Checkpoint.objects.filter(project=project)

        for checkpoint in checkpoints:
            submissions = Submission.objects.filter(checkpoint=checkpoint, user=user, accepted=False)
            if submissions.exists():
                break
        else:
            hot_projects.append(project)

    serializer = ProjectSerializer(hot_projects, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@swagger_auto_schema(
    operation_summary="Просмотр профиля компаний",
    method='GET',
    responses={
        status.HTTP_200_OK: CompanySerializer,
        status.HTTP_400_BAD_REQUEST: 'Bad request'
    }
)
@api_view(["GET"])
def all_company_view(request):
    companies = Company.objects.all()
    serializer = CompanySerializer(companies, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@swagger_auto_schema(
    operation_summary="Просмотр профиля компании по id",
    method='GET',
    manual_parameters=[
        openapi.Parameter("id", openapi.IN_PATH, description="id компании", type=openapi.TYPE_INTEGER)],
    responses={
        status.HTTP_200_OK: CompanySerializer,
        status.HTTP_400_BAD_REQUEST: 'Bad request'
    }
)
@api_view(["GET"])
def company_view(request, id):
    try:
        company = Company.objects.get(pk=id)
        serializer = CompanySerializer(company)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Company.DoesNotExist:
        return JsonResponse({'error': 'Компания не найдена'}, status=status.HTTP_400_BAD_REQUEST)

@swagger_auto_schema(
    operation_summary="Пользователь удалил проект",
    method='DELETE',
    manual_parameters=[
        openapi.Parameter("id", openapi.IN_PATH, description="id Project", type=openapi.TYPE_INTEGER)],
    responses={
        status.HTTP_204_NO_CONTENT: "no content",
        status.HTTP_400_BAD_REQUEST: 'Bad request',
        status.HTTP_401_UNAUTHORIZED: 'Пользователь не авторизирован'
    }
)

@swagger_auto_schema(
    operation_summary="Начало проекта пользователя",
    method='POST',
    responses={
        status.HTTP_201_CREATED: ProjectSerializer,
        status.HTTP_400_BAD_REQUEST: 'Bad request',
        status.HTTP_401_UNAUTHORIZED: 'Пользователь не авторизирован'
    }
)
@api_view(['POST','DELETE'])
@permission_classes([IsAuthenticated])
def project_execution_view(request,id):
    if request.method == 'POST':
        try:
            project = Project.objects.get(pk=id)
            user = request.user
            user.projects.add(project)
            serializer = ProjectSerializer(user.projects,many=True)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Project.DoesNotExist:
            return JsonResponse({'error': 'Проект не найден'}, status=status.HTTP_400_BAD_REQUEST)
    if request.method == "DELETE":
        try:
            project = Project.objects.get(pk=id)
            user = request.user
            user.projects.remove(project)
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Project.DoesNotExist:
            return JsonResponse({'error': 'Проект не найден'}, status=status.HTTP_400_BAD_REQUEST)



