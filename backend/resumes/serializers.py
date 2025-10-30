from rest_framework import serializers
from .models import Template, Resume, Experience, Education, Skill


class TemplateSerializer(serializers.ModelSerializer):
    """Template serializer"""

    # Override thumbnail field to return raw value instead of full URL
    thumbnail = serializers.CharField(read_only=True)

    class Meta:
        model = Template
        fields = [
            'id', 'name', 'description', 'thumbnail', 'is_premium',
            'is_active', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class TemplateDetailSerializer(serializers.ModelSerializer):
    """Template detail serializer with HTML/CSS"""

    # Override thumbnail field to return raw value instead of full URL
    thumbnail = serializers.CharField(read_only=True)

    class Meta:
        model = Template
        fields = [
            'id', 'name', 'description', 'thumbnail', 'is_premium',
            'is_active', 'template_html', 'template_css', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class ExperienceSerializer(serializers.ModelSerializer):
    """Experience serializer"""

    class Meta:
        model = Experience
        fields = [
            'id', 'company', 'position', 'location', 'start_date',
            'end_date', 'is_current', 'description', 'work_mode', 'order'
        ]
        read_only_fields = ['id']


class EducationSerializer(serializers.ModelSerializer):
    """Education serializer"""

    class Meta:
        model = Education
        fields = [
            'id', 'institution', 'degree', 'field_of_study', 'location',
            'start_date', 'end_date', 'is_current', 'grade', 'description', 'work_mode', 'order'
        ]
        read_only_fields = ['id']


class SkillSerializer(serializers.ModelSerializer):
    """Skill serializer"""

    class Meta:
        model = Skill
        fields = ['id', 'name', 'level', 'category', 'order']
        read_only_fields = ['id']


class ResumeSerializer(serializers.ModelSerializer):
    """Resume serializer"""

    experiences = ExperienceSerializer(many=True, read_only=True)
    education = EducationSerializer(many=True, read_only=True)
    skills = SkillSerializer(many=True, read_only=True)
    template_name = serializers.CharField(source='template.name', read_only=True)
    can_export_without_watermark = serializers.BooleanField(read_only=True)

    class Meta:
        model = Resume
        fields = [
            'id', 'session_id', 'user', 'template', 'template_name',
            'full_name', 'email', 'phone', 'address', 'city', 'postal_code',
            'website', 'linkedin_url', 'github_url', 'photo', 'date_of_birth',
            'nationality', 'driving_license', 'summary', 'title',
            'experience_data', 'education_data', 'skills_data',
            'languages_data', 'certifications_data', 'projects_data',
            'custom_sections', 'is_paid', 'payment_type',
            'experiences', 'education', 'skills',
            'can_export_without_watermark',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']

    def create(self, validated_data):
        request = self.context.get('request')

        # If user is authenticated, associate resume with user
        if request and request.user.is_authenticated:
            validated_data['user'] = request.user
        # Otherwise, use session ID for anonymous users
        elif request and request.session.session_key:
            validated_data['session_id'] = request.session.session_key
        else:
            # Create a session if one doesn't exist
            if request:
                request.session.create()
                validated_data['session_id'] = request.session.session_key

        return super().create(validated_data)


class ResumeCreateSerializer(serializers.ModelSerializer):
    """Simplified serializer for creating resumes"""

    template = serializers.PrimaryKeyRelatedField(
        queryset=Template.objects.all(),
        required=False,
        allow_null=True
    )
    full_name = serializers.CharField(max_length=255, required=False, allow_blank=True)
    email = serializers.EmailField(required=False, allow_blank=True)
    phone = serializers.CharField(max_length=20, required=False, allow_blank=True)
    address = serializers.CharField(required=False, allow_blank=True)
    website = serializers.URLField(required=False, allow_blank=True)
    linkedin_url = serializers.URLField(required=False, allow_blank=True)
    github_url = serializers.URLField(required=False, allow_blank=True)
    summary = serializers.CharField(required=False, allow_blank=True)
    title = serializers.CharField(max_length=255, required=False, allow_blank=True)
    date_of_birth = serializers.DateField(required=False, allow_null=True)
    nationality = serializers.CharField(max_length=100, required=False, allow_blank=True)
    driving_license = serializers.CharField(max_length=100, required=False, allow_blank=True)

    class Meta:
        model = Resume
        fields = [
            'id', 'template', 'full_name', 'email', 'phone', 'address',
            'website', 'linkedin_url', 'github_url', 'date_of_birth',
            'nationality', 'driving_license', 'summary', 'title',
            'experience_data', 'education_data', 'skills_data',
            'languages_data', 'certifications_data', 'projects_data',
            'custom_sections'
        ]
        read_only_fields = ['id']

    def create(self, validated_data):
        request = self.context.get('request')

        # If user is authenticated, associate resume with user
        if request and request.user.is_authenticated:
            validated_data['user'] = request.user
        # Otherwise, use session ID for anonymous users
        elif request:
            if not request.session.session_key:
                request.session.create()
            validated_data['session_id'] = request.session.session_key

        return Resume.objects.create(**validated_data)


class ResumeUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating resumes"""

    class Meta:
        model = Resume
        fields = [
            'template', 'full_name', 'email', 'phone', 'address', 'city', 'postal_code',
            'website', 'linkedin_url', 'github_url', 'date_of_birth',
            'nationality', 'driving_license', 'summary', 'title',
            'experience_data', 'education_data', 'skills_data',
            'languages_data', 'certifications_data', 'projects_data',
            'custom_sections'
        ]
        # Note: 'photo' is excluded - file uploads should be handled separately
        # via multipart/form-data using a dedicated endpoint
