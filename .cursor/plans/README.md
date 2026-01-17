# Opportunity.ai Product Development Plans

This directory contains all planning documents organized for product development, from proof of concept through MVP to full product.

## Structure

```
.cursor/plans/
├── README.md                    # This file - overview and navigation
├── PLAN-INDEX.md                # Index of all plans
├── PROJECT-PLAN.md              # Master execution plan with milestones
│
├── roadmap/                     # High-level product roadmap
│   ├── PRODUCT-ROADMAP.md      # Overall product roadmap (POC → MVP → Full Product)
│   └── MVP-ROADMAP.md          # MVP-specific roadmap and timeline
│
├── features/                     # Feature-specific plans (POC → MVP → Full)
│   ├── 01-job-discovery.md
│   ├── 02-application-materials.md
│   ├── 03-pipeline-tracking.md
│   ├── 04-personalized-insights.md
│   └── 05-privacy-compliance.md
│
├── adr/                         # Architecture Decision Records
│   ├── 001-ui-first-approach.md
│   ├── 002-clean-architecture.md
│   ├── 003-linkedin-integration.md
│   └── 004-ai-prompt-strategy.md
│
├── patterns/                    # Implementation patterns library
│   ├── component-patterns.md
│   ├── service-patterns.md
│   └── ai-integration-patterns.md
│
├── implementation/              # Detailed implementation plans
│   ├── ui-prototype.md
│   ├── backend-integration.md
│   └── ai-features.md
│
└── archive/                     # Historical documents
    └── [archived files]
```

## Quick Navigation

**Starting development?**
→ See [roadmap/MVP-ROADMAP.md](roadmap/MVP-ROADMAP.md) for MVP timeline

**Working on a feature?**
→ See [features/](features/) for feature-specific plans with POC/MVP/milestones

**Need architecture context?**
→ See [adr/](adr/) for architecture decisions

**Looking for code patterns?**
→ See [patterns/](patterns/) for implementation patterns

**Detailed implementation?**
→ See [implementation/](implementation/) for step-by-step guides

**Complete index?**
→ See [PLAN-INDEX.md](PLAN-INDEX.md) for all plans

## Plan Structure: POC → MVP → Full Product

Each feature plan follows this structure:

### Proof of Concept (POC)
- **Goal**: Validate core concept and user value
- **Scope**: Minimal viable implementation
- **Timeline**: 1-2 weeks
- **Success Criteria**: Core functionality works, user can test value

### MVP (Minimum Viable Product)
- **Goal**: Production-ready feature for initial users
- **Scope**: Full feature with polish and error handling
- **Timeline**: 2-4 weeks
- **Success Criteria**: Feature complete, tested, documented, deployed

### Full Product
- **Goal**: Enhanced feature with advanced capabilities
- **Scope**: Additional features, optimizations, integrations
- **Timeline**: Ongoing
- **Success Criteria**: Feature meets full product vision

## Vision Alignment

All plans align with the original [Opportunity.ai Vision PDF](file://Opportunity.ai%20Vision.pdf) and current [VISION.md](../../VISION.md).

**Key Features from Vision:**
1. AI-Powered Job Discovery
2. Tailored Application Documents (Outreach Draft Generator)
3. Job Application Tracking (Personal ATS/CRM)
4. Personalized Insights (Resume scoring, skill gaps)
5. User Control & Privacy (GDPR compliant)

## Related Documentation

- **Product Vision**: [VISION.md](../../VISION.md)
- **Technical Spec**: [TECH-SPEC.md](../../TECH-SPEC.md)
- **Development Rules**: [.cursor/rules/](../rules/)
- **Setup Guide**: [docs/SETUP.md](../../docs/SETUP.md)
