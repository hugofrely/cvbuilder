# Custom migration to add default UUID generation to allauth tables

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0008_migrate_m2m_tables_to_uuid'),
    ]

    operations = [
        # Add default UUID generation to all allauth tables
        migrations.RunSQL(
            """
            -- socialaccount_socialaccount
            ALTER TABLE socialaccount_socialaccount
            ALTER COLUMN id SET DEFAULT gen_random_uuid();

            -- socialaccount_socialapp
            ALTER TABLE socialaccount_socialapp
            ALTER COLUMN id SET DEFAULT gen_random_uuid();

            -- socialaccount_socialtoken
            ALTER TABLE socialaccount_socialtoken
            ALTER COLUMN id SET DEFAULT gen_random_uuid();

            -- account_emailaddress
            ALTER TABLE account_emailaddress
            ALTER COLUMN id SET DEFAULT gen_random_uuid();

            -- account_emailconfirmation
            ALTER TABLE account_emailconfirmation
            ALTER COLUMN id SET DEFAULT gen_random_uuid();

            -- socialaccount_socialapp_sites
            ALTER TABLE socialaccount_socialapp_sites
            ALTER COLUMN id SET DEFAULT gen_random_uuid();
            """,
            reverse_sql="""
            ALTER TABLE socialaccount_socialaccount ALTER COLUMN id DROP DEFAULT;
            ALTER TABLE socialaccount_socialapp ALTER COLUMN id DROP DEFAULT;
            ALTER TABLE socialaccount_socialtoken ALTER COLUMN id DROP DEFAULT;
            ALTER TABLE account_emailaddress ALTER COLUMN id DROP DEFAULT;
            ALTER TABLE account_emailconfirmation ALTER COLUMN id DROP DEFAULT;
            ALTER TABLE socialaccount_socialapp_sites ALTER COLUMN id DROP DEFAULT;
            """
        ),
    ]
