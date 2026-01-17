# Opportunity.ai

Opportunity.ai is an AI-assisted job search and application management platform designed to streamline every step of a tech professional's job hunt. Our core purpose is to help users discover relevant jobs across multiple countries, tailor their applications (CVs, cover letters) to each opportunity, and track their job pipeline – all in one compliant, efficient workflow.

## Overview

The platform acts as a "job search copilot," combining job aggregation, AI-driven personalization, and organizational tools so candidates can focus on landing the right role rather than juggling dozens of tabs and documents.

### Core Features

- **Job Ingestion**: Paste job URLs, upload job lists (CSV/JSON), or manually enter job details
- **AI-Powered Ranking**: Jobs ranked by fit score based on user profile and preferences
- **Tailored Application Materials**: Generate customized CVs, cover letters, and outreach messages
- **Pipeline Tracking**: Track application status from saved to applied, interview, offer, or rejected
- **Outreach Assistance**: Draft personalized messages with AI assistance

## Tech Stack

- **Frontend**: Next.js 16 (React Server Components), TypeScript, Tailwind CSS
- **Backend**: Next.js Route Handlers + Server Actions
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel
- **AI**: OpenAI API (server-side)
- **Tool Management**: mise (polyglot tool version manager)

## Project Status

**Current Phase**: Foundation Setup

- ✅ Cursor rules and agent configuration
- ✅ Database schema and migrations
- ✅ Supabase setup and configuration
- ✅ Documentation and guides
- ⏳ Next: Initialize Next.js application
- ⏳ Next: Implement core features

See [VISION.md](VISION.md) for product vision and roadmap.

## Prerequisites

- [mise](https://mise.jdx.dev) - Tool version manager (replaces nvm, asdf, etc.)
- [Supabase account](https://supabase.com) - For database and authentication
- [Supabase CLI](https://supabase.com/docs/reference/cli) - For local development
- OpenAI API key - For AI features
- Node.js and pnpm (managed via mise)

## Development Setup

### 1. Install mise

mise manages all tool versions automatically. Install it first:

```bash
# Install mise
curl https://mise.run | sh

# Or using Homebrew (macOS)
brew install mise
```

### 2. Clone the Repository

```bash
git clone https://github.com/jasveersingh-de/opportunity.git
cd opportunity
```

### 3. Tool Version Setup

mise automatically sets up the correct tool versions when you enter the project directory:

```bash
# Enter project directory (mise activates automatically)
cd opportunity.ai

# Verify tool versions are set up
mise ls

# Check versions
node --version
pnpm --version
```

If tools aren't installed, run:
```bash
mise install
```

### 4. Install Dependencies

```bash
pnpm install
```

### 5. Complete Setup

**See [docs/SETUP.md](docs/SETUP.md) for complete setup instructions**, including:
- Account creation (Supabase, LinkedIn, OpenAI)
- Automated setup scripts
- OAuth configuration
- Environment management

**Quick start:**
```bash
# Run setup script (after creating accounts)
./scripts/setup.sh

# Start development
pnpm dev
```

## Repository Structure

```
opportunity.ai/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication routes
│   ├── (dashboard)/       # Dashboard routes
│   │   ├── jobs/         # Job management
│   │   └── applications/  # Application tracking
│   └── api/               # API route handlers
├── components/            # React components
│   ├── ui/               # Reusable UI primitives
│   ├── features/         # Feature-specific components
│   └── layout/           # Layout components
├── lib/                   # Library and helper functions
│   ├── db/               # Database access layer
│   ├── jobs/             # Job service logic
│   ├── ai/               # AI client and prompts
│   └── adapters/         # External service adapters
├── supabase/             # Supabase migrations and config
│   └── migrations/       # Database migration files
├── public/               # Static assets
├── docs/                 # Additional documentation
├── .cursor/              # Cursor IDE rules
│   └── rules/           # Agent rules and conventions
├── .mise.toml            # mise tool version configuration
├── AGENTS.md             # Subagent definitions
└── README.md             # This file
```

## Development Workflow

### Running Commands

All commands assume mise has set up the correct tool versions:

```bash
# Development
pnpm dev              # Start dev server
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

### Code Quality

Before committing, ensure:
- `pnpm lint` passes
- `pnpm typecheck` passes
- Tests pass (if applicable)

See [.cursor/rules/00-operating-system.md](.cursor/rules/00-operating-system.md) for detailed development guidelines.

## Contributing

We welcome contributions! Please:

1. Read the [Vision document](VISION.md) to understand product goals
2. Check [.cursor/rules/](.cursor/rules/) for coding standards and conventions
3. Follow the git workflow in [.cursor/rules/09-git-workflow.md](.cursor/rules/09-git-workflow.md)
4. Use the appropriate PR template when creating pull requests:
   - Default: `.github/pull_request_template.md`
   - Feature: `.github/PULL_REQUEST_TEMPLATE/feature.md`
   - Bug fix: `.github/PULL_REQUEST_TEMPLATE/bugfix.md`
   - Database: `.github/PULL_REQUEST_TEMPLATE/database.md`
   - Documentation: `.github/PULL_REQUEST_TEMPLATE/documentation.md`
5. Ensure all checks pass before submitting PRs

### Commit Message Format

Use conventional commit format:

```
feat: add job ranking with AI scoring
fix: correct RLS policy for jobs table
docs: update API documentation
```

See [.cursor/rules/09-git-workflow.md](.cursor/rules/09-git-workflow.md) for details.

## Documentation

### Core Documentation

- **Vision**: See [VISION.md](VISION.md) for product vision and goals
- **Tech Spec**: See [TECH-SPEC.md](TECH-SPEC.md) for detailed technical design
- **Cursor Rules**: See [.cursor/rules/](.cursor/rules/) for development conventions
- **Subagents**: See [AGENTS.md](AGENTS.md) for agent responsibilities

### Setup

- **Complete Setup Guide**: See [docs/SETUP.md](docs/SETUP.md) for account creation, configuration, and automation

### Supabase Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase CLI Reference](https://supabase.com/docs/reference/cli)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Supabase Database Security](https://supabase.com/docs/guides/database/secure-data)

## Security & Privacy

- **Never commit secrets or API keys** - Use `.env.local` (gitignored)
- **All AI operations happen server-side only** - Never expose API keys to client
- **User data is protected with Row Level Security (RLS)** - All tables have RLS enabled
- **Service role key is server-side only** - Never expose to browser
- **Password policies enforced** - Strong passwords required
- **Audit logging** - All important actions are logged

See [.cursor/rules/05-security-and-compliance.md](.cursor/rules/05-security-and-compliance.md) for security guidelines.
See [.cursor/rules/13-supabase-security.md](.cursor/rules/13-supabase-security.md) for Supabase-specific security patterns.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Production Status

**Current Phase:** Foundation Setup  
**Production Ready:** ⚠️ Not yet - See [PRODUCTION-READINESS.md](PRODUCTION-READINESS.md) for detailed status

This repository contains the foundation, documentation, and planning for Opportunity.ai. Application code implementation is the next phase.

---

Opportunity.ai is at the intersection of career development and cutting-edge AI technology. We're excited to develop this in the open and build a tool that can genuinely help people advance their careers.
