from django.db import models
from django.conf import settings
import uuid


class Template(models.Model):
    """CV Template model"""

    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    thumbnail = models.ImageField(upload_to='templates/', blank=True, null=True)
    is_premium = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    template_html = models.TextField(help_text="HTML template with placeholders")
    template_css = models.TextField(help_text="CSS styling for the template")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'templates'
        ordering = ['is_premium', '-created_at']

    def __str__(self):
        return f"{self.name} ({'Premium' if self.is_premium else 'Free'})"


class Resume(models.Model):
    """Resume/CV model - stores user CV data"""

    # Session ID for anonymous users
    session_id = models.CharField(max_length=255, blank=True, null=True, db_index=True)

    # User (optional - only after they register/login)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='resumes',
        blank=True,
        null=True
    )

    # Template selection (optional)
    template = models.ForeignKey(
        Template,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='resumes'
    )

    # Personal Information
    full_name = models.CharField(max_length=255, blank=True)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    website = models.URLField(blank=True)
    linkedin_url = models.URLField(blank=True)
    github_url = models.URLField(blank=True)
    photo = models.ImageField(upload_to='resumes/photos/', blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True, help_text="Date of birth")
    nationality = models.CharField(max_length=100, blank=True, help_text="Nationality")
    driving_license = models.CharField(max_length=100, blank=True, help_text="Driving license type")

    # Professional Summary
    summary = models.TextField(blank=True)

    # Title/Headline
    title = models.CharField(max_length=255, blank=True, help_text="Job title or headline")

    # Store JSON data for flexible sections
    experience_data = models.JSONField(default=list, blank=True)
    education_data = models.JSONField(default=list, blank=True)
    skills_data = models.JSONField(default=list, blank=True)
    languages_data = models.JSONField(default=list, blank=True)
    certifications_data = models.JSONField(default=list, blank=True)
    projects_data = models.JSONField(default=list, blank=True)
    custom_sections = models.JSONField(default=list, blank=True)

    # Payment status
    is_paid = models.BooleanField(default=False)
    payment_type = models.CharField(
        max_length=20,
        choices=[
            ('free', 'Free'),
            ('single', 'Single Purchase'),
            ('subscription', 'Subscription'),
        ],
        default='free'
    )

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_accessed = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'resumes'
        ordering = ['-updated_at']
        indexes = [
            models.Index(fields=['session_id']),
            models.Index(fields=['user']),
        ]

    def __str__(self):
        return f"{self.full_name} - {self.title or 'Resume'}"

    @property
    def can_export_without_watermark(self):
        """Check if resume can be exported without watermark"""
        if self.is_paid:
            return True
        if self.user and self.user.is_premium and self.user.is_subscription_active:
            return True
        if not self.template or not self.template.is_premium:
            return True
        return False


class Experience(models.Model):
    """Work Experience model"""

    resume = models.ForeignKey(Resume, on_delete=models.CASCADE, related_name='experiences')
    company = models.CharField(max_length=255)
    position = models.CharField(max_length=255)
    location = models.CharField(max_length=255, blank=True)
    start_date = models.DateField()
    end_date = models.DateField(blank=True, null=True)
    is_current = models.BooleanField(default=False)
    description = models.TextField(blank=True)
    order = models.IntegerField(default=0)

    class Meta:
        db_table = 'experiences'
        ordering = ['resume', '-start_date', 'order']

    def __str__(self):
        return f"{self.position} at {self.company}"


class Education(models.Model):
    """Education model"""

    resume = models.ForeignKey(Resume, on_delete=models.CASCADE, related_name='education')
    institution = models.CharField(max_length=255)
    degree = models.CharField(max_length=255)
    field_of_study = models.CharField(max_length=255, blank=True)
    location = models.CharField(max_length=255, blank=True)
    start_date = models.DateField()
    end_date = models.DateField(blank=True, null=True)
    is_current = models.BooleanField(default=False)
    grade = models.CharField(max_length=50, blank=True)
    description = models.TextField(blank=True)
    order = models.IntegerField(default=0)

    class Meta:
        db_table = 'education'
        ordering = ['resume', '-start_date', 'order']

    def __str__(self):
        return f"{self.degree} at {self.institution}"


class Skill(models.Model):
    """Skills model"""

    resume = models.ForeignKey(Resume, on_delete=models.CASCADE, related_name='skills')
    name = models.CharField(max_length=100)
    level = models.CharField(
        max_length=20,
        choices=[
            ('beginner', 'Beginner'),
            ('intermediate', 'Intermediate'),
            ('advanced', 'Advanced'),
            ('expert', 'Expert'),
        ],
        default='intermediate'
    )
    category = models.CharField(max_length=100, blank=True, help_text="e.g., Programming, Design, Languages")
    order = models.IntegerField(default=0)

    class Meta:
        db_table = 'skills'
        ordering = ['resume', 'category', 'order']

    def __str__(self):
        return f"{self.name} ({self.level})"
