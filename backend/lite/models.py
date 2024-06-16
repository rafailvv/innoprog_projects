from django.db import models


class User(models.Model):
    username = models.CharField(max_length=100)
    password = models.CharField(max_length=100)
    email = models.CharField(max_length=100)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    phone = models.CharField(max_length=100)
    github = models.CharField(max_length=100)
    telegram_username = models.CharField(max_length=100)
    telegram_id = models.BigIntegerField(null=True)


# Create your models here.
class Project(models.Model):
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=1000)
    company = models.CharField(max_length=100)
    price = models.IntegerField()
    file = models.CharField(max_length=100)
    code_structure = models.CharField(max_length=1000)
    assessment_criteria = models.CharField(max_length=100)


class Checkpoint(models.Model):
    name = models.CharField(max_length=30)
    description = models.CharField(max_length=1000)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    points = models.IntegerField()


class Submission(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    checkpoint = models.ForeignKey(Checkpoint, on_delete=models.CASCADE)
    github = models.CharField(max_length=100)
    file = models.CharField(max_length=1000)
    date_time = models.DateTimeField()
    revisions = models.BooleanField(default=False)
    accepted = models.BooleanField(default=False)


class Feedback(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    submission = models.ForeignKey(Submission, on_delete=models.CASCADE)
    grade = models.IntegerField()
    comment = models.CharField(max_length=2000)
    date_time = models.DateTimeField()
    like = models.IntegerField(default=0)
    dislike = models.IntegerField(default=0)


