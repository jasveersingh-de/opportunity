# Development Rules

This directory contains **15 development rules** that are **automatically applied** in every Cursor session via the `alwaysApply: true` frontmatter.

## Rules Index

All rules are numbered and organized by category:

### Core Rules
- **[00-operating-system.md](00-operating-system.md)** - Agent work loop, verification commands, mise setup
- **[01-product-scope.md](01-product-scope.md)** - What's allowed vs prohibited (no scraping, no auto-apply)
- **[02-architecture.md](02-architecture.md)** - System architecture, Server Components, service layer

### Code Quality
- **[03-coding-standards.md](03-coding-standards.md)** - TypeScript strict mode, Zod validation, function size
- **[04-testing-and-ci.md](04-testing-and-ci.md)** - Testing requirements, CI checks, test patterns
- **[09-git-workflow.md](09-git-workflow.md)** - Commit messages, branching, PR guidelines

### Security & Data
- **[05-security-and-compliance.md](05-security-and-compliance.md)** - Secrets management, RLS, audit logging
- **[06-data-model.md](06-data-model.md)** - Database schema, migrations, RLS policies
- **[13-supabase-security.md](13-supabase-security.md)** - Supabase-specific security patterns
- **[14-supabase-integration.md](14-supabase-integration.md)** - Supabase client setup, SSR patterns

### Features & Integration
- **[07-ai-integration.md](07-ai-integration.md)** - AI prompt management, versioning, server-side only
- **[08-ui-ux.md](08-ui-ux.md)** - UI patterns, accessibility, responsive design
- **[10-error-handling.md](10-error-handling.md)** - Error classes, user-safe messages, error boundaries
- **[11-api-design.md](11-api-design.md)** - API route patterns, response formats, validation
- **[12-performance.md](12-performance.md)** - Performance optimization, caching, lazy loading
- **[15-monitoring.md](15-monitoring.md)** - Logging, error tracking, analytics

## How Rules Work

Each rule file has frontmatter that marks it for automatic application:

```yaml
---
description: Brief description
globs: "**/*"
alwaysApply: true
---
```

This ensures:
- ✅ Rules are **automatically loaded** in every Cursor session
- ✅ Rules are **context-aware** (applied to relevant files)
- ✅ Rules are **always available** without manual reference

## Quick Reference

**Most Important Rules:**
1. **[00-operating-system.md](00-operating-system.md)** - Always run `pnpm typecheck && pnpm lint && pnpm test` after changes
2. **[01-product-scope.md](01-product-scope.md)** - Never scrape LinkedIn or auto-apply
3. **[05-security-and-compliance.md](05-security-and-compliance.md)** - Never commit secrets, always use RLS
4. **[09-git-workflow.md](09-git-workflow.md)** - Use conventional commits, follow PR templates

## Related Files

- **[.cursorrules](../.cursorrules)** - Quick reference and rule summaries
- **[AGENTS.md](../AGENTS.md)** - Subagent definitions (test-runner, security-sentinel, etc.)
