from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['email', 'username', 'is_premium', 'subscription_type', 'is_staff', 'created_at']
    list_filter = ['is_premium', 'subscription_type', 'is_staff', 'is_superuser', 'is_active']
    search_fields = ['email', 'username', 'first_name', 'last_name']
    ordering = ['-created_at']

    fieldsets = BaseUserAdmin.fieldsets + (
        ('Subscription Information', {
            'fields': ('is_premium', 'subscription_type', 'subscription_start_date',
                      'subscription_end_date', 'stripe_customer_id', 'stripe_subscription_id')
        }),
        ('Extra Info', {
            'fields': ('phone', 'created_at', 'updated_at')
        }),
    )

    readonly_fields = ['created_at', 'updated_at']
