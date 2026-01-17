# Pull Request

<!--
  Use the following format for PR title:
  - feat: add job ranking with AI scoring
  - fix: correct RLS policy for jobs table
  - docs: update API documentation
  - refactor: extract job service into separate module
  - chore: update dependencies
-->

## Description

<!-- Provide a clear and concise description of what this PR does -->

### What Changed
- 

### Why
- 

### Related Issues
<!-- Link to related issues, if any -->
Closes #

## Type of Change

<!-- Mark the relevant option with an 'x' -->

- [ ] 🎉 Feature (non-breaking change which adds functionality)
- [ ] 🐛 Bug fix (non-breaking change which fixes an issue)
- [ ] 📚 Documentation (changes to documentation only)
- [ ] ♻️ Refactor (code change that neither fixes a bug nor adds a feature)
- [ ] ⚡ Performance (improvement that improves performance)
- [ ] 🧪 Test (adding or updating tests)
- [ ] 🔧 Chore (maintenance tasks, dependencies, config, etc.)
- [ ] 🔒 Security (security improvements)
- [ ] 🗄️ Database (migration or schema changes)

## Testing

### How to Test
<!-- Provide step-by-step instructions for testing this PR -->

1. 
2. 
3. 

### Test Results
<!-- If applicable, include test results or screenshots -->

- [ ] All existing tests pass
- [ ] New tests added (if applicable)
- [ ] Manual testing completed

### Screenshots (if UI changes)
<!-- Add screenshots or GIFs to demonstrate UI changes -->

## Checklist

### Code Quality
- [ ] Code follows project coding standards (see `.cursor/rules/03-coding-standards.md`)
- [ ] TypeScript strict mode compliance (no `any` without justification)
- [ ] Functions are small and focused
- [ ] JSDoc comments added for non-trivial functions
- [ ] No console.log or debug code left in

### Verification
- [ ] `pnpm typecheck` passes
- [ ] `pnpm lint` passes (or warnings are documented)
- [ ] `pnpm test` passes (or explain why not applicable)
- [ ] `pnpm build` succeeds locally

### Security & Privacy
- [ ] No secrets, API keys, or credentials in code/logs
- [ ] `.env.local` is gitignored (verify no secrets committed)
- [ ] Input validation added where needed
- [ ] RLS policies verified (if database changes)
- [ ] Service role key usage is server-side only (if applicable)
- [ ] Audit logging added for critical actions (if applicable)

### Database (if applicable)
- [ ] Migration file created (if schema changes)
- [ ] Migration tested locally (`pnpm supabase db reset`)
- [ ] RLS policies included in migration
- [ ] Types regenerated after migration (`pnpm supabase gen types typescript --local > lib/db/types.ts`)
- [ ] Migration is reversible (when possible)

### Documentation
- [ ] README updated (if needed)
- [ ] Code comments added/updated (if needed)
- [ ] API documentation updated (if applicable)
- [ ] Setup instructions updated (if applicable)

### AI Features (if applicable)
- [ ] Prompt versions updated (if prompts changed)
- [ ] Prompt versions logged in audit trails
- [ ] AI calls are server-side only

### Review Readiness
- [ ] PR description is complete
- [ ] Commits follow conventional commit format
- [ ] Branch is up to date with target branch
- [ ] No merge conflicts
- [ ] CI checks are passing (or explain why not)

## Additional Notes

<!-- Add any additional context, concerns, or notes for reviewers -->

## Breaking Changes

<!-- If this PR includes breaking changes, describe them here and suggest migration path -->

## Deployment Notes

<!-- Any special deployment considerations or steps required -->
