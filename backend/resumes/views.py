from rest_framework import viewsets, status, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404
from django.http import HttpResponse
from django.template import Context, Template as DjangoTemplate
from pybars import Compiler
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

    list: Get all active templates with pagination and filtering
    retrieve: Get a specific template with HTML/CSS
    free: List only free templates (without pagination)
    premium: List only premium templates (without pagination)
    """
    queryset = Template.objects.filter(is_active=True)
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['is_premium']
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return TemplateDetailSerializer
        return TemplateSerializer

    @action(detail=False, methods=['get'])
    def free(self, request):
        """Get only free templates (without pagination)"""
        templates = self.get_queryset().filter(is_premium=False)
        serializer = self.get_serializer(templates, many=True)
        return Response({'count': len(templates), 'results': serializer.data})

    @action(detail=False, methods=['get'])
    def premium(self, request):
        """Get only premium templates (without pagination)"""
        templates = self.get_queryset().filter(is_premium=True)
        serializer = self.get_serializer(templates, many=True)
        return Response({'count': len(templates), 'results': serializer.data})


class ResumeViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing resumes.

    list: Get all resumes for authenticated user or session
    create: Create a new resume
    retrieve: Get a specific resume
    update/partial_update: Update a resume (auto-save)
    destroy: Delete a resume
    export_pdf: Export resume as PDF
    upload_photo: Upload a photo for the resume
    delete_photo: Delete the resume photo
    """
    permission_classes = [permissions.AllowAny]
    parser_classes = [JSONParser, MultiPartParser, FormParser]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['template', 'is_paid', 'payment_type']
    search_fields = ['full_name', 'email', 'title']
    ordering_fields = ['created_at', 'updated_at', 'full_name']
    ordering = ['-updated_at']

    def get_queryset(self):
        """
        Filter resumes by authenticated user or session ID.

        Logic:
        - Authenticated users: show only resumes linked to their user account
        - Anonymous users: show only resumes linked to their session that have NO user
        """
        import logging
        logger = logging.getLogger(__name__)

        is_authenticated = self.request.user.is_authenticated
        logger.info(f"ResumeViewSet.get_queryset() - user.is_authenticated: {is_authenticated}")

        if is_authenticated:
            # Show only resumes linked to this user
            logger.info(f"ResumeViewSet.get_queryset() - Authenticated user: {self.request.user.id}")
            return Resume.objects.filter(user=self.request.user)

        # For anonymous users, filter by session AND ensure no user is linked
        session_key = self.request.session.session_key
        logger.info(f"ResumeViewSet.get_queryset() - Anonymous user with session_key: {session_key}")
        if session_key:
            return Resume.objects.filter(
                session_id=session_key,
                user__isnull=True  # Only resumes not yet linked to a user
            )

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
                'city': resume.city,
                'postal_code': resume.postal_code,
                'website': resume.website,
                'linkedin_url': resume.linkedin_url,
                'github_url': resume.github_url,
                'photo': resume.photo.url if resume.photo else None,
                'date_of_birth': resume.date_of_birth,
                'nationality': resume.nationality,
                'driving_license': resume.driving_license,
                'title': resume.title,
                'summary': resume.summary,
                'experience_data': resume.experience_data or [],
                'education_data': resume.education_data or [],
                'skills_data': resume.skills_data or [],
                'languages_data': resume.languages_data or [],
                'certifications_data': resume.certifications_data or [],
                'projects_data': resume.projects_data or [],
                'custom_sections': resume.custom_sections or [],
            }

            # Render template with Handlebars (pybars)
            compiler = Compiler()

            # Register custom helpers for Handlebars
            def first_helper(this, value, count):
                """Helper to get first N characters of a string"""
                if value:
                    return str(value)[:int(count)]
                return ''

            handlebars_template = compiler.compile(template.template_html)
            rendered_html = handlebars_template(context_data, helpers={'first': first_helper})

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

        Logic:
        1. Check if template is premium
        2. Check if user can export (is premium user OR has paid for this CV)
        3. Generate PDF with WeasyPrint
        4. Add watermark if not paid and template is premium
        5. Return PDF file or payment required error
        """
        resume = self.get_object()

        try:
            from datetime import datetime
            from .pdf_service import PDFGenerationService
            import logging

            logger = logging.getLogger(__name__)
            logger.info(f'Starting PDF export for resume {resume.id}')

            # Get template (use default if none selected)
            template = resume.template
            if not template:
                logger.warning(f'No template set for resume {resume.id}, using default')
                # Get first available free template
                template = Template.objects.filter(is_active=True, is_premium=False).first()
                if not template:
                    logger.error('No template available in database')
                    return Response({
                        'error': 'No template available'
                    }, status=status.HTTP_404_NOT_FOUND)

            logger.info(f'Using template {template.id} (premium: {template.is_premium})')

            # Check if user can export without payment
            # Free templates: always exportable
            # Premium templates: need to be premium user or have paid for this CV
            if template.is_premium:
                # Check if user is premium
                user_is_premium = False
                if request.user.is_authenticated:
                    user_is_premium = getattr(request.user, 'is_premium', False)

                # Check if this specific CV has been paid for
                cv_is_paid = resume.is_paid

                if not user_is_premium and not cv_is_paid:
                    return Response({
                        'error': 'Payment required',
                        'message': 'Ce modèle est premium. Veuillez devenir membre Premium ou payer pour ce CV.',
                        'template_is_premium': True,
                        'requires_payment': True,
                        'payment_options': {
                            'per_cv': 2.40,
                            'premium_unlimited': 24.00
                        }
                    }, status=status.HTTP_402_PAYMENT_REQUIRED)

            # Prepare context data for template
            # Using flat structure to match Handlebars template expectations
            import json

            context_data = {
                # Personal Information (flat structure for Handlebars)
                'full_name': resume.full_name or '',
                'first_name': resume.full_name.split()[0] if resume.full_name else '',
                'last_name': ' '.join(resume.full_name.split()[1:]) if resume.full_name and len(resume.full_name.split()) > 1 else '',
                'email': resume.email or '',
                'phone': resume.phone or '',
                'address': resume.address or '',
                'city': resume.city or '',
                'postal_code': resume.postal_code or '',
                'website': resume.website or '',
                'linkedin_url': resume.linkedin_url or '',
                'github_url': resume.github_url or '',
                'title': resume.title or '',
                'date_of_birth': str(resume.date_of_birth) if resume.date_of_birth else '',
                'nationality': resume.nationality or '',
                'driving_license': resume.driving_license or '',

                # Professional content
                'summary': resume.summary or '',
                'experience': resume.experience_data or [],
                'education': resume.education_data or [],
                'skills': resume.skills_data or [],
                'languages': resume.languages_data or [],
                'hobbies': [],
                'references': [],

                # Alternative naming conventions (for compatibility)
                'experiences': resume.experience_data or [],
                'educations': resume.education_data or [],
            }

            # Generate PDF with Playwright
            # This supports JavaScript templates (Handlebars, etc.)
            logger.info('Generating PDF with Playwright')

            # Get HTML and CSS from template
            html_content = template.template_html or ''
            css_content = template.template_css or ''

            # Generate PDF using Playwright service
            pdf_content = PDFGenerationService.generate_pdf_sync(
                html_content=html_content,
                css_content=css_content,
                cv_data=context_data,
                filename=f"{resume.id}.pdf"
            )

            logger.info(f'PDF generated successfully: {len(pdf_content)} bytes')

            # Generate filename
            safe_name = resume.full_name.replace(' ', '_') if resume.full_name else f'CV_{resume.id}'
            timestamp = datetime.now().strftime('%Y%m%d')
            filename = f'{safe_name}_{timestamp}.pdf'

            # Create response
            response = HttpResponse(pdf_content, content_type='application/pdf')
            response['Content-Disposition'] = f'attachment; filename="{filename}"'
            response['X-Resume-ID'] = str(resume.id)
            response['X-Template-Premium'] = str(template.is_premium)

            return response

        except Template.DoesNotExist:
            return Response({
                'error': 'Template not found',
                'detail': 'Le modèle sélectionné n\'existe pas'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            import traceback
            return Response({
                'error': 'Failed to generate PDF',
                'detail': str(e),
                'traceback': traceback.format_exc()
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['get'])
    def get_or_create_draft(self, request):
        """
        Get or create a draft resume for the current session/user.

        This endpoint prevents duplicate resume creation by ensuring
        only one draft exists per session/user at a time.

        Returns the most recently updated resume, or creates a new one if none exists.
        """
        try:
            # Get the user's resumes (filtered by session or user in get_queryset)
            resumes = self.get_queryset()

            if resumes.exists():
                # Return the most recently updated resume
                resume = resumes.first()  # Already ordered by -updated_at
                serializer = self.get_serializer(resume)
                return Response({
                    'resume': serializer.data,
                    'is_new': False,
                })
            else:
                # Create a new draft resume
                # Create session if it doesn't exist
                if not request.session.session_key:
                    request.session.create()

                resume_data = {
                    'full_name': '',
                    'email': '',
                    'phone': '',
                }

                serializer = ResumeCreateSerializer(
                    data=resume_data,
                    context={'request': request}
                )
                serializer.is_valid(raise_exception=True)
                resume = serializer.save()

                return Response({
                    'resume': ResumeSerializer(resume).data,
                    'is_new': True,
                }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({
                'error': 'Failed to get or create draft',
                'detail': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['post'])
    def migrate_anonymous(self, request):
        """
        Migrate anonymous resume data from session to authenticated user account.

        This endpoint is called after login/signup to transfer any CV data that was
        created while the user was using a session (not logged in).

        The migration process:
        1. Find all resumes linked to the current session (session_id)
        2. Link them to the authenticated user account
        3. Clear the session_id to prevent duplicate access

        Returns the number of resumes migrated.
        """
        if not request.user.is_authenticated:
            return Response({
                'error': 'Authentication required'
            }, status=status.HTTP_401_UNAUTHORIZED)

        try:
            session_key = request.session.session_key

            if not session_key:
                return Response({
                    'message': 'No session data to migrate',
                    'migrated_count': 0
                }, status=status.HTTP_200_OK)

            # Find all resumes linked to this session
            session_resumes = Resume.objects.filter(
                session_id=session_key,
                user__isnull=True  # Only resumes not yet linked to a user
            )

            migrated_count = session_resumes.count()

            if migrated_count == 0:
                return Response({
                    'message': 'No session resumes to migrate',
                    'migrated_count': 0
                }, status=status.HTTP_200_OK)

            # Link all session resumes to the authenticated user
            session_resumes.update(
                user=request.user,
                session_id=None  # Clear session_id after migration
            )

            # Get the IDs of migrated resumes
            migrated_ids = list(session_resumes.values_list('id', flat=True))

            return Response({
                'message': f'{migrated_count} resume(s) migrated successfully',
                'migrated_count': migrated_count,
                'resume_ids': migrated_ids,
                'action': 'migrated'
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                'error': 'Failed to migrate anonymous resumes',
                'detail': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['post'], parser_classes=[MultiPartParser, FormParser])
    def upload_photo(self, request, pk=None):
        """
        Upload a photo for the resume.

        Expects a multipart/form-data request with a 'photo' file field.
        Supported formats: JPG, JPEG, PNG, GIF
        Max file size: 5MB (enforced by Django settings)

        Returns the updated resume with the photo URL.
        """
        resume = self.get_object()

        try:
            # Check if photo file is in request
            if 'photo' not in request.FILES:
                return Response({
                    'error': 'No photo file provided',
                    'detail': 'Please include a photo file in the request'
                }, status=status.HTTP_400_BAD_REQUEST)

            photo_file = request.FILES['photo']

            # Validate file type
            allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
            if photo_file.content_type not in allowed_types:
                return Response({
                    'error': 'Invalid file type',
                    'detail': f'Only JPG, PNG and GIF images are allowed. Got: {photo_file.content_type}'
                }, status=status.HTTP_400_BAD_REQUEST)

            # Validate file size (5MB max)
            max_size = 5 * 1024 * 1024  # 5MB in bytes
            if photo_file.size > max_size:
                return Response({
                    'error': 'File too large',
                    'detail': f'Maximum file size is 5MB. Your file is {photo_file.size / 1024 / 1024:.2f}MB'
                }, status=status.HTTP_400_BAD_REQUEST)

            # Delete old photo if exists
            if resume.photo:
                resume.photo.delete(save=False)

            # Save new photo
            resume.photo = photo_file
            resume.save(update_fields=['photo'])

            # Return updated resume
            serializer = ResumeSerializer(resume)

            return Response({
                'message': 'Photo uploaded successfully',
                'photo_url': resume.photo.url if resume.photo else None,
                'resume': serializer.data
            }, status=status.HTTP_200_OK)

        except Exception as e:
            import traceback
            return Response({
                'error': 'Failed to upload photo',
                'detail': str(e),
                'traceback': traceback.format_exc()
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['delete'])
    def delete_photo(self, request, pk=None):
        """
        Delete the resume photo.

        Returns the updated resume without the photo.
        """
        resume = self.get_object()

        try:
            if not resume.photo:
                return Response({
                    'message': 'No photo to delete',
                }, status=status.HTTP_200_OK)

            # Delete the photo file
            resume.photo.delete(save=True)

            # Return updated resume
            serializer = ResumeSerializer(resume)

            return Response({
                'message': 'Photo deleted successfully',
                'resume': serializer.data
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                'error': 'Failed to delete photo',
                'detail': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


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
