---
description: Next.js App Router + Supabase integration patterns and best practices
globs: "**/*.{ts,tsx}"
alwaysApply: true
---

# Supabase Integration Patterns

This document provides Next.js App Router + Supabase integration patterns based on [Supabase Next.js Guide](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs).

## Client Initialization

### Server Components

**Use `createServerClient` from `@supabase/ssr`:**

```typescript
// lib/db/server-client.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

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

**Usage in Server Components:**

```typescript
// app/dashboard/jobs/page.tsx
import { getSupabaseServerClient } from '@/lib/db/server-client';
import { redirect } from 'next/navigation';

export default async function JobsPage() {
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/login');
  }
  
  const { data: jobs } = await supabase
    .from('jobs')
    .select('*')
    .eq('user_id', user.id);
  
  return <JobList jobs={jobs || []} />;
}
```

### Client Components

**Use standard `createClient` for client components:**

```typescript
// lib/db/client.ts
import { createClient } from '@supabase/supabase-js';

export function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

**Usage in Client Components:**

```typescript
// components/jobs/JobList.tsx
'use client';

import { useEffect, useState } from 'react';
import { getSupabaseClient } from '@/lib/db/client';
import type { Job } from '@/lib/db/types';

export function JobList() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const supabase = getSupabaseClient();
  
  useEffect(() => {
    async function loadJobs() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const { data } = await supabase
        .from('jobs')
        .select('*')
        .eq('user_id', user.id);
      
      if (data) setJobs(data);
    }
    
    loadJobs();
  }, []);
  
  return <div>{/* Render jobs */}</div>;
}
```

### Route Handlers (API Routes)

**Use `createRouteHandlerClient`:**

```typescript
// app/api/jobs/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    return NextResponse.json(
      { error: 'Unauthorized', code: 'UNAUTHORIZED' },
      { status: 401 }
    );
  }
  
  const { data: jobs } = await supabase
    .from('jobs')
    .select('*')
    .eq('user_id', user.id);
  
  return NextResponse.json({ data: jobs });
}
```

### Server Actions

**Use server client in Server Actions:**

```typescript
// app/actions/jobs.ts
'use server';

import { getSupabaseServerClient } from '@/lib/db/server-client';
import { revalidatePath } from 'next/cache';

export async function createJobAction(formData: FormData) {
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { error: 'Unauthorized' };
  }
  
  const title = formData.get('title') as string;
  const company = formData.get('company') as string;
  
  const { data, error } = await supabase
    .from('jobs')
    .insert({ user_id: user.id, title, company })
    .select()
    .single();
  
  if (error) {
    return { error: 'Failed to create job' };
  }
  
  revalidatePath('/dashboard/jobs');
  return { success: true, data };
}
```

## Authentication Patterns

### Login Page

```typescript
// app/login/page.tsx
'use client';

import { useState } from 'react';
import { getSupabaseClient } from '@/lib/db/client';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const supabase = getSupabaseClient();
  
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('Login error:', error);
      return;
    }
    
    router.push('/dashboard');
    router.refresh();
  }
  
  return (
    <form onSubmit={handleLogin}>
      {/* Form fields */}
    </form>
  );
}
```

### Magic Link Login

```typescript
// app/login/page.tsx
async function handleMagicLink(email: string) {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  
  if (error) {
    console.error('Magic link error:', error);
    return;
  }
  
  // Show success message
}
```

### Auth Callback Handler

```typescript
// app/auth/callback/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const supabase = createRouteHandlerClient({ cookies });
  
  if (code) {
    await supabase.auth.exchangeCodeForSession(code);
  }
  
  return NextResponse.redirect(new URL('/dashboard', request.url));
}
```

### Protected Route Middleware

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
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  // Redirect authenticated users away from login
  if (request.nextUrl.pathname === '/login' && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return res;
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};
```

## Data Fetching Patterns

### Server Component Data Fetching

**Use Server Components for initial data load:**

```typescript
// app/dashboard/jobs/page.tsx
import { getSupabaseServerClient } from '@/lib/db/server-client';
import { cache } from 'react';

