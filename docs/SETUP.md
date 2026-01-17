# Setup Guide

Complete setup guide for Opportunity.ai. Follow phases in order.

## Quick Start

```bash
# 1. Create accounts (UI, ~15 min) - see Phase 1
# 2. Run automated setup (CLI, ~5 min)
./scripts/setup.sh

# 3. Configure OAuth (UI, ~2 min) - see Phase 3
# 4. Start development
pnpm dev
```

**Automation**: ~70% CLI, ~30% UI (one-time account creation)

---

## Phase 1: Account Creation (UI, ~15 min)

### Supabase

1. Sign up at [supabase.com](https://supabase.com)
2. Create project: `opportunity-ai-dev`
3. Get credentials from **Project Settings → API**:
   - Project URL: `https://<ref>.supabase.co`
   - `anon` key
   - `service_role` key (secret!)

### LinkedIn Developer

1. Go to [linkedin.com/developers](https://www.linkedin.com/developers/)
2. Create app with "Sign in with LinkedIn using OpenID Connect"
3. Add redirect URLs:
   - `http://localhost:3000/auth/callback`
   - `https://<project-ref>.supabase.co/auth/v1/callback`
4. Copy Client ID and Secret

### OpenAI

1. Sign up at [platform.openai.com](https://platform.openai.com)
2. Add payment method
3. Create API key (starts with `sk-`)

### Store Credentials

```bash
cp .env.example .env.local
# Edit .env.local with credentials from above
```

---

## Phase 2: Automated Setup (CLI)

```bash
# Run setup script
./scripts/setup.sh

# Or manually:
pnpm create next-app@latest . --typescript --tailwind --app
pnpm install
pnpm add @supabase/supabase-js @supabase/ssr @supabase/auth-helpers-nextjs
pnpm dlx shadcn@latest init -y
supabase start
supabase db reset
supabase gen types typescript --local > lib/db/types.ts
```

---

## Phase 3: OAuth Configuration

### Option A: Dashboard (Easiest)

1. Supabase Dashboard → **Authentication → Providers**
2. Enable **LinkedIn (OIDC)**
3. Enter Client ID and Secret
4. Save

### Option B: Management API

```bash
supabase login
export LINKEDIN_CLIENT_ID="<id>"
export LINKEDIN_CLIENT_SECRET="<secret>"
./scripts/configure-linkedin-oauth.sh
```

---

## Phase 4: Environments

### Development (Local)

- Supabase: `supabase start` (local)
- Environment: `.env.local`
- URL: `http://localhost:3000`

### Staging/Production

- Supabase: Separate project
- Environment: Vercel/env vars
- Migrations: `supabase db push`

**Key Commands:**
```bash
supabase link --project-ref <ref>  # Link to remote
supabase db push                    # Push migrations
supabase gen types typescript --project-id <id> > lib/db/types.ts
```

---

## Troubleshooting

**Supabase won't start:** `supabase stop && supabase start`

**OAuth not working:** Check redirect URLs match exactly (no trailing slashes)

**Env vars not loading:** Restart dev server, verify `.env.local` exists

---

## Reference

- **Supabase CLI**: `supabase --help`
- **Local Studio**: http://localhost:54323
- **Migration workflow**: See [.cursor/rules/06-data-model.md](../.cursor/rules/06-data-model.md)
- **Security**: See [.cursor/rules/13-supabase-security.md](../.cursor/rules/13-supabase-security.md)
