from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponseRedirect

urlpatterns = [
    path('', lambda request: HttpResponseRedirect('http://localhost:5173')),
    path('admin/', admin.site.urls),
    path('api/auth/', include('users.urls')),
    path('api/', include('generator.urls')),
]
