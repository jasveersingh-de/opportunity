# Technical Specification

## Overview

This document provides detailed technical design and implementation specifications for Opportunity.ai.

## System Architecture

### Technology Stack

- **Frontend**: Next.js 16 (App Router), React Server Components, TypeScript, Tailwind CSS
- **Backend**: Next.js Route Handlers + Server Actions
- **Database**: Supabase (PostgreSQL) with Row Level Security
- **Authentication**: Supabase Auth (email/password, magic link, OAuth)
- **Deployment**: Vercel (Next.js) + Supabase Cloud
- **AI**: OpenAI API (server-side only)
- **Tool Management**: mise (polyglot tool version manager)

### Architecture Patterns

- **Server Components by Default**: Data fetching in Server Components
- **Service Layer**: Business logic in `lib/*/service.ts`
- **Data Access Layer**: Database queries in `lib/db/queries/*`
- **API Routes**: Thin route handlers, logic in services
- **Type Safety**: TypeScript strict mode, generated types from Supabase

## Database Schema

### Core Tables

#### profiles
User preferences and profile data.

```sql
- id (uuid, primary key)
- user_id (uuid, foreign key to auth.users)
- preferred_countries (text[])
- target_roles (text[])
- seniority_level (text)
- remote_preference (text)
- created_at (timestamptz)
- updated_at (timestamptz)
```

#### jobs
Ingested job postings.

```sql
- id (uuid, primary key)
- user_id (uuid, foreign key to auth.users)
- title (text, not null)
- company (text, not null)
- url (text)
- description (text)
- country (text, ISO country code)
- location (text)
- remote_type (text)
- salary_min (integer)
- salary_max (integer)
- currency (text, default 'USD')
- rank_score (numeric, AI-generated)
- status (text, default 'saved')
- ingested_at (timestamptz)
- created_at (timestamptz)
- updated_at (timestamptz)
```

#### artifacts
Generated CV versions, cover letters, message drafts.

```sql
- id (uuid, primary key)
- user_id (uuid, foreign key to auth.users)
- job_id (uuid, foreign key to jobs)
- type (text, 'cv' | 'cover_letter' | 'message')
- content (text, not null)
- version (text, default '1.0')
- model (text, AI model used)
- prompt_version (text)
- approved (boolean, default false)
- created_at (timestamptz)
- updated_at (timestamptz)
```

#### applications
Pipeline state linking jobs to applications.

```sql
- id (uuid, primary key)
- user_id (uuid, foreign key to auth.users)
- job_id (uuid, foreign key to jobs)
- status (text, 'saved' | 'applied' | 'interview' | 'offer' | 'rejected')
- applied_at (timestamptz)
- notes (text)
- created_at (timestamptz)
- updated_at (timestamptz)
```

#### audit_log
Audit trail for all important actions.

```sql
- id (uuid, primary key)
- user_id (uuid, foreign key to auth.users)
- action (text, not null)
- resource (text, not null)
- resource_id (uuid)
- metadata (jsonb)
- created_at (timestamptz)
```

### Indexes

- Foreign keys: `user_id`, `job_id` on all relevant tables
- Filter columns: `status`, `country`, `type`
- Sort columns: `rank_score`, `created_at`
- Composite indexes for common query patterns

### Row Level Security (RLS)

All user-owned tables have RLS enabled with policies:
- Users can only access their own records
- Service role key used server-side for admin operations
- Audit log: read-only for users, write-only for system

See [.cursor/rules/06-data-model.md](.cursor/rules/06-data-model.md) for detailed RLS policies.

## API Design

### RESTful Conventions

- **Base URL**: `/api`
- **Resources**: `/api/jobs`, `/api/applications`, `/api/artifacts`
- **Methods**: GET, POST, PUT, PATCH, DELETE
- **Response Format**: `{ data: T, meta?: {...} }` for success, `{ error: string, code?: string }` for errors

### Authentication

- JWT tokens from Supabase Auth
- Middleware validates JWT on protected routes
- Service role key used only server-side

