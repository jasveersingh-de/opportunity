---
description: Git conventions for commits and change scope
globs: "**/*"
alwaysApply: true
---

# Git Workflow

## Commit Messages

### Commit Message Format

**Use conventional commit format:**

```
<type>: <subject>

[optional body]

[optional footer]
```

### Commit Types

- **feat**: New feature
- **fix**: Bug fix
- **chore**: Maintenance tasks (dependencies, config, etc.)
- **docs**: Documentation changes
- **refactor**: Code refactoring (no behavior change)
- **test**: Adding or updating tests
- **style**: Code style changes (formatting, no logic change)
- **perf**: Performance improvements

### Examples

```bash
# Feature
feat: add job ranking with AI scoring

# Bug fix
fix: correct RLS policy for jobs table

# Chore
chore: update dependencies

# Documentation
docs: add API endpoint documentation

# Refactor
refactor: extract job service into separate module

# Test
test: add integration tests for job creation

# Performance
perf: optimize job list query with composite index
```

### Commit Message Guidelines

- **Subject line**: 50 characters or less, imperative mood ("add" not "added")
- **Body**: Explain what and why (if needed), wrap at 72 characters
- **Footer**: Reference issues (e.g., "Fixes #123")

### Good Commit Messages

```bash
feat: add country filter to job list

Adds multi-select country filter component that allows users to
filter jobs by one or more countries. Filter state is persisted
in URL query parameters.

feat: implement AI-powered job ranking

Uses GPT-4 to analyze job descriptions against user profile and
generate ranking scores. Scores are stored in jobs.rank_score column.

fix: prevent users from accessing other users' jobs

Updates RLS policies to ensure users can only access their own jobs.
Adds integration tests to verify policy enforcement.
```

### Bad Commit Messages

```bash
# Too vague
update code

# Not imperative
updated job service

# Too long subject
feat: add a really long feature that does many things and is hard to understand

# No type
add job filtering
```

## Branching Strategy

### Branch Naming

**Use descriptive branch names:**

```
feat/job-ranking
fix/rls-policy
refactor/job-service
docs/api-endpoints
```

### Branch Guidelines

- **One feature per branch** (conceptually)
- **Avoid mixing refactors with feature changes** unless required
- **Keep branches small**: Prefer multiple small PRs over one large PR
- **Delete merged branches**: Clean up after merge

### Branch Workflow

```bash
# Create feature branch
git checkout -b feat/job-ranking

# Make changes and commit
git add .
git commit -m "feat: add job ranking with AI scoring"

# Push and create PR
git push origin feat/job-ranking
```

## Pull Request Guidelines

### PR Title

**Use same format as commit messages:**

```
feat: add job ranking with AI scoring
fix: correct RLS policy for jobs table
```

### PR Description Template

**GitHub PR templates are available** in `.github/pull_request_template.md` and `.github/PULL_REQUEST_TEMPLATE/`:

- **Default template**: `.github/pull_request_template.md` - Use for most PRs
- **Feature PRs**: `.github/PULL_REQUEST_TEMPLATE/feature.md` - For new features
- **Bug fixes**: `.github/PULL_REQUEST_TEMPLATE/bugfix.md` - For bug fixes
- **Database changes**: `.github/PULL_REQUEST_TEMPLATE/database.md` - For migrations/schema changes
- **Documentation**: `.github/PULL_REQUEST_TEMPLATE/documentation.md` - For docs-only changes

**When creating a PR**, GitHub will automatically populate the template. Select the appropriate template when creating the PR, or use the default template.

**All PR templates include:**
- Description section (What Changed, Why)
- Testing instructions
- Comprehensive checklist (code quality, security, verification)
- Type-specific sections (e.g., migration details for database PRs)

**Minimum PR description should include:**
- What changed and why
- How to test
- Checklist items verified

### PR Review Checklist

Before requesting review:

- [ ] All tests pass
- [ ] Lint and typecheck pass
- [ ] No console.log or debug code
- [ ] No secrets or credentials
- [ ] Documentation updated if needed
- [ ] PR description is complete
- [ ] Screenshots added for UI changes

## Commit Scope

### Small, Focused Commits

**Prefer small, reviewable commits:**

```bash
# ✅ GOOD: Focused commits
feat: add job model and database schema
feat: add job creation API endpoint
feat: add job list UI component
test: add tests for job creation

# ❌ BAD: Giant commit
feat: implement job management feature
# (includes schema, API, UI, tests all in one)
```

### Atomic Commits

**Each commit should be atomic (one logical change):**

- If a commit can be split into multiple logical changes, split it
- If reverting one commit breaks the build, it's probably too large

### Commit Frequency

**Commit often:**
- After completing a logical unit of work
- Before taking a break
- After fixing a bug
- After adding a test

## Git Best Practices

### Before Committing

```bash
# Check what will be committed
git status
git diff

# Stage specific files
git add path/to/file.ts

# Review staged changes
git diff --staged
```

### Commit Workflow

```bash
# 1. Check status
git status

# 2. Stage changes
git add .

# 3. Review staged changes
git diff --staged

# 4. Commit with message
git commit -m "feat: add job ranking"

# 5. Push (if ready)
git push origin branch-name
```

### Undoing Changes

```bash
# Unstage changes (keep file changes)
git reset HEAD path/to/file.ts

# Discard file changes (careful!)
git checkout -- path/to/file.ts

# Amend last commit
git commit --amend -m "feat: add job ranking with AI"

# Undo last commit (keep changes)
git reset --soft HEAD~1
```

## Related Rules

- See [00-operating-system.md](00-operating-system.md) for work loop and verification
- See [03-coding-standards.md](03-coding-standards.md) for code quality standards
- See [04-testing-and-ci.md](04-testing-and-ci.md) for testing requirements
