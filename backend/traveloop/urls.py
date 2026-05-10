"""
Traveloop project URL configuration.
All API endpoints are namespaced under /api/.
"""

from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse


def api_root(request):
    """Root endpoint — API health check (fixes the localhost:8000/ 404)."""
    return JsonResponse({
        'status': 'ok',
        'project': 'Traveloop',
        'version': '1.0.0',
        'message': 'Traveloop API is running. Use /api/ endpoints or /admin/ for dashboard.',
        'endpoints': {
            'auth':      '/api/auth/',
            'trips':     '/api/trips/',
            'budget':    '/api/budget/',
            'checklist': '/api/checklist/',
            'users':     '/api/users/',
            'admin':     '/admin/',
        }
    })


urlpatterns = [
    path('', api_root, name='api-root'),
    path('admin/', admin.site.urls),
    path('api/auth/', include('users.urls_auth')),
    path('api/trips/', include('trips.urls')),
    path('api/budget/', include('budget.urls')),
    path('api/checklist/', include('checklist.urls')),
    path('api/users/', include('users.urls')),
]
