from django.urls import path
from .views import GenerateView, GenerateStreamView, HistoryView

urlpatterns = [
    path('generate/', GenerateView.as_view(), name='generate'),
    path('generate/stream/', GenerateStreamView.as_view(), name='generate-stream'),
    path('history/', HistoryView.as_view(), name='history'),
]
