---
description: Performance optimization rules and caching strategies
globs: "**/*.{ts,tsx}"
alwaysApply: true
---

# Performance

## Caching Strategy

### Next.js Caching

**Use Next.js caching APIs for data fetching:**

```typescript
// app/jobs/page.tsx
import { cache } from 'react';
import { getJobs } from '@/lib/jobs/service';

// Cache the data fetch
const getCachedJobs = cache(async () => {
  return getJobs();
});

export default async function JobsPage() {
  const jobs = await getCachedJobs(); // Cached per request
  return <JobList jobs={jobs} />;
}
```

### Time-Based Revalidation

**Use `revalidate` for time-based cache invalidation:**

```typescript
// app/jobs/page.tsx
export const revalidate = 3600; // Revalidate every hour

export default async function JobsPage() {
  const jobs = await getJobs();
  return <JobList jobs={jobs} />;
}
```

### On-Demand Revalidation

**Use `revalidatePath` or `revalidateTag` for on-demand invalidation:**

```typescript
// app/actions/jobs.ts
'use server';

import { revalidatePath } from 'next/cache';
import { createJob } from '@/lib/jobs/service';

export async function createJobAction(data: CreateJobInput) {
  const job = await createJob(data);
  
  // Revalidate jobs page
  revalidatePath('/jobs');
  
  return { success: true, data: job };
}
```

### Custom Caching

**Use `unstable_cache` for custom caching needs:**

```typescript
// lib/jobs/service.ts
import { unstable_cache } from 'next/cache';

export const getCachedJobs = unstable_cache(
  async (userId: string) => {
    return getJobsFromDB(userId);
  },
  ['jobs'], // Cache key
  {
    revalidate: 3600, // 1 hour
    tags: ['jobs'], // For revalidation
  }
);
```

## Database Query Optimization

### Indexes

**Add indexes for common query patterns:**

```sql
-- Single column indexes
create index idx_jobs_user_id on jobs(user_id);
create index idx_jobs_status on jobs(status);
create index idx_jobs_country on jobs(country);

-- Composite indexes for common queries
create index idx_jobs_user_status on jobs(user_id, status);
create index idx_jobs_user_country on jobs(user_id, country);

-- Partial indexes for filtered queries
create index idx_jobs_active on jobs(user_id) 
where status in ('saved', 'applied');
```

See [06-data-model.md](06-data-model.md) for index guidelines.

### Query Optimization

**Avoid N+1 queries; use batch fetching:**

```typescript
// ❌ BAD: N+1 queries
const jobs = await getJobs();
for (const job of jobs) {
  const applications = await getApplicationsForJob(job.id); // N queries
}

// ✅ GOOD: Batch fetch
const jobs = await getJobs();
const jobIds = jobs.map(job => job.id);
const applications = await getApplicationsForJobs(jobIds); // 1 query
```

### Pagination

**Always paginate large result sets:**

```typescript
// lib/jobs/service.ts
export async function getJobsPaginated(params: {
  page: number;
  pageSize: number;
  userId: string;
}) {
  const offset = (params.page - 1) * params.pageSize;
  
  const { data, count } = await supabase
    .from('jobs')
    .select('*', { count: 'exact' })
    .eq('user_id', params.userId)
    .range(offset, offset + params.pageSize - 1)
    .order('created_at', { ascending: false });
  
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

## Image Optimization

### Next.js Image Component

**Use Next.js `Image` component for optimized images:**

```typescript
// components/ui/CompanyLogo.tsx
import Image from 'next/image';

export function CompanyLogo({ src, alt }: { src: string; alt: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={100}
      height={100}
      loading="lazy"
      placeholder="blur"
    />
  );
}
```

## Code Splitting

### Dynamic Imports

**Use dynamic imports for large components:**

```typescript
// app/jobs/page.tsx
import dynamic from 'next/dynamic';

// Lazy load heavy component
const JobChart = dynamic(() => import('@/components/features/jobs/JobChart'), {
  loading: () => <JobChartSkeleton />,
  ssr: false, // If component doesn't need SSR
});

export default function JobsPage() {
  return (
    <>
      <JobList />
      <JobChart /> {/* Lazy loaded */}
    </>
  );
}
```

## Bundle Size Optimization

### Tree Shaking

**Import only what you need:**

```typescript
// ❌ BAD: Import entire library
import _ from 'lodash';
const result = _.map(data, item => item.id);

// ✅ GOOD: Import specific function
import map from 'lodash/map';
const result = map(data, item => item.id);

// ✅ BETTER: Use native methods
const result = data.map(item => item.id);
```

### Analyze Bundle

**Analyze bundle size regularly:**

```bash
# Install analyzer
pnpm add -D @next/bundle-analyzer

# Analyze
ANALYZE=true pnpm build
```

## API Response Optimization

### Response Compression

**Enable response compression (Next.js does this automatically):**

```typescript
// next.config.js
module.exports = {
  compress: true, // Default in production
};
```

### Selective Field Fetching

**Fetch only needed fields:**

```typescript
// lib/jobs/service.ts
export async function getJobList(userId: string) {
  // Only fetch fields needed for list view
  const { data } = await supabase
    .from('jobs')
    .select('id, title, company, status, created_at')
    .eq('user_id', userId);
  
  return data;
}

export async function getJobDetail(jobId: string) {
  // Fetch all fields for detail view
  const { data } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', jobId)
    .single();
  
  return data;
}
```

## Client-Side Optimization

### Memoization

**Use React.memo and useMemo for expensive computations:**

```typescript
// components/features/jobs/JobCard.tsx
import { memo, useMemo } from 'react';

export const JobCard = memo(function JobCard({ job }: { job: Job }) {
  // Expensive computation
  const formattedDate = useMemo(
    () => formatDate(job.created_at),
    [job.created_at]
  );
  
  return (
    <div>
      <h3>{job.title}</h3>
      <p>{formattedDate}</p>
    </div>
  );
});
```

### Virtual Scrolling

**Use virtual scrolling for long lists:**

```typescript
// components/features/jobs/JobList.tsx
import { useVirtualizer } from '@tanstack/react-virtual';

export function JobList({ jobs }: { jobs: Job[] }) {
  const parentRef = useRef<HTMLDivElement>(null);
  
  const virtualizer = useVirtualizer({
    count: jobs.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100,
  });
  
  return (
    <div ref={parentRef} style={{ height: '600px', overflow: 'auto' }}>
      {virtualizer.getVirtualItems().map(virtualItem => (
        <JobCard
          key={virtualItem.key}
          job={jobs[virtualItem.index]}
          style={{
            height: `${virtualItem.size}px`,
            transform: `translateY(${virtualItem.start}px)`,
          }}
        />
      ))}
    </div>
  );
}
```

## Performance Monitoring

### Web Vitals

**Monitor Core Web Vitals:**

```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Performance Checklist

Before marking performance work complete:

- [ ] Database queries are optimized (indexes, no N+1)
- [ ] Large lists are paginated
- [ ] Images use Next.js Image component
- [ ] Heavy components are lazy loaded
- [ ] API responses are cached where appropriate
- [ ] Bundle size is reasonable (< 250KB initial)
- [ ] Core Web Vitals meet targets (LCP < 2.5s, FID < 100ms, CLS < 0.1)

## Related Rules

- See [02-architecture.md](02-architecture.md) for caching strategy
- See [06-data-model.md](06-data-model.md) for database indexes
- See [11-api-design.md](11-api-design.md) for API optimization
