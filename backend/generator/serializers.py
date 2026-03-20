from rest_framework import serializers
from .models import GenerationHistory

class GenerationHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = GenerationHistory
        fields = ('id', 'idea', 'project_type', 'complexity', 'generated_code', 'created_at')
