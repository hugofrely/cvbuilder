# Custom migration to convert allauth primary keys to UUID

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0006_migrate_allauth_to_uuid'),
    ]

    operations = [
        # =====================================================================
        # SOCIALACCOUNT_SOCIALACCOUNT
        # =====================================================================

        # Step 1: Add UUID column
        migrations.RunSQL(
            """
            ALTER TABLE socialaccount_socialaccount ADD COLUMN uuid_new uuid DEFAULT gen_random_uuid();
            ALTER TABLE socialaccount_socialaccount ALTER COLUMN uuid_new DROP DEFAULT;
            """,
            reverse_sql="ALTER TABLE socialaccount_socialaccount DROP COLUMN IF EXISTS uuid_new;"
        ),

        # Step 2: Add UUID FK columns to dependent tables
        migrations.RunSQL(
            """
            ALTER TABLE socialaccount_socialtoken ADD COLUMN account_id_uuid uuid;
            """,
            reverse_sql="ALTER TABLE socialaccount_socialtoken DROP COLUMN IF EXISTS account_id_uuid;"
        ),

        # Step 3: Copy FK relationships
        migrations.RunSQL(
            """
            UPDATE socialaccount_socialtoken sst
            SET account_id_uuid = ssa.uuid_new
            FROM socialaccount_socialaccount ssa
            WHERE sst.account_id = ssa.id;
            """,
            reverse_sql=migrations.RunSQL.noop
        ),

        # Step 4: Drop old FK constraints
        migrations.RunSQL(
            """
            ALTER TABLE socialaccount_socialtoken
            DROP CONSTRAINT IF EXISTS socialaccount_social_account_id_951f210e_fk_socialacc;
            """,
            reverse_sql=migrations.RunSQL.noop
        ),

        # Step 5: Drop old id, rename UUID to id
        migrations.RunSQL(
            """
            ALTER TABLE socialaccount_socialaccount DROP CONSTRAINT socialaccount_socialaccount_pkey CASCADE;
            ALTER TABLE socialaccount_socialaccount DROP COLUMN id;
            ALTER TABLE socialaccount_socialaccount RENAME COLUMN uuid_new TO id;
            ALTER TABLE socialaccount_socialaccount ADD PRIMARY KEY (id);
            """,
            reverse_sql=migrations.RunSQL.noop
        ),

        # Step 6: Update dependent table FKs
        migrations.RunSQL(
            """
            ALTER TABLE socialaccount_socialtoken DROP COLUMN account_id;
            ALTER TABLE socialaccount_socialtoken RENAME COLUMN account_id_uuid TO account_id;
            ALTER TABLE socialaccount_socialtoken ALTER COLUMN account_id SET NOT NULL;

            ALTER TABLE socialaccount_socialtoken
            ADD CONSTRAINT socialaccount_social_account_id_uuid_fk_socialacc
            FOREIGN KEY (account_id) REFERENCES socialaccount_socialaccount(id) DEFERRABLE INITIALLY DEFERRED;

            CREATE INDEX IF NOT EXISTS socialaccount_socialtoken_account_id_uuid_idx
            ON socialaccount_socialtoken(account_id);
            """,
            reverse_sql=migrations.RunSQL.noop
        ),

        # =====================================================================
        # ACCOUNT_EMAILADDRESS
        # =====================================================================

        # Step 1: Add UUID column
        migrations.RunSQL(
            """
            ALTER TABLE account_emailaddress ADD COLUMN uuid_new uuid DEFAULT gen_random_uuid();
            ALTER TABLE account_emailaddress ALTER COLUMN uuid_new DROP DEFAULT;
            """,
            reverse_sql="ALTER TABLE account_emailaddress DROP COLUMN IF EXISTS uuid_new;"
        ),

        # Step 2: Add UUID FK columns to dependent tables
        migrations.RunSQL(
            """
            ALTER TABLE account_emailconfirmation ADD COLUMN email_address_id_uuid uuid;
            """,
            reverse_sql="ALTER TABLE account_emailconfirmation DROP COLUMN IF EXISTS email_address_id_uuid;"
        ),

        # Step 3: Copy FK relationships
        migrations.RunSQL(
            """
            UPDATE account_emailconfirmation aec
            SET email_address_id_uuid = aea.uuid_new
            FROM account_emailaddress aea
            WHERE aec.email_address_id = aea.id;
            """,
            reverse_sql=migrations.RunSQL.noop
        ),

        # Step 4: Drop old FK constraints
        migrations.RunSQL(
            """
            ALTER TABLE account_emailconfirmation
            DROP CONSTRAINT IF EXISTS account_emailconfirm_email_address_id_5b7f8c58_fk_account_e;
            """,
            reverse_sql=migrations.RunSQL.noop
        ),

        # Step 5: Drop old id, rename UUID to id
        migrations.RunSQL(
            """
            ALTER TABLE account_emailaddress DROP CONSTRAINT account_emailaddress_pkey CASCADE;
            ALTER TABLE account_emailaddress DROP COLUMN id;
            ALTER TABLE account_emailaddress RENAME COLUMN uuid_new TO id;
            ALTER TABLE account_emailaddress ADD PRIMARY KEY (id);
            """,
            reverse_sql=migrations.RunSQL.noop
        ),

        # Step 6: Update dependent table FKs
        migrations.RunSQL(
            """
            ALTER TABLE account_emailconfirmation DROP COLUMN email_address_id;
            ALTER TABLE account_emailconfirmation RENAME COLUMN email_address_id_uuid TO email_address_id;
            ALTER TABLE account_emailconfirmation ALTER COLUMN email_address_id SET NOT NULL;

            ALTER TABLE account_emailconfirmation
            ADD CONSTRAINT account_emailconfirm_email_address_id_uuid_fk_account
            FOREIGN KEY (email_address_id) REFERENCES account_emailaddress(id) DEFERRABLE INITIALLY DEFERRED;

            CREATE INDEX IF NOT EXISTS account_emailconfirmation_email_address_id_uuid_idx
            ON account_emailconfirmation(email_address_id);
            """,
            reverse_sql=migrations.RunSQL.noop
        ),

        # =====================================================================
        # SOCIALACCOUNT_SOCIALAPP & SOCIALACCOUNT_SOCIALTOKEN
        # =====================================================================

        # SOCIALACCOUNT_SOCIALAPP
        migrations.RunSQL(
            """
            ALTER TABLE socialaccount_socialapp ADD COLUMN uuid_new uuid DEFAULT gen_random_uuid();
            ALTER TABLE socialaccount_socialapp ALTER COLUMN uuid_new DROP DEFAULT;

            -- Add UUID FK to socialaccount_socialtoken
            ALTER TABLE socialaccount_socialtoken ADD COLUMN app_id_uuid uuid;

            -- Copy FK relationships
            UPDATE socialaccount_socialtoken sst
            SET app_id_uuid = ssa.uuid_new
            FROM socialaccount_socialapp ssa
            WHERE sst.app_id = ssa.id;

            -- Add UUID FK to socialaccount_socialapp_sites
            ALTER TABLE socialaccount_socialapp_sites ADD COLUMN socialapp_id_uuid uuid;

            UPDATE socialaccount_socialapp_sites ssas
            SET socialapp_id_uuid = ssa.uuid_new
            FROM socialaccount_socialapp ssa
            WHERE ssas.socialapp_id = ssa.id;

            -- Drop old constraints
            ALTER TABLE socialaccount_socialtoken
            DROP CONSTRAINT IF EXISTS socialaccount_social_app_id_636a42d7_fk_socialacc;

            ALTER TABLE socialaccount_socialapp_sites
            DROP CONSTRAINT IF EXISTS socialaccount_social_socialapp_id_97fb6e7d_fk_socialacc;

            -- Convert PK
            ALTER TABLE socialaccount_socialapp DROP CONSTRAINT socialaccount_socialapp_pkey CASCADE;
            ALTER TABLE socialaccount_socialapp DROP COLUMN id;
            ALTER TABLE socialaccount_socialapp RENAME COLUMN uuid_new TO id;
            ALTER TABLE socialaccount_socialapp ADD PRIMARY KEY (id);

            -- Update FK columns in socialaccount_socialtoken
            ALTER TABLE socialaccount_socialtoken DROP COLUMN IF EXISTS app_id;
            ALTER TABLE socialaccount_socialtoken RENAME COLUMN app_id_uuid TO app_id;

            ALTER TABLE socialaccount_socialtoken
            ADD CONSTRAINT socialaccount_social_app_id_uuid_fk_socialacc
            FOREIGN KEY (app_id) REFERENCES socialaccount_socialapp(id) DEFERRABLE INITIALLY DEFERRED;

            CREATE INDEX IF NOT EXISTS socialaccount_socialtoken_app_id_uuid_idx
            ON socialaccount_socialtoken(app_id);

            -- Update FK in socialaccount_socialapp_sites
            ALTER TABLE socialaccount_socialapp_sites DROP COLUMN socialapp_id;
            ALTER TABLE socialaccount_socialapp_sites RENAME COLUMN socialapp_id_uuid TO socialapp_id;
            ALTER TABLE socialaccount_socialapp_sites ALTER COLUMN socialapp_id SET NOT NULL;

            ALTER TABLE socialaccount_socialapp_sites
            ADD CONSTRAINT socialaccount_social_socialapp_id_uuid_fk_socialacc
            FOREIGN KEY (socialapp_id) REFERENCES socialaccount_socialapp(id) DEFERRABLE INITIALLY DEFERRED;
            """,
            reverse_sql=migrations.RunSQL.noop
        ),

        # SOCIALACCOUNT_SOCIALTOKEN
        migrations.RunSQL(
            """
            ALTER TABLE socialaccount_socialtoken ADD COLUMN uuid_new uuid DEFAULT gen_random_uuid();
            ALTER TABLE socialaccount_socialtoken ALTER COLUMN uuid_new DROP DEFAULT;

            ALTER TABLE socialaccount_socialtoken DROP CONSTRAINT socialaccount_socialtoken_pkey CASCADE;
            ALTER TABLE socialaccount_socialtoken DROP COLUMN id;
            ALTER TABLE socialaccount_socialtoken RENAME COLUMN uuid_new TO id;
            ALTER TABLE socialaccount_socialtoken ADD PRIMARY KEY (id);
            """,
            reverse_sql=migrations.RunSQL.noop
        ),

        # ACCOUNT_EMAILCONFIRMATION
        migrations.RunSQL(
            """
            ALTER TABLE account_emailconfirmation ADD COLUMN uuid_new uuid DEFAULT gen_random_uuid();
            ALTER TABLE account_emailconfirmation ALTER COLUMN uuid_new DROP DEFAULT;

            ALTER TABLE account_emailconfirmation DROP CONSTRAINT account_emailconfirmation_pkey CASCADE;
            ALTER TABLE account_emailconfirmation DROP COLUMN id;
            ALTER TABLE account_emailconfirmation RENAME COLUMN uuid_new TO id;
            ALTER TABLE account_emailconfirmation ADD PRIMARY KEY (id);
            """,
            reverse_sql=migrations.RunSQL.noop
        ),
    ]
