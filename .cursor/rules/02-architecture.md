---
description: System architecture boundaries and module responsibilities
globs: "**/*"
alwaysApply: true
---

# Architecture

## Stack Overview

- **Frontend**: Next.js 16 App Router (React Server Components)
- **Styling**: Tailwind CSS
- **Backend**: Next.js Route Handlers + Server Actions
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel
- **AI**: Server-side AI calls via dedicated client module (OpenAI API)
- **Language**: TypeScript (strict mode)
- **Tool Management**: mise (polyglot tool version manager)

## Frontend Architecture

### Next.js App Router Structure

```
app/
  (auth)/
    login/
      page.tsx
  (dashboard)/
    jobs/
      page.tsx          # Server Component
      [id]/
        page.tsx
    applications/
      page.tsx
  api/
    jobs/
      route.ts          # Route Handler
    applications/
      route.ts
  layout.tsx
  page.tsx
```

### Component Organization

```
components/
  ui/                   # Reusable UI primitives (buttons, inputs, etc.)
  features/             # Feature-specific components
    jobs/
      JobCard.tsx
      JobList.tsx
    applications/
      ApplicationForm.tsx
  layout/               # Layout components (Header, Sidebar, etc.)
```

### Server vs Client Components

**Default to Server Components** unless you need:
- Interactivity (onClick, onChange, etc.)
- Browser APIs (localStorage, window, etc.)
- React hooks (useState, useEffect, etc.)
- Third-party libraries that require client-side rendering

**Decision Tree:**
1. Does it need interactivity? → Client Component (`'use client'`)
2. Does it fetch data? → Server Component
3. Does it render other components? → Server Component (can compose Client Components)

### Route Handlers

- **Location**: `app/api/*/route.ts`
- **Keep handlers thin**: Move business logic to `lib/*`
- **Use proper HTTP methods**: GET, POST, PUT, DELETE, PATCH
- **Return typed responses**: Use consistent response wrappers (see [11-api-design.md](11-api-design.md))

Example structure:

```typescript
// app/api/jobs/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getJobs } from '@/lib/jobs/service';

export async function GET(request: NextRequest) {
  try {
    const jobs = await getJobs();
    return NextResponse.json({ data: jobs });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}
```

## Backend Architecture

### Service Layer Pattern

Put business logic in `lib/*/service.ts`:

```
lib/
  jobs/
    service.ts          # Business logic
    types.ts            # TypeScript types
  applications/
    service.ts
  ai/
    client.ts           # AI client singleton
    prompts/
      cv-generation.ts
      cover-letter.ts
```

### External Service Adapters

Put external service integrations behind adapters:

```
lib/
  adapters/
    supabase.ts         # Supabase client wrapper
    ai-provider.ts      # AI provider abstraction
```

## Data Layer

### Supabase Client Pattern

**Next.js App Router client initialization:**

```typescript
// lib/db/client.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Get Supabase client for client-side use.
 * Uses anon key - safe because RLS protects data.
 */
export function getSupabaseClient() {
  return createClient(supabaseUrl, supabaseAnonKey);
}

/**
 * Get Supabase admin client with service role key.
 * WARNING: Bypasses RLS - use only server-side!
 */
export function getSupabaseAdmin() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for admin operations');
  }
  
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
```

**Server Component client (with cookies):**

```typescript
// lib/db/server-client.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Get Supabase client for Server Components.
 * Automatically handles auth cookies.
 */
export async function getSupabaseServerClient() {
  const cookieStore = await cookies();
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    }
  );
}
```

### Data Access Layer

**No inline SQL in UI components**. Use a data access layer:

```
lib/
  db/
    client.ts           # Supabase client
    queries/
      jobs.ts           # Job queries
      applications.ts   # Application queries
    types.ts            # Generated types from Supabase
```

Example:

```typescript
// lib/db/queries/jobs.ts
import { supabase } from '../client';
import { Job } from '../types';

export async function getJobsByUserId(userId: string): Promise<Job[]> {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('user_id', userId);
    
  if (error) throw error;
  return data;
}
```

## AI Integration

### AI Client Module

**All AI calls must happen server-side only**:

