---
description: Operating system for agentic execution in this repo
globs: "**/*"
alwaysApply: true
---

# Agent Operating System (AOS)

You are the Cursor agent working in this repository. This document defines the "operating system" contract for how you execute tasks.

## Non-negotiables

- **Be fully agentic**: Take initiative, run commands, iterate until passing checks.
- **Prefer small, reviewable changes**: Avoid giant rewrites; break work into logical commits.
- **Keep the user in control**: Never submit applications, send emails, or take real-world actions without explicit user approval.
- **Never commit secrets**: Never paste private tokens, API keys, or credentials into code, logs, or commits.
- **Verify before claiming done**: Run checks and tests; don't assume code works.

## Work Loop (Always Follow)

1. **Clarify the goal** in 1-3 bullets (no questions unless truly blocked).
2. **Produce a plan** of attack in clear steps.
3. **Make changes** incrementally with logical commits.
4. **Run relevant checks** via terminal (typecheck + tests at minimum if code changed).
5. **Summarize** what changed + how to verify.

## Development Environment Setup

### mise Tool Version Manager

**This project uses mise** (https://mise.jdx.dev) for managing tool versions. mise automatically sets up Node.js and pnpm versions when you enter the project directory.

**Installation:**
```bash
# Install mise (one-time setup)
curl https://mise.run | sh

# Or using Homebrew (macOS)
brew install mise
```

**Usage:**
```bash
# Enter project directory - mise automatically activates
cd /path/to/opportunity.ai

# Verify tool versions are set up
mise ls

# Check current Node.js version
node --version

# Check current pnpm version
pnpm --version
```

**mise automatically:**
- Installs the correct Node.js version (from `.mise.toml`)
- Installs the correct pnpm version (from `.mise.toml`)
- Sets up environment variables when entering the project directory
- No need to manually switch Node.js versions or install tools

## Terminal Usage

### Required Verification Commands

After any code change, run these commands in sequence:

```bash
# Type checking
pnpm typecheck

# Linting
pnpm lint

# Tests (if applicable)
pnpm test
```

### Command Execution Rules

- **Use the terminal proactively** to verify correctness.
- **If a command hangs** (e.g., dev server), stop it and run non-blocking commands instead.
- **Prefer deterministic commands**: lint, typecheck, unit tests over manual verification.
- **Run commands in the project root** unless explicitly working in a subdirectory.
- **Capture command output** and report failures clearly.

### Common Commands

```bash
# Tool version management (mise)
mise ls                # List installed tools and versions
mise install           # Install tools specified in .mise.toml
mise which node        # Show path to Node.js binary

# Development
pnpm dev              # Start dev server (background if needed)
pnpm build            # Production build
pnpm start            # Start production server

# Quality checks
pnpm lint             # Run linter
pnpm typecheck        # TypeScript type checking
pnpm test             # Run tests
pnpm test:watch       # Watch mode tests

# Database (Supabase)
pnpm supabase start   # Start local Supabase
pnpm supabase db reset # Reset local database
pnpm supabase gen types typescript --local > lib/db/types.ts # Generate types
```

**Note:** All commands assume mise has set up the correct tool versions. If you encounter version-related issues, ensure mise is installed and activated (it activates automatically when you `cd` into the project directory).

## Output Expectations

- **Provide crisp diffs/file changes**: Show what changed, not just "I updated the file."
- **Add/update docs** when behavior changes (README or `/docs`).
- **Include verification steps**: Tell the user how to test your changes.
- **Report errors clearly**: Include error messages, file paths, and line numbers.

## Done Criteria Checklist

Before marking a task complete, verify:

- [ ] Code changes are committed with clear messages
- [ ] `pnpm typecheck` passes
- [ ] `pnpm lint` passes (or warnings are documented)
- [ ] Relevant tests pass (or new tests added for new features)
- [ ] Documentation updated if behavior changed
- [ ] No secrets or credentials in code/logs
- [ ] User can verify the change (clear testing instructions)

## Troubleshooting Common Agent Failures

### Type Errors
- **Symptom**: `pnpm typecheck` fails
- **Action**: Fix type errors; don't use `any` without justification. Add proper types or type assertions.

### Lint Errors
- **Symptom**: `pnpm lint` fails
- **Action**: Fix linting issues; don't disable rules without good reason. Use `eslint-disable` comments sparingly.

### Test Failures
- **Symptom**: Tests fail after changes
- **Action**: 
  - If behavior intentionally changed: update tests to match new behavior
  - If behavior unintentionally changed: fix the code to match test expectations
  - Never weaken test intent (e.g., removing assertions)

### Build Failures
- **Symptom**: `pnpm build` fails
- **Action**: Check for missing dependencies, type errors, or configuration issues. Fix root cause.

### Missing Dependencies
- **Symptom**: Import errors or missing modules
- **Action**: Install missing packages with `pnpm add <package>` or `pnpm add -D <package>` for dev dependencies.

### Tool Version Issues
- **Symptom**: Wrong Node.js or pnpm version, or tools not found
- **Action**: 
  - Ensure mise is installed: `curl https://mise.run | sh`
  - Enter project directory (mise activates automatically)
  - Run `mise install` to install tools from `.mise.toml`
  - Verify with `mise ls` and `node --version`

## Related Rules

- See [01-product-scope.md](01-product-scope.md) for product boundaries
- See [03-coding-standards.md](03-coding-standards.md) for code quality standards
- See [04-testing-and-ci.md](04-testing-and-ci.md) for testing requirements
- See [09-git-workflow.md](09-git-workflow.md) for commit conventions
