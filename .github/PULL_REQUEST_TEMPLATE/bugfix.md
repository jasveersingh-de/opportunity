# Bug Fix: [Bug Description]

<!--
  PR Title Format: fix: [brief description of bug]
  Example: fix: correct RLS policy for jobs table
-->

## Description

### What Changed
- 

### Bug Description
<!-- Describe the bug that was fixed -->

### Root Cause
<!-- Explain what caused the bug -->

### Solution
<!-- Explain how the bug was fixed -->

### Related Issues
Closes #

## Testing

### Test Plan
<!-- How to verify the bug is fixed -->

1. 
2. 
3. 

### Regression Testing
- [ ] Existing functionality still works
- [ ] Related features tested
- [ ] Edge cases tested

### Test Results
- [ ] Bug is fixed
- [ ] No new bugs introduced
- [ ] Regression test added (if applicable)

## Checklist

### Code Quality
- [ ] Code follows project coding standards
- [ ] TypeScript strict mode compliance
- [ ] Functions are small and focused
- [ ] No console.log or debug code

### Verification
- [ ] `pnpm typecheck` passes
- [ ] `pnpm lint` passes
- [ ] `pnpm test` passes (including new regression test)
- [ ] `pnpm build` succeeds

### Security & Privacy
- [ ] No secrets in code/logs
- [ ] Input validation verified
- [ ] RLS policies verified (if database changes)
- [ ] Security implications reviewed

### Database (if applicable)
- [ ] Migration file created (if schema fix)
- [ ] Migration tested locally
- [ ] RLS policies verified
- [ ] Types regenerated

### Documentation
- [ ] Code comments added (if needed)
- [ ] Bug documented in commit message

### Review Readiness
- [ ] PR description is complete
- [ ] Commits follow conventional commit format
- [ ] Branch is up to date
- [ ] CI checks are passing

## Additional Context

<!-- Any additional information that would help reviewers understand the fix -->

## Prevention

<!-- Optional: How can we prevent similar bugs in the future? -->
