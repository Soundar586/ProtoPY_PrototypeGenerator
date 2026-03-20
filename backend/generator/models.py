from django.db import models
from django.conf import settings

class GenerationHistory(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='generations')
    idea = models.TextField()
    project_type = models.CharField(max_length=50)
    complexity = models.CharField(max_length=50)
    generated_code = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.email} - {self.project_type} - {self.created_at}"