```
lib/
  ai/
    client.ts           # AI client singleton (OpenAI, Anthropic, etc.)
    prompts/
      cv-generation.ts  # Prompt templates
      cover-letter.ts
      ranking.ts
    types.ts            # AI response types
```

### Prompt Management

- Store prompts as templates in `lib/ai/prompts/*`
- Version prompts (include version in audit logs)
- Make prompts testable (snapshot or golden outputs where possible)

See [07-ai-integration.md](07-ai-integration.md) for detailed AI rules.

## Authentication (Supabase Auth)

### Auth Integration Patterns

**Server Component auth check:**

```typescript
// app/dashboard/jobs/page.tsx
import { getSupabaseServerClient } from '@/lib/db/server-client';
import { redirect } from 'next/navigation';

export default async function JobsPage() {
  const supabase = await getSupabaseServerClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    redirect('/login');
  }
  
  // Fetch user's jobs
  const { data: jobs } = await supabase
    .from('jobs')
    .select('*')
    .eq('user_id', user.id);
  
  return <JobList jobs={jobs} />;
}
```

**Client Component auth:**

```typescript
// components/auth/AuthButton.tsx
'use client';

import { useEffect, useState } from 'react';
import { getSupabaseClient } from '@/lib/db/client';
import type { User } from '@supabase/supabase-js';

export function AuthButton() {
  const [user, setUser] = useState<User | null>(null);
  const supabase = getSupabaseClient();
  
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );
    
    return () => subscription.unsubscribe();
  }, []);
  
  // Render auth UI
}
```

**Middleware auth:**

```typescript
// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res });
  
  const { data: { session } } = await supabase.auth.getSession();
  
  // Protect dashboard routes
  if (request.nextUrl.pathname.startsWith('/dashboard') && !session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return res;
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
```

### Auth Providers

**Supported auth methods:**
- Email/password
- Magic link (passwordless)
- OAuth (Google, GitHub, etc.)

**Configuration:**
- Configure providers in Supabase dashboard
- Document setup in `docs/supabase-setup.md`

See [14-supabase-integration.md](14-supabase-integration.md) for detailed auth patterns.

## Supabase Features

### Storage (Optional)

**If storing CVs/files:**

```typescript
// lib/storage/client.ts
import { getSupabaseClient } from '@/lib/db/client';

export async function uploadCV(file: File, userId: string) {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase.storage
    .from('cvs')
    .upload(`${userId}/${file.name}`, file, {
      cacheControl: '3600',
      upsert: false,
    });
  
  if (error) throw error;
  return data;
}
```

**Storage RLS policies required** - configure in Supabase dashboard.

### Realtime (Optional)

**If using real-time features:**

```typescript
// components/jobs/JobList.tsx
'use client';

import { useEffect } from 'react';
import { getSupabaseClient } from '@/lib/db/client';

export function JobList({ initialJobs }: { initialJobs: Job[] }) {
  const supabase = getSupabaseClient();
  
  useEffect(() => {
    const channel = supabase
      .channel('jobs-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'jobs',
        filter: `user_id=eq.${userId}`,
      }, (payload) => {
        // Handle real-time updates
        console.log('Job changed:', payload);
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
  // Render jobs
}
```

### Edge Functions (Optional)

**If using Supabase Edge Functions:**

- Location: `supabase/functions/`
- Deploy: `supabase functions deploy <function-name>`
- Use for: Background jobs, webhooks, heavy processing

See [13-supabase-security.md](13-supabase-security.md) for Edge Function security patterns.

## Observability

### Audit Logging

Every "agentic" step that mutates state must write an audit record:

```typescript
// lib/audit/log.ts
import { getSupabaseAdmin } from '@/lib/db/admin';

/**
 * Log an action to the audit log.
 * Uses service role key to ensure users cannot tamper with audit logs.
 */
export async function logAction(params: {
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  metadata?: Record<string, unknown>;
}) {
  const admin = getSupabaseAdmin(); // Use admin client for audit logs
  
  await admin.from('audit_log').insert({
    user_id: params.userId,
    action: params.action,
    resource: params.resource,
    resource_id: params.resourceId,
    metadata: params.metadata,
    created_at: new Date().toISOString(),
  });
}
```

