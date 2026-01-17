/**
 * Environment variable validation
 */

const REQUIRED_ENV_VARS = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'OPENAI_API_KEY',
] as const;

/**
 * Validate required environment variables are set
 */
export function validateEnv(): { valid: boolean; missing: string[] } {
  const missing: string[] = [];
  
  for (const key of REQUIRED_ENV_VARS) {
    if (!process.env[key]?.trim()) {
      missing.push(key);
    }
  }
  
  return {
    valid: missing.length === 0,
    missing,
  };
}

/**
 * Assert all required environment variables are set (throws if missing)
 */
export function assertEnv(): void {
  const { valid, missing } = validateEnv();
  if (!valid) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}
