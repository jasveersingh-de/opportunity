# Pull Request Templates

This directory contains GitHub pull request templates to help ensure consistent and complete PR descriptions.

## Available Templates

### Default Template
**File:** `.github/pull_request_template.md`

Use this template for most pull requests. It includes comprehensive checklists for:
- Code quality
- Security & privacy
- Testing
- Documentation
- Database changes (if applicable)
- AI features (if applicable)

### Specialized Templates

#### Feature Template
**File:** `.github/PULL_REQUEST_TEMPLATE/feature.md`

Use for new features. Includes:
- Feature details and implementation approach
- User impact description
- Test coverage requirements
- Future enhancement notes

#### Bug Fix Template
**File:** `.github/PULL_REQUEST_TEMPLATE/bugfix.md`

Use for bug fixes. Includes:
- Bug description and root cause
- Solution explanation
- Regression testing checklist
- Prevention strategies

#### Database Template
**File:** `.github/PULL_REQUEST_TEMPLATE/database.md`

Use for database migrations and schema changes. Includes:
- Migration details and rollback plan
- RLS policy testing requirements
- Type generation verification
- Production deployment notes

#### Documentation Template
**File:** `.github/PULL_REQUEST_TEMPLATE/documentation.md`

Use for documentation-only changes. Includes:
- Files changed
- Documentation quality checklist
- Verification steps

## How to Use

### When Creating a PR on GitHub

1. **Create a new pull request** on GitHub
2. GitHub will automatically detect and offer template options
3. **Select the appropriate template** from the dropdown (or use default)
4. **Fill in all relevant sections**
5. **Check off completed items** in the checklist
6. **Submit for review**

### Template Selection Guide

- **Feature PRs** → Use `feature.md`
- **Bug fixes** → Use `bugfix.md`
- **Database migrations** → Use `database.md`
- **Documentation updates** → Use `documentation.md`
- **Everything else** → Use default `pull_request_template.md`

## PR Title Format

All PRs should follow conventional commit format:

```
feat: add job ranking with AI scoring
fix: correct RLS policy for jobs table
docs: update API documentation
refactor: extract job service into separate module
chore: update dependencies
```

See [.cursor/rules/09-git-workflow.md](../../.cursor/rules/09-git-workflow.md) for commit message guidelines.

## Checklist Requirements

Before submitting a PR, ensure:

- [ ] `pnpm typecheck` passes
- [ ] `pnpm lint` passes
- [ ] `pnpm test` passes (or explain why not applicable)
- [ ] `pnpm build` succeeds
- [ ] No secrets or credentials in code
- [ ] Documentation updated (if needed)
- [ ] Security considerations addressed (RLS, input validation, etc.)

## Related Documentation

- **Git Workflow:** [.cursor/rules/09-git-workflow.md](../../.cursor/rules/09-git-workflow.md)
- **Coding Standards:** [.cursor/rules/03-coding-standards.md](../../.cursor/rules/03-coding-standards.md)
- **Security Rules:** [.cursor/rules/05-security-and-compliance.md](../../.cursor/rules/05-security-and-compliance.md)
- **Testing Requirements:** [.cursor/rules/04-testing-and-ci.md](../../.cursor/rules/04-testing-and-ci.md)
