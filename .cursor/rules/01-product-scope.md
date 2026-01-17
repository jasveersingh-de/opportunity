---
description: Product scope and explicit out-of-scope boundaries
globs: "**/*"
alwaysApply: true
---

# Product Scope (PoC)

## Goal

Speed up multi-country job search with a compliant, human-in-the-loop workflow:
**ingest jobs → rank → generate tailored materials → track pipeline → assist outreach**.

## Core Features

### 1. Job Ingestion
- User pastes job URLs + job description text
- User uploads exported job lists (CSV/JSON)
- Manual entry of job details
- **Status**: Track ingestion source and timestamp

### 2. Job Ranking
- AI-powered ranking based on user profile/preferences
- Filterable by: country, role, seniority, remote/hybrid, salary range
- **Status**: Ranked jobs with confidence scores

### 3. Material Generation
- Generate tailored CV versions per job
- Generate cover letters
- Generate outreach message drafts
- **Status**: All generated content requires user approval before use

### 4. Pipeline Tracking
- Track application status: Saved, Applied, Interview, Offer, Rejected
- View by status, date, country, role
- **Status**: Full CRUD for application records

### 5. Outreach Assistance
- Draft personalized messages
- Track outreach attempts
- **Status**: User must initiate all external communications

## Hard Boundaries (Never Build)

### ❌ Prohibited Features

- **LinkedIn scraping behind login**: Do NOT build automated LinkedIn scraping that requires authentication
- **Auto-apply bots**: Do NOT build bots that automatically submit job applications
- **Bypass protections**: Do NOT bypass paywalls, CAPTCHAs, rate limits, or platform protections
- **Unauthorized integrations**: Do NOT build integrations with platforms that don't officially support them

### ✅ Allowed Ingestion Approaches

- User pastes job URLs + job description text
- User uploads exported job lists (CSV/JSON)
- Integrations only when officially supported/approved (e.g., official APIs with proper authentication)
- Manual entry via UI

### ✅ Human-in-the-Loop Requirements

- All "apply" actions must be initiated by the user
- All generated content (CVs, cover letters, messages) must be reviewed and approved by the user
- AI can suggest and draft, but user must approve before export/use
- Never claim content is fact-checked unless actually verified

## Definition of Done for Each Feature

Every feature must have:

- [ ] **UI path**: User can access the feature through the interface
- [ ] **API path** (if needed): Backend endpoint or server action exists
- [ ] **Basic tests**: Unit tests or integration tests, or at minimum typechecked + linted
- [ ] **Documentation**: Doc note in README or `/docs` explaining the feature
- [ ] **Error handling**: Graceful error messages for common failure cases
- [ ] **User feedback**: Loading states, success/error notifications

## Feature Checklist

When implementing a new feature, verify:

- [ ] Follows product scope boundaries
- [ ] Has clear user value proposition
- [ ] Includes user approval step for any external action
- [ ] Respects platform ToS and rate limits
- [ ] Has audit logging for important actions
- [ ] Has basic error handling
- [ ] Has documentation

## Related Rules

- See [02-architecture.md](02-architecture.md) for system architecture
- See [07-ai-integration.md](07-ai-integration.md) for AI generation rules
- See [05-security-and-compliance.md](05-security-and-compliance.md) for security boundaries
