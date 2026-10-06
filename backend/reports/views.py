from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import MedicalReport
from .serializers import MedicalReportSerializer
from notifications.models import Notification

class MedicalReportViewSet(viewsets.ModelViewSet):
    serializer_class = MedicalReportSerializer

    def get_permissions(self):
        if self.action in ['verify']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return MedicalReport.objects.none()
        if user.role in ['admin', 'staff', 'doctor']:
            return MedicalReport.objects.all().order_by('-created_at')
        return MedicalReport.objects.filter(patient=user).order_by('-created_at')

    def perform_create(self, serializer):
        report = serializer.save()
        # When a report is created/published, update booking status
        booking = report.booking
        booking.status = 'REPORT_READY'
        booking.save()

        # Send notification to patient
        Notification.objects.create(
            user=report.patient,
            title=f"Lab Report Ready: {report.report_id}",
            message=f"Your diagnostic test report for booking {booking.booking_id} is ready for download.",
            notification_type='REPORT_READY',
            link=f"/dashboard/reports"
        )

    @action(detail=False, methods=['get'], url_path='verify/(?P<code>[^/.]+)')
    def verify(self, request, code=None):
        try:
            report = MedicalReport.objects.get(verification_code=code)
            return Response({
                'valid': True,
                'report_id': report.report_id,
                'patient_name': report.patient.get_full_name() or report.patient.username,
                'reported_at': report.reported_at,
                'doctor_name': report.doctor_name,
                'summary': report.overall_summary,
                'center': 'ACCUSURE DIAGNOSTICS, Jamshedpur',
                'parameters_data': report.parameters_data
            })
        except MedicalReport.DoesNotExist:
            return Response({'valid': False, 'message': 'Report not found or invalid QR verification code.'}, status=status.HTTP_404_NOT_FOUND)
