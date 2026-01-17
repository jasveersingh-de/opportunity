'use server';

import { getSupabaseServerClient } from '@/lib/db/server-client';
import { profileService } from '@/lib/services/profile/profile.service';
import { revalidatePath } from 'next/cache';

/**
 * Server action to handle post-authentication profile setup.
 * Called after OAuth callback to ensure profile exists.
 */
export async function ensureProfile() {
  const supabase = await getSupabaseServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: 'Not authenticated' };
  }

  const { data: profile, error: profileError } = await profileService.getOrCreateProfile(user);

  if (profileError) {
    console.error('Error ensuring profile:', profileError);
    return { error: 'Failed to create profile' };
  }

  revalidatePath('/dashboard');
  return { success: true, profile };
}
