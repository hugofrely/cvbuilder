from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_nested import routers
from .views import (
    TemplateViewSet,
    ResumeViewSet,
    ExperienceViewSet,
    EducationViewSet,
    SkillViewSet
)

app_name = 'resumes'

# Main router with trailing_slash=False to match APPEND_SLASH=False
router = DefaultRouter(trailing_slash=False)
router.register(r'templates', TemplateViewSet, basename='template')
router.register(r'resumes', ResumeViewSet, basename='resume')

# Nested routers for resume sub-resources
resumes_router = routers.NestedDefaultRouter(router, r'resumes', lookup='resume', trailing_slash=False)
resumes_router.register(r'experiences', ExperienceViewSet, basename='resume-experiences')
resumes_router.register(r'education', EducationViewSet, basename='resume-education')
resumes_router.register(r'skills', SkillViewSet, basename='resume-skills')

urlpatterns = [
    path('', include(router.urls)),
    path('', include(resumes_router.urls)),
]
