from django.contrib import admin
from .models import Template, Resume, Experience, Education, Skill


@admin.register(Template)
class TemplateAdmin(admin.ModelAdmin):
    list_display = ['name', 'is_premium', 'is_active', 'created_at']
    list_filter = ['is_premium', 'is_active']
    search_fields = ['name', 'description']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(Resume)
class ResumeAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'email', 'template', 'user', 'is_paid', 'payment_type', 'created_at']
    list_filter = ['is_paid', 'payment_type', 'template', 'created_at']
    search_fields = ['full_name', 'email', 'session_id']
    readonly_fields = ['created_at', 'updated_at', 'last_accessed']
    fieldsets = (
        ('Identification', {
            'fields': ('session_id', 'user', 'template')
        }),
        ('Informations personnelles', {
            'fields': ('full_name', 'email', 'phone', 'address', 'website', 'linkedin_url', 'github_url', 'photo')
        }),
        ('Contenu CV', {
            'fields': ('title', 'summary', 'experience_data', 'education_data', 'skills_data',
                      'languages_data', 'certifications_data', 'projects_data', 'custom_sections')
        }),
        ('Paiement', {
            'fields': ('is_paid', 'payment_type')
        }),
        ('Dates', {
            'fields': ('created_at', 'updated_at', 'last_accessed')
        }),
    )


@admin.register(Experience)
class ExperienceAdmin(admin.ModelAdmin):
    list_display = ['position', 'company', 'resume', 'start_date', 'is_current']
    list_filter = ['is_current', 'start_date']
    search_fields = ['position', 'company', 'resume__full_name']


@admin.register(Education)
class EducationAdmin(admin.ModelAdmin):
    list_display = ['degree', 'institution', 'resume', 'start_date', 'is_current']
    list_filter = ['is_current', 'start_date']
    search_fields = ['degree', 'institution', 'resume__full_name']


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ['name', 'level', 'category', 'resume']
    list_filter = ['level', 'category']
    search_fields = ['name', 'resume__full_name']
