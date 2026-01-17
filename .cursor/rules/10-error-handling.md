---
description: Centralized error handling patterns and user-safe error messages
globs: "**/*.{ts,tsx}"
alwaysApply: true
---

# Error Handling

## Error Class Hierarchy

### Custom Error Classes

**Define error classes for different error types:**

```typescript
// lib/errors.ts

// Base error class
export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Validation errors (400)
export class ValidationError extends AppError {
  constructor(
    message: string,
    public field?: string,
    public details?: Record<string, unknown>
  ) {
    super(message, 400, 'VALIDATION_ERROR');
  }
}

// Not found errors (404)
export class NotFoundError extends AppError {
  constructor(resource: string, id?: string) {
    super(
      `${resource}${id ? ` with id ${id}` : ''} not found`,
      404,
      'NOT_FOUND'
    );
    this.resource = resource;
    this.id = id;
  }
  resource: string;
  id?: string;
}

// Unauthorized errors (401)
export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

// Forbidden errors (403)
export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(message, 403, 'FORBIDDEN');
  }
}

// Database errors (500)
export class DatabaseError extends AppError {
  constructor(
    message: string,
    public originalError?: unknown
  ) {
    super(message, 500, 'DATABASE_ERROR');
  }
}

// AI service errors (500)
export class AIServiceError extends AppError {
  constructor(
    message: string,
    public originalError?: unknown
  ) {
    super(message, 500, 'AI_SERVICE_ERROR');
  }
}
```

## Error Handling Pattern

### Service Layer

**Return user-safe messages; log detailed context server-side:**

```typescript
// lib/jobs/service.ts
import { NotFoundError, DatabaseError, ValidationError } from '@/lib/errors';
import { logError } from '@/lib/audit/log';

export async function getJobById(id: string, userId: string): Promise<Job> {
  try {
    // Validate input
    if (!id) {
      throw new ValidationError('Job ID is required', 'id');
    }
    
    const job = await db.queries.jobs.getById(id);
    
    if (!job) {
      throw new NotFoundError('Job', id);
    }
    
    // Check authorization
    if (job.user_id !== userId) {
      throw new ForbiddenError('You do not have access to this job');
    }
    
    return job;
  } catch (error) {
    // Re-throw known errors
    if (error instanceof AppError) {
      throw error;
    }
    
    // Log detailed error server-side
    logError({
      error,
      context: {
        function: 'getJobById',
        jobId: id,
        userId,
      },
    });
    
    // Return user-safe error
    throw new DatabaseError('Failed to fetch job');
  }
}
```

### API Route Handlers

**Handle errors and return appropriate HTTP responses:**

```typescript
// app/api/jobs/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import {
  AppError,
  ValidationError,
  NotFoundError,
  ForbiddenError,
} from '@/lib/errors';
import { getJobById } from '@/lib/jobs/service';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getUserId(request); // Your auth helper
    const job = await getJobById(params.id, userId);
    
    return NextResponse.json({ data: job });
  } catch (error) {
    if (error instanceof NotFoundError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: 404 }
      );
    }
    
    if (error instanceof ForbiddenError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: 403 }
      );
    }
    
    if (error instanceof ValidationError) {
      return NextResponse.json(
        {
          error: error.message,
          code: error.code,
          field: error.field,
          details: error.details,
        },
        { status: 400 }
      );
    }
    
    // Unknown errors - return generic message
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
```

### Server Actions

**Return error objects instead of throwing (for form handling):**

```typescript
// app/actions/jobs.ts
'use server';

import { createJobSchema } from '@/lib/api/schemas';
import { createJob } from '@/lib/jobs/service';
import { ValidationError } from '@/lib/errors';

export async function createJobAction(formData: FormData) {
  try {
    const data = {
      title: formData.get('title'),
      company: formData.get('company'),
      // ...
    };
    
    const validated = createJobSchema.safeParse(data);
    if (!validated.success) {
      return {
        error: 'Validation failed',
        details: validated.error.errors,
      };
    }
    
    const job = await createJob(validated.data);
    return { success: true, data: job };
  } catch (error) {
    if (error instanceof ValidationError) {
      return {
        error: error.message,
        field: error.field,
      };
    }
    
    return {
      error: 'Failed to create job. Please try again.',
    };
  }
}
```

