---
description: Supabase-specific security rules, RLS templates, and security patterns
globs: "**/*.{ts,tsx,sql}"
alwaysApply: true
---

# Supabase Security Rules

This document provides Supabase-specific security patterns and RLS policy templates based on [Supabase Security Documentation](https://supabase.com/docs/guides/security).

## Row Level Security (RLS) Enforcement

### RLS Requirements

**RLS MUST be enabled on all user-owned tables:**

- Every table containing user data must have RLS enabled
- Policies must be defined before table is used in production
- Default behavior: If no policy matches, access is DENIED
- Service role key bypasses RLS (use only server-side with caution)

### RLS Policy Template

**Standard pattern for user-owned tables:**

```sql
-- Enable RLS
alter table <table_name> enable row level security;

-- SELECT policy: Users can view own records
create policy "<table_name>_select_own"
  on <table_name> for select
  using (auth.uid() = user_id);

-- INSERT policy: Users can insert own records
create policy "<table_name>_insert_own"
  on <table_name> for insert
  with check (auth.uid() = user_id);

-- UPDATE policy: Users can update own records
create policy "<table_name>_update_own"
  on <table_name> for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- DELETE policy: Users can delete own records
create policy "<table_name>_delete_own"
  on <table_name> for delete
  using (auth.uid() = user_id);
```

### Table-Specific RLS Policies

#### Profiles Table

```sql
alter table profiles enable row level security;

create policy "profiles_select_own"
  on profiles for select
  using (auth.uid() = user_id);

create policy "profiles_insert_own"
  on profiles for insert
  with check (auth.uid() = user_id);

create policy "profiles_update_own"
  on profiles for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "profiles_delete_own"
  on profiles for delete
  using (auth.uid() = user_id);
```

#### Jobs Table

```sql
alter table jobs enable row level security;

create policy "jobs_select_own"
  on jobs for select
  using (auth.uid() = user_id);

create policy "jobs_insert_own"
  on jobs for insert
  with check (auth.uid() = user_id);

create policy "jobs_update_own"
  on jobs for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "jobs_delete_own"
  on jobs for delete
  using (auth.uid() = user_id);
```

#### Artifacts Table

```sql
alter table artifacts enable row level security;

create policy "artifacts_select_own"
  on artifacts for select
  using (auth.uid() = user_id);

create policy "artifacts_insert_own"
  on artifacts for insert
  with check (auth.uid() = user_id);

create policy "artifacts_update_own"
  on artifacts for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "artifacts_delete_own"
  on artifacts for delete
  using (auth.uid() = user_id);
```

#### Applications Table

```sql
alter table applications enable row level security;

create policy "applications_select_own"
  on applications for select
  using (auth.uid() = user_id);

create policy "applications_insert_own"
  on applications for insert
  with check (auth.uid() = user_id);

create policy "applications_update_own"
  on applications for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "applications_delete_own"
  on applications for delete
  using (auth.uid() = user_id);
```

#### Audit Log Table

```sql
alter table audit_log enable row level security;

-- Users can only view their own audit logs
create policy "audit_log_select_own"
  on audit_log for select
  using (auth.uid() = user_id);

-- No insert policy for authenticated users
-- Insert via service role key only (server-side)
-- This ensures audit logs cannot be tampered with by users
```

## Service Role Key Usage

### Service Role Key Rules

**CRITICAL: Service role key has admin privileges and bypasses RLS**

**Usage Patterns:**

```typescript
// lib/db/admin.ts
import { createClient } from '@supabase/supabase-js';

/**
 * Get Supabase admin client with service role key.
 * 
 * WARNING: This client bypasses RLS and has full database access.
 * Only use for:
 * - Audit log writes
 * - Admin operations
 * - System-level operations
 * 
 * NEVER expose this function or its return value to client code.
 */
export function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!url || !key) {
    throw new Error('Missing Supabase admin credentials');
  }
  
  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
```

**When to Use Service Role Key:**

✅ **Allowed:**
- Writing to audit_log table (users shouldn't write their own audit logs)
- Admin operations (user management, system configuration)
- Background jobs that need to access all data
- Migration scripts

❌ **Never:**
- In client-side code (`'use client'` components)
- In browser JavaScript
- For regular user operations (use anon key + RLS instead)
- Exposed in environment variables prefixed with `NEXT_PUBLIC_*`

### Anon Key Usage

**Anon key is safe to expose to browser when RLS is enabled:**

```typescript
// lib/db/client.ts
import { createClient } from '@supabase/supabase-js';

/**
 * Get Supabase client for authenticated users.
 * Uses anon key - safe because RLS protects data.
 */
export function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!url || !key) {
    throw new Error('Missing Supabase credentials');
  }
  
  return createClient(url, key);
}
```

## Authentication Security

### Password Policy

**Configure in `supabase/config.toml`:**

```toml
[auth.password]
min_length = 8
require_uppercase = true
require_lowercase = true
require_numbers = true
require_symbols = false  # Optional, can enable for stronger passwords
```

**Additional Security:**
- Enable leak detection (HaveIBeenPwned integration) in Supabase dashboard
- Require email confirmation for password changes
- Implement password reset flow with secure tokens

### JWT Validation

**Validate JWT in middleware and API routes:**

```typescript
// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res });
  
  const { data: { session }, error } = await supabase.auth.getSession();
  
  // Validate JWT
  if (error || !session) {
    // Redirect to login or return 401
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Verify JWT hasn't expired
  const expiresAt = session.expires_at;
  if (expiresAt && expiresAt * 1000 < Date.now()) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return res;
}
```

### Magic Link & OAuth

**Prefer magic link over email/password:**
- More secure (no password to leak)
- Better UX (no password to remember)
- Configure in Supabase dashboard

**OAuth Providers:**
- Google, GitHub, etc.
- Configure in Supabase dashboard
- Document setup in `docs/supabase-setup.md`

## Edge Functions Security

### Edge Function Patterns

**If using Supabase Edge Functions:**

```typescript
// supabase/functions/example/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  // CORS headers
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  
  try {
    // Get JWT from Authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Create Supabase client with anon key (RLS will protect data)
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );
    
    // Verify user
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Rate limiting (implement your rate limiting logic)
    // ...
    
    // Business logic
    // ...
    
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
```

**Edge Function Security Checklist:**
- [ ] JWT validation on every request
- [ ] Rate limiting implemented
- [ ] Input validation and sanitization
- [ ] Error handling (don't expose internal errors)
- [ ] CORS headers configured
- [ ] No service role key in Edge Functions (use anon key + RLS)

## Rate Limiting

### API Route Rate Limiting

**Implement rate limiting for expensive operations:**

```typescript
// lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Rate limiters for different operations
export const aiGenerationLimiter = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 h'), // 10 requests per hour
  analytics: true,
});

export const apiLimiter = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, '1 m'), // 100 requests per minute
  analytics: true,
});

// Usage in API route
export async function POST(request: NextRequest) {
  const userId = await getUserId(request);
  
  const { success } = await aiGenerationLimiter.limit(userId);
  if (!success) {
    return NextResponse.json(
      { error: 'Rate limit exceeded', code: 'RATE_LIMIT' },
      { status: 429 }
    );
  }
  
  // Proceed with request
}
```

## Security Testing

### RLS Policy Testing

**Test RLS policies with different user contexts:**

```typescript
// tests/rls/jobs.test.ts
import { createClient } from '@supabase/supabase-js';

describe('Jobs RLS Policies', () => {
  it('should prevent users from accessing other users jobs', async () => {
    const user1Client = createClient(url, user1Token);
    const user2Client = createClient(url, user2Token);
    
    // User 1 creates a job
    const { data: job } = await user1Client
      .from('jobs')
      .insert({ title: 'Test Job', company: 'Test Co', user_id: user1Id })
      .select()
      .single();
    
    // User 2 should not see it
    const { data: jobs } = await user2Client.from('jobs').select();
    expect(jobs).not.toContainEqual(expect.objectContaining({ id: job.id }));
    
    // User 2 should not be able to update it
    const { error } = await user2Client
      .from('jobs')
      .update({ title: 'Hacked' })
      .eq('id', job.id);
    expect(error).toBeTruthy();
  });
});
```

## Security Checklist

Before deploying:

- [ ] All tables have RLS enabled
- [ ] All RLS policies are tested
- [ ] Service role key is never in client code
- [ ] Anon key is used in client (RLS protects data)
- [ ] Password policies configured
- [ ] JWT validation in all protected routes
- [ ] Rate limiting on expensive operations
- [ ] Input validation on all user inputs
- [ ] Audit logging for sensitive operations
- [ ] MFA enabled for organization owners
- [ ] Backups configured and tested

## Related Rules

- See [05-security-and-compliance.md](05-security-and-compliance.md) for general security rules
- See [06-data-model.md](06-data-model.md) for database schema and migrations
- See [14-supabase-integration.md](14-supabase-integration.md) for integration patterns

## References

- [Supabase Database Security](https://supabase.com/docs/guides/database/secure-data)
- [Supabase Auth Security](https://supabase.com/docs/guides/auth/password-security)
- [Supabase Edge Functions Security](https://supabase.com/docs/guides/functions/security)
