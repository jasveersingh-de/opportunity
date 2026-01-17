---
description: Testing policy and required checks to run after changes
globs: "**/*"
alwaysApply: true
---

# Testing & Verification

## Required Checks After Code Changes

**Whenever you change code, always run:**

```bash
# 1. Type checking
pnpm typecheck

# 2. Linting
pnpm lint

# 3. Tests (if applicable)
pnpm test
```

**Minimum acceptance criteria:**
- ✅ `pnpm lint` passes (or warnings are documented)
- ✅ `pnpm typecheck` passes
- ✅ Tests pass (or explain why not applicable and how to verify manually)

## Testing Policy

### When to Add Tests

- **New feature** → Add tests where feasible (unit tests for business logic, integration tests for API endpoints)
- **Bug fix** → Add a regression test when possible
- **Refactor** → Ensure existing tests still pass; add tests if coverage is low

### Test File Naming

- Unit tests: `*.test.ts` or `*.test.tsx`
- Integration tests: `*.integration.test.ts`
- Test files co-located with source or in `__tests__/` directories

### Test Structure

```typescript
// lib/jobs/service.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { getJobs } from './service';

describe('getJobs', () => {
  beforeEach(() => {
    // Setup test data
  });

  it('should return jobs for a user', async () => {
    const jobs = await getJobs('user-123');
    expect(jobs).toBeInstanceOf(Array);
  });

  it('should filter by country', async () => {
    const jobs = await getJobs('user-123', { country: 'US' });
    expect(jobs.every(job => job.country === 'US')).toBe(true);
  });
});
```

## Test Environment Setup

### Tool Version Management

**Ensure mise is set up before running tests:**
- mise automatically manages Node.js and pnpm versions (see `.mise.toml`)
- Enter project directory to activate mise: `cd /path/to/opportunity.ai`
- Verify tool versions: `mise ls` and `node --version`
- All test commands assume correct tool versions are active

## Test Database Setup (Supabase)

### Local Supabase Testing

**Use Supabase CLI for local testing:**

```bash
# Start local Supabase (if not already running)
supabase start

# Reset database before tests
supabase db reset

# Generate types for tests
supabase gen types typescript --local > lib/db/types.ts
```

**Test environment variables:**

```bash
# .env.test (gitignored)
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU
```

**Test setup helper:**

```typescript
// tests/setup.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'test-anon-key';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'test-service-key';

export const testSupabase = createClient(supabaseUrl, supabaseAnonKey);
export const testSupabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Reset test database by running migrations.
 * Run this before each test suite.
 */
export async function resetTestDatabase() {
  // Use Supabase CLI to reset: supabase db reset
  // Or truncate tables manually:
  const tables = ['audit_log', 'applications', 'artifacts', 'jobs', 'profiles'];
  
  for (const table of tables) {
    await testSupabaseAdmin.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000');
  }
}

/**
 * Create a test user and return auth token.
 */
export async function createTestUser(email: string, password: string) {
  const { data, error } = await testSupabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  
  if (error) throw error;
  
  // Sign in to get session
  const { data: session } = await testSupabase.auth.signInWithPassword({
    email,
    password,
  });
  
  return { user: data.user, session };
}
```

### Test Data Fixtures

```typescript
// tests/fixtures/jobs.ts
import type { Database } from '@/lib/db/types';

type Job = Database['public']['Tables']['jobs']['Insert'];

export const mockJob: Job = {
  title: 'Software Engineer',
  company: 'Test Company',
  user_id: 'test-user-1',
  country: 'US',
  location: 'San Francisco',
  remote_type: 'remote',
  status: 'saved',
};

export const mockJobWithId = {
  ...mockJob,
  id: 'test-job-1',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};
```

### RLS Policy Testing

**Test Row Level Security policies:**