**Required audit events:**
- Job creation/update/deletion
- Application status changes
- AI generation events (CV, cover letter, message)
- User preference changes
- Authentication events (login, logout, password change)

### Structured Logging

**Use structured logging for better observability:**

```typescript
// lib/logger.ts
export function logInfo(message: string, metadata?: Record<string, unknown>) {
  console.log(JSON.stringify({
    level: 'info',
    message,
    timestamp: new Date().toISOString(),
    ...metadata,
  }));
}

export function logError(error: Error, metadata?: Record<string, unknown>) {
  console.error(JSON.stringify({
    level: 'error',
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    ...metadata,
  }));
}
```

### Error Tracking

**Integrate error tracking service (e.g., Sentry):**

```typescript
// lib/error-tracking.ts
import * as Sentry from '@sentry/nextjs';

export function captureError(error: Error, context?: Record<string, unknown>) {
  Sentry.captureException(error, {
    extra: context,
  });
}
```

### Performance Monitoring

**Monitor database query performance:**

```typescript
// lib/db/queries/jobs.ts
import { getSupabaseServerClient } from '@/lib/db/server-client';
import { logInfo } from '@/lib/logger';

export async function getJobsByUserId(userId: string): Promise<Job[]> {
  const startTime = Date.now();
  const supabase = await getSupabaseServerClient();
  
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('user_id', userId);
  
  const duration = Date.now() - startTime;
  
  if (error) {
    logError(error, { function: 'getJobsByUserId', userId, duration });
    throw error;
  }
  
  logInfo('getJobsByUserId', { userId, count: data.length, duration });
  return data;
}
```

See [15-monitoring.md](15-monitoring.md) for detailed observability patterns.

## Caching Strategy

### Next.js Caching

- Use `cache()` for data fetching in Server Components
- Use `revalidate` for time-based revalidation
- Use `unstable_cache` for custom caching needs

### Database Query Optimization

- Add indexes for common query patterns (see [06-data-model.md](06-data-model.md))
- Use pagination for large result sets
- Avoid N+1 queries (use batch fetching)

See [12-performance.md](12-performance.md) for detailed performance rules.

## Development Environment

### Tool Version Management

**This project uses mise** (https://mise.jdx.dev) for tool version management:
- Node.js version is managed via `.mise.toml`
- pnpm version is managed via `.mise.toml`
- mise automatically sets up the correct tool versions when you enter the project directory
- No need to manually install or switch Node.js versions

**Setup:**
```bash
# Install mise (if not already installed)
curl https://mise.run | sh

# Enter project directory - mise automatically activates
cd /path/to/opportunity.ai

# Verify versions
mise ls
```

## Environment Variables

Structure:

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...  # Server-side only
OPENAI_API_KEY=...              # Server-side only
```

- `NEXT_PUBLIC_*` variables are exposed to the browser
- All other variables are server-side only
- Never commit `.env.local` (see [05-security-and-compliance.md](05-security-and-compliance.md))

## Deployment

### Vercel

**This project is deployed on Vercel:**
- Automatic deployments from main branch
- Preview deployments for pull requests
- Environment variables configured in Vercel dashboard
- Edge runtime support for optimal performance

**Deployment workflow:**
1. Push to main branch → automatic production deployment
2. Create PR → preview deployment
3. Environment variables synced from Vercel dashboard

See [12-performance.md](12-performance.md) for Vercel-specific optimizations.

## Related Rules

- See [00-operating-system.md](00-operating-system.md) for development setup with mise
- See [03-coding-standards.md](03-coding-standards.md) for code quality standards
- See [06-data-model.md](06-data-model.md) for database schema conventions
- See [13-supabase-security.md](13-supabase-security.md) for Supabase security patterns
- See [14-supabase-integration.md](14-supabase-integration.md) for Next.js + Supabase integration patterns
- See [15-monitoring.md](15-monitoring.md) for observability patterns
- See [07-ai-integration.md](07-ai-integration.md) for AI integration patterns
- See [11-api-design.md](11-api-design.md) for API design conventions
- See [12-performance.md](12-performance.md) for performance optimization