## Error Logging

### Logging Pattern

**Log detailed errors server-side; never expose sensitive data:**

```typescript
// lib/audit/log.ts
export async function logError(params: {
  error: unknown;
  context?: Record<string, unknown>;
}) {
  const errorDetails = {
    message: error instanceof Error ? error.message : 'Unknown error',
    stack: error instanceof Error ? error.stack : undefined,
    name: error instanceof Error ? error.name : undefined,
    context: params.context,
    timestamp: new Date().toISOString(),
  };
  
  // Log to Supabase audit_log or external service
  await supabase.from('audit_log').insert({
    action: 'error',
    resource: 'system',
    metadata: errorDetails,
    created_at: new Date().toISOString(),
  });
  
  // Also log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error logged:', errorDetails);
  }
}
```

### What to Log

**Log:**
- Error message and stack trace
- Context (function name, parameters, user ID)
- Timestamp
- Error type/class

**Do NOT log:**
- Full request bodies with sensitive data
- API keys or tokens
- Passwords or credentials
- Full user data objects

## User-Safe Error Messages

### Error Message Guidelines

**Error messages should be:**
- **User-friendly**: No technical jargon or stack traces
- **Actionable**: Tell user what they can do
- **Specific**: Explain what went wrong
- **Safe**: Don't expose system internals

### Examples

```typescript
// ❌ BAD: Technical error
throw new Error('TypeError: Cannot read property "id" of undefined');

// ✅ GOOD: User-friendly
throw new NotFoundError('Job', jobId);

// ❌ BAD: Exposes system details
throw new Error('Database connection failed: ECONNREFUSED 127.0.0.1:5432');

// ✅ GOOD: Generic but helpful
throw new DatabaseError('Unable to save job. Please try again in a moment.');
```

### Error Message Mapping

```typescript
// lib/errors/messages.ts
export const ERROR_MESSAGES = {
  VALIDATION_ERROR: 'Please check your input and try again.',
  NOT_FOUND: 'The requested resource was not found.',
  UNAUTHORIZED: 'You must be logged in to perform this action.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  DATABASE_ERROR: 'A database error occurred. Please try again.',
  AI_SERVICE_ERROR: 'AI service is temporarily unavailable. Please try again later.',
  RATE_LIMIT_ERROR: 'Too many requests. Please try again later.',
} as const;
```

## Client-Side Error Handling

### React Error Boundaries

**Use error boundaries for unexpected errors:**

```typescript
// components/ErrorBoundary.tsx
'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error
    console.error('Error caught by boundary:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="error-container">
          <h2>Something went wrong</h2>
          <p>Please refresh the page or contact support if the problem persists.</p>
        </div>
      );
    }
    
    return this.props.children;
  }
}
```

### Form Error Handling

**Display validation errors in forms:**

```typescript
// components/features/jobs/JobForm.tsx
'use client';

import { useActionState } from 'react';

export function JobForm() {
  const [state, formAction] = useActionState(createJobAction, null);
  
  return (
    <form action={formAction}>
      <input name="title" />
      {state?.field === 'title' && (
        <p className="error">{state.error}</p>
      )}
      
      <button type="submit">Create Job</button>
      
      {state?.error && !state.field && (
        <p className="error">{state.error}</p>
      )}
    </form>
  );
}
```

## Error Recovery

### Retry Logic

**Implement retry logic for transient errors:**

```typescript
// lib/utils/retry.ts
export async function retry<T>(
  fn: () => Promise<T>,
  options: { maxRetries?: number; delay?: number } = {}
): Promise<T> {
  const { maxRetries = 3, delay = 1000 } = options;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
    }
  }
  
  throw new Error('Retry failed');
}
```

## Related Rules

- See [03-coding-standards.md](03-coding-standards.md) for error handling in code standards
- See [05-security-and-compliance.md](05-security-and-compliance.md) for secure error messages
- See [11-api-design.md](11-api-design.md) for API error response format