```typescript
// tests/rls/jobs.test.ts
import { describe, it, expect, beforeAll } from '@jest/globals';
import { testSupabase, createTestUser, resetTestDatabase } from '../setup';

describe('Jobs RLS Policies', () => {
  let user1: { user: any; session: any };
  let user2: { user: any; session: any };
  
  beforeAll(async () => {
    await resetTestDatabase();
    user1 = await createTestUser('user1@test.com', 'password123');
    user2 = await createTestUser('user2@test.com', 'password123');
  });
  
  it('should prevent users from accessing other users jobs', async () => {
    // User 1 creates a job
    const { data: job1 } = await testSupabase
      .from('jobs')
      .insert({
        title: 'User 1 Job',
        company: 'Company A',
        user_id: user1.user.id,
      })
      .select()
      .single();
    
    expect(job1).toBeTruthy();
    
    // User 2 should not see User 1's job
    const { data: jobs } = await testSupabase
      .from('jobs')
      .select()
      .eq('user_id', user1.user.id);
    
    // User 2's query should return empty (RLS filters)
    expect(jobs).toEqual([]);
    
    // User 2 should not be able to update User 1's job
    const { error } = await testSupabase
      .from('jobs')
      .update({ title: 'Hacked' })
      .eq('id', job1.id);
    
    expect(error).toBeTruthy();
    expect(error?.code).toBe('42501'); // Insufficient privilege
  });
  
  it('should allow users to access their own jobs', async () => {
    const { data: job } = await testSupabase
      .from('jobs')
      .insert({
        title: 'My Job',
        company: 'My Company',
        user_id: user1.user.id,
      })
      .select()
      .single();
    
    // User 1 should see their own job
    const { data: jobs } = await testSupabase
      .from('jobs')
      .select()
      .eq('user_id', user1.user.id);
    
    expect(jobs).toHaveLength(1);
    expect(jobs[0].id).toBe(job.id);
  });
});
```

### Migration Testing

**Test migrations:**

```typescript
// tests/migrations/migrations.test.ts
import { describe, it, expect } from '@jest/globals';
import { testSupabaseAdmin } from '../setup';

describe('Migrations', () => {
  it('should have all required tables', async () => {
    const { data: tables } = await testSupabaseAdmin
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .in('table_name', ['profiles', 'jobs', 'artifacts', 'applications', 'audit_log']);
    
    expect(tables).toHaveLength(5);
  });
  
  it('should have RLS enabled on all user tables', async () => {
    const { data: policies } = await testSupabaseAdmin
      .from('pg_policies')
      .select('tablename')
      .in('tablename', ['profiles', 'jobs', 'artifacts', 'applications']);
    
    const tablesWithPolicies = new Set(policies?.map(p => p.tablename) || []);
    expect(tablesWithPolicies.has('profiles')).toBe(true);
    expect(tablesWithPolicies.has('jobs')).toBe(true);
    expect(tablesWithPolicies.has('artifacts')).toBe(true);
    expect(tablesWithPolicies.has('applications')).toBe(true);
  });
});
```

## Integration Testing with Supabase

### API Route Integration Tests

**Test API routes with Supabase:**

```typescript
// tests/api/jobs.test.ts
import { describe, it, expect, beforeAll } from '@jest/globals';
import { createTestUser, resetTestDatabase } from '../setup';
import { GET, POST } from '@/app/api/jobs/route';
import { NextRequest } from 'next/server';

describe('API /api/jobs', () => {
  let user: { user: any; session: any };
  
  beforeAll(async () => {
    await resetTestDatabase();
    user = await createTestUser('test@example.com', 'password123');
  });
  
  it('should return user jobs', async () => {
    const request = new NextRequest('http://localhost:3000/api/jobs', {
      headers: {
        'Cookie': `sb-access-token=${user.session.access_token}`,
      },
    });
    
    const response = await GET(request);
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(Array.isArray(data.data)).toBe(true);
  });
  
  it('should create a new job', async () => {
    const request = new NextRequest('http://localhost:3000/api/jobs', {
      method: 'POST',
      headers: {
        'Cookie': `sb-access-token=${user.session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: 'Test Job',
        company: 'Test Company',
      }),
    });
    
    const response = await POST(request);
    const data = await response.json();
    
    expect(response.status).toBe(201);
    expect(data.data.title).toBe('Test Job');
  });
});
```

### Server Action Integration Tests

**Test Server Actions with Supabase:**

```typescript
// tests/actions/jobs.test.ts
import { describe, it, expect, beforeAll } from '@jest/globals';
import { createTestUser, resetTestDatabase, testSupabase } from '../setup';
import { createJobAction } from '@/app/actions/jobs';

