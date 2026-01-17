# Database: [Migration/Schema Change Description]

<!--
  PR Title Format: 
  - feat(db): add [feature] table/column
  - fix(db): correct [issue] in [table]
  Example: feat(db): add job ranking score column
-->

## Description

### What Changed
- 

### Why
- 

### Migration Details
<!-- Describe the schema changes -->

### Related Issues
Closes #

## Migration Information

### Migration File
<!-- Name of the migration file -->
`supabase/migrations/[timestamp]_[name].sql`

### Schema Changes
<!-- List all schema changes -->

- 

### Data Migration (if applicable)
<!-- Describe any data transformations needed -->

### Rollback Plan
<!-- How to rollback this migration if needed -->

```sql
-- Rollback SQL (if applicable)
```

## Testing

### Migration Testing
- [ ] Migration tested locally (`pnpm supabase db reset`)
- [ ] Migration tested on fresh database
- [ ] Rollback tested (if applicable)
- [ ] No data loss verified

### RLS Policy Testing
- [ ] RLS policies tested with different user contexts
- [ ] Policies prevent unauthorized access
- [ ] Policies allow authorized access
- [ ] Integration tests added for RLS

### Type Generation
- [ ] Types regenerated: `pnpm supabase gen types typescript --local > lib/db/types.ts`
- [ ] TypeScript compilation passes with new types
- [ ] No type errors in codebase

## Checklist

### Migration Quality
- [ ] Migration file follows naming convention
- [ ] Migration is idempotent (if possible)
- [ ] Migration is reversible (when possible)
- [ ] Migration includes RLS policies
- [ ] Migration includes indexes (if needed)
- [ ] Migration includes constraints (if needed)

### Security
- [ ] RLS enabled on all new tables
- [ ] RLS policies tested
- [ ] Service role key usage is server-side only
- [ ] No sensitive data exposed

### Verification
- [ ] `pnpm typecheck` passes (after type regeneration)
- [ ] `pnpm lint` passes
- [ ] `pnpm test` passes
- [ ] `pnpm build` succeeds
- [ ] Migration runs successfully locally

### Documentation
- [ ] Migration documented in commit message
- [ ] Schema changes documented
- [ ] RLS policies documented
- [ ] Breaking changes documented (if applicable)

### Review Readiness
- [ ] PR description is complete
- [ ] Commits follow conventional commit format
- [ ] Branch is up to date
- [ ] CI checks are passing

## Breaking Changes

<!-- If this migration includes breaking changes, describe them and migration path -->

## Related Files

<!-- List related files that may need updates -->

- Migration file: `supabase/migrations/[file].sql`
- Type definitions: `lib/db/types.ts` (regenerated)
- 

## Production Deployment Notes

<!-- Any special considerations for deploying this migration to production -->
