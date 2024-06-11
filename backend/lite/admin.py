from django.contrib import admin
from .models import *
admin.site.register(User)
admin.site.register(Project)
admin.site.register(Checkpoint)
admin.site.register(Submission)
admin.site.register(Feedback)

# Register your models here.
