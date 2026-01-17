# UI Prototype Implementation Plan

## Vision Alignment

This plan implements the UI foundation for all MVP features from the [original Opportunity.ai Vision PDF](file://Opportunity.ai%20Vision.pdf):

- **AI-Powered Job Discovery**: UI for job ingestion, list, and ranking display
- **Tailored Application Materials**: UI for CV, cover letter, and outreach draft generation
- **Job Application Tracking**: UI for pipeline tracker (personal ATS/CRM)
- **User Control & Privacy**: UI for privacy settings and data control

**Competitive Context:** This UI-first approach enables faster iteration and better UX than competitors (Teal, AIApply) who often have fragmented interfaces.

## Architecture Decision

**ADR Reference:** [ADR-001: UI-First Development Approach](../adr/001-ui-first-approach.md)

**Rationale:** Build UI prototype first with mock data to:
- Get faster UX feedback
- Validate product concept early
- Enable parallel development
- Maintain clean architecture separation

## Overview

Build a complete UI prototype for Opportunity.ai MVP following clean architecture principles with progressive enhancement. Start simple (presentation layer), then add service/domain layers as complexity grows.

## Clean Architecture Layers (Progressive)

### Phase 1: Presentation Layer (Start Here)

- **Components**: Pure UI components, no business logic
- **Pages**: Next.js pages that compose components
- **Hooks**: React hooks for UI state only
- **Types**: Component props and UI types

### Phase 2: Service Layer (Add When Needed)

- **Services**: Business logic, data transformation
- **Server Actions**: Next.js server actions for mutations
- **API Routes**: Thin route handlers
- **Validation**: Zod schemas for input/output

### Phase 3: Domain Layer (Add for Complex Features)

- **Domain Models**: Core business entities
- **Use Cases**: Feature-specific business logic
- **Domain Services**: Cross-cutting concerns

### Phase 4: Data Layer (Already Exists)

- **Queries**: Database access (`lib/db/queries/*`)
- **Repositories**: Data access abstraction (optional)
- **Types**: Generated from Supabase

## Component Architecture

### Layer Structure

```
components/
  ui/                          # Presentation Layer (Phase 1)
    primitives/                # Base components (Button, Input, Card)
      button.tsx
      input.tsx
      card.tsx
      badge.tsx
    composite/                 # Composed UI components
      data-table.tsx
      form-field.tsx
      modal.tsx
    feedback/                   # User feedback components
      toast.tsx
      loading.tsx
      error-boundary.tsx
  
  features/                    # Feature Components (Phase 1-2)
    jobs/
      presentation/            # UI-only components
        JobCard.tsx
        JobList.tsx
        JobFilters.tsx
        JobForm.tsx
      containers/              # Container components (connect to services)
        JobsPageContainer.tsx
        JobDetailContainer.tsx
  
  layout/                      # Layout Components (Phase 1)
    Header.tsx
    Sidebar.tsx
    DashboardLayout.tsx
    AuthLayout.tsx

lib/
  services/                    # Service Layer (Phase 2)
    jobs/
      job.service.ts          # Business logic
      job.types.ts            # Service types
    applications/
      application.service.ts
    artifacts/
      artifact.service.ts
  
  domain/                      # Domain Layer (Phase 3, if needed)
    jobs/
      job.entity.ts           # Domain model
      job.use-cases.ts        # Use cases
  
  db/                          # Data Layer (Already exists)
    queries/
      jobs.queries.ts
    types.ts
```

## Progressive Implementation Plan

### Phase 1: Foundation UI (Week 1)

**Goal:** Basic UI structure with presentation layer only

**Why:** A consistent design system ensures UI consistency, faster development, and better UX. shadcn/ui provides accessible, customizable components built on Radix UI.

**Decision:** We chose shadcn/ui over other options because:
- Built on Radix UI (accessibility-first)
- Uses Tailwind CSS (already in stack)
- Copy-paste components (no dependency bloat)
- Fully customizable

#### 1.1 Design System Setup

- [ ] Install shadcn/ui components: `npx shadcn-ui@latest init`
- [ ] Create design tokens (colors, typography, spacing)
- [ ] Set up Tailwind theme configuration
- [ ] Create base UI primitives (Button, Input, Card, Badge)
- [ ] Document component usage patterns

**Reference:** See [shadcn/ui docs](https://ui.shadcn.com) for component patterns

#### 1.2 Layout Components

- [ ] DashboardLayout (with Header, Sidebar)
- [ ] AuthLayout (for login page)
- [ ] Navigation components (Sidebar, Header menu)
- [ ] Responsive breakpoints

#### 1.3 Authentication UI

- [ ] Login page (LinkedIn button)
- [ ] Auth callback page
- [ ] Loading states
- [ ] Error states

**Architecture:** Pure presentation layer, minimal logic

---

### Phase 2: Job Management UI (Week 2)

**Goal:** Complete job ingestion and management UI

#### 2.1 Job List UI

- [ ] JobCard component (presentation)
- [ ] JobList component (presentation)
- [ ] Empty states
- [ ] Loading skeletons

#### 2.2 Job Forms

- [ ] JobEntryForm (manual entry)
- [ ] FileUpload component (CSV/JSON)
- [ ] Form validation UI
- [ ] Success/error feedback

#### 2.3 Job Detail UI

- [ ] JobDetail page layout
- [ ] Job information display
- [ ] Action buttons (edit, delete, create application)
- [ ] Related artifacts list

**Architecture:** Add service layer for job operations

**Service Layer:**

```typescript
// lib/services/jobs/job.service.ts
export class JobService {
  async createJob(data: CreateJobInput): Promise<Job> {
    // Validation
    // Database operation
    // Audit logging
  }
  
  async getJobs(filters: JobFilters): Promise<Job[]> {
    // Query with filters
    // Transform data
  }
}
```

---

### Phase 3: Pipeline & Applications UI (Week 3)

**Goal:** Application pipeline tracking UI

#### 3.1 Pipeline View

- [ ] Kanban board component (or list view)
- [ ] Status columns (Saved, Applied, Interview, Offer, Rejected)
- [ ] Drag-and-drop (optional, or click-based)
- [ ] Application cards

#### 3.2 Application Detail

- [ ] Application detail page
- [ ] Status update UI
- [ ] Notes editor
- [ ] Timeline/history view

#### 3.3 Dashboard Overview

- [ ] Stats cards component
- [ ] Recent activity feed
- [ ] Quick actions panel

**Architecture:** Service layer for applications

---

### Phase 4: AI Features UI (Week 4-5)

**Goal:** AI generation interfaces

#### 4.1 Ranking UI

- [ ] Rank button/action
- [ ] Ranking progress indicator
- [ ] Rank score display (badge, visual)
- [ ] Sort by rank

#### 4.2 CV Generation UI

- [ ] Generate CV button
- [ ] CV preview component
- [ ] Approve/reject actions
- [ ] Version comparison
- [ ] Download button

#### 4.3 Cover Letter UI

- [ ] Generate cover letter button
- [ ] Cover letter editor/preview
- [ ] Approve/reject
- [ ] Download

#### 4.4 Message Drafting UI

- [ ] Draft message button
- [ ] Message editor
- [ ] Message type selector
- [ ] Copy to clipboard

**Architecture:** Service layer for AI operations with proper error handling

---

### Phase 5: Enhanced Features UI (Week 6)

**Goal:** Advanced filtering, search, organization

#### 5.1 Advanced Filters

- [ ] Filter components (country, role, seniority, remote, salary)
- [ ] Filter state management
- [ ] URL-based filter persistence
- [ ] Clear filters action

#### 5.2 Search UI

- [ ] Search input component
- [ ] Search results highlighting
- [ ] Search suggestions (optional)

#### 5.3 Organization UI

- [ ] Tags/labels component
- [ ] Bulk actions UI
- [ ] Custom lists/collections

**Architecture:** Enhanced service layer with filtering logic

---

## Clean Architecture Patterns

### Component Composition

**Presentation Component (Phase 1):**

```typescript
// components/features/jobs/presentation/JobCard.tsx
interface JobCardProps {
  job: Job;
  onEdit?: (job: Job) => void;
  onDelete?: (jobId: string) => void;
}

export function JobCard({ job, onEdit, onDelete }: JobCardProps) {
  // Pure presentation, no business logic
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

**Container Component (Phase 2):**

```typescript
// components/features/jobs/containers/JobsPageContainer.tsx
'use client';

import { JobService } from '@/lib/services/jobs/job.service';
import { JobList } from '../presentation/JobList';

export function JobsPageContainer() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const jobService = new JobService();
  
  useEffect(() => {
    jobService.getJobs().then(setJobs);
  }, []);
  
  const handleDelete = async (jobId: string) => {
    await jobService.deleteJob(jobId);
    setJobs(jobs.filter(j => j.id !== jobId));
  };
  
  return <JobList jobs={jobs} onDelete={handleDelete} />;
}
```

**Server Component Page (Phase 2):**

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

### Service Layer Pattern

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
    private queries: JobQueries,
    private audit: AuditLogger
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
}
```

### Dependency Injection Pattern

```typescript
// lib/services/jobs/job.service.ts
export class JobService {
  constructor(
    private queries: JobQueries = new JobQueries(),
    private audit: AuditLogger = new AuditLogger()
  ) {}
}

// Usage in Server Actions
'use server';

import { JobService } from '@/lib/services/jobs/job.service';

export async function createJobAction(formData: FormData) {
  const service = new JobService();
  const user = await getCurrentUser();
  return service.createJob(formData, user.id);
}
```

## File Structure

```
app/
  (auth)/
    login/
      page.tsx                 # Server Component
  (dashboard)/
    layout.tsx                 # Dashboard layout
    page.tsx                   # Dashboard home
    jobs/
      page.tsx                 # Server Component (fetches data)
      [id]/
        page.tsx               # Server Component
    applications/
      page.tsx
      [id]/
        page.tsx
    settings/
      page.tsx
  api/
    jobs/
      route.ts                 # API route (thin)
    applications/
      route.ts

components/
  ui/
    primitives/
      button.tsx
      input.tsx
      card.tsx
    composite/
      data-table.tsx
      form-field.tsx
    feedback/
      toast.tsx
      loading.tsx
  
  features/
    jobs/
      presentation/
        JobCard.tsx
        JobList.tsx
        JobFilters.tsx
        JobForm.tsx
      containers/
        JobsPageContainer.tsx  # Client component container
  
  layout/
    Header.tsx
    Sidebar.tsx
    DashboardLayout.tsx

lib/
  services/                    # Service Layer (Phase 2+)
    jobs/
      job.service.ts
      job.types.ts
    applications/
      application.service.ts
    artifacts/
      artifact.service.ts
    ai/
      ranking.service.ts
      generation.service.ts
  
  db/                          # Data Layer (exists)
    queries/
      jobs.queries.ts
    types.ts
  
  hooks/                       # Custom React hooks
    use-jobs.ts
    use-applications.ts
  
  utils/                       # Utility functions
    formatters.ts
    validators.ts
```

## Implementation Strategy

### Incremental Enhancement

**Start Simple (Phase 1):**

- Pure presentation components
- Direct data fetching in Server Components
- Minimal abstraction

**Add Services (Phase 2):**

- Extract business logic to services
- Add validation layers
- Implement error handling

**Enhance Architecture (Phase 3):**

- Add domain models if needed
- Implement use cases for complex features
- Add repository pattern if data access becomes complex

### Testing Strategy

**Component Tests:**

- Test presentation components in isolation
- Mock service dependencies
- Test user interactions

**Service Tests:**

- Unit tests for business logic
- Mock data layer
- Test validation and error handling

**Integration Tests:**

- Test full flows (page → service → database)
- Test RLS policies
- Test error scenarios

## Success Criteria

**UI Prototype Complete When:**

- [ ] All MVP features have UI components
- [ ] Components follow clean architecture layers
- [ ] Services handle business logic
- [ ] Presentation components are reusable
- [ ] Error states handled gracefully
- [ ] Loading states implemented
- [ ] Responsive design verified
- [ ] Accessibility requirements met
- [ ] Type safety throughout

## Timeline

- **Week 1:** Foundation UI + Layout
- **Week 2:** Job Management UI + Services
- **Week 3:** Pipeline UI + Application Services
- **Week 4-5:** AI Features UI + AI Services
- **Week 6:** Enhanced Features + Polish

**Total:** 6 weeks for complete UI prototype

## Next Steps

1. Start with Phase 1: Foundation UI
2. Build presentation components first
3. Add service layer when business logic emerges
4. Enhance architecture progressively
5. Test each phase before moving forward

## Related Documentation

**Planning:**
- [PROJECT-PLAN.md](../PROJECT-PLAN.md) - Master execution plan
- [roadmap/MVP-ROADMAP.md](../roadmap/MVP-ROADMAP.md) - MVP roadmap
- [features/](../features/) - Feature-specific plans with POC/MVP

**Architecture:**
- [ADR-001: UI-First Approach](../adr/001-ui-first-approach.md) - Architecture decision
- [ADR-002: Clean Architecture](../adr/002-clean-architecture.md) - Architecture pattern
- [.cursor/rules/02-architecture.md](../../rules/02-architecture.md) - Architecture rules

**Patterns:**
- [patterns/component-patterns.md](../patterns/component-patterns.md) - Component patterns
- [patterns/service-patterns.md](../patterns/service-patterns.md) - Service patterns
- [.cursor/rules/08-ui-ux.md](../../rules/08-ui-ux.md) - UI/UX guidelines

**Vision:**
- [Original Vision PDF](file://Opportunity.ai%20Vision.pdf) - Original comprehensive vision
- [VISION.md](../../VISION.md) - Current product vision
