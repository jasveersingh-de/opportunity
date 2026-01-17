---
description: API endpoint conventions and RESTful patterns
globs: "app/api/**"
alwaysApply: true
---

# API Design

## RESTful Conventions

### HTTP Methods

**Use appropriate HTTP methods:**

- **GET**: Read/fetch resources
- **POST**: Create new resources
- **PUT**: Replace entire resource
- **PATCH**: Partial update
- **DELETE**: Delete resource

### Resource Naming

**Use plural nouns for resources:**

```
✅ GOOD
GET    /api/jobs
POST   /api/jobs
GET    /api/jobs/:id
PUT    /api/jobs/:id
DELETE /api/jobs/:id

GET    /api/applications
POST   /api/applications
GET    /api/applications/:id

❌ BAD
GET    /api/job
POST   /api/createJob
GET    /api/getJob/:id
```

### Nested Resources

**Use nested routes for related resources:**

```
✅ GOOD
GET    /api/jobs/:id/applications
POST   /api/jobs/:id/applications
GET    /api/jobs/:id/artifacts

❌ BAD
GET    /api/applications?jobId=:id
```

## Response Format

### Success Response

**Use consistent response wrapper:**

```typescript
// Success response
{
  data: T,           // The actual data
  meta?: {           // Optional metadata
    page?: number;
    pageSize?: number;
    total?: number;
  }
}

// Error response
{
  error: string,     // User-friendly error message
  code?: string,     // Error code (e.g., 'VALIDATION_ERROR')
  field?: string,    // Field name (for validation errors)
  details?: unknown  // Additional error details
}
```

### Response Examples

```typescript
// GET /api/jobs
{
  "data": [
    { "id": "1", "title": "Software Engineer", ... },
    { "id": "2", "title": "Product Manager", ... }
  ],
  "meta": {
    "page": 1,
    "pageSize": 20,
    "total": 45
  }
}

// GET /api/jobs/:id
{
  "data": {
    "id": "1",
    "title": "Software Engineer",
    "company": "Acme Corp",
    ...
  }
}

// POST /api/jobs
{
  "data": {
    "id": "3",
    "title": "New Job",
    ...
  }
}

// Error response
{
  "error": "Job not found",
  "code": "NOT_FOUND"
}
```

## Status Codes

### HTTP Status Code Usage

**Use appropriate status codes:**

- **200 OK**: Successful GET, PUT, PATCH
- **201 Created**: Successful POST (resource created)
- **204 No Content**: Successful DELETE
- **400 Bad Request**: Validation errors, malformed request
- **401 Unauthorized**: Authentication required
- **403 Forbidden**: Authenticated but not authorized
- **404 Not Found**: Resource doesn't exist
- **409 Conflict**: Resource conflict (e.g., duplicate)
- **422 Unprocessable Entity**: Validation errors (alternative to 400)
- **500 Internal Server Error**: Server errors

### Status Code Examples

```typescript
// app/api/jobs/route.ts
export async function GET(request: NextRequest) {
  try {
    const jobs = await getJobs();
    return NextResponse.json({ data: jobs }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createJobSchema.safeParse(body);
    
    if (!validated.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validated.error.errors },
        { status: 400 }
      );
    }
    
    const job = await createJob(validated.data);
    return NextResponse.json({ data: job }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create job' },
      { status: 500 }
    );
  }
}

// app/api/jobs/[id]/route.ts
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const job = await getJobById(params.id);
    
    if (!job) {
      return NextResponse.json(
        { error: 'Job not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ data: job }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch job' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await deleteJob(params.id);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete job' },
      { status: 500 }
    );
  }
}
```

## Request Validation

### Input Validation

**Validate all inputs at API boundaries:**

```typescript
// app/api/jobs/route.ts
import { z } from 'zod';
import { createJobSchema } from '@/lib/api/schemas';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validated = createJobSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: validated.error.errors,
        },
        { status: 400 }
      );
    }
    
    // Use validated.data (properly typed)
    const job = await createJob(validated.data);
    return NextResponse.json({ data: job }, { status: 201 });
  } catch (error) {
    // Handle errors
  }
}
```

### Query Parameters

**Validate and parse query parameters:**

```typescript
// app/api/jobs/route.ts
import { z } from 'zod';

const jobsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
  country: z.string().optional(),
  status: z.enum(['saved', 'applied', 'interview', 'offer', 'rejected']).optional(),
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  // Parse and validate query params
  const query = jobsQuerySchema.safeParse({
    page: searchParams.get('page'),
    pageSize: searchParams.get('pageSize'),
    country: searchParams.get('country'),
    status: searchParams.get('status'),
  });
  
  if (!query.success) {
    return NextResponse.json(
      { error: 'Invalid query parameters', details: query.error.errors },
      { status: 400 }
    );
  }
  
  const jobs = await getJobs(query.data);
  return NextResponse.json({ data: jobs });
}
```

## Pagination

### Pagination Pattern

**Implement pagination for list endpoints:**

```typescript
// lib/jobs/service.ts
export async function getJobs(params: {
  page: number;
  pageSize: number;
  filters?: JobFilters;
}) {
  const offset = (params.page - 1) * params.pageSize;
  
  const { data, count } = await supabase
    .from('jobs')
    .select('*', { count: 'exact' })
    .range(offset, offset + params.pageSize - 1);
  
  return {
    data: data || [],
    meta: {
      page: params.page,
      pageSize: params.pageSize,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / params.pageSize),
    },
  };
}
```

### Pagination Response

```typescript
// Response format
{
  "data": [...],
  "meta": {
    "page": 1,
    "pageSize": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

## Filtering and Sorting

### Filter Parameters

**Use query parameters for filtering:**

```
GET /api/jobs?country=US&status=applied&remoteType=remote
```

### Sorting

**Use `sort` and `order` query parameters:**

```
GET /api/jobs?sort=rank_score&order=desc
GET /api/jobs?sort=created_at&order=asc
```

```typescript
// lib/jobs/service.ts
export async function getJobs(params: {
  sort?: string;
  order?: 'asc' | 'desc';
  filters?: JobFilters;
}) {
  let query = supabase.from('jobs').select('*');
  
  // Apply filters
  if (params.filters?.country) {
    query = query.eq('country', params.filters.country);
  }
  
  // Apply sorting
  if (params.sort) {
    query = query.order(params.sort, { ascending: params.order === 'asc' });
  }
  
  return query;
}
```

## Authentication

### Auth Middleware

**Validate authentication in API routes:**

```typescript
// lib/auth/middleware.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function requireAuth(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    return {
      error: NextResponse.json(
        { error: 'Unauthorized', code: 'UNAUTHORIZED' },
        { status: 401 }
      ),
    };
  }
  
  return { user };
}
```

### Usage in Routes

```typescript
// app/api/jobs/route.ts
export async function POST(request: NextRequest) {
  const auth = await requireAuth(request);
  if (auth.error) return auth.error;
  
  const { user } = auth;
  // Proceed with authenticated request
}
```

## Rate Limiting

**Implement rate limiting for expensive operations:**

```typescript
// lib/rate-limit.ts
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  const userId = await getUserId(request);
  
  const allowed = await checkRateLimit(userId);
  if (!allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded', code: 'RATE_LIMIT' },
      { status: 429 }
    );
  }
  
  // Proceed with request
}
```

## Related Rules

- See [02-architecture.md](02-architecture.md) for route handler structure
- See [10-error-handling.md](10-error-handling.md) for error handling patterns
- See [05-security-and-compliance.md](05-security-and-compliance.md) for security requirements
