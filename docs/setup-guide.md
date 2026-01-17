# Setup Guide: Accounts, Services, and Automation

Complete guide for setting up Opportunity.ai, including account creation, service configuration, and CLI automation.

## Quick Start Summary

**~70% can be automated via CLI/API**
- Next.js initialization: ✅ 100% CLI
- Supabase local setup: ✅ 100% CLI
- Code implementation: ✅ 100% CLI
- Supabase OAuth config: ✅ Can use Management API
- Database migrations: ✅ 100% CLI

**~30% requires UI/dashboard (one-time)**
- Account creation (Supabase, LinkedIn, OpenAI): ❌ Must use web UI
- LinkedIn app creation: ❌ Must use LinkedIn dashboard
- Initial credential retrieval: ⚠️ Dashboard (but can be automated after)

---

## Phase 1: Account Creation (UI Required, ~15 minutes)

### 1. Supabase Account & Project

**Steps:**
1. Go to [supabase.com](https://supabase.com) and click "Start your project"
2. Sign up with GitHub, Google, or email
3. Verify your email if required
4. Click "New Project"
5. Fill in project details:
   - **Name**: `opportunity-ai-dev` (or similar)
   - **Database Password**: Generate a strong password (save it securely!)
   - **Region**: Choose closest to you
6. Wait for project creation (~2 minutes)
7. Once ready, go to **Project Settings → API**
8. Copy these credentials (you'll need them later):
   - **Project URL**: `https://<project-ref>.supabase.co`
   - **`anon` `public` key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **`service_role` `secret` key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` ⚠️ Keep this secret!

**Cost**: Free tier available (500MB database, 2GB bandwidth)

**For Local Development:**
- Can use `supabase start` (no account needed for local)
- But remote project needed for OAuth callbacks

---

### 2. LinkedIn Developer Account & App

**Steps:**
1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/)
2. Sign in with your LinkedIn account
3. Click **"Create app"** button
4. Fill in app details:
   - **App name**: `Opportunity.ai` (or similar)
   - **LinkedIn Page**: (optional, can create later)
   - **Privacy Policy URL**: (required - can use placeholder like `https://github.com/yourusername/opportunity.ai` for now)
   - **App logo**: (optional - upload a square logo)
   - **App usage**: Select **"Sign in with LinkedIn using OpenID Connect"**
5. Accept terms and click **"Create app"**
6. After creation, go to **"Auth"** tab
7. Click **"Add product"** and select **"Sign In with LinkedIn using OpenID Connect"**
8. In the **"Auth"** tab, scroll to **"Redirect URLs"** section
9. Add these redirect URLs (you'll need your Supabase project URL from step 1):
   - **Development**: `http://localhost:3000/auth/callback`
   - **Supabase callback**: `https://<project-ref>.supabase.co/auth/v1/callback`
   - **Production**: `https://your-app.vercel.app/auth/callback` (add later when deploying)
10. Click **"Update"** to save redirect URLs
11. In the **"Auth"** tab, find **"Application credentials"** section
12. Copy:
    - **Client ID**: `86abc123...`
    - **Client Secret**: `ABC123xyz...` ⚠️ Keep this secret!

**Important Notes:**
- LinkedIn may require app review for production use
- Redirect URLs must match exactly (including protocol, port, trailing slashes)
- Privacy Policy URL is required (can use GitHub Pages or similar for now)
- You can update redirect URLs later when you have production domain

**Cost**: Free

---

### 3. OpenAI Account & API Key

**Steps:**
1. Go to [platform.openai.com](https://platform.openai.com)
2. Click **"Sign up"** or **"Log in"**
3. Sign up with email, Google, or Microsoft account
4. Verify your email if required
5. Add payment method (required for API access):
   - Go to **Settings → Billing**
   - Click **"Add payment method"**
   - Enter credit card details
   - Set up billing
6. Go to **API Keys** section (left sidebar)
7. Click **"Create new secret key"**
8. Give it a name (e.g., "Opportunity.ai Development")
9. Copy the API key immediately (starts with `sk-`) - you won't see it again!
10. (Optional) Set usage limits:
    - Go to **Settings → Limits**
    - Set soft limit (e.g., $10/month) to avoid unexpected charges

**Cost**: Pay-per-use
- GPT-4: ~$0.03 per 1K input tokens, ~$0.06 per 1K output tokens
- GPT-3.5-turbo: ~$0.0015 per 1K input tokens, ~$0.002 per 1K output tokens

**For Development:**
- Start with GPT-3.5-turbo (cheaper)
- Set usage limits to avoid unexpected charges

---

### 4. Store Credentials Securely

**Create `.env.local` file:**
```bash
# In your project root
cp .env.example .env.local
```

**Add all credentials to `.env.local`:**
```bash
# Supabase (from step 1)
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key-from-supabase>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key-from-supabase>

# LinkedIn OAuth (from step 2)
LINKEDIN_CLIENT_ID=<client-id-from-linkedin>
LINKEDIN_CLIENT_SECRET=<client-secret-from-linkedin>

# OpenAI (from step 3)
OPENAI_API_KEY=sk-<your-openai-key>
OPENAI_MODEL=gpt-4

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

**Security Notes:**
- `.env.local` is gitignored (never commit it!)
- Store credentials in password manager for team sharing
- Use different credentials for dev/staging/production

---

## Phase 2: Automated Setup (CLI, ~5 minutes)

### Run Setup Script

**Create and run the setup script:**
```bash
# Make script executable
chmod +x scripts/setup.sh

# Run setup
./scripts/setup.sh
```

**What the script does:**
1. Initializes Next.js 16 app (if not exists)
2. Installs all dependencies
3. Sets up Supabase locally
4. Applies database migrations
5. Generates TypeScript types
6. Creates project structure
7. Sets up environment variable template

**Manual steps after script:**
1. Edit `.env.local` with credentials from Phase 1
2. Configure LinkedIn OAuth in Supabase (see Phase 3)

---

### Manual CLI Setup (Alternative)

If you prefer to run commands manually:

```bash
# 1. Initialize Next.js
pnpm create next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*"

# 2. Install dependencies
pnpm install
pnpm add @supabase/supabase-js @supabase/ssr @supabase/auth-helpers-nextjs
pnpm add zod react-hook-form @hookform/resolvers

# 3. Initialize shadcn/ui
pnpm dlx shadcn@latest init -y
pnpm dlx shadcn@latest add button input card form label

# 4. Set up Supabase locally
supabase start
supabase db reset

# 5. Generate TypeScript types
mkdir -p lib/db
supabase gen types typescript --local > lib/db/types.ts

# 6. Create .env.local (populate with credentials from Phase 1)
cp .env.example .env.local
# Edit .env.local with your credentials
```

---

## Phase 3: Configure LinkedIn OAuth

### Option A: Via Supabase Dashboard (Easiest, ~2 minutes)

**Steps:**
1. Go to your Supabase project dashboard
2. Navigate to **Authentication → Providers**
3. Find **"LinkedIn (OIDC)"** in the list
4. Click to expand/enable it
5. Enter:
   - **Client ID**: (from LinkedIn Developer App)
   - **Client Secret**: (from LinkedIn Developer App)
6. Click **"Save"**

**That's it!** LinkedIn OAuth is now configured.

---

### Option B: Via Supabase Management API (Automated)

**Prerequisites:**
- Supabase CLI installed
- LinkedIn credentials in environment variables

**Steps:**
```bash
# 1. Login to Supabase CLI
supabase login

# 2. Get your project reference
supabase projects list

# 3. Run OAuth configuration script
export LINKEDIN_CLIENT_ID="<your-client-id>"
export LINKEDIN_CLIENT_SECRET="<your-client-secret>"
./scripts/configure-linkedin-oauth.sh
```

**Script contents** (`scripts/configure-linkedin-oauth.sh`):
```bash
#!/bin/bash
# Requires: supabase login, LINKEDIN_CLIENT_ID, LINKEDIN_CLIENT_SECRET

set -e

PROJECT_REF=$(supabase projects list | grep opportunity | awk '{print $1}' || echo "")
if [ -z "$PROJECT_REF" ]; then
  echo "Error: Could not find Supabase project"
  exit 1
fi

ACCESS_TOKEN=$(cat ~/.supabase/access-token 2>/dev/null || echo "")
if [ -z "$ACCESS_TOKEN" ]; then
  echo "Error: Not logged in. Run 'supabase login' first"
  exit 1
fi

if [ -z "$LINKEDIN_CLIENT_ID" ] || [ -z "$LINKEDIN_CLIENT_SECRET" ]; then
  echo "Error: LINKEDIN_CLIENT_ID and LINKEDIN_CLIENT_SECRET must be set"
  exit 1
fi

echo "Configuring LinkedIn OAuth for project: $PROJECT_REF"

curl -X PATCH \
  "https://api.supabase.com/v1/projects/${PROJECT_REF}/config/auth" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "{
    \"EXTERNAL_LINKEDIN_OIDC_ENABLED\": true,
    \"EXTERNAL_LINKEDIN_OIDC_CLIENT_ID\": \"${LINKEDIN_CLIENT_ID}\",
    \"EXTERNAL_LINKEDIN_OIDC_SECRET\": \"${LINKEDIN_CLIENT_SECRET}\"
  }"

echo ""
echo "✅ LinkedIn OAuth configured successfully!"
```

---

## Phase 4: Verify Setup

### Test Local Development

```bash
# Start development server
pnpm dev

# In another terminal, verify Supabase is running
supabase status
```

**Expected results:**
- Next.js dev server running on `http://localhost:3000`
- Supabase local services running
- No errors in console

### Test Authentication Flow

1. Navigate to `http://localhost:3000/login`
2. Click "Sign in with LinkedIn"
3. Complete LinkedIn OAuth flow
4. Verify redirect to `/dashboard`
5. Verify session persists on page refresh

---

## Setup Checklist

### Before Starting Development

- [ ] Supabase account created
- [ ] Supabase project created
- [ ] Supabase credentials copied to `.env.local`
- [ ] LinkedIn Developer account created
- [ ] LinkedIn app created
- [ ] LinkedIn OAuth credentials copied to `.env.local`
- [ ] OpenAI account created
- [ ] OpenAI API key generated and added to `.env.local`
- [ ] Setup script run (or manual setup completed)
- [ ] LinkedIn OAuth configured in Supabase
- [ ] Local Supabase running (`supabase start`)
- [ ] Migrations applied (`supabase db reset`)
- [ ] TypeScript types generated
- [ ] Development server starts without errors

---

## What's Automated vs Manual

### ✅ 100% CLI/Automated

| Task | Command |
|------|---------|
| Next.js initialization | `pnpm create next-app@latest .` |
| Install dependencies | `pnpm install` |
| Supabase local setup | `supabase start` |
| Apply migrations | `supabase db reset` |
| Generate types | `supabase gen types typescript --local` |
| Code implementation | All files via CLI/editor |

### ⚠️ Partially Automated

| Task | CLI Option | UI Option |
|------|------------|-----------|
| Supabase OAuth config | Management API | Dashboard |
| Environment variables | Script + manual entry | Manual entry |

### ❌ Manual Only (UI Required)

| Task | Why |
|------|-----|
| Account creation | Email verification, terms acceptance |
| LinkedIn app creation | No API available |
| Initial credential retrieval | Security - shown once in dashboards |

**Overall**: ~70% automated, ~30% requires UI (mostly one-time account/app creation)

---

## Troubleshooting

### Supabase Local Won't Start

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

### LinkedIn OAuth Not Working

1. **Check redirect URLs match exactly:**
   - In LinkedIn app: `http://localhost:3000/auth/callback`
   - In Supabase: Site URL set correctly
   - No trailing slashes or protocol mismatches

2. **Verify credentials:**
   - Client ID and Secret correct in Supabase
   - No extra spaces or quotes

3. **Check Supabase logs:**
   - Go to Supabase Dashboard → Logs
   - Look for authentication errors

### Environment Variables Not Loading

1. **Verify file exists:** `.env.local` in project root
2. **Check variable names:** Must match exactly (case-sensitive)
3. **Restart dev server:** Changes require restart
4. **Check `.gitignore`:** `.env.local` should be ignored

---

## Next Steps

After setup is complete:

1. **Start development**: `pnpm dev`
2. **Implement features**: See [.cursor/rules/](.cursor/rules/) for development guidelines
3. **Test authentication**: Complete login flow
4. **Build dashboard**: Implement job management features

---

## Additional Resources

- **Supabase Setup**: See [docs/supabase-setup.md](supabase-setup.md) for detailed Supabase configuration
- **Environment Management**: See [docs/environments.md](environments.md) for environment separation
- **Development Guidelines**: See [.cursor/rules/](.cursor/rules/) for coding standards
- **Architecture**: See [TECH-SPEC.md](../TECH-SPEC.md) for technical specifications

---

## Quick Reference

### Essential Commands

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Production build
pnpm typecheck        # Type checking
pnpm lint             # Linting

# Supabase
supabase start        # Start local Supabase
supabase stop         # Stop local Supabase
supabase db reset     # Reset database
supabase gen types typescript --local > lib/db/types.ts  # Generate types

# Setup
./scripts/setup.sh    # Run full setup
```

### Important URLs

- **Supabase Dashboard**: https://app.supabase.com
- **LinkedIn Developers**: https://www.linkedin.com/developers/
- **OpenAI Platform**: https://platform.openai.com
- **Local Supabase Studio**: http://localhost:54323
- **Local Development**: http://localhost:3000
