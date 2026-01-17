# Supabase Setup Guide

Complete guide for setting up Supabase for Opportunity.ai.

## Prerequisites

- [Supabase account](https://supabase.com)
- [Supabase CLI](https://supabase.com/docs/reference/cli) installed
- Node.js and pnpm (managed via mise)

## Installation

### Install Supabase CLI

**Using mise (recommended):**
```bash
mise install supabase
```

**Using npm:**
```bash
npm install -g supabase
```

**Using Homebrew (macOS):**
```bash
brew install supabase/tap/supabase
```

**Verify installation:**
```bash
supabase --version
```

## Local Development Setup

### 1. Start Local Supabase

```bash
# Start local Supabase (first time may take a few minutes)
supabase start

# This will:
# - Start PostgreSQL database
# - Start Supabase API
# - Start Supabase Studio (http://localhost:54323)
# - Start Inbucket (email testing) (http://localhost:54324)
```

**Output:**
```
Started supabase local development setup.

         API URL: http://localhost:54321
     GraphQL URL: http://localhost:54321/graphql/v1
          DB URL: postgresql://postgres:postgres@localhost:54322/postgres
      Studio URL: http://localhost:54323
    Inbucket URL: http://localhost:54324
      JWT secret: super-secret-jwt-token-with-at-least-32-characters-long
        anon key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2. Configure Environment Variables

**Create `.env.local`:**
```bash
# Copy from .env.example
cp .env.example .env.local

# Update with local Supabase values
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key-from-output>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key-from-output>
```

### 3. Apply Migrations

```bash
# Reset database and apply all migrations
supabase db reset

# This will:
# - Drop all tables
# - Apply all migrations in supabase/migrations/
# - Seed data (if any)
```

### 4. Generate TypeScript Types

```bash
# Generate types from local schema
supabase gen types typescript --local > lib/db/types.ts
```

### 5. Access Supabase Studio

Open http://localhost:54323 in your browser to:
- View database tables
- Test queries
- Manage data
- View API documentation

## Remote Project Setup

### 1. Create Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click "New Project"
3. Fill in project details:
   - **Name**: opportunity-ai-staging (or production)
   - **Database Password**: Strong password (save it!)
   - **Region**: Choose closest region
4. Wait for project to be created (2-3 minutes)

### 2. Get Project Credentials

1. Go to Project Settings → API
2. Copy:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **service_role key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (keep secret!)

### 3. Link Local Project to Remote

```bash
# Link to remote project
supabase link --project-ref <project-ref>

# Project ref is in the URL: https://app.supabase.com/project/<project-ref>
```

### 4. Push Migrations to Remote

```bash
# Push migrations to remote
supabase db push

# This will apply all migrations to the remote database
```

### 5. Generate Types from Remote

```bash
# Generate types from remote schema
supabase gen types typescript --project-id <project-id> > lib/db/types.ts

# Or if linked
supabase gen types typescript --linked > lib/db/types.ts
```

## Authentication Setup

### 1. Configure Auth Providers

**Email/Password:**
1. Go to Authentication → Providers
2. Enable "Email" provider
3. Configure email templates (optional)

**Magic Link:**
1. Enable "Email" provider
2. Configure redirect URL: `http://localhost:3000/auth/callback` (dev)
3. Configure redirect URL: `https://your-app.vercel.app/auth/callback` (prod)

**OAuth (Google, GitHub, etc.):**
1. Go to Authentication → Providers
2. Enable desired OAuth provider
3. Configure OAuth credentials
4. Add redirect URLs

### 2. Configure Password Policy

**In `supabase/config.toml`:**
```toml
[auth.password]
min_length = 8
require_uppercase = true
require_lowercase = true
require_numbers = true
require_symbols = false
```

**In Supabase Dashboard:**
1. Go to Authentication → Settings
2. Configure password requirements
3. Enable leak detection (HaveIBeenPwned)

### 3. Configure MFA (Optional)

1. Go to Authentication → Settings
2. Enable MFA
3. Configure MFA requirements

## Row Level Security (RLS) Setup

### 1. Verify RLS is Enabled

**All migrations should enable RLS:**
```sql
alter table profiles enable row level security;
alter table jobs enable row level security;
-- etc.
```

### 2. Verify Policies

**Check policies in Supabase Studio:**
1. Go to Database → Policies
2. Verify policies exist for all tables
3. Test policies with different users

**Or via SQL:**
```sql
SELECT tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public';
```

### 3. Test RLS Policies

See [.cursor/rules/04-testing-and-ci.md](../.cursor/rules/04-testing-and-ci.md) for RLS testing patterns.

## Storage Setup (Optional)

**If storing CVs/files:**

1. Go to Storage in Supabase Dashboard
2. Create bucket: `cvs`
3. Configure RLS policies:
   ```sql
   CREATE POLICY "Users can upload own CVs"
     ON storage.objects FOR INSERT
     WITH CHECK (bucket_id = 'cvs' AND auth.uid()::text = (storage.foldername(name))[1]);
   
   CREATE POLICY "Users can view own CVs"
     ON storage.objects FOR SELECT
     USING (bucket_id = 'cvs' AND auth.uid()::text = (storage.foldername(name))[1]);
   ```

## Monitoring Setup

### 1. Enable Logging

**In Supabase Dashboard:**
1. Go to Logs
2. Enable API logs
3. Enable Database logs
4. Configure log retention

### 2. Set Up Alerts

**In Supabase Dashboard:**
1. Go to Settings → Alerts
2. Configure alerts for:
   - High error rate
   - Database connection issues
   - Storage quota

## Production Checklist

Before deploying to production:

- [ ] Supabase production project created
- [ ] Environment variables configured
- [ ] Migrations applied
- [ ] RLS policies verified
- [ ] Types generated
- [ ] Auth providers configured
- [ ] Password policy configured
- [ ] MFA enabled (if required)
- [ ] Backup strategy verified
- [ ] Monitoring configured
- [ ] Alerts configured

## Troubleshooting

### Local Supabase Won't Start

```bash
# Stop and restart
supabase stop
supabase start

# Check Docker is running
docker ps

# Reset if needed
supabase stop --no-backup
supabase start
```

### Migration Errors

```bash
# Check migration status
supabase migration list

# Reset database
supabase db reset

# Check for syntax errors in migration files
```

### Connection Issues

```bash
# Verify Supabase is running
supabase status

# Check environment variables
echo $NEXT_PUBLIC_SUPABASE_URL

# Test connection
supabase db ping
```

## Related Documentation

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase CLI Reference](https://supabase.com/docs/reference/cli)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Supabase Database Security](https://supabase.com/docs/guides/database/secure-data)
- See [docs/environments.md](environments.md) for environment management
- See [.cursor/rules/06-data-model.md](../.cursor/rules/06-data-model.md) for migration workflow
- See [.cursor/rules/13-supabase-security.md](../.cursor/rules/13-supabase-security.md) for security patterns
