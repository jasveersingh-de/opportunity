import { getSupabaseClient } from '@/lib/db/client';
import type { User } from '@supabase/supabase-js';

/**
 * Authentication service for client components.
 * Handles LinkedIn OAuth and session management.
 */
export class AuthService {
  /**
   * Initiate LinkedIn OAuth login
   */
  async signInWithLinkedIn(): Promise<{ error: Error | null }> {
    const supabase = getSupabaseClient();
    const redirectUrl = `${window.location.origin}/auth/callback`;
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'linkedin',
      options: {
        redirectTo: redirectUrl,
        scopes: 'openid profile email',
      },
    });

    return { error };
  }

  /**
   * Sign out current user
   */
  async signOut(): Promise<{ error: Error | null }> {
    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.signOut();
    return { error };
  }

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<{ user: User | null; error: Error | null }> {
    const supabase = getSupabaseClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  }

  /**
   * Get current session
   */
  async getSession() {
    const supabase = getSupabaseClient();
    const { data: { session }, error } = await supabase.auth.getSession();
    return { session, error };
  }

  /**
   * Listen to auth state changes
   */
  onAuthStateChange(callback: (event: string, session: any) => void) {
    const supabase = getSupabaseClient();
    return supabase.auth.onAuthStateChange(callback);
  }
}

export const authService = new AuthService();
