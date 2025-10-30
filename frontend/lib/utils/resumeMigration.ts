import { resumeApi } from '@/lib/api/resume';

/**
 * Migrate anonymous resume data from Django session to authenticated user account
 *
 * This function is called after successful login or signup to transfer
 * any CV data that was created while the user was using a session (not logged in).
 *
 * The backend handles the migration by:
 * 1. Finding all resumes linked to the current session
 * 2. Linking them to the authenticated user
 * 3. Clearing the session_id
 *
 * @returns The number of resumes migrated, or null if migration failed
 */
export async function migrateAnonymousResume(): Promise<number | null> {
  try {
    console.log('🔄 Starting session resume migration...');

    // Call the migration endpoint
    // The backend will automatically detect the session and migrate resumes
    const result = await resumeApi.migrateAnonymous();

    console.log('✅ Session resume migration result:', result);

    if (result.migrated_count > 0) {
      console.log(`✅ Migrated ${result.migrated_count} resume(s) successfully`);

      // If there's at least one migrated resume, update the current resume ID
      if (result.resume_ids && result.resume_ids.length > 0) {
        // Use the most recently created/updated resume
        const resumeId = result.resume_ids[0];
        localStorage.setItem('currentResumeId', String(resumeId));
        console.log('✅ Updated current resume ID:', resumeId);
      }
    } else {
      console.log('📭 No session resumes to migrate');
    }

    return result.migrated_count;

  } catch (error) {
    console.error('❌ Failed to migrate session resumes:', error);
    // Don't throw error - allow the app to continue even if migration fails
    return null;
  }
}