### Rate Limiting

- API routes: 100 requests per minute per user
- AI generation endpoints: 10 requests per hour per user
- Implemented via middleware or Edge Functions

See [.cursor/rules/11-api-design.md](.cursor/rules/11-api-design.md) for detailed API conventions.

## AI Integration

### AI Client Architecture

- **Location**: `lib/ai/client.ts`
- **Server-Side Only**: All AI calls happen server-side
- **Providers**: OpenAI (primary), extensible to Anthropic, etc.
- **Prompt Management**: Templates in `lib/ai/prompts/*`
- **Versioning**: Prompt versions tracked and logged

### AI Features

1. **Job Ranking**: Analyze job description vs user profile, generate fit score
2. **CV Generation**: Tailor CV to specific job description
3. **Cover Letter Generation**: Generate personalized cover letters
4. **Message Drafting**: Draft outreach messages

### Output Validation

- All AI outputs validated against Zod schemas
- User approval required before use
- Audit logging for all AI generation events

See [.cursor/rules/07-ai-integration.md](.cursor/rules/07-ai-integration.md) for detailed AI rules.

## Security Architecture

### Authentication & Authorization

- **Supabase Auth**: Email/password, magic link, OAuth
- **Password Policy**: Min 8 chars, complexity requirements, leak detection
- **MFA**: Required for organization owners (future)
- **JWT Validation**: Proper claim validation in middleware

### Data Security

- **RLS**: All tables protected with Row Level Security
- **Service Role Key**: Server-side only, never exposed to client
- **Encryption**: Data encrypted at rest (Supabase default)
- **HTTPS**: All connections over TLS

### Secrets Management

- Environment variables for all secrets
- `.env.local` gitignored
- `.env.example` documents required variables
- No secrets in code or logs

See [.cursor/rules/05-security-and-compliance.md](.cursor/rules/05-security-and-compliance.md) for security guidelines.

## Development Workflow

### Local Development

1. Install mise for tool version management
2. Clone repository
3. Run `mise install` to set up tools
4. Install dependencies: `pnpm install`
5. Set up environment variables: copy `.env.example` to `.env.local`
6. Start local Supabase: `pnpm supabase start`
7. Run migrations: `pnpm supabase db reset`
8. Generate types: `pnpm supabase gen types typescript --local > lib/db/types.ts`
9. Start dev server: `pnpm dev`

### Migration Workflow

1. Create migration: `pnpm supabase migration new description`
2. Edit migration file in `supabase/migrations/`
3. Test locally: `pnpm supabase db reset`
4. Generate types after schema changes
5. Commit migration file
6. Deploy via CI/CD or manually

### Testing

- Unit tests for business logic
- Integration tests for API routes
- RLS policy tests
- Migration tests

See [.cursor/rules/04-testing-and-ci.md](.cursor/rules/04-testing-and-ci.md) for testing requirements.

## Deployment

### Environments

- **Development**: Local Supabase + local Next.js
- **Staging**: Supabase staging project + Vercel preview
- **Production**: Supabase production project + Vercel production

### CI/CD

- GitHub Actions for automated testing
- Migration validation in CI
- Type generation on schema changes
- Automated deployments to staging
- Manual approval for production

### Monitoring

- Error tracking (Sentry or similar)
- Performance monitoring
- Audit logs for compliance
- Database query performance

## Performance Considerations

### Caching Strategy

- Next.js Server Component caching
- Database query result caching where appropriate
- AI response caching (with user approval)

### Optimization

- Database indexes for common queries
- Pagination for large result sets
- Image optimization via Next.js Image
- Code splitting and lazy loading

See [.cursor/rules/12-performance.md](.cursor/rules/12-performance.md) for performance guidelines.

## Related Documentation

- See [VISION.md](VISION.md) for product vision
- See [README.md](README.md) for setup instructions
- See [.cursor/rules/](.cursor/rules/) for development conventions
- See [docs/SETUP.md](docs/SETUP.md) for complete setup guide
