from rest_framework import viewsets, status, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404
from django.http import HttpResponse
from django.template import Context, Template as DjangoTemplate
from .models import Template, Resume, Experience, Education, Skill
from .serializers import (
    TemplateSerializer,
    TemplateDetailSerializer,
    ResumeSerializer,
    ResumeCreateSerializer,
    ResumeUpdateSerializer,
    ExperienceSerializer,
    EducationSerializer,
    SkillSerializer
)


class IsOwnerOrSessionUser(permissions.BasePermission):
    """
    Custom permission to only allow owners of a resume or session users to edit it.
    """
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed for owner or session user
        if request.user.is_authenticated and obj.user == request.user:
            return True

        # Check session ID for anonymous users
        if hasattr(obj, 'session_id') and obj.session_id:
            return obj.session_id == request.session.session_key

        return False


class TemplateViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for viewing templates.

    list: Get all active templates
    retrieve: Get a specific template with HTML/CSS
    free: List only free templates
    premium: List only premium templates
    """
    queryset = Template.objects.filter(is_active=True)
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return TemplateDetailSerializer
        return TemplateSerializer

    @action(detail=False, methods=['get'])
    def free(self, request):
        """Get only free templates"""
        templates = self.get_queryset().filter(is_premium=False)
        serializer = self.get_serializer(templates, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def premium(self, request):
        """Get only premium templates"""
        templates = self.get_queryset().filter(is_premium=True)
        serializer = self.get_serializer(templates, many=True)
        return Response(serializer.data)


class ResumeViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing resumes.

    list: Get all resumes for authenticated user or session
    create: Create a new resume
    retrieve: Get a specific resume
    update/partial_update: Update a resume (auto-save)
    destroy: Delete a resume
    export_pdf: Export resume as PDF
    """
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['template', 'is_paid', 'payment_type']
    search_fields = ['full_name', 'email', 'title']
    ordering_fields = ['created_at', 'updated_at', 'full_name']
    ordering = ['-updated_at']

    def get_queryset(self):
        """
        Filter resumes by authenticated user or session ID.
        """
        if self.request.user.is_authenticated:
            return Resume.objects.filter(user=self.request.user)

        # For anonymous users, filter by session
        session_key = self.request.session.session_key
        if session_key:
            return Resume.objects.filter(session_id=session_key)

        return Resume.objects.none()

    def get_serializer_class(self):
        if self.action == 'create':
            return ResumeCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return ResumeUpdateSerializer
        return ResumeSerializer

    def perform_create(self, serializer):
        """
        Associate resume with user or session on creation.
        """
        # Create session if it doesn't exist
        if not self.request.session.session_key:
            self.request.session.create()

        serializer.save()

    def perform_update(self, serializer):
        """
        Update last_accessed timestamp on save (for auto-save).
        """
        from django.utils import timezone
        resume = serializer.save()
        resume.last_accessed = timezone.now()
        resume.save(update_fields=['last_accessed'])

    @action(detail=True, methods=['get'])
    def render_html(self, request, pk=None):
        """
        Render resume with its template HTML.

        Returns the compiled HTML with resume data injected.
        """
        resume = self.get_object()

        try:
            # Get template (use default if none selected)
            template = resume.template
            if not template:
                # Get first available template
                template = Template.objects.filter(is_active=True, is_premium=False).first()
                if not template:
                    return Response({
                        'error': 'No template available'
                    }, status=status.HTTP_404_NOT_FOUND)

            # Prepare context data for template
            context_data = {
                'full_name': resume.full_name,
                'email': resume.email,
                'phone': resume.phone,
                'address': resume.address,
                'website': resume.website,
                'linkedin_url': resume.linkedin_url,
                'github_url': resume.github_url,
                'photo': resume.photo.url if resume.photo else None,
                'date_of_birth': resume.date_of_birth,
                'nationality': resume.nationality,
                'driving_license': resume.driving_license,
                'title': resume.title,
                'summary': resume.summary,
                'experience_data': resume.experience_data,
                'education_data': resume.education_data,
                'skills_data': resume.skills_data,
                'languages_data': resume.languages_data,
                'certifications_data': resume.certifications_data,
                'projects_data': resume.projects_data,
                'custom_sections': resume.custom_sections,
            }

            # Render template with context
            django_template = DjangoTemplate(template.template_html)
            context = Context(context_data)
            rendered_html = django_template.render(context)

            return Response({
                'html': rendered_html,
                'css': template.template_css,
                'template_name': template.name,
            })

        except Exception as e:
            return Response({
                'error': 'Failed to render template',
                'detail': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['post'])
    def export_pdf(self, request, pk=None):
        """
        Export resume as PDF.

        Returns PDF file with or without watermark based on payment status.
        """
        resume = self.get_object()

        try:
            # TODO: Implement PDF generation logic
            # This would use WeasyPrint or ReportLab to generate PDF
            # from the template HTML/CSS with resume data

            # For now, return a placeholder response
            return Response({
                'message': 'PDF export functionality to be implemented',
                'can_export_without_watermark': resume.can_export_without_watermark,
                'resume_id': resume.id
            }, status=status.HTTP_501_NOT_IMPLEMENTED)

            # Example implementation would be:
            # pdf_content = generate_pdf(resume)
            # response = HttpResponse(pdf_content, content_type='application/pdf')
            # response['Content-Disposition'] = f'attachment; filename="resume_{resume.id}.pdf"'
            # return response

        except Exception as e:
            return Response({
                'error': 'Failed to generate PDF',
                'detail': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['post'])
    def import_linkedin(self, request):
        """
        Import resume data from LinkedIn profile.

        Expected payload: { "linkedin_url": "..." } or LinkedIn API data
        """
        # TODO: Implement LinkedIn import logic
        return Response({
            'message': 'LinkedIn import functionality to be implemented'
        }, status=status.HTTP_501_NOT_IMPLEMENTED)


class ExperienceViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing experience entries.
    """
    serializer_class = ExperienceSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        """
        Filter experiences by resume ownership.
        """
        resume_id = self.kwargs.get('resume_pk')
        if not resume_id:
            return Experience.objects.none()

        # Verify resume access
        if self.request.user.is_authenticated:
            return Experience.objects.filter(
                resume_id=resume_id,
                resume__user=self.request.user
            )

        session_key = self.request.session.session_key
        if session_key:
            return Experience.objects.filter(
                resume_id=resume_id,
                resume__session_id=session_key
            )

        return Experience.objects.none()

    def perform_create(self, serializer):
        resume_id = self.kwargs.get('resume_pk')
        resume = get_object_or_404(Resume, pk=resume_id)

        # Verify ownership
        if self.request.user.is_authenticated:
            if resume.user != self.request.user:
                raise permissions.PermissionDenied()
        else:
            if resume.session_id != self.request.session.session_key:
                raise permissions.PermissionDenied()

        serializer.save(resume=resume)


class EducationViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing education entries.
    """
    serializer_class = EducationSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        """
        Filter education by resume ownership.
        """
        resume_id = self.kwargs.get('resume_pk')
        if not resume_id:
            return Education.objects.none()

        # Verify resume access
        if self.request.user.is_authenticated:
            return Education.objects.filter(
                resume_id=resume_id,
                resume__user=self.request.user
            )

        session_key = self.request.session.session_key
        if session_key:
            return Education.objects.filter(
                resume_id=resume_id,
                resume__session_id=session_key
            )

        return Education.objects.none()

    def perform_create(self, serializer):
        resume_id = self.kwargs.get('resume_pk')
        resume = get_object_or_404(Resume, pk=resume_id)

        # Verify ownership
        if self.request.user.is_authenticated:
            if resume.user != self.request.user:
                raise permissions.PermissionDenied()
        else:
            if resume.session_id != self.request.session.session_key:
                raise permissions.PermissionDenied()

        serializer.save(resume=resume)


class SkillViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing skill entries.
    """
    serializer_class = SkillSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        """
        Filter skills by resume ownership.
        """
        resume_id = self.kwargs.get('resume_pk')
        if not resume_id:
            return Skill.objects.none()

        # Verify resume access
        if self.request.user.is_authenticated:
            return Skill.objects.filter(
                resume_id=resume_id,
                resume__user=self.request.user
            )

        session_key = self.request.session.session_key
        if session_key:
            return Skill.objects.filter(
                resume_id=resume_id,
                resume__session_id=session_key
            )

        return Skill.objects.none()

    def perform_create(self, serializer):
        resume_id = self.kwargs.get('resume_pk')
        resume = get_object_or_404(Resume, pk=resume_id)

        # Verify ownership
        if self.request.user.is_authenticated:
            if resume.user != self.request.user:
                raise permissions.PermissionDenied()
        else:
            if resume.session_id != self.request.session.session_key:
                raise permissions.PermissionDenied()

        serializer.save(resume=resume)
