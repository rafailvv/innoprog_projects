from django.contrib import admin
from .models import Project, Checkpoint, Submission, Feedback, User, Company
from django.contrib.auth.models import User as BaseUser
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('name', 'company', 'price')
    search_fields = ('name', 'company')
    list_filter = ('company',)
    ordering = ('name',)

@admin.register(Checkpoint)
class CheckpointAdmin(admin.ModelAdmin):
    list_display = ('name', 'project', 'points')
    search_fields = ('name',)
    list_filter = ('project',)
    ordering = ('project', 'name')

@admin.register(Submission)
class SubmissionAdmin(admin.ModelAdmin):
    list_display = ('user', 'checkpoint', 'github', 'date_time', 'revisions', 'accepted')
    search_fields = ('user__username', 'checkpoint__name', 'github')
    list_filter = ('accepted', 'revisions', 'date_time')
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
class UserAdmin(BaseUserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'phone', 'github', 'telegram_username', 'telegram_id', 'is_staff')
    search_fields = ('username', 'email', 'first_name', 'last_name', 'phone', 'github', 'telegram_username')
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'groups')
    ordering = ('username',)
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'email', 'phone', 'github', 'telegram_username', 'telegram_id')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'password1', 'password2'),
        }),
    )

# Unregister the base user model and register the custom user model
admin.site.unregister(BaseUser)