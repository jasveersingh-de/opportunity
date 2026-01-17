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

**Singleton pattern** for Supabase client:

```typescript
// lib/db/client.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// For server-side operations with service role key
export function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
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

## Observability

### Audit Logging

Every "agentic" step that mutates state must write an audit record:

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
- See [07-ai-integration.md](07-ai-integration.md) for AI integration patterns
- See [11-api-design.md](11-api-design.md) for API design conventions
- See [12-performance.md](12-performance.md) for performance optimization
