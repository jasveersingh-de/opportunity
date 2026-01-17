import { getSupabaseServerClient } from '@/lib/db/server-client';
import type { User } from '@supabase/supabase-js';

/**
 * Profile service for managing user profiles.
 * Creates profile on first login and syncs with auth user data.
 */
export class ProfileService {
  /**
   * Get or create user profile
   * Creates profile if it doesn't exist (first-time login)
   */
  async getOrCreateProfile(user: User) {
    const supabase = await getSupabaseServerClient();

    // Check if profile exists
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (existingProfile) {
      return { data: existingProfile, error: null };
    }

    // Create profile from user metadata
    const { data: newProfile, error: createError } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        email: user.email || '',
        full_name: user.user_metadata?.full_name || 
                   user.user_metadata?.name || 
                   user.email?.split('@')[0] || 
                   'User',
        avatar_url: user.user_metadata?.avatar_url || 
                   user.user_metadata?.picture || 
                   null,
        // LinkedIn-specific metadata
        linkedin_url: user.user_metadata?.linkedin_url || null,
        // Default preferences
        preferred_countries: [],
        preferred_roles: [],
        seniority_level: null,
        remote_preference: null,
      })
      .select()
      .single();

    if (createError) {
      console.error('Error creating profile:', createError);
      return { data: null, error: createError };
    }

    return { data: newProfile, error: null };
  }

  /**
   * Update profile with LinkedIn data
   */
  async updateProfileFromLinkedIn(user: User) {
    const supabase = await getSupabaseServerClient();

    const { data, error } = await supabase
      .from('profiles')
      .update({
        full_name: user.user_metadata?.full_name || 
                   user.user_metadata?.name || 
                   user.email?.split('@')[0],
        avatar_url: user.user_metadata?.avatar_url || 
                   user.user_metadata?.picture || 
                   null,
        linkedin_url: user.user_metadata?.linkedin_url || null,
      })
      .eq('id', user.id)
      .select()
      .single();

    return { data, error };
  }
}

export const profileService = new ProfileService();
