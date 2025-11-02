# Custom migration to convert allauth foreign keys to UUID

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0005_switch_to_uuid_primary_key'),
    ]

    operations = [
        # Step 1: Add temporary UUID columns for foreign keys
        migrations.RunSQL(
            """
            -- Add temporary UUID columns to socialaccount_socialaccount
            ALTER TABLE socialaccount_socialaccount
            ADD COLUMN user_id_uuid uuid;

            -- Add temporary UUID columns to account_emailaddress
            ALTER TABLE account_emailaddress
            ADD COLUMN user_id_uuid uuid;
            """,
            reverse_sql="""
            ALTER TABLE socialaccount_socialaccount DROP COLUMN IF EXISTS user_id_uuid;
            ALTER TABLE account_emailaddress DROP COLUMN IF EXISTS user_id_uuid;
            """
        ),

        # Step 2: Map old integer user_id to new UUID by matching emails
        migrations.RunSQL(
            """
            -- Update socialaccount_socialaccount by matching email in extra_data with users table
            UPDATE socialaccount_socialaccount ssa
            SET user_id_uuid = u.id
            FROM users u
            WHERE u.email = (ssa.extra_data::jsonb)->>'email';

            -- Update account_emailaddress by matching email with users table
            UPDATE account_emailaddress aea
            SET user_id_uuid = u.id
            FROM users u
            WHERE u.email = aea.email;

            -- Delete orphaned records (socialaccount entries without matching users)
            DELETE FROM socialaccount_socialtoken WHERE account_id IN (
                SELECT id FROM socialaccount_socialaccount WHERE user_id_uuid IS NULL
            );
            DELETE FROM socialaccount_socialaccount WHERE user_id_uuid IS NULL;
            DELETE FROM account_emailconfirmation WHERE email_address_id IN (
                SELECT id FROM account_emailaddress WHERE user_id_uuid IS NULL
            );
            DELETE FROM account_emailaddress WHERE user_id_uuid IS NULL;
            """,
            reverse_sql=migrations.RunSQL.noop
        ),

        # Step 3: Drop old foreign key constraints
        migrations.RunSQL(
            """
            -- Drop FK constraints on socialaccount tables
            ALTER TABLE socialaccount_socialaccount
            DROP CONSTRAINT IF EXISTS socialaccount_social_user_id_8146e70c_fk_users_id;

            ALTER TABLE account_emailaddress
            DROP CONSTRAINT IF EXISTS account_emailaddres_user_id_2c513194_fk_users_id;
            """,
            reverse_sql=migrations.RunSQL.noop
        ),

        # Step 4: Drop old user_id columns and rename UUID columns
        migrations.RunSQL(
            """
            -- socialaccount_socialaccount
            ALTER TABLE socialaccount_socialaccount DROP COLUMN user_id;
            ALTER TABLE socialaccount_socialaccount RENAME COLUMN user_id_uuid TO user_id;
            ALTER TABLE socialaccount_socialaccount ALTER COLUMN user_id SET NOT NULL;

            -- account_emailaddress
            ALTER TABLE account_emailaddress DROP COLUMN user_id;
            ALTER TABLE account_emailaddress RENAME COLUMN user_id_uuid TO user_id;
            ALTER TABLE account_emailaddress ALTER COLUMN user_id SET NOT NULL;
            """,
            reverse_sql=migrations.RunSQL.noop
        ),

        # Step 5: Recreate foreign key constraints with UUID
        migrations.RunSQL(
            """
            -- Recreate FK for socialaccount_socialaccount
            ALTER TABLE socialaccount_socialaccount
            ADD CONSTRAINT socialaccount_social_user_id_uuid_fk_users_id
            FOREIGN KEY (user_id) REFERENCES users(id) DEFERRABLE INITIALLY DEFERRED;

            -- Recreate FK for account_emailaddress
            ALTER TABLE account_emailaddress
            ADD CONSTRAINT account_emailaddres_user_id_uuid_fk_users_id
            FOREIGN KEY (user_id) REFERENCES users(id) DEFERRABLE INITIALLY DEFERRED;

            -- Recreate indexes
            CREATE INDEX IF NOT EXISTS socialaccount_socialaccount_user_id_uuid_idx
            ON socialaccount_socialaccount(user_id);

            CREATE INDEX IF NOT EXISTS account_emailaddress_user_id_uuid_idx
            ON account_emailaddress(user_id);
            """,
            reverse_sql=migrations.RunSQL.noop
        ),
    ]
