---
description: Security, secrets, and privacy rules
globs: "**/*"
alwaysApply: true
---

# Security & Privacy

## Secrets Management

### Never Commit Secrets

**Hard rule**: Never commit secrets, API keys, tokens, or credentials to the repository.

### Environment Variables

**Use `.env.local` for local secrets** (gitignored):

```bash
# .env.local (gitignored)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...  # Server-side only
OPENAI_API_KEY=sk-...              # Server-side only
```

**Update `.env.example` for new variables** (empty values, documented):

```bash
# .env.example (committed)
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# AI Provider
OPENAI_API_KEY=
```

### Environment Variable Validation

**Validate required environment variables at startup:**

```typescript
// lib/env/validate.ts
const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'OPENAI_API_KEY',
] as const;

export function validateEnv() {
  const missing: string[] = [];
  
  for (const key of requiredEnvVars) {
    if (!process.env[key]) {
      missing.push(key);
    }
  }
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}
```

**Call validation in critical paths:**

```typescript
// app/api/jobs/route.ts
import { validateEnv } from '@/lib/env/validate';

// Validate on server startup or in API routes
if (process.env.NODE_ENV === 'production') {
  validateEnv();
}
```

## User Data Privacy

### Data Minimization

- **Store only what is necessary** for the PoC
- **Do not store raw resumes/CVs** unless required; prefer encrypted storage or user-controlled uploads
- **Respect user deletion requests**: Implement proper data deletion

### Sensitive Data Handling

**Never log sensitive data:**

```typescript
// ❌ BAD
console.log('User data:', user);
console.log('API key:', process.env.OPENAI_API_KEY);

// ✅ GOOD
console.log('User ID:', user.id);
// Use proper logging service that filters secrets
logInfo({ userId: user.id, action: 'login' });
```

### Data Encryption

- **Encrypt sensitive data at rest** if storing user documents
- **Use HTTPS** for all API communications
- **Use Supabase RLS** for database-level access control

## Authentication & Authorization

### Service Role Key Safety

**CRITICAL: Service role key must NEVER be exposed to client** (Supabase security requirement):

**Service Role Key Rules:**
- **Server-side only**: Use only in API routes, Server Actions, or Edge Functions
- **Never in client code**: Not in `'use client'` components, not in browser JavaScript
- **Never in environment variables** prefixed with `NEXT_PUBLIC_*`
- **Bypasses RLS**: Service role key has admin privileges - use with extreme caution
- **Audit usage**: Log all operations using service role key

**Correct Usage:**
```typescript
// ✅ GOOD: Server-side only
// lib/db/admin.ts (server-side module)
import { createClient } from '@supabase/supabase-js';

export function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // Server-side only
  );
}

// ✅ GOOD: In API route (server-side)
// app/api/jobs/route.ts
import { getSupabaseAdmin } from '@/lib/db/admin';

export async function POST(request: NextRequest) {
  const admin = getSupabaseAdmin(); // Safe - server-side only
  // ...
}
```

**Incorrect Usage:**
```typescript
// ❌ BAD: Exposed to client
// app/page.tsx (client component)
'use client';
const client = createClient(url, serviceRoleKey); // NEVER DO THIS

// ❌ BAD: In NEXT_PUBLIC_ variable
// NEXT_PUBLIC_SUPABASE_SERVICE_KEY=... // NEVER DO THIS
```

**Anon Key Safety:**
- Anon key is safe to expose to browser **only with RLS enabled**
- RLS policies protect data even if anon key is exposed
- Always use anon key in client components, never service role key

### Row Level Security (RLS)

**RLS is REQUIRED for all user-owned tables** (Supabase best practice):

- **Enable RLS on all tables** that contain user data
- **Policies must be explicit**: Define who can SELECT, INSERT, UPDATE, DELETE
- **Default deny**: If no policy matches, access is denied
- **Test RLS policies** with different user contexts in integration tests
- **Never disable RLS** in production, even temporarily

**RLS Policy Requirements:**
- Every table must have policies for all operations (SELECT, INSERT, UPDATE, DELETE)
- Policies must use `auth.uid()` to verify user identity
- Service role key can bypass RLS (use only server-side)
- Document all policies in migration files

**Example RLS Policy Pattern:**
```sql
-- Users can only access their own records
create policy "Users can view own jobs"
  on jobs for select
  using (auth.uid() = user_id);
```

See [06-data-model.md](06-data-model.md) for RLS policy patterns.
See [13-supabase-security.md](13-supabase-security.md) for detailed RLS templates.

### Authentication & Password Policies

