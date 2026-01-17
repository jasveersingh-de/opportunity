---
description: Database schema conventions and migration practices
globs: "supabase/**"
alwaysApply: true
---

# Data Model Conventions

## Database: Supabase (PostgreSQL)

### Schema Overview

**Minimum PoC tables:**

- `profiles` - User preferences, countries, role targets
- `jobs` - Ingested job postings
- `artifacts` - Generated CV versions, cover letters, message drafts
- `applications` - Pipeline state (links jobs to applications)
- `audit_log` - Who did what (audit trail)

## Table Definitions

### Profiles Table

```sql
-- supabase/migrations/001_create_profiles.sql
create table profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  preferred_countries text[] default '{}',
  target_roles text[] default '{}',
  seniority_level text, -- 'junior', 'mid', 'senior', 'lead', 'principal'
  remote_preference text, -- 'remote', 'hybrid', 'onsite', 'any'
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id)
);
```

### Jobs Table

```sql
-- supabase/migrations/002_create_jobs.sql
create table jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  company text not null,
  url text,
  description text,
  country text, -- ISO country code (e.g., 'US', 'GB')
  location text, -- City/region
  remote_type text, -- 'remote', 'hybrid', 'onsite'
  salary_min integer,
  salary_max integer,
  currency text default 'USD',
  rank_score numeric, -- AI-generated ranking score
  status text default 'saved', -- 'saved', 'applied', 'interview', 'offer', 'rejected'
  ingested_at timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_jobs_user_id on jobs(user_id);
create index idx_jobs_status on jobs(status);
create index idx_jobs_country on jobs(country);
create index idx_jobs_rank_score on jobs(rank_score desc);
```

### Artifacts Table

```sql
-- supabase/migrations/003_create_artifacts.sql
create table artifacts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  job_id uuid references jobs(id) on delete cascade,
  type text not null, -- 'cv', 'cover_letter', 'message'
  content text not null,
  version text default '1.0',
  model text, -- AI model used (e.g., 'gpt-4')
  prompt_version text,
  approved boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_artifacts_user_id on artifacts(user_id);
create index idx_artifacts_job_id on artifacts(job_id);
create index idx_artifacts_type on artifacts(type);
```

### Applications Table

```sql
-- supabase/migrations/004_create_applications.sql
create table applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  job_id uuid references jobs(id) on delete cascade,
  status text default 'saved', -- 'saved', 'applied', 'interview', 'offer', 'rejected'
  applied_at timestamptz,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, job_id)
);

create index idx_applications_user_id on applications(user_id);
create index idx_applications_status on applications(status);
create index idx_applications_job_id on applications(job_id);
```

### Audit Log Table

```sql
-- supabase/migrations/005_create_audit_log.sql
create table audit_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  action text not null, -- 'create', 'update', 'delete', 'generate_cv', etc.
  resource text not null, -- 'job', 'application', 'cv', etc.
  resource_id uuid,
  metadata jsonb,
  created_at timestamptz default now()
);

create index idx_audit_log_user_id on audit_log(user_id);
create index idx_audit_log_resource on audit_log(resource, resource_id);
create index idx_audit_log_created_at on audit_log(created_at desc);
```

## Row Level Security (RLS)

### Enable RLS

**Enable RLS on all user-owned tables:**

```sql
alter table profiles enable row level security;
alter table jobs enable row level security;
alter table artifacts enable row level security;
alter table applications enable row level security;
-- audit_log can be read-only for users, write-only for system
alter table audit_log enable row level security;
```

### RLS Policy Templates

**User can read/write own records, nothing else:**

```sql
-- Profiles policies
create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = user_id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = user_id);

create policy "Users can insert own profile"
  on profiles for insert
  with check (auth.uid() = user_id);

-- Jobs policies
create policy "Users can view own jobs"
  on jobs for select
  using (auth.uid() = user_id);

create policy "Users can insert own jobs"
  on jobs for insert
  with check (auth.uid() = user_id);

create policy "Users can update own jobs"
  on jobs for update
  using (auth.uid() = user_id);

create policy "Users can delete own jobs"
  on jobs for delete
  using (auth.uid() = user_id);

-- Similar policies for artifacts and applications
```

### Testing RLS Policies

**Test RLS with different user contexts:**

```typescript
// tests/rls.test.ts
import { createClient } from '@supabase/supabase-js';

describe('RLS Policies', () => {
  it('should prevent users from accessing other users jobs', async () => {
    const user1Client = createClient(url, user1Token);
    const user2Client = createClient(url, user2Token);
    
    // User 1 creates a job
    const { data: job } = await user1Client.from('jobs').insert({...}).select().single();
    
    // User 2 should not see it
    const { data: jobs } = await user2Client.from('jobs').select();
    expect(jobs).not.toContainEqual(expect.objectContaining({ id: job.id }));
  });
});
```

## Migrations

### Migration Workflow

**Always create migrations for schema changes:**

```bash
# Create a new migration
pnpm supabase migration new add_salary_range_to_jobs

# Edit the migration file
# supabase/migrations/YYYYMMDDHHMMSS_add_salary_range_to_jobs.sql

# Apply migration locally
pnpm supabase db reset  # Resets and applies all migrations
# OR
pnpm supabase migration up  # Applies pending migrations
```

### Migration File Naming

**Format**: `YYYYMMDDHHMMSS_description.sql`

Examples:
- `20240115103000_create_profiles.sql`
- `20240115104500_add_index_to_jobs.sql`
- `20240115110000_add_remote_type_to_jobs.sql`

### Migration Best Practices

- **Prefer additive changes**: Avoid destructive changes in early PoC
- **Test migrations**: Run `pnpm supabase db reset` to test from scratch
- **Version control**: Commit all migration files
- **Rollback plan**: Document how to rollback if needed

### Example Migration

```sql
-- supabase/migrations/20240115103000_add_salary_range_to_jobs.sql
alter table jobs
  add column salary_min integer,
  add column salary_max integer,
  add column currency text default 'USD';

create index idx_jobs_salary_range on jobs(salary_min, salary_max);
```

## Indexes

### Index Creation Guidelines

**Add indexes for common query patterns:**

- Foreign keys: `user_id`, `job_id`
- Filter columns: `status`, `country`, `type`
- Sort columns: `rank_score`, `created_at`
- Composite indexes for common filter combinations

### Index Examples

```sql
-- Single column indexes
create index idx_jobs_user_id on jobs(user_id);
create index idx_jobs_status on jobs(status);

-- Composite index for common query
create index idx_jobs_user_status on jobs(user_id, status);

-- Partial index for active jobs
create index idx_jobs_active on jobs(user_id) where status in ('saved', 'applied');
```

## Type Generation

### Generate TypeScript Types

**Generate types from Supabase schema:**

```bash
# Generate types from local Supabase
pnpm supabase gen types typescript --local > lib/db/types.ts

# Generate types from remote Supabase
pnpm supabase gen types typescript --project-id <project-id> > lib/db/types.ts
```

**Keep types in sync**: Regenerate after schema changes.

## Related Rules

- See [05-security-and-compliance.md](05-security-and-compliance.md) for RLS security requirements
- See [02-architecture.md](02-architecture.md) for data access layer patterns
- See [03-coding-standards.md](03-coding-standards.md) for type usage
