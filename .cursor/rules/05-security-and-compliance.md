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

### Service Keys

**Any admin/service key must stay server-side only:**

```typescript
// ✅ GOOD: Server-side only
// lib/db/admin.ts
const adminClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Never exposed to client
);

// ❌ BAD: Exposed to client
// app/page.tsx
const client = createClient(url, serviceRoleKey); // Never do this
```

### Row Level Security (RLS)

**Enforce RLS if using Supabase tables exposed to clients:**

- Enable RLS on all user-owned tables
- Policies: user can read/write own records, nothing else
- Test RLS policies with different user contexts

See [06-data-model.md](06-data-model.md) for RLS policy patterns.

### API Route Security

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
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  // Proceed with authenticated request
}
```

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

## Security Checklist

Before deploying or merging:

- [ ] No secrets in code or logs
- [ ] `.env.local` is gitignored
- [ ] `.env.example` is up to date
- [ ] RLS policies are enabled and tested
- [ ] Service keys are server-side only
- [ ] User inputs are validated
- [ ] Audit logging is implemented for critical actions
- [ ] Rate limiting is in place for expensive operations
- [ ] HTTPS is enforced in production

## Related Rules

- See [06-data-model.md](06-data-model.md) for RLS policy patterns
- See [10-error-handling.md](10-error-handling.md) for secure error messages
- See [11-api-design.md](11-api-design.md) for API security patterns
