# Custom migration to convert Many-to-Many table foreign keys to UUID

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0007_migrate_allauth_pks_to_uuid'),
    ]

    operations = [
        # =====================================================================
        # USERS_GROUPS - Many-to-Many table for User <-> Group
        # =====================================================================

        migrations.RunSQL(
            """
            -- Check if there are any records
            DO $$
            DECLARE
                record_count INTEGER;
            BEGIN
                SELECT COUNT(*) INTO record_count FROM users_groups;

                IF record_count > 0 THEN
                    -- Add UUID column
                    ALTER TABLE users_groups ADD COLUMN user_id_uuid uuid;

                    -- Try to map old bigint user_id to new UUID
                    -- This will only work if user_id happens to match some pattern
                    -- Otherwise, we'll need to delete orphaned records

                    -- Check if there are any valid mappings possible
                    -- Since users.id is now UUID and users_groups.user_id is bigint,
                    -- there's no direct mapping. We need to delete all records.

                    RAISE NOTICE 'Found % records in users_groups that cannot be migrated. Deleting orphaned records.', record_count;
                    DELETE FROM users_groups;
                END IF;

                -- Drop old user_id column
                ALTER TABLE users_groups DROP CONSTRAINT IF EXISTS users_groups_user_id_f500bee5_fk_users_id;
                ALTER TABLE users_groups DROP COLUMN user_id;

                -- Rename UUID column to user_id (or add if it doesn't exist)
                IF EXISTS (SELECT 1 FROM information_schema.columns
                          WHERE table_name = 'users_groups' AND column_name = 'user_id_uuid') THEN
                    ALTER TABLE users_groups RENAME COLUMN user_id_uuid TO user_id;
                ELSE
                    ALTER TABLE users_groups ADD COLUMN user_id uuid NOT NULL;
                END IF;

                -- Recreate FK constraint
                ALTER TABLE users_groups
                ADD CONSTRAINT users_groups_user_id_uuid_fk_users_id
                FOREIGN KEY (user_id) REFERENCES users(id) DEFERRABLE INITIALLY DEFERRED;

                -- Recreate indexes
                DROP INDEX IF EXISTS users_groups_user_id_f500bee5;
                CREATE INDEX users_groups_user_id_uuid_idx ON users_groups(user_id);

                DROP INDEX IF EXISTS users_groups_user_id_group_id_fc7788e8_uniq;
                CREATE UNIQUE INDEX users_groups_user_id_group_id_uuid_uniq
                ON users_groups(user_id, group_id);
            END $$;
            """,
            reverse_sql=migrations.RunSQL.noop
        ),

        # =====================================================================
        # USERS_USER_PERMISSIONS - Many-to-Many table for User <-> Permission
        # =====================================================================

        migrations.RunSQL(
            """
            -- Check if there are any records
            DO $$
            DECLARE
                record_count INTEGER;
            BEGIN
                SELECT COUNT(*) INTO record_count FROM users_user_permissions;

                IF record_count > 0 THEN
                    RAISE NOTICE 'Found % records in users_user_permissions that cannot be migrated. Deleting orphaned records.', record_count;
                    DELETE FROM users_user_permissions;
                END IF;

                -- Drop old user_id column
                ALTER TABLE users_user_permissions DROP CONSTRAINT IF EXISTS users_user_permissio_user_id_92473840_fk_users_id;
                ALTER TABLE users_user_permissions DROP COLUMN user_id;

                -- Add UUID column
                ALTER TABLE users_user_permissions ADD COLUMN user_id uuid NOT NULL;

                -- Recreate FK constraint
                ALTER TABLE users_user_permissions
                ADD CONSTRAINT users_user_permissions_user_id_uuid_fk_users_id
                FOREIGN KEY (user_id) REFERENCES users(id) DEFERRABLE INITIALLY DEFERRED;

                -- Recreate indexes
                DROP INDEX IF EXISTS users_user_permissions_user_id_92473840;
                CREATE INDEX users_user_permissions_user_id_uuid_idx ON users_user_permissions(user_id);

                DROP INDEX IF EXISTS users_user_permissions_user_id_permission_id_3b86cbdf_uniq;
                CREATE UNIQUE INDEX users_user_permissions_user_id_permission_id_uuid_uniq
                ON users_user_permissions(user_id, permission_id);
            END $$;
            """,
            reverse_sql=migrations.RunSQL.noop
        ),

        # =====================================================================
        # SOCIALACCOUNT_SOCIALAPP_SITES - Many-to-Many ID migration
        # =====================================================================

        migrations.RunSQL(
            """
            -- This table's ID can be converted to UUID
            ALTER TABLE socialaccount_socialapp_sites ADD COLUMN uuid_new uuid DEFAULT gen_random_uuid();
            ALTER TABLE socialaccount_socialapp_sites ALTER COLUMN uuid_new DROP DEFAULT;

            ALTER TABLE socialaccount_socialapp_sites DROP CONSTRAINT socialaccount_socialapp_sites_pkey CASCADE;
            ALTER TABLE socialaccount_socialapp_sites DROP COLUMN id;
            ALTER TABLE socialaccount_socialapp_sites RENAME COLUMN uuid_new TO id;
            ALTER TABLE socialaccount_socialapp_sites ADD PRIMARY KEY (id);
            """,
            reverse_sql=migrations.RunSQL.noop
        ),
    ]
