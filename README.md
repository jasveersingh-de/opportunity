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

## Prerequisites

- [mise](https://mise.jdx.dev) - Tool version manager (replaces nvm, asdf, etc.)
- Supabase account (for database)
- OpenAI API key (for AI features)

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
git clone https://github.com/YourUsername/opportunity.ai.git
cd opportunity.ai
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

### 5. Configure Environment Variables

Create a copy of `.env.example` as `.env.local`:

```bash
cp .env.example .env.local
```

Then open `.env.local` and fill in the required keys:

- **Supabase URL and Anon Key**: From your Supabase project settings
- **Supabase Service Role Key**: For server-side operations (optional for dev)
- **OpenAI API Key**: For AI features

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...  # Server-side only
OPENAI_API_KEY=sk-...              # Server-side only
```

### 6. Run Database Migrations

If using Supabase CLI for local development:

```bash
# Start local Supabase
pnpm supabase start

# Apply migrations
pnpm supabase db reset

# Generate TypeScript types
pnpm supabase gen types typescript --local > lib/db/types.ts
```

### 7. Start the Development Server

```bash
pnpm dev
```

The app will be available at `http://localhost:3000`.

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
4. Ensure all checks pass before submitting PRs

### Commit Message Format

Use conventional commit format:

```
feat: add job ranking with AI scoring
fix: correct RLS policy for jobs table
docs: update API documentation
```

See [.cursor/rules/09-git-workflow.md](.cursor/rules/09-git-workflow.md) for details.

## Documentation

- **Vision**: See `VISION.md` for product vision and goals
- **Tech Spec**: See `TECH-SPEC.md` for detailed technical design
- **Cursor Rules**: See [.cursor/rules/](.cursor/rules/) for development conventions
- **Subagents**: See [AGENTS.md](AGENTS.md) for agent responsibilities

## Security & Privacy

- Never commit secrets or API keys
- All AI operations happen server-side only
- User data is protected with Row Level Security (RLS)
- See [.cursor/rules/05-security-and-compliance.md](.cursor/rules/05-security-and-compliance.md) for security guidelines

## License

[Specify your license here]

---

Opportunity.ai is at the intersection of career development and cutting-edge AI technology. We're excited to develop this in the open and build a tool that can genuinely help people advance their careers.
