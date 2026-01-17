# Environment Management

This document describes the environment separation strategy for Opportunity.ai.

## Environment Overview

Opportunity.ai uses three environments:

1. **Development**: Local development with Supabase local
2. **Staging**: Preview/staging environment with Supabase staging project
3. **Production**: Production environment with Supabase production project

## Environment Separation

### Development Environment

**Local Supabase:**
- Run `supabase start` to start local Supabase
- Database runs in Docker containers
- No external dependencies
- Fast iteration and testing

**Configuration:**
- `.env.local` (gitignored)
- Uses local Supabase credentials
- OpenAI API key (development key or mock)

**Setup:**
```bash
# Start local Supabase
supabase start

# Apply migrations
supabase db reset

# Generate types
supabase gen types typescript --local > lib/db/types.ts
```

### Staging Environment

**Supabase Staging Project:**
- Separate Supabase project for staging
- Isolated from production data
- Used for testing before production deployment

**Configuration:**
- Environment variables in Vercel (staging project)
- Uses staging Supabase project credentials
- OpenAI API key (staging key or production key with rate limits)

**Deployment:**
- Automatic deployment on PR merge to `main`
- Preview deployments for each PR
- Manual deployment via Vercel dashboard

**Setup:**
```bash
# Link to staging project
supabase link --project-ref <staging-project-ref>

# Push migrations
supabase db push

# Generate types
supabase gen types typescript --project-id <staging-project-id> > lib/db/types.ts
```

### Production Environment

**Supabase Production Project:**
- Production Supabase project
- Production data
- High availability and performance

**Configuration:**
- Environment variables in Vercel (production project)
- Uses production Supabase project credentials
- OpenAI API key (production key)

**Deployment:**
- Manual deployment via Vercel dashboard
- Requires approval for migrations
- Backup before major changes

**Setup:**
```bash
# Link to production project (careful!)
supabase link --project-ref <production-project-ref>

# Push migrations (with caution)
supabase db push

# Generate types
supabase gen types typescript --project-id <production-project-id> > lib/db/types.ts
```

## Environment Variables

### Required Variables

All environments require these variables:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# OpenAI
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4

# Application
NODE_ENV=
NEXT_PUBLIC_APP_URL=
```

### Environment-Specific Variables

**Development:**
```bash
# Local Supabase (default values)
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<local-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<local-service-key>
```

**Staging:**
```bash
# Staging Supabase project
NEXT_PUBLIC_SUPABASE_URL=https://<staging-project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<staging-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<staging-service-key>
```

**Production:**
```bash
# Production Supabase project
NEXT_PUBLIC_SUPABASE_URL=https://<production-project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<production-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<production-service-key>
```

## Migration Workflow

### Development

1. Create migration: `supabase migration new <description>`
2. Edit migration file
3. Test locally: `supabase db reset`
4. Generate types: `supabase gen types typescript --local > lib/db/types.ts`
5. Commit migration file

### Staging

1. Merge PR to `main`
2. CI/CD validates migrations
3. Deploy to staging
4. Test in staging environment
5. Verify migrations applied correctly

### Production

1. **Manual approval required**
2. Review migration in staging first
3. Backup production database
4. Apply migration: `supabase db push` (or via dashboard)
5. Verify migration success
6. Monitor for issues

## Backup and Recovery

### Backup Strategy

**Supabase Automatic Backups:**
- Daily backups (Supabase default)
- Point-in-time recovery available
- Backup retention: 7 days (default)

**Manual Backups:**
- Before major migrations
- Before schema changes
- Before data migrations

**Backup Procedure:**
```bash
# Export database schema
supabase db dump --schema-only > backup-schema.sql

# Export data (if needed)
supabase db dump --data-only > backup-data.sql
```

### Recovery Procedure

**If migration fails:**
1. Stop application deployment
2. Review error logs
3. Create rollback migration if needed
4. Apply rollback migration
5. Verify data integrity
6. Resume application deployment

## Environment Checklist

### Development Setup
- [ ] Local Supabase running
- [ ] Migrations applied
- [ ] Types generated
- [ ] Environment variables configured
- [ ] Tests passing

### Staging Setup
- [ ] Supabase staging project created
- [ ] Environment variables configured in Vercel
- [ ] Migrations applied
- [ ] Types generated
- [ ] Application deployed
- [ ] Smoke tests passing

### Production Setup
- [ ] Supabase production project created
- [ ] Environment variables configured in Vercel
- [ ] Migrations applied
- [ ] Types generated
- [ ] Application deployed
- [ ] Monitoring configured
- [ ] Backup strategy verified

## Related Documentation

- See [docs/supabase-setup.md](supabase-setup.md) for Supabase setup guide
- See [.cursor/rules/06-data-model.md](../.cursor/rules/06-data-model.md) for migration workflow
- See [README.md](../README.md) for development setup
