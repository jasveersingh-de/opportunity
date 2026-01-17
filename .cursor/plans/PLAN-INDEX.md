---
title: Plan Index
type: index
status: active
last-updated: 2024-01-15
---

# Plan Index

Quick reference to all project plans organized by category.

## Master Plans

- **[PROJECT-PLAN.md](PROJECT-PLAN.md)** - Master execution plan with high-level milestones
- **[README.md](README.md)** - Plans directory overview and navigation

## Roadmaps

- **[roadmap/PRODUCT-ROADMAP.md](roadmap/PRODUCT-ROADMAP.md)** - Overall product roadmap (POC → MVP → Full Product)
  - **Status:** ✅ Complete
  - **Purpose:** High-level product development phases
  - **Timeline:** 17+ weeks

- **[roadmap/MVP-ROADMAP.md](roadmap/MVP-ROADMAP.md)** - MVP-specific roadmap
  - **Status:** ✅ Complete
  - **Purpose:** 12-week MVP timeline and scope
  - **Timeline:** 12 weeks

## Feature Plans

Feature-specific plans with POC → MVP → Full Product phases and milestones:

- **[features/01-job-discovery.md](features/01-job-discovery.md)** - AI-powered job discovery
  - **Status:** 🟡 Ready to start
  - **POC:** Manual entry, basic list (1-2 weeks)
  - **MVP:** File upload, AI ranking, filters (4 weeks)
  - **Full:** Multi-platform, semantic search (ongoing)

- **[features/02-application-materials.md](features/02-application-materials.md)** - CV, cover letter, outreach generation
  - **Status:** 🟡 Ready to start
  - **POC:** Basic CV/cover letter generation (1-2 weeks)
  - **MVP:** Full generation with Outreach Draft Generator (4 weeks)
  - **Full:** Resume comparison, learning from edits (ongoing)

- **[features/03-pipeline-tracking.md](features/03-pipeline-tracking.md)** - Personal ATS/CRM pipeline
  - **Status:** 🟡 Ready to start
  - **POC:** Basic status tracking (1-2 weeks)
  - **MVP:** Full pipeline with dashboard (4 weeks)
  - **Full:** AI follow-ups, interview prep (ongoing)

- **[features/04-personalized-insights.md](features/04-personalized-insights.md)** - Skill gap, career insights
  - **Status:** ⚪ Pending (Phase 2)
  - **POC:** Resume scoring (1-2 weeks)
  - **MVP:** Skill gap analysis, recommendations (4 weeks)
  - **Full:** Career paths, salary insights (ongoing)

- **[features/05-privacy-compliance.md](features/05-privacy-compliance.md)** - GDPR, data control
  - **Status:** 🟡 In progress
  - **POC:** Basic export/deletion (1 week)
  - **MVP:** Full GDPR compliance (3 weeks)
  - **Full:** Advanced privacy features (ongoing)

## Architecture Decision Records (ADRs)

- **[adr/001-ui-first-approach.md](adr/001-ui-first-approach.md)** - UI-first development decision
- **[adr/002-clean-architecture.md](adr/002-clean-architecture.md)** - Clean architecture with progressive enhancement
- **[adr/003-linkedin-integration.md](adr/003-linkedin-integration.md)** - LinkedIn integration strategy
- **[adr/004-ai-prompt-strategy.md](adr/004-ai-prompt-strategy.md)** - AI prompt versioning strategy

## Implementation Patterns

- **[patterns/component-patterns.md](patterns/component-patterns.md)** - Component patterns (presentation, container, server)
- **[patterns/service-patterns.md](patterns/service-patterns.md)** - Service layer patterns
- **[patterns/ai-integration-patterns.md](patterns/ai-integration-patterns.md)** - AI integration patterns

## Implementation Plans

- **[implementation/ui-prototype.md](implementation/ui-prototype.md)** - UI prototype detailed implementation
  - **Status:** 🟡 Ready to start
  - **Purpose:** Step-by-step UI prototype implementation
  - **Timeline:** 6 weeks

- **implementation/backend-integration.md** - Backend integration (to be created)
- **implementation/ai-features.md** - AI features implementation (to be created)


## Plan Status Legend

- 🟢 **Complete** - All tasks finished
- 🟡 **In Progress / Ready** - Currently working on or ready to start
- ⚪ **Pending** - Not started yet
- 🔴 **Blocked** - Waiting on dependencies

## Quick Navigation

**Starting development?**
→ See [roadmap/MVP-ROADMAP.md](roadmap/MVP-ROADMAP.md) for MVP timeline

**Working on a feature?**
→ See [features/](features/) for feature plans with POC/MVP/milestones

**Need architecture context?**
→ See [adr/](adr/) for architecture decisions

**Looking for code patterns?**
→ See [patterns/](patterns/) for implementation patterns

**Detailed implementation?**
→ See [implementation/](implementation/) for step-by-step guides

## Related Documentation

- **Product Vision**: [VISION.md](../../VISION.md)
- **Technical Spec**: [TECH-SPEC.md](../../TECH-SPEC.md)
- **Development Rules**: [.cursor/rules/](../rules/)
- **Setup Guide**: [docs/SETUP.md](../../docs/SETUP.md)
