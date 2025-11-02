from django.apps import AppConfig


class UsersConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'users'

    def ready(self):
        """Import signals when app is ready"""
        import users.signals  # noqa

        # Patch allauth models to use UUID
        import uuid
        from django.db import models

        try:
            from allauth.socialaccount import models as socialaccount_models
            from allauth.account import models as account_models

            def replace_id_field_with_uuid(model_class):
                """Replace AutoField id with UUIDField"""
                # Remove old id field from local_fields
                model_class._meta.local_fields = [
                    f for f in model_class._meta.local_fields if f.name != 'id'
                ]

                # Create and add new UUID field
                uuid_field = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
                uuid_field.set_attributes_from_name('id')
                uuid_field.model = model_class
                uuid_field.contribute_to_class(model_class, 'id')

                # Update _meta
                model_class._meta.pk = uuid_field
                model_class._meta.auto_field = None

            # Apply to all allauth models
            replace_id_field_with_uuid(socialaccount_models.SocialAccount)
            replace_id_field_with_uuid(socialaccount_models.SocialApp)
            replace_id_field_with_uuid(socialaccount_models.SocialToken)
            replace_id_field_with_uuid(account_models.EmailAddress)
            replace_id_field_with_uuid(account_models.EmailConfirmation)

        except Exception as e:
            print(f"Warning: Could not patch allauth models: {e}")
