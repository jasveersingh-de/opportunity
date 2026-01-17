---
description: TypeScript, Next.js, and general coding conventions
globs: "**/*.{ts,tsx,js,jsx}"
alwaysApply: true
---

# Coding Standards

## TypeScript

### Strict Mode Requirements

**Always use strict TypeScript configuration:**

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true
  }
}
```

### Type Safety Rules

- **No `any`** unless there is a clear justification comment explaining why
- **Prefer `unknown` over `any`** when type is truly unknown
- **Use type assertions sparingly**: Prefer type guards and proper typing
- **Strong typing for API responses and DB models**: Use generated types from Supabase

### Runtime Validation

**Use `zod` (or equivalent) for runtime validation at boundaries:**

```typescript
// lib/api/schemas.ts
import { z } from 'zod';

export const createJobSchema = z.object({
  title: z.string().min(1),
  company: z.string().min(1),
  url: z.string().url(),
  country: z.string().length(2), // ISO country code
});

export type CreateJobInput = z.infer<typeof createJobSchema>;
```

**Validate at API boundaries:**

```typescript
// app/api/jobs/route.ts
import { createJobSchema } from '@/lib/api/schemas';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validated = createJobSchema.safeParse(body);
  
  if (!validated.success) {
    return NextResponse.json(
      { error: 'Invalid input', details: validated.error.errors },
      { status: 400 }
    );
  }
  
  // Use validated.data (properly typed)
}
```

## Next.js Conventions

### Route Handlers

- **Keep route handlers thin**: Move logic to `lib/*`
- **Use proper HTTP methods**: GET, POST, PUT, DELETE, PATCH
- **Return consistent response format**: See [11-api-design.md](11-api-design.md)

### Caching Semantics

- **Avoid accidental stale data**: Use `cache()` for Server Components
- **Be explicit about revalidation**: Use `revalidate` or `revalidatePath` when needed
- **Don't cache user-specific data globally**: Cache per user or don't cache

### Server Actions

```typescript
// app/actions/jobs.ts
'use server';

import { createJobSchema } from '@/lib/api/schemas';
import { createJob } from '@/lib/jobs/service';

export async function createJobAction(formData: FormData) {
  const data = {
    title: formData.get('title'),
    company: formData.get('company'),
    // ...
  };
  
  const validated = createJobSchema.safeParse(data);
  if (!validated.success) {
    return { error: 'Invalid input' };
  }
  
  try {
    const job = await createJob(validated.data);
    return { success: true, data: job };
  } catch (error) {
    return { error: 'Failed to create job' };
  }
}
```

## Code Style

### Function Design

- **Small functions**: Single responsibility, clear purpose
- **Clear names**: Function names should describe what they do
- **Avoid clever abstractions**: Prefer straightforward, readable code
- **Limit function length**: If a function is >50 lines, consider breaking it up

### Documentation

**Add JSDoc to non-trivial functions**, especially:
- Integration boundaries (API calls, database queries)
- Complex algorithms
- Public APIs (exported functions)

```typescript
/**
 * Fetches jobs for a user with optional filters.
 * 
 * @param userId - The user ID to fetch jobs for
 * @param filters - Optional filters (country, role, status)
 * @returns Array of jobs matching the criteria
 * @throws {DatabaseError} If database query fails
 */
export async function getJobs(
  userId: string,
  filters?: JobFilters
): Promise<Job[]> {
  // ...
}
```

### Import Organization

**Organize imports in this order:**

1. External dependencies (React, Next.js, etc.)
2. Internal absolute imports (`@/lib/*`, `@/components/*`)
3. Relative imports (`./`, `../`)
4. Type-only imports (use `import type`)

```typescript
// External
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Internal absolute
import { getJobs } from '@/lib/jobs/service';
import { Button } from '@/components/ui/button';

// Relative
import { JobCard } from './JobCard';

// Types
import type { Job } from '@/lib/db/types';
```

## Error Handling

### Error Types

**Fail fast on invalid inputs:**

```typescript
// lib/errors.ts
export class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends Error {
  constructor(resource: string, id?: string) {
    super(`${resource}${id ? ` with id ${id}` : ''} not found`);
    this.name = 'NotFoundError';
  }
}

export class DatabaseError extends Error {
  constructor(message: string, public originalError?: unknown) {
    super(message);
    this.name = 'DatabaseError';
  }
}
```

### Error Handling Pattern

**Return user-safe messages; log detailed context server-side:**

```typescript
// lib/jobs/service.ts
import { logError } from '@/lib/audit/log';

export async function getJobById(id: string): Promise<Job> {
  try {
    const job = await db.queries.jobs.getById(id);
    if (!job) {
      throw new NotFoundError('Job', id);
    }
    return job;
  } catch (error) {
    // Log detailed error server-side
    logError({
      error,
      context: { function: 'getJobById', jobId: id },
    });
    
    // Re-throw with user-safe message
    if (error instanceof NotFoundError) {
      throw error; // Already user-safe
    }
    throw new Error('Failed to fetch job');
  }
}
```

See [10-error-handling.md](10-error-handling.md) for detailed error handling patterns.

## Code Quality

### Linting

- **Follow ESLint rules**: Fix all linting errors before committing
- **Use Prettier**: Consistent code formatting
- **No console.log in production code**: Use proper logging (see observability)

### Type Generation

**Generate types from Supabase schema:**

```bash
pnpm supabase gen types typescript --local > lib/db/types.ts
```

**Keep generated types in sync**: Regenerate after schema changes.

## Development Environment

### Tool Version Management

**Node.js version is managed via mise** (see `.mise.toml`):
- mise automatically sets up the correct Node.js version when entering the project directory
- No need to manually install or switch Node.js versions
- Ensure mise is installed and activated before running development commands

**Verify environment:**
```bash
# Check Node.js version (should match .mise.toml)
node --version

# Check if mise is active
mise ls
```

## Related Rules

- See [02-architecture.md](02-architecture.md) for architecture patterns
- See [04-testing-and-ci.md](04-testing-and-ci.md) for testing requirements
- See [10-error-handling.md](10-error-handling.md) for error handling patterns
- See [11-api-design.md](11-api-design.md) for API design conventions