describe('createJobAction', () => {
  let user: { user: any; session: any };
  
  beforeAll(async () => {
    await resetTestDatabase();
    user = await createTestUser('test@example.com', 'password123');
  });
  
  it('should create a job', async () => {
    const formData = new FormData();
    formData.append('title', 'Test Job');
    formData.append('company', 'Test Company');
    
    const result = await createJobAction(formData);
    
    expect(result.success).toBe(true);
    expect(result.data).toBeTruthy();
    
    // Verify in database
    const { data: jobs } = await testSupabase
      .from('jobs')
      .select()
      .eq('user_id', user.user.id);
    
    expect(jobs).toHaveLength(1);
    expect(jobs[0].title).toBe('Test Job');
  });
});
```

## Mocking Patterns

### AI Client Mocking

```typescript
// tests/mocks/ai-client.ts
import { vi } from 'vitest';

export const mockAIClient = {
  generateCV: vi.fn().mockResolvedValue({
    content: 'Generated CV content',
    version: '1.0',
  }),
  generateCoverLetter: vi.fn(),
};

vi.mock('@/lib/ai/client', () => ({
  aiClient: mockAIClient,
}));
```

### Database Mocking

**For unit tests, mock the data access layer:**

```typescript
// tests/mocks/db-queries.ts
import { vi } from 'vitest';

export const mockJobQueries = {
  getById: vi.fn(),
  getByUserId: vi.fn(),
  create: vi.fn(),
};

vi.mock('@/lib/db/queries/jobs', () => ({
  jobQueries: mockJobQueries,
}));
```

## Test Coverage

### Coverage Expectations

- **Aim for 80%+ coverage** for business logic (`lib/*/service.ts`)
- **Critical paths must be tested**: Authentication, data mutations, AI generation
- **UI components**: Test user interactions and edge cases

### Coverage Commands

```bash
# Run tests with coverage
pnpm test:coverage

# View coverage report
open coverage/index.html
```

## CI/CD Integration

### Pre-commit Hooks (Recommended)

```json
// package.json
{
  "scripts": {
    "pre-commit": "pnpm lint && pnpm typecheck && pnpm test"
  }
}
```

### GitHub Actions (Example)

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm lint
      - run: pnpm typecheck
      - run: pnpm test
```

## Handling Test Failures

### If Tests Fail After Changes

1. **Diagnose root cause**: Read error messages, check test output
2. **Fix code** (preferred): If behavior unintentionally changed, fix the code
3. **Update tests** (if behavior intentionally changed): Update tests to match new behavior
4. **Preserve test intent**: Never weaken tests (e.g., removing assertions, making tests less specific)

### Example: Intentional Behavior Change

```typescript
// Before: getJobs returned all jobs
// After: getJobs returns only active jobs

// OLD TEST (needs update)
it('should return all jobs', async () => {
  const jobs = await getJobs('user-123');
  expect(jobs.length).toBe(10); // This might fail now
});

// UPDATED TEST
it('should return only active jobs', async () => {
  const jobs = await getJobs('user-123');
  expect(jobs.every(job => job.status === 'active')).toBe(true);
});
```

## Manual Verification

**When automated tests aren't applicable, provide clear manual verification steps:**

```markdown
## Manual Testing Steps

1. Start dev server: `pnpm dev`
2. Navigate to `/jobs`
3. Verify jobs are displayed
4. Click "Add Job" button
5. Fill form and submit
6. Verify job appears in list
```

## Related Rules

- See [00-operating-system.md](00-operating-system.md) for work loop and verification commands
- See [03-coding-standards.md](03-coding-standards.md) for code quality standards
- See [06-data-model.md](06-data-model.md) for database testing patterns
