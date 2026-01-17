---
description: UX conventions for the PoC dashboard
globs: "app/**"
alwaysApply: true
---

# UI/UX

## Design Principles

### Minimize Clicks

**Optimize workflows for speed:**
- **Ingest** → **Rank** → **Generate** → **Track**
- Default views show actionable items first
- Inline actions where possible (no modal for simple operations)

### Default Views

**Primary navigation views:**

- **Today** - Jobs/applications updated today
- **Needs Action** - Items requiring user attention (drafts to approve, applications to follow up)
- **Applied** - Applications in progress
- **Rejected** - Rejected applications (for learning)

### Information Architecture

```
Dashboard
├── Jobs
│   ├── All Jobs (with filters)
│   ├── Ranked Jobs (AI-sorted)
│   └── Job Detail
├── Applications
│   ├── Pipeline View (by status)
│   └── Application Detail
├── Artifacts
│   ├── CVs
│   ├── Cover Letters
│   └── Messages
└── Settings
    └── Profile/Preferences
```

## Component Patterns

### Reusable Components

**Prefer reusable table/list components:**

```typescript
// components/ui/data-table.tsx
export function DataTable<T>({
  data,
  columns,
  onRowClick,
  filters,
}: DataTableProps<T>) {
  // Generic table component
}

// Usage
<DataTable
  data={jobs}
  columns={jobColumns}
  filters={jobFilters}
  onRowClick={(job) => router.push(`/jobs/${job.id}`)}
/>
```

### Component Organization

```
components/
  ui/                    # Primitive components (Button, Input, Card, etc.)
    button.tsx
    input.tsx
    card.tsx
    table.tsx
  features/              # Feature-specific components
    jobs/
      JobCard.tsx
      JobList.tsx
      JobFilters.tsx
    applications/
      ApplicationCard.tsx
      PipelineView.tsx
  layout/                # Layout components
    Header.tsx
    Sidebar.tsx
    DashboardLayout.tsx
```

### Server vs Client Components

**Default to Server Components; use Client Components only when needed:**

```typescript
// ✅ Server Component (default)
// app/jobs/page.tsx
import { getJobs } from '@/lib/jobs/service';

export default async function JobsPage() {
  const jobs = await getJobs();
  return <JobList jobs={jobs} />;
}

// ✅ Client Component (needs interactivity)
// components/features/jobs/JobFilters.tsx
'use client';

import { useState } from 'react';

export function JobFilters() {
  const [filters, setFilters] = useState({});
  // ...
}
```

## Inline Filters

### Filter Components

**Inline filters for common queries:**

- **Country** - Multi-select dropdown
- **Role** - Multi-select dropdown
- **Seniority** - Radio buttons or dropdown
- **Remote/Hybrid** - Checkboxes
- **Status** - Tabs or pills

```typescript
// components/features/jobs/JobFilters.tsx
'use client';

export function JobFilters({
  onFilterChange,
}: {
  onFilterChange: (filters: JobFilters) => void;
}) {
  return (
    <div className="flex gap-4">
      <CountrySelect onChange={(country) => onFilterChange({ country })} />
      <RoleSelect onChange={(role) => onFilterChange({ role })} />
      <RemoteTypeSelect onChange={(type) => onFilterChange({ type })} />
      <StatusTabs onChange={(status) => onFilterChange({ status })} />
    </div>
  );
}
```

## Accessibility

### Keyboard Navigation

**All interactive elements must be keyboard navigable:**

- Use semantic HTML (`<button>`, `<a>`, `<input>`)
- Tab order follows visual flow
- Focus indicators are visible
- Escape key closes modals/dropdowns

### ARIA Labels

**Proper labels for inputs and interactive elements:**

```typescript
// ✅ GOOD
<button aria-label="Add new job">+</button>
<input
  type="text"
  aria-label="Job title"
  placeholder="Enter job title"
/>

// ❌ BAD
<button>+</button> // No label
<input type="text" /> // No label
```

### Screen Reader Support

- Use semantic HTML (`<nav>`, `<main>`, `<article>`, `<section>`)
- Provide alt text for images
- Use `aria-live` regions for dynamic content updates
- Test with screen readers (VoiceOver, NVDA, JAWS)

## Performance

### Pagination

**Paginate job lists; avoid loading everything at once:**

```typescript
// app/jobs/page.tsx
export default async function JobsPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = parseInt(searchParams.page || '1');
  const pageSize = 20;
  const jobs = await getJobsPaginated({
    page,
    pageSize,
  });
  
  return (
    <>
      <JobList jobs={jobs.data} />
      <Pagination
        currentPage={page}
        totalPages={jobs.totalPages}
      />
    </>
  );
}
```

### Loading States

**Show loading states for async operations:**

```typescript
// components/features/jobs/JobList.tsx
import { Suspense } from 'react';

export function JobList({ jobs }: { jobs: Job[] }) {
  return (
    <Suspense fallback={<JobListSkeleton />}>
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </Suspense>
  );
}
```

### Optimistic Updates

**Use optimistic updates for better UX:**

```typescript
'use client';

import { useOptimistic } from 'react';

export function ApplicationStatus({ application }: { application: Application }) {
  const [optimisticStatus, setOptimisticStatus] = useOptimistic(
    application.status
  );
  
  const updateStatus = async (newStatus: string) => {
    setOptimisticStatus(newStatus); // Optimistic update
    await updateApplicationStatus(application.id, newStatus);
  };
  
  return (
    <StatusSelect
      value={optimisticStatus}
      onChange={updateStatus}
    />
  );
}
```

## Responsive Design

### Mobile-First

**Design for mobile first, then enhance for desktop:**

- Use responsive breakpoints (Tailwind: `sm:`, `md:`, `lg:`, `xl:`)
- Stack filters vertically on mobile, horizontal on desktop
- Use collapsible navigation on mobile
- Touch-friendly button sizes (min 44x44px)

## User Feedback

### Toast Notifications

**Provide clear feedback for user actions:**

```typescript
// components/ui/toast.tsx
import { toast } from 'sonner'; // or similar

export function useToast() {
  return {
    success: (message: string) => toast.success(message),
    error: (message: string) => toast.error(message),
    info: (message: string) => toast.info(message),
  };
}

// Usage
const { success, error } = useToast();
await createJob(data);
success('Job created successfully');
```

### Error Messages

**Show user-friendly error messages:**

```typescript
// components/features/jobs/JobForm.tsx
try {
  await createJob(formData);
  success('Job created successfully');
} catch (error) {
  if (error instanceof ValidationError) {
    error(`Invalid input: ${error.message}`);
  } else {
    error('Failed to create job. Please try again.');
  }
}
```

## Accessibility Checklist

Before marking UI work complete:

- [ ] All interactive elements are keyboard navigable
- [ ] Focus indicators are visible
- [ ] ARIA labels are present for icon-only buttons
- [ ] Form inputs have associated labels
- [ ] Color contrast meets WCAG AA standards
- [ ] Screen reader testing completed (or verified with tools)
- [ ] Loading states are shown for async operations
- [ ] Error messages are user-friendly
- [ ] Mobile responsive design verified

## Related Rules

- See [02-architecture.md](02-architecture.md) for component organization
- See [03-coding-standards.md](03-coding-standards.md) for TypeScript patterns
- See [10-error-handling.md](10-error-handling.md) for error message patterns
