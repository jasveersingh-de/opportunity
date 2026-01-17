---
title: MVP Roadmap - Opportunity.ai
type: roadmap
status: active
tags: [mvp, roadmap, timeline, 12-weeks]
last-updated: 2024-01-15
---

# MVP Roadmap: Opportunity.ai

## Overview

This roadmap focuses specifically on the MVP phase, detailing what needs to be built to launch the first version of Opportunity.ai.

## MVP Scope

**Goal:** Launch a production-ready MVP that delivers core value to tech professionals seeking international job opportunities.

**Timeline:** 12 weeks (3 months)

**Target Users:** Tech professionals (engineers, PMs, designers, data scientists) conducting multi-country job searches.

## MVP Features

### Core Features (Must Have)

1. **Job Discovery** (MVP)
   - Manual job entry
   - CSV/JSON upload
   - Job list with basic filters
   - Job detail view

2. **AI-Powered Ranking** (MVP)
   - AI ranking algorithm
   - Fit score (0-100)
   - Sortable by rank
   - Visual rank indicators

3. **Application Materials** (MVP)
   - CV generation (tailored to job)
   - Cover letter generation
   - **Outreach Draft Generator** (email/LinkedIn messages) - Key feature from original vision
   - Preview and approve workflow
   - Version management
   - Download (PDF/Markdown)

4. **Pipeline Tracking** (MVP)
   - Create application from job
   - Status tracking (Saved, Applied, Interview, Offer, Rejected)
   - Pipeline view (Kanban or list)
   - Application detail page
   - Basic dashboard with stats

5. **Authentication** (MVP)
   - LinkedIn OAuth
   - Profile import
   - Session management
   - Protected routes

### Enhanced Features (Should Have)

6. **Advanced Filtering**
   - Filter by country, role, seniority, remote type, salary
   - Combined filters
   - URL-based filter persistence

7. **Follow-up Reminders**
   - Basic reminder system
   - Application status updates

8. **Resume Scoring** (Basic)
   - Basic resume scoring
   - Simple feedback

## MVP Timeline

### Phase 1: Foundation (Weeks 1-2)
- Next.js app setup
- Design system
- Authentication (LinkedIn OAuth)
- Basic layout

### Phase 2: Core Features (Weeks 3-8)
- Job discovery (MVP)
- AI ranking (MVP)
- Application materials (MVP)
- Pipeline tracking (MVP)

### Phase 3: Polish (Weeks 9-10)
- Advanced filtering
- Follow-up reminders
- Resume scoring (basic)
- Dashboard enhancements

### Phase 4: Launch Prep (Weeks 11-12)
- Testing and bug fixes
- Performance optimization
- Documentation
- Deployment

## Success Criteria

**MVP Launch Ready When:**
- [ ] All core features functional
- [ ] User can complete full workflow (ingest → rank → generate → track)
- [ ] All features tested
- [ ] Performance acceptable
- [ ] Documentation complete
- [ ] Deployed to production

## Out of Scope for MVP

- Multi-platform integrations (Xing, etc.) - Phase 2
- Advanced skill gap analysis - Phase 2
- Interview prep tips - Phase 2
- Learning recommendations - Phase 2
- Advanced analytics - Phase 2

## Related Plans

- **Feature Plans**: [../features/](../features/) - Detailed POC/MVP plans for each feature
- **Implementation Plans**: [../implementation/](../implementation/) - Step-by-step implementation
- **Product Roadmap**: [PRODUCT-ROADMAP.md](PRODUCT-ROADMAP.md) - Full product roadmap
