import time
import json
from django.http import StreamingHttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import GenerationHistory
from .serializers import GenerationHistorySerializer
from .ai_engine import generate_python_code

class GenerateView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        idea = request.data.get('idea', '').strip()
        project_type = request.data.get('project_type', 'Website')
        complexity = request.data.get('complexity', 'Simple')

        if not idea:
            return Response({'error': 'Project idea is required.'}, status=400)

        code = generate_python_code(idea, project_type, complexity)

        GenerationHistory.objects.create(
            user=request.user,
            idea=idea,
            project_type=project_type,
            complexity=complexity,
            generated_code=code,
        )

        return Response({'code': code})


class GenerateStreamView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        idea = request.data.get('idea', '').strip()
        project_type = request.data.get('project_type', 'Website')
        complexity = request.data.get('complexity', 'Simple')

        if not idea:
            return Response({'error': 'Project idea is required.'}, status=400)

        code = generate_python_code(idea, project_type, complexity)

        def stream():
            for line in code.split('\n'):
                yield f"data: {json.dumps({'chunk': line + chr(10)})}\n\n"
                time.sleep(0.04)
            yield "data: [DONE]\n\n"

            GenerationHistory.objects.create(
                user=request.user,
                idea=idea,
                project_type=project_type,
                complexity=complexity,
                generated_code=code,
            )

        response = StreamingHttpResponse(stream(), content_type='text/event-stream')
        response['Cache-Control'] = 'no-cache'
        response['X-Accel-Buffering'] = 'no'
        return response


class HistoryView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        history = GenerationHistory.objects.filter(user=request.user)[:20]
        return Response(GenerationHistorySerializer(history, many=True).data)
