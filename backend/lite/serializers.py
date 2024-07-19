from rest_framework import serializers
from .models import Project, User, Checkpoint, Submission, Feedback


class ProjectsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class LoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password']


class UserTgSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['telegram_id']


class CheckpointSerializer(serializers.ModelSerializer):
    class Meta:
        model = Checkpoint
        fields = '__all__'
class CheckpointRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Checkpoint
        fields = ['name', 'description', 'points']

class SubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Submission
        fields = '__all__'

class SubmissionRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Submission
        fields = ['github', 'file']

class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = '__all__'

class FeedbackRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = ['grade', 'comment']
