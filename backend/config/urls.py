from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from .dashboard_views import AdminDashboardStatsView

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Core API endpoints specified in requirements
    path('api/auth/', include('accounts.urls')),
    path('api/tests/', include('lab_tests.urls')),
    path('api/bookings/', include('bookings.urls')),
    path('api/reports/', include('reports.urls')),
    path('api/billing/', include('billing.urls')),
    path('api/inventory/', include('inventory.urls')),
    path('api/notifications/', include('notifications.urls')),
    path('api/doctors/', include('doctors.urls')),
    path('api/patients/', include('patients.urls')),
    
    # Analytics & Dashboard
    path('api/dashboard/stats/', AdminDashboardStatsView.as_view(), name='dashboard_stats'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