const getCachedJobs = cache(async (userId: string) => {
  const supabase = await getSupabaseServerClient();
  const { data } = await supabase
    .from('jobs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  return data || [];
});

export default async function JobsPage() {
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) redirect('/login');
  
  const jobs = await getCachedJobs(user.id);
  
  return <JobList initialJobs={jobs} />;
}
```

### Client Component Real-time Updates

**Combine Server Component initial load with Client Component real-time:**

```typescript
// components/jobs/JobList.tsx
'use client';

import { useEffect, useState } from 'react';
import { getSupabaseClient } from '@/lib/db/client';
import type { Job } from '@/lib/db/types';

export function JobList({ initialJobs }: { initialJobs: Job[] }) {
  const [jobs, setJobs] = useState(initialJobs);
  const supabase = getSupabaseClient();
  
  useEffect(() => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    const channel = supabase
      .channel('jobs-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'jobs',
        filter: `user_id=eq.${user.id}`,
      }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setJobs((prev) => [payload.new as Job, ...prev]);
        } else if (payload.eventType === 'UPDATE') {
          setJobs((prev) =>
            prev.map((job) =>
              job.id === payload.new.id ? (payload.new as Job) : job
            )
          );
        } else if (payload.eventType === 'DELETE') {
          setJobs((prev) => prev.filter((job) => job.id !== payload.old.id));
        }
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
  return <div>{/* Render jobs */}</div>;
}
```

## Error Handling

### Supabase Error Handling

```typescript
// lib/db/queries/jobs.ts
import { getSupabaseServerClient } from '@/lib/db/server-client';
import { DatabaseError } from '@/lib/errors';

export async function getJobsByUserId(userId: string): Promise<Job[]> {
  const supabase = await getSupabaseServerClient();
  
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('user_id', userId);
  
  if (error) {
    // Supabase errors have codes
    if (error.code === 'PGRST116') {
      // No rows returned - not an error, return empty array
      return [];
    }
    
    throw new DatabaseError('Failed to fetch jobs', error);
  }
  
  return data || [];
}
```

## Best Practices

### 1. Always Check Authentication

**In Server Components:**
```typescript
const { data: { user } } = await supabase.auth.getUser();
if (!user) redirect('/login');
```

**In API Routes:**
```typescript
const { data: { user }, error } = await supabase.auth.getUser();
if (error || !user) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```

### 2. Use RLS for Data Protection

**RLS policies protect data even if anon key is exposed:**
- Always use anon key in client code
- RLS policies enforce access control
- Never use service role key in client

### 3. Cache Server Component Data

**Use React `cache()` for Server Component data fetching:**
```typescript
import { cache } from 'react';

const getCachedData = cache(async (userId: string) => {
  // Fetch data
});
```

### 4. Handle Loading States

**Show loading states during data fetching:**
```typescript
// app/dashboard/jobs/loading.tsx
export default function Loading() {
  return <JobListSkeleton />;
}
```

### 5. Optimistic Updates

**Use optimistic updates for better UX:**
```typescript
'use client';

import { useOptimistic } from 'react';

export function JobCard({ job }: { job: Job }) {
  const [optimisticJob, setOptimisticJob] = useOptimistic(job);
  
  async function updateStatus(newStatus: string) {
    setOptimisticJob({ ...job, status: newStatus }); // Optimistic
    await updateJobStatus(job.id, newStatus); // Actual update
  }
}
```

## Related Rules

- See [02-architecture.md](02-architecture.md) for overall architecture
- See [13-supabase-security.md](13-supabase-security.md) for security patterns
- See [06-data-model.md](06-data-model.md) for database patterns
- See [10-error-handling.md](10-error-handling.md) for error handling

## References

- [Supabase Next.js Guide](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Supabase Auth Helpers](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
- [Supabase Realtime](https://supabase.com/docs/guides/realtime)
