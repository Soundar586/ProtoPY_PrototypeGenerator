from django.contrib import admin
from .models import GenerationHistory

@admin.register(GenerationHistory)
class GenerationHistoryAdmin(admin.ModelAdmin):
    list_display = ('user', 'project_type', 'complexity', 'created_at')
    list_filter = ('project_type', 'complexity')
