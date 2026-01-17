# Service Patterns

## Overview

Service layer patterns for business logic, data transformation, and external integrations.

## Service Layer Pattern

### Pattern: Service Class

**Structure:**
```typescript
// lib/services/jobs/job.service.ts
import { JobQueries } from '@/lib/db/queries/jobs.queries';
import { AuditLogger } from '@/lib/audit/logger';
import { z } from 'zod';

const CreateJobSchema = z.object({
  title: z.string().min(1),
  company: z.string().min(1),
  // ...
});

export class JobService {
  constructor(
    private queries: JobQueries = new JobQueries(),
    private audit: AuditLogger = new AuditLogger()
  ) {}
  
  async createJob(input: unknown, userId: string): Promise<Job> {
    // 1. Validate input
    const data = CreateJobSchema.parse(input);
    
    // 2. Business logic
    const job = await this.queries.create({
      ...data,
      user_id: userId,
      ingested_at: new Date(),
    });
    
    // 3. Audit log
    await this.audit.log({
      userId,
      action: 'create_job',
      resource: 'job',
      resourceId: job.id,
    });
    
    return job;
  }
  
  async getJobs(filters: JobFilters, userId: string): Promise<Job[]> {
    return this.queries.findByUser(userId, filters);
  }
}
```

**Guidelines:**
- Validate input with Zod
- Handle business logic
- Call data layer (queries)
- Log important actions
- Return typed results

## Mock Service Pattern

### Pattern: Mock Service for POC

**Structure:**
```typescript
// lib/services/jobs/job.service.mock.ts
export class MockJobService {
  private jobs: Job[] = [];
  
  async createJob(data: CreateJobInput): Promise<Job> {
    const job: Job = {
      id: crypto.randomUUID(),
      ...data,
      created_at: new Date(),
    };
    this.jobs.push(job);
    return job;
  }
  
  async getJobs(): Promise<Job[]> {
    return this.jobs;
  }
}
```

**Usage:**
```typescript
// In POC phase
const jobService = new MockJobService();

// In MVP phase
const jobService = new JobService();
```

## Related Documentation

- [Component Patterns](./component-patterns.md)
- [AI Integration Patterns](./ai-integration-patterns.md)
- [Architecture Rules](../../rules/02-architecture.md)