**Supabase Auth Configuration** (per [Supabase Auth Guide](https://supabase.com/docs/guides/auth/password-security)):

**Password Requirements:**
- **Minimum length**: 8 characters (enforced in Supabase config)
- **Complexity**: Require uppercase, lowercase, numbers (configured in `supabase/config.toml`)
- **Leak detection**: Enable HaveIBeenPwned integration (Supabase feature)
- **Password reset**: Require email confirmation for password changes

**Multi-Factor Authentication (MFA):**
- **Organization owners**: MFA required (future enhancement)
- **User accounts**: MFA optional but recommended
- **Enforcement**: Configure in Supabase dashboard

**JWT Validation:**
- **Validate JWT claims** in middleware and API routes
- **Check expiration**: JWTs expire after configured time (default 1 hour)
- **Verify signature**: Supabase client handles this automatically
- **Refresh tokens**: Handle token refresh for long-lived sessions

**API Route Security:**

**Validate user authentication in API routes:**

```typescript
// app/api/jobs/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    return NextResponse.json(
      { error: 'Unauthorized', code: 'UNAUTHORIZED' },
      { status: 401 }
    );
  }
  
  // Validate JWT claims
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json(
      { error: 'Session expired', code: 'SESSION_EXPIRED' },
      { status: 401 }
    );
  }
  
  // Proceed with authenticated request
}
```

**Magic Link & OAuth:**
- Prefer magic link over email/password when possible (better UX, more secure)
- Support OAuth providers (Google, GitHub, etc.) for easier signup
- Configure in Supabase dashboard and document in setup guide

## Audit Logging

### Required Audit Events

**Add audit logs for actions** (create/update/delete, AI generation events):

```typescript
// lib/audit/log.ts
export async function logAction(params: {
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  metadata?: Record<string, unknown>;
}) {
  await supabase.from('audit_log').insert({
    user_id: params.userId,
    action: params.action, // 'create', 'update', 'delete', 'generate_cv', etc.
    resource: params.resource, // 'job', 'application', 'cv', etc.
    resource_id: params.resourceId,
    metadata: params.metadata,
    created_at: new Date().toISOString(),
  });
}
```

### What to Log

**Log these events:**
- Job creation/update/deletion
- Application status changes
- AI generation events (CV, cover letter, message)
- User preference changes
- Authentication events (login, logout)

**Do NOT log:**
- Full CV/resume text
- API keys or tokens
- Passwords or sensitive user data
- Full request bodies with sensitive data

### Log Format

```typescript
// Example audit log entry
{
  user_id: 'user-123',
  action: 'generate_cv',
  resource: 'cv',
  resource_id: 'cv-456',
  metadata: {
    job_id: 'job-789',
    model: 'gpt-4',
    prompt_version: '1.0',
    // No sensitive content
  },
  created_at: '2024-01-15T10:30:00Z'
}
```

## Input Validation

### Sanitize User Input

**Validate and sanitize all user inputs:**

```typescript
import { z } from 'zod';

// Validate input schema
const jobInputSchema = z.object({
  title: z.string().min(1).max(200),
  company: z.string().min(1).max(200),
  url: z.string().url(),
  description: z.string().max(10000), // Limit length
});

// Sanitize HTML if needed (for user-generated content)
import DOMPurify from 'isomorphic-dompurify';

const sanitized = DOMPurify.sanitize(userInput);
```

### SQL Injection Prevention

**Use parameterized queries (Supabase handles this):**

```typescript
// ✅ GOOD: Supabase uses parameterized queries
const { data } = await supabase
  .from('jobs')
  .select('*')
  .eq('user_id', userId); // Safe

// ❌ BAD: Never do raw SQL with user input
// (Supabase doesn't allow this easily, but if using raw SQL, use parameters)
```

## Rate Limiting

**Implement rate limiting for API routes** (especially AI generation):

```typescript
// lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 h'), // 10 requests per hour
});

export async function checkRateLimit(userId: string) {
  const { success } = await ratelimit.limit(userId);
  return success;
}
```

## Platform Security (Supabase)

### Organization & Project Security

**Supabase Dashboard Security:**
- **MFA required** for organization owners
- **SSO enabled** for team access (if available)
- **IP restrictions** for dashboard access (if needed)
- **Audit logs** enabled for all admin actions

### Network Security

- **SSL/TLS enforced**: All connections must use HTTPS (Supabase default)
- **Database connections**: Use connection pooling, restrict direct access
- **API endpoints**: Validate origin headers, use CORS properly

### Compliance

- **SOC-2 Type 2**: Supabase is compliant (verify current status)
- **GDPR compliance**: Data residency options, right to deletion
- **HIPAA**: Available as add-on if handling healthcare data
- **Data retention**: Configure backup retention policies

## Security Checklist

Before deploying or merging:

- [ ] No secrets in code or logs
- [ ] `.env.local` is gitignored
- [ ] `.env.example` is up to date
- [ ] **RLS policies are enabled on ALL user tables and tested**
- [ ] **Service role key is server-side only (never in client code)**
- [ ] **Anon key is safe (RLS protects data)**
- [ ] **Password policies configured in Supabase**
- [ ] **JWT validation in all protected routes**
- [ ] User inputs are validated and sanitized
- [ ] Audit logging is implemented for critical actions
- [ ] Rate limiting is in place for expensive operations
- [ ] HTTPS is enforced in production
- [ ] **MFA enabled for organization owners**
- [ ] **Backup strategy documented and tested**

## Supabase Security References

- [Supabase Security Guide](https://supabase.com/docs/guides/security)
- [Supabase Database Security](https://supabase.com/docs/guides/database/secure-data)
- [Supabase Auth Password Security](https://supabase.com/docs/guides/auth/password-security)
- [Supabase Platform Security](https://supabase.com/docs/guides/security/platform-security)

## Related Rules

- See [06-data-model.md](06-data-model.md) for RLS policy patterns
- See [13-supabase-security.md](13-supabase-security.md) for detailed Supabase security rules
- See [10-error-handling.md](10-error-handling.md) for secure error messages
- See [11-api-design.md](11-api-design.md) for API security patterns
