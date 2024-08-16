from django.conf import settings
from django.contrib.auth.password_validation import validate_password
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db.models import Avg
from dotenv import dotenv_values
from rest_framework import serializers
from .models import Project, User, Checkpoint, Submission, Feedback, Company
import re


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password', 'first_name', 'last_name', 'email', 'phone', 'github', 'telegram_username',
                  'telegram_id', 'teacher','position']
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True},
            'email': {'required': False},
            'phone': {'required': False},
            'github': {'required': False},
            'telegram_username': {'required': False},
            'telegram_id': {'required': False},
            'teacher' : {'required': False},
            'password': {'write_only': True},
            'position': {'required': False},
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
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if instance.photo_fase:
            representation['photo_fase'] = settings.DOMAIN + settings.MEDIA_URL + str(instance.photo_fase)
        representation['rate'] = instance.positive_feedback_rate
        representation['average_grade'] = instance.average_feedback_score
        return representation

class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'first_name', 'position','last_name', 'email', 'phone', 'github', 'telegram_username']
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
    users_in_progress = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = '__all__'

    def get_users_in_progress(self, obj):
        return Submission.objects.filter(checkpoint__project=obj, feedback__grade__lt=4).values('user').distinct().count()

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if instance.file:
            representation['file'] = settings.DOMAIN + settings.MEDIA_URL + str(instance.file)
        representation['users_in_progress_count'] = self.get_users_in_progress(instance)
        return representation


class CheckpointSerializer(serializers.ModelSerializer):
    project = ProjectSerializer()
    is_done = serializers.SerializerMethodField()

    class Meta:
        model = Checkpoint
        fields = '__all__'

    def get_is_done(self, obj):
        user = self.context.get('user')
        if not user or not user.is_authenticated:
            return False
        return Submission.objects.filter(checkpoint=obj, user=user, feedback__grade__gte=4).exists()

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['is_done'] = self.get_is_done(instance)
        return representation




class CheckpointRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Checkpoint
        fields = ['name', 'description', 'points']



class SubmissionSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    checkpoint = CheckpointSerializer(read_only=True)
    accepted = serializers.SerializerMethodField()
    avg_grade = serializers.SerializerMethodField()

    class Meta:
        model = Submission
        fields = '__all__'

    def get_accepted(self, obj):
        feedbacks = Feedback.objects.filter(submission=obj, user__teacher=True, grade__gte=4)
        return feedbacks.count() >= 2

    def get_avg_grade(self, obj):
        avg_grade = Feedback.objects.filter(submission=obj).aggregate(Avg('grade'))['grade__avg']
        return avg_grade if avg_grade is not None else 0

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if instance.file:
            representation['file'] = settings.DOMAIN + settings.MEDIA_URL + str(instance.file)
        representation['accepted'] = self.get_accepted(instance)
        representation['avg_grade'] = self.get_avg_grade(instance)
        return representation


class SubmissionRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Submission
        fields = ['github', 'file','name']


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

class UserOtherSubmissionsSerializer(serializers.Serializer):
    user_submissions = serializers.ListField(child=SubmissionSerializer())
    other_submissions = serializers.ListField(child=SubmissionSerializer())