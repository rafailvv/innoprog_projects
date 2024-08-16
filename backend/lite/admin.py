from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from .models import Project, Checkpoint, Submission, Feedback, User, Company
from django.contrib.auth.admin import UserAdmin as DefaultUserAdmin

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('name', 'company', 'price')
    search_fields = ('name', 'company__name')
    list_filter = ('company__name','difficulty')
    ordering = ('name',)

@admin.register(Checkpoint)
class CheckpointAdmin(admin.ModelAdmin):
    list_display = ('name', 'project', 'points')
    search_fields = ('name',)
    list_filter = ('project',)
    ordering = ('project', 'name')

@admin.register(Submission)
class SubmissionAdmin(admin.ModelAdmin):
    list_display = ('user', 'checkpoint', 'github', 'date_time', 'is_visible')
    search_fields = ('user__username', 'checkpoint__name', 'github')
    list_filter = ('is_visible', 'date_time')
    ordering = ('-date_time',)

@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ('user', 'submission', 'grade', 'date_time', 'like', 'dislike')
    search_fields = ('user__username', 'submission__checkpoint__name', 'grade')
    list_filter = ('grade', 'date_time')
    ordering = ('-date_time',)

@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ('name', 'logo', 'description', 'url', 'field')
    search_fields = ('name', 'description', 'field')
    list_filter = ('field',)
    ordering = ('name',)

@admin.register(User)
class UserAdmin(DefaultUserAdmin):
    fieldsets = DefaultUserAdmin.fieldsets + (
        (None, {'fields': ('phone', 'github', 'telegram_username', 'telegram_id','teacher','position','photo_fase')}),
    )
