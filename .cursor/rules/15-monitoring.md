---
description: Monitoring, logging, and observability patterns
globs: "**/*.{ts,tsx}"
alwaysApply: true
---

# Monitoring & Observability

## Logging Standards

### Structured Logging

**Use structured logging for better observability:**

```typescript
// lib/logger.ts
type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  userId?: string;
  requestId?: string;
  metadata?: Record<string, unknown>;
}

export function log(level: LogLevel, message: string, metadata?: Record<string, unknown>) {
  const entry: LogEntry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...metadata,
  };
  
  // In production, send to logging service
  if (process.env.NODE_ENV === 'production') {
    // Send to logging service (e.g., Logtail, Datadog, etc.)
    // logToService(entry);
  } else {
    // In development, log to console
    console[level](JSON.stringify(entry, null, 2));
  }
}

export const logger = {
  info: (message: string, metadata?: Record<string, unknown>) =>
    log('info', message, metadata),
  warn: (message: string, metadata?: Record<string, unknown>) =>
    log('warn', message, metadata),
  error: (message: string, metadata?: Record<string, unknown>) =>
    log('error', message, metadata),
  debug: (message: string, metadata?: Record<string, unknown>) =>
    log('debug', message, metadata),
};
```

### Logging Best Practices

**What to log:**
- User actions (with user ID)
- API requests (method, path, status, duration)
- Database queries (query type, duration, row count)
- AI generation events (model, prompt version, duration)
- Errors (with stack traces and context)

**What NOT to log:**
- Passwords or API keys
- Full request bodies with sensitive data
- Full CV/resume content
- Personal identifiable information (PII) unless necessary

**Example usage:**

```typescript
// lib/jobs/service.ts
import { logger } from '@/lib/logger';

export async function createJob(data: CreateJobInput, userId: string) {
  const startTime = Date.now();
  
  try {
    logger.info('Creating job', { userId, title: data.title });
    
    const job = await db.queries.jobs.create(data, userId);
    
    const duration = Date.now() - startTime;
    logger.info('Job created', {
      userId,
      jobId: job.id,
      duration,
    });
    
    return job;
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error('Failed to create job', {
      userId,
      error: error instanceof Error ? error.message : 'Unknown error',
      duration,
    });
    throw error;
  }
}
```

## Error Tracking

### Error Tracking Integration

**Integrate error tracking service (e.g., Sentry):**

```typescript
// lib/error-tracking.ts
import * as Sentry from '@sentry/nextjs';

export function captureError(
  error: Error,
  context?: {
    userId?: string;
    requestId?: string;
    metadata?: Record<string, unknown>;
  }
) {
  Sentry.captureException(error, {
    user: context?.userId ? { id: context.userId } : undefined,
    tags: {
      requestId: context?.requestId,
    },
    extra: context?.metadata,
  });
}

export function captureMessage(
  message: string,
  level: 'info' | 'warning' | 'error' = 'info',
  context?: Record<string, unknown>
) {
  Sentry.captureMessage(message, {
    level,
    extra: context,
  });
}
```

**Usage:**

```typescript
// app/api/jobs/route.ts
import { captureError } from '@/lib/error-tracking';

export async function POST(request: NextRequest) {
  try {
    // ... business logic
  } catch (error) {
    captureError(error instanceof Error ? error : new Error('Unknown error'), {
      userId: user?.id,
      metadata: { endpoint: '/api/jobs', method: 'POST' },
    });
    
    return NextResponse.json(
      { error: 'Failed to create job' },
      { status: 500 }
    );
  }
}
```

## Performance Monitoring

### Database Query Performance

**Monitor database query performance:**

```typescript
// lib/db/queries/jobs.ts
import { logger } from '@/lib/logger';

export async function getJobsByUserId(userId: string): Promise<Job[]> {
  const startTime = Date.now();
  const supabase = await getSupabaseServerClient();
  
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('user_id', userId);
  
  const duration = Date.now() - startTime;
  
  if (error) {
    logger.error('Database query failed', {
      function: 'getJobsByUserId',
      userId,
      duration,
      error: error.message,
    });
    throw error;
  }
  
  // Log slow queries
  if (duration > 1000) {
    logger.warn('Slow database query', {
      function: 'getJobsByUserId',
      userId,
      duration,
      rowCount: data?.length || 0,
    });
  }
  
  logger.debug('Database query completed', {
    function: 'getJobsByUserId',
    userId,
    duration,
    rowCount: data?.length || 0,
  });
  
  return data || [];
}
```

### API Route Performance

**Monitor API route performance:**

