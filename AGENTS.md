# Subagents

This repository uses specialized subagent responsibilities when acting agentically. Each subagent has a specific role and set of responsibilities.

## test-runner

**Responsibilities:**
- Whenever code changes, run the relevant checks:
  - `pnpm lint`
  - `pnpm typecheck`
  - `pnpm test` (or closest scoped tests)
- If a failure occurs:
  - Diagnose root cause (read error messages, check test output)
  - Fix code (preferred) or update tests only if behavior intentionally changed
  - Preserve test intent (no weakening assertions or making tests less specific)
- Report:
  - Which commands ran
  - What failed and why
  - What changed to fix it

**Execution Pattern:**
```bash
# After any code change
pnpm typecheck && pnpm lint && pnpm test

# If failures occur
1. Read error output
2. Identify root cause
3. Fix code (if unintentional change) OR update tests (if intentional change)
4. Re-run checks
5. Report results
```

**Success Criteria:**
- All checks pass
- Test coverage maintained or improved
- No test intent weakened

## refactor-scout

**Responsibilities:**
- Identify simple refactors that reduce complexity:
  - Dead code removal
  - Duplicated logic extraction
  - Unused imports/variables
  - Simple type improvements
- Only do refactors when they are:
  - Adjacent to the current task, OR
  - Unblock the current task, OR
  - Explicitly requested
- Never do large rewrites without explicit approval

**Execution Pattern:**
```typescript
// Example: Remove dead code
// Before
function unusedFunction() { ... }
function activeFunction() { ... }

// After
function activeFunction() { ... }
```

**Success Criteria:**
- Code complexity reduced
- Functionality unchanged
- Tests still pass
- Changes are small and reviewable

## security-sentinel

**Responsibilities:**
- Check for security violations:
  - Secret leakage (API keys, tokens in code/logs)
  - Unsafe logging (sensitive data in logs)
  - Missing RLS policies (Supabase tables without RLS)
  - Client exposure of service keys
  - Missing input validation
- Block merges/changes that violate security rules
- Report security issues with clear remediation steps

**Execution Pattern:**
```bash
# Check for secrets
grep -r "API_KEY\|SECRET\|PASSWORD" --exclude-dir=node_modules .

# Check for RLS policies
# Review Supabase migrations for RLS enablement

# Check for unsafe logging
grep -r "console.log.*user\|console.log.*password" --exclude-dir=node_modules .
```

**Success Criteria:**
- No secrets in code
- All user tables have RLS enabled
- No sensitive data in logs
- Input validation present at boundaries

## type-enforcer

**Responsibilities:**
- Ensure TypeScript strict mode compliance
- Catch type errors before runtime
- Suggest type improvements
- Generate types from Supabase schema when schema changes

**Execution Pattern:**
```bash
# Run type checking
pnpm typecheck

# If schema changed, regenerate types
pnpm supabase gen types typescript --local > lib/db/types.ts
```

**Success Criteria:**
- No `any` types without justification
- All types properly defined
- Generated types are up to date

## migration-manager

**Responsibilities:**
- Create migrations for schema changes
- Ensure migrations are reversible when possible
- Test migrations (run `pnpm supabase db reset`)
- Verify RLS policies are included in migrations

**Execution Pattern:**
```bash
# Create migration
pnpm supabase migration new add_column_to_table

# Edit migration file
# Test migration
pnpm supabase db reset
```

**Success Criteria:**
- Migration files created for schema changes
- Migrations tested locally
- RLS policies included
- Types regenerated after migration

## prompt-versioner

**Responsibilities:**
- Version AI prompts when changed
- Update prompt version constants
- Ensure prompt versions are logged in audit trails
- Test prompt changes with sample inputs

**Execution Pattern:**
```typescript
// Update prompt version
export const PROMPT_VERSIONS = {
  'cv-generation': '1.1', // Updated
  'cover-letter': '1.0',
} as const;

// Ensure version is logged
await logAction({
  action: 'generate_cv',
  metadata: {
    prompt_version: PROMPT_VERSIONS['cv-generation'],
  },
});
```

**Success Criteria:**
- Prompt versions tracked
- Versions logged in audit logs
- Prompt changes are testable

## Related Rules

- See [.cursor/rules/00-operating-system.md](.cursor/rules/00-operating-system.md) for work loop
- See [.cursor/rules/04-testing-and-ci.md](.cursor/rules/04-testing-and-ci.md) for testing requirements
- See [.cursor/rules/05-security-and-compliance.md](.cursor/rules/05-security-and-compliance.md) for security rules
- See [.cursor/rules/06-data-model.md](.cursor/rules/06-data-model.md) for migration workflow
- See [.cursor/rules/07-ai-integration.md](.cursor/rules/07-ai-integration.md) for prompt management
