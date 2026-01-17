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

### Local Testing

**Use Supabase local development for integration tests:**

```typescript
// tests/setup.ts
import { createClient } from '@supabase/supabase-js';

export const testSupabase = createClient(
  process.env.SUPABASE_TEST_URL!,
  process.env.SUPABASE_TEST_ANON_KEY!
);

// Reset database before each test suite
export async function resetTestDatabase() {
  // Truncate tables or use migrations
}
```

### Test Data Fixtures

```typescript
// tests/fixtures/jobs.ts
export const mockJob = {
  id: 'test-job-1',
  title: 'Software Engineer',
  company: 'Test Company',
  user_id: 'test-user-1',
  // ...
};
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