```typescript
// middleware.ts or API route wrapper
export async function withPerformanceMonitoring<T>(
  handler: () => Promise<T>,
  metadata: { endpoint: string; method: string }
): Promise<T> {
  const startTime = Date.now();
  
  try {
    const result = await handler();
    const duration = Date.now() - startTime;
    
    logger.info('API request completed', {
      ...metadata,
      duration,
      status: 'success',
    });
    
    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    
    logger.error('API request failed', {
      ...metadata,
      duration,
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    
    throw error;
  }
}
```

### AI Generation Performance

**Monitor AI generation performance:**

```typescript
// lib/ai/client.ts
import { logger } from '@/lib/logger';

export async function generateCV(params: GenerateCVParams) {
  const startTime = Date.now();
  
  try {
    logger.info('Starting CV generation', {
      userId: params.userId,
      jobId: params.jobId,
      model: 'gpt-4',
      promptVersion: params.promptVersion,
    });
    
    const response = await openai.chat.completions.create({...});
    const duration = Date.now() - startTime;
    
    logger.info('CV generation completed', {
      userId: params.userId,
      jobId: params.jobId,
      duration,
      tokenCount: response.usage?.total_tokens,
      promptTokens: response.usage?.prompt_tokens,
      completionTokens: response.usage?.completion_tokens,
    });
    
    return response;
  } catch (error) {
    const duration = Date.now() - startTime;
    
    logger.error('CV generation failed', {
      userId: params.userId,
      jobId: params.jobId,
      duration,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    
    throw error;
  }
}
```

## Audit Logging

### Audit Log Requirements

**Log all important actions to audit_log table:**

```typescript
// lib/audit/log.ts
import { getSupabaseAdmin } from '@/lib/db/admin';
import { logger } from '@/lib/logger';

export async function logAction(params: {
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  metadata?: Record<string, unknown>;
}) {
  const admin = getSupabaseAdmin(); // Use admin client for audit logs
  
  try {
    await admin.from('audit_log').insert({
      user_id: params.userId,
      action: params.action,
      resource: params.resource,
      resource_id: params.resourceId,
      metadata: params.metadata,
      created_at: new Date().toISOString(),
    });
    
    logger.debug('Audit log created', {
      userId: params.userId,
      action: params.action,
      resource: params.resource,
    });
  } catch (error) {
    // Log audit log failure (critical - should never fail silently)
    logger.error('Failed to create audit log', {
      userId: params.userId,
      action: params.action,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    
    // Still throw - audit logging is critical
    throw error;
  }
}
```

**Required audit events:**
- Job creation/update/deletion
- Application status changes
- AI generation events (CV, cover letter, message)
- User preference changes
- Authentication events (login, logout, password change)
- Profile updates

## Metrics & Alerting

### Key Metrics to Track

**Application Metrics:**
- Request rate (requests per minute)
- Error rate (errors per minute)
- Response time (p50, p95, p99)
- Database query performance
- AI generation latency

**Business Metrics:**
- Jobs created per user
- Applications tracked
- AI generations per user
- User retention

**Infrastructure Metrics:**
- Database connection pool usage
- API rate limit hits
- Storage usage
- Function execution time (if using Edge Functions)

### Alerting Thresholds

**Set up alerts for:**
- Error rate > 1% of requests
- Response time p95 > 2 seconds
- Database query time > 1 second
- AI generation failures > 5% of requests
- Rate limit hits > 10 per hour per user

**Example alert configuration:**

```typescript
// lib/alerts.ts
import { logger } from '@/lib/logger';

export function checkErrorRate(errorCount: number, totalRequests: number) {
  const errorRate = (errorCount / totalRequests) * 100;
  
  if (errorRate > 1) {
    logger.warn('High error rate detected', {
      errorRate,
      errorCount,
      totalRequests,
    });
    
    // Send alert (e.g., to PagerDuty, Slack, etc.)
    // sendAlert({ type: 'error_rate', value: errorRate });
  }
}
```

## Monitoring Checklist

Before deploying to production:

- [ ] Structured logging implemented
- [ ] Error tracking service configured (Sentry, etc.)
- [ ] Performance monitoring in place
- [ ] Audit logging for all critical actions
- [ ] Key metrics defined and tracked
- [ ] Alerting thresholds configured
- [ ] Log retention policy defined
- [ ] Monitoring dashboard set up

## Related Rules

- See [02-architecture.md](02-architecture.md) for observability architecture
- See [10-error-handling.md](10-error-handling.md) for error handling patterns
- See [06-data-model.md](06-data-model.md) for audit_log table schema
