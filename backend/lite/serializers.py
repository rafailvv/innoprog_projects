from django.conf import settings
from django.contrib.auth.password_validation import validate_password
from django.core.validators import MinValueValidator, MaxValueValidator
from dotenv import dotenv_values
from rest_framework import serializers
from .models import Project, User, Checkpoint, Submission, Feedback, Company
import re


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password', 'first_name', 'last_name', 'email', 'phone', 'github', 'telegram_username',
                  'telegram_id']
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True},
            'email': {'required': False},
            'phone': {'required': False},
            'github': {'required': False},
            'telegram_username': {'required': False},
            'telegram_id': {'required': False},
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        user = User(
            username=validated_data.get('username'),
            first_name=validated_data.get('first_name'),
            last_name=validated_data.get('last_name'),
            email=validated_data.get('email'),
            phone=validated_data.get('phone'),
            github=validated_data.get('github'),
            telegram_username=validated_data.get('telegram_username'),
            telegram_id=validated_data.get('telegram_id'),
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

    def validate_password(self, value):
        validate_password(value)
        return value

    def validate_phone(self, value):
        phone_regex = re.compile(r'^\+?1?\d{9,15}$')
        if not phone_regex.match(value):
            raise serializers.ValidationError('Введите правильный номер телефона.')
        return value

    def validate(self, data):
        if 'email' in data and User.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError({'email': 'Пользователь с таким email уже существует.'})
        if User.objects.filter(username=data['username']).exists():
            raise serializers.ValidationError({'username': 'Пользователь с таким именем пользователя уже существует.'})
        if 'telegram_username' in data and User.objects.filter(telegram_username=data['telegram_username']).exists():
            raise serializers.ValidationError(
                {'telegram_username': 'Пользователь с таким именем пользователя в Telegram уже существует.'})
        if 'phone' in data and User.objects.filter(phone=data['phone']).exists():
            raise serializers.ValidationError({'phone': 'Пользователь с таким номером телефона уже существует.'})
        return data


class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'email', 'phone', 'github', 'telegram_username']
        extra_kwargs = {
            'username': {'required': False}
        }


class UserUpdatePasswordSerializer(serializers.ModelSerializer):
    old_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(required=True, write_only=True)

    class Meta:
        model = User
        fields = ['old_password', 'new_password']

    def validate_new_password(self, value):
        validate_password(value)
        return value


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True)


class UserTgSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['telegram_id']
        extra_kwargs = {
            'telegram_id': {'required': True}
        }

class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = '__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if instance.logo:
            representation['logo'] = settings.DOMAIN + settings.MEDIA_URL + str(instance.logo)
        return representation

class ProjectSerializer(serializers.ModelSerializer):
    company = CompanySerializer()
    class Meta:
        model = Project
        fields = '__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if instance.file:
            representation['file'] = settings.DOMAIN + settings.MEDIA_URL + str(instance.file)
        return representation


class CheckpointSerializer(serializers.ModelSerializer):
    project = ProjectSerializer()
    class Meta:
        model = Checkpoint
        fields = '__all__'


class CheckpointRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Checkpoint
        fields = ['name', 'description', 'points']


class SubmissionSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    checkpoint = CheckpointSerializer(read_only=True)
    class Meta:
        model = Submission
        fields = '__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if instance.file:
            representation['file'] = settings.DOMAIN + settings.MEDIA_URL + str(instance.file)
        return representation


class SubmissionRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Submission
        fields = ['github', 'file']


class FeedbackSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    submission = SubmissionSerializer(read_only=True)
    class Meta:
        model = Feedback
        fields = '__all__'


class FeedbackRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = ['grade', 'comment']

class ValueSerializer(serializers.Serializer):
    value = serializers.IntegerField(required=True,validators=[MinValueValidator(-1), MaxValueValidator(1)])

