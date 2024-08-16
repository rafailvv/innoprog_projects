from django.core.validators import MinValueValidator, MaxValueValidator
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models import Avg


class ProjectDifficulty(models.TextChoices):
    EASY = 'easy', 'Easy'
    MEDIUM = 'medium', 'Medium'
    HARD = 'hard', 'Hard'


class CompanyField(models.TextChoices):
    IT = 'it', 'Информационные технологии'
    FINANCE = 'finance', 'Финансовый сектор'
    HEALTHCARE = 'healthcare', 'Здравоохранение'
    EDUCATION = 'education', 'Образование'
    RETAIL = 'retail', 'Розничная торговля'
    MANUFACTURING = 'manufacturing', 'Производственный сектор'
    TRANSPORTATION = 'transportation', 'Транспорт'
    ENTERTAINMENT = 'entertainment', 'Развлечения'
    REAL_ESTATE = 'real_estate', 'Недвижимость'
    TELECOMMUNICATIONS = 'telecommunications', 'Телекоммуникации'
    ENERGY = 'energy', 'Энергетика'
    AGRICULTURE = 'agriculture', 'Сельское хозяйство'
    AUTOMOTIVE = 'automotive', 'Автомобильная промышленность'
    TOURISM = 'tourism', 'Туризм'
    LOGISTICS = 'logistics', 'Логистика'
    CONSTRUCTION = 'construction', 'Строительство'
    PHARMACEUTICALS = 'pharmaceuticals', 'Фармацевтика'
    REAL_ESTATE_DEVELOPMENT = 'real_estate_development', 'Развитие недвижимости'
    AEROSPACE = 'aerospace', 'Аэрокосмическая отрасль'
    MEDIA = 'media', 'Медиа'
    SPORTS = 'sports', 'Спорт'
    ART = 'art', 'Искусство'

class Company(models.Model):
    name = models.CharField(max_length=100)
    logo = models.ImageField(upload_to='companies/')
    description = models.CharField(max_length=1000)
    url = models.CharField(max_length=300)
    field = models.CharField(
        max_length=30,
        choices=CompanyField.choices,
        default=CompanyField.IT
    )

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Компания'
        verbose_name_plural = 'Компании'


class Project(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(max_length=1000)
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    like = models.IntegerField(default=0)
    price = models.PositiveIntegerField()
    file = models.FileField(upload_to='project_files/', blank=True, null=True)
    code_structure = models.TextField(max_length=1000)
    assessment_criteria = models.TextField(max_length=1000, default="Чистый код")
    difficulty = models.CharField(
        max_length=10,
        choices=ProjectDifficulty.choices,
        default=ProjectDifficulty.MEDIUM
    )

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Проект'
        verbose_name_plural = 'Проекты'

class User(AbstractUser):
    phone = models.CharField(max_length=100, blank=True, null=True)
    github = models.CharField(max_length=100, blank=True, null=True)
    telegram_username = models.CharField(max_length=100, blank=True, null=True)
    telegram_id = models.BigIntegerField(null=True, blank=True)
    photo_fase = models.ImageField(upload_to='avatar_logo/', null=True, blank=True)
    teacher = models.BooleanField(default=False)
    position = models.CharField(max_length=100, default="")
    projects = models.ManyToManyField(Project, related_name='users')

    @property
    def positive_feedback_rate(self):
        feedbacks = Feedback.objects.filter(user=self)
        valid_feedbacks = feedbacks.exclude(like=0, dislike=0)
        positive_feedbacks = valid_feedbacks.filter(like=1).count()
        total_feedbacks = valid_feedbacks.count()
        if total_feedbacks == 0:
            return None
        return (positive_feedbacks / total_feedbacks) * 100

    @property
    def average_feedback_score(self):
        feedbacks = Feedback.objects.filter(submission__user=self)
        if feedbacks.exists():
            return round(feedbacks.aggregate(average_score=Avg('grade'))['average_score'],2)
        return None

    def __str__(self):
        return self.username


class Checkpoint(models.Model):
    name = models.CharField(max_length=30)
    description = models.TextField(max_length=1000)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    points = models.PositiveIntegerField(validators=[MinValueValidator(1), MaxValueValidator(100)])

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Контрольная точка'
        verbose_name_plural = 'Контрольные точки'


class Submission(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    checkpoint = models.ForeignKey(Checkpoint, on_delete=models.CASCADE)
    github = models.CharField(max_length=100)
    file = models.FileField(upload_to='file_submissions/', blank=True, null=True)
    date_time = models.DateTimeField()
    is_visible = models.BooleanField(default=True)
    name = models.CharField(max_length=100,null=True)

    def __str__(self):
        return f"{self.user.username} - {self.checkpoint.name}"

    class Meta:
        verbose_name = 'Отправка'
        verbose_name_plural = 'Отправки'


class Feedback(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    submission = models.ForeignKey(Submission, on_delete=models.CASCADE)
    grade = models.PositiveIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    comment = models.TextField(max_length=2000)
    date_time = models.DateTimeField()
    like = models.IntegerField(default=0)
    dislike = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.user.username} - {self.submission.checkpoint.name}"

    class Meta:
        verbose_name = 'Обратная связь'
        verbose_name_plural = 'Обратные связи'
