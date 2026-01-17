# Component Patterns

## Overview

This document defines reusable component patterns for the Opportunity.ai UI, following clean architecture principles.

## Presentation Components

### Pattern: Pure Presentation Component

**When to use:** Display-only components with no business logic.

**Structure:**
```typescript
// components/features/jobs/presentation/JobCard.tsx
interface JobCardProps {
  job: Job;
  onEdit?: (job: Job) => void;
  onDelete?: (jobId: string) => void;
}

export function JobCard({ job, onEdit, onDelete }: JobCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{job.title}</CardTitle>
        <CardDescription>{job.company}</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Job details */}
      </CardContent>
      <CardFooter>
        <Button onClick={() => onEdit?.(job)}>Edit</Button>
        <Button onClick={() => onDelete?.(job.id)}>Delete</Button>
      </CardFooter>
    </Card>
  );
}
```

**Guidelines:**
- No API calls
- Props define all data and callbacks
- Easy to test in isolation
- Reusable across contexts

## Container Components

### Pattern: Container Component

**When to use:** Connect presentation components to services/data.

**Structure:**
```typescript
// components/features/jobs/containers/JobsPageContainer.tsx
'use client';

import { useState, useEffect } from 'react';
import { JobService } from '@/lib/services/jobs/job.service';
import { JobList } from '../presentation/JobList';

export function JobsPageContainer() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const jobService = new JobService();
  
  useEffect(() => {
    jobService.getJobs().then((data) => {
      setJobs(data);
      setLoading(false);
    });
  }, []);
  
  const handleDelete = async (jobId: string) => {
    await jobService.deleteJob(jobId);
    setJobs(jobs.filter(j => j.id !== jobId));
  };
  
  if (loading) return <LoadingSkeleton />;
  
  return <JobList jobs={jobs} onDelete={handleDelete} />;
}
```

**Guidelines:**
- Handle data fetching
- Manage loading/error states
- Connect to services
- Compose presentation components

## Server Components

### Pattern: Server Component Page

**When to use:** Pages that fetch data server-side.

**Structure:**
```typescript
// app/(dashboard)/jobs/page.tsx
import { JobService } from '@/lib/services/jobs/job.service';
import { JobList } from '@/components/features/jobs/presentation/JobList';

export default async function JobsPage() {
  const jobService = new JobService();
  const jobs = await jobService.getJobs();
  
  return <JobList jobs={jobs} />;
}
```

**Guidelines:**
- Fetch data server-side
- Use Server Components by default
- Compose Client Components when needed

## Form Patterns

### Pattern: Form with Validation

**Structure:**
```typescript
// components/features/jobs/JobForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createJobSchema } from '@/lib/api/schemas';

export function JobForm({ onSubmit }: { onSubmit: (data: CreateJobInput) => Promise<void> }) {
  const form = useForm({
    resolver: zodResolver(createJobSchema),
  });
  
  const handleSubmit = async (data: CreateJobInput) => {
    await onSubmit(data);
    form.reset();
  };
  
  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      {/* Form fields */}
    </form>
  );
}
```

## Related Documentation

- [Service Patterns](./service-patterns.md)
- [AI Integration Patterns](./ai-integration-patterns.md)
- [Architecture Rules](../../rules/02-architecture.md)
