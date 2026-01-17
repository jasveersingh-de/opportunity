# CI/CD Workflows

This directory contains GitHub Actions workflows for continuous integration and deployment.

## Workflows

### 1. PR Checks (`pr-checks.yml`)

**Triggers:** Pull requests to `main` branch

**What it does:**
- Runs linter (`pnpm lint`)
- Runs type checking (`pnpm typecheck`)
- Builds the application (`pnpm build`)
- Verifies build artifacts are created

**Purpose:** Ensures all PRs pass quality checks before merging.

### 2. CI (`ci.yml`)

**Triggers:** Pushes to `main` branch

**What it does:**
- Runs linter and type checking
- Builds the application
- Uploads build artifacts

**Purpose:** Validates code quality on main branch.

### 3. Deploy (`deploy.yml`)

**Triggers:** Pushes to `main` branch (excluding docs and config changes)

**What it does:**
- Builds the application with production environment variables
- Deploys to Vercel (if configured)

**Purpose:** Automatically deploys to production when code is merged to main.

### 4. Supabase Migrations (`supabase-migrations.yml`)

**Triggers:** Pull requests or pushes that modify `supabase/migrations/**`

**What it does:**
- Validates database migrations
- Checks RLS policies
- Generates TypeScript types

**Purpose:** Ensures database migrations are valid before merging.

## Required GitHub Secrets

### For Deployment (Vercel)

To enable automatic deployment, add these secrets to your GitHub repository:

1. **VERCEL_TOKEN**
   - Get from: https://vercel.com/account/tokens
   - Create a new token with appropriate permissions

2. **VERCEL_ORG_ID**
   - Get from: Vercel dashboard → Settings → General
   - Or run: `vercel whoami` and check your account

3. **VERCEL_PROJECT_ID**
   - Get from: Vercel project settings
   - Or run: `vercel link` in your project directory

### For Build (Optional but Recommended)

These secrets are used during the build process:

1. **NEXT_PUBLIC_SUPABASE_URL**
   - Your Supabase project URL
   - Format: `https://xxxxx.supabase.co`

2. **NEXT_PUBLIC_SUPABASE_ANON_KEY**
   - Your Supabase anonymous key
   - Get from: Supabase dashboard → Settings → API

3. **SUPABASE_SERVICE_ROLE_KEY** (for server-side operations)
   - Your Supabase service role key
   - Get from: Supabase dashboard → Settings → API
   - ⚠️ Keep this secret - never expose to client

4. **OPENAI_API_KEY** (for AI features)
   - Your OpenAI API key
   - Get from: https://platform.openai.com/api-keys

## Setting Up Secrets

1. Go to your GitHub repository
2. Navigate to: **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each secret with its value

## Workflow Status

You can check workflow status:
- In the **Actions** tab of your GitHub repository
- On pull requests (checks appear at the bottom)
- Via GitHub API

## Local Testing

To test workflows locally before pushing:

```bash
# Test build locally
pnpm build

# Test linting
pnpm lint

# Test type checking
pnpm typecheck
```

## Troubleshooting

### Build Fails in CI

- Check that all environment variables are set (even dummy values work for build)
- Verify `pnpm-lock.yaml` is committed
- Check Node.js version matches (should be 20)

### Deployment Fails

- Verify Vercel secrets are set correctly
- Check Vercel project is linked to the repository
- Ensure Vercel token has correct permissions

### Migration Validation Fails

- Run `supabase db reset` locally to test migrations
- Check migration SQL syntax
- Verify RLS policies are correctly defined

## Related Documentation

- [Testing & CI Rules](../../.cursor/rules/04-testing-and-ci.md)
- [Git Workflow](../../.cursor/rules/09-git-workflow.md)
- [Project Setup](../../docs/SETUP.md)
