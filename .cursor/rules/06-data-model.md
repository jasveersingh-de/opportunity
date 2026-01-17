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

### Supabase CLI Setup

**Install Supabase CLI:**

```bash
# Using mise (recommended)
mise install supabase

# Or using npm
npm install -g supabase

# Or using Homebrew (macOS)
brew install supabase/tap/supabase
```

**Initialize Supabase project:**

```bash
# Link to remote project (optional)
supabase link --project-ref <project-ref>

# Or use local development
supabase start
```

### Migration Workflow

**Always create migrations via Supabase CLI** (never manually in dashboard):

```bash
# 1. Create a new migration
supabase migration new add_salary_range_to_jobs

# This creates: supabase/migrations/YYYYMMDDHHMMSS_add_salary_range_to_jobs.sql

# 2. Edit the migration file
# Add your SQL changes

# 3. Test migration locally
supabase db reset  # Resets and applies all migrations from scratch
# OR
supabase migration up  # Applies only pending migrations

# 4. Verify migration
supabase db diff  # Shows differences between local and remote (if linked)

# 5. Generate types after schema changes
supabase gen types typescript --local > lib/db/types.ts

# 6. Commit migration file
git add supabase/migrations/YYYYMMDDHHMMSS_add_salary_range_to_jobs.sql
git commit -m "feat: add salary range to jobs table"
```

### Migration File Naming

**Format**: `YYYYMMDDHHMMSS_description.sql` (Supabase CLI generates this automatically)

Examples:
- `20240115103000_create_profiles.sql`
- `20240115104500_add_index_to_jobs.sql`
- `20240115110000_add_remote_type_to_jobs.sql`

**Naming conventions:**
- Use descriptive names: `add_column_name_to_table_name`
- Use snake_case for descriptions
- Be specific: `add_salary_range_to_jobs` not `update_jobs`

### Environment-Specific Migration Strategies

**Local Development:**
```bash
# Start local Supabase
supabase start

# Apply all migrations
supabase db reset

# Generate types from local
supabase gen types typescript --local > lib/db/types.ts
```

**Staging/Production:**
```bash
# Link to remote project
supabase link --project-ref <staging-project-ref>

# Push migrations to remote
supabase db push

# Generate types from remote
supabase gen types typescript --project-id <project-id> > lib/db/types.ts
```

**Never push migrations directly to production without testing in staging first.**

### Migration Best Practices

- **Prefer additive changes**: Avoid destructive changes (DROP, TRUNCATE) in early PoC
- **Test migrations**: Always run `supabase db reset` locally before committing
- **Version control**: Commit all migration files (they're the source of truth)
- **Idempotent migrations**: Write migrations that can be run multiple times safely
- **One change per migration**: Keep migrations focused and reviewable
- **Include RLS policies**: Always add RLS policies in the same migration as table creation

### Rollback Procedures

**For local development:**
```bash
# Reset to clean state
supabase db reset
```

**For remote (if needed):**
```bash
# Create a new migration to reverse changes
supabase migration new revert_salary_range

# In the migration file, add:
-- Revert salary range columns
alter table jobs
  drop column salary_min,
  drop column salary_max,
  drop column currency;

drop index if exists idx_jobs_salary_range;
```

**Best Practice**: Prefer creating a new migration to revert rather than modifying existing migrations (which breaks history).

### Type Generation Automation

**Automate type generation after migrations:**

```bash
# Add to package.json scripts
{
  "scripts": {
    "db:types": "supabase gen types typescript --local > lib/db/types.ts",
    "db:types:remote": "supabase gen types typescript --project-id <project-id> > lib/db/types.ts",
    "db:reset": "supabase db reset && pnpm db:types"
  }
}
```

**CI/CD Integration:**
- Generate types in CI after migration validation
- Fail build if types are out of sync
- See [create_cicd_workflow] for GitHub Actions setup

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
# Generate types from local Supabase (development)
supabase gen types typescript --local > lib/db/types.ts

# Generate types from remote Supabase (staging/production)
supabase gen types typescript --project-id <project-id> > lib/db/types.ts

# Or if linked
supabase gen types typescript --linked > lib/db/types.ts
```

**Automation:**
- Run type generation after every migration
- Add to pre-commit hook or CI/CD pipeline
- Verify types are committed and up-to-date

**Type File Location:**
- Store generated types in `lib/db/types.ts`
- Commit generated types to version control
- Regenerate when schema changes

**Keep types in sync**: Regenerate after every schema change.

### Type Usage

**Import and use generated types:**

```typescript
// lib/db/types.ts (generated)
export type Database = {
  public: {
    Tables: {
      jobs: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          // ...
        };
        Insert: { /* ... */ };
        Update: { /* ... */ };
      };
      // ...
    };
  };
};

// Usage in code
import type { Database } from '@/lib/db/types';

type Job = Database['public']['Tables']['jobs']['Row'];
type JobInsert = Database['public']['Tables']['jobs']['Insert'];
```

## Supabase CLI Commands Reference

### Common Commands

```bash
# Start local Supabase
supabase start

# Stop local Supabase
supabase stop

# Reset local database (applies all migrations)
supabase db reset

# Create new migration
supabase migration new <description>

# Apply pending migrations
supabase migration up

# Show migration status
supabase migration list

# Link to remote project
supabase link --project-ref <project-ref>

# Push migrations to remote
supabase db push

# Generate TypeScript types
supabase gen types typescript --local > lib/db/types.ts

# Show database differences
supabase db diff

# Access Supabase Studio (local)
# Opens at http://localhost:54323
```

### Migration Testing

**Test migrations in isolation:**

```bash
# Create test migration
supabase migration new test_feature

# Test locally
supabase db reset

# Verify schema
supabase db diff

# If linked, test against remote (staging)
supabase db push --dry-run  # Preview changes
```

## Related Rules

- See [05-security-and-compliance.md](05-security-and-compliance.md) for RLS security requirements
- See [13-supabase-security.md](13-supabase-security.md) for RLS policy templates
- See [02-architecture.md](02-architecture.md) for data access layer patterns
- See [03-coding-standards.md](03-coding-standards.md) for type usage
- See [docs/supabase-setup.md](docs/supabase-setup.md) for complete Supabase setup guide
