from django.contrib import admin

from .models import JobApplication, JobPost, Notification, Resume, Skill

admin.site.register([JobApplication, JobPost, Notification, Resume, Skill])
