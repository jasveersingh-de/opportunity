# Opportunity.ai Product Development Plans

This directory contains all planning documents organized for product development, from proof of concept through MVP to full product.

## Structure

```
.cursor/plans/
├── README.md                    # This file - overview and navigation
│
├── roadmap/                    # High-level product roadmap
│   ├── PRODUCT-ROADMAP.md     # Overall product roadmap (POC → MVP → Full Product)
│   └── MVP-ROADMAP.md         # MVP-specific roadmap and timeline
│
├── features/                    # Feature-specific plans (POC → MVP → Full)
│   ├── 01-job-discovery.md    # AI-powered job discovery feature
│   ├── 02-application-materials.md # CV, cover letter, outreach generation
│   ├── 03-pipeline-tracking.md # Personal ATS/CRM pipeline
│   ├── 04-personalized-insights.md # Skill gap, career insights
│   └── 05-privacy-compliance.md # GDPR, data control
│
├── adr/                        # Architecture Decision Records
│   ├── 001-ui-first-approach.md
│   ├── 002-clean-architecture.md
│   ├── 003-linkedin-integration.md
│   └── 004-ai-prompt-strategy.md
│
├── patterns/                   # Implementation patterns library
│   ├── component-patterns.md
│   ├── service-patterns.md
│   └── ai-integration-patterns.md
│
└── implementation/             # Detailed implementation plans
    ├── ui-prototype.md        # UI prototype implementation
    ├── backend-integration.md # Backend integration plan
    └── ai-features.md         # AI features implementation
```

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

## Milestones

Each feature plan includes milestones:
- **Milestone 1**: Foundation/Setup
- **Milestone 2**: Core Implementation
- **Milestone 3**: Integration & Polish
- **Milestone 4**: Advanced Features (Full Product)

## Quick Navigation

**Starting development?**
→ See [roadmap/PRODUCT-ROADMAP.md](roadmap/PRODUCT-ROADMAP.md) for overall direction

**Working on a feature?**
→ See [features/](features/) for feature-specific plans with POC/MVP/milestones

**Need architecture context?**
→ See [adr/](adr/) for architecture decisions

**Looking for code patterns?**
→ See [patterns/](patterns/) for implementation patterns

**Detailed implementation?**
→ See [implementation/](implementation/) for step-by-step guides

## Vision Alignment

All plans align with the original [Opportunity.ai Vision PDF](file://Opportunity.ai%20Vision.pdf) and current [VISION.md](../../VISION.md).

**Key Features from Vision:**
1. AI-Powered Job Discovery
2. Tailored Application Documents (Outreach Draft Generator)
3. Job Application Tracking (Personal ATS/CRM)
4. Personalized Insights (Resume scoring, skill gaps)
5. User Control & Privacy (GDPR compliant)

## Plan Management

**When Starting a Feature:**
1. Review feature plan in `features/`
2. Check POC/MVP scope
3. Review milestones
4. Reference ADRs for architecture decisions
5. Use patterns from `patterns/`

**When Completing Milestones:**
1. Mark milestone complete in feature plan
2. Update roadmap status
3. Document learnings in ADRs if needed
4. Commit plan updates with code

**When Creating New Plans:**
1. Use feature plan template
2. Include POC/MVP distinction
3. Define clear milestones
4. Add vision alignment section
5. Update this README

## Documentation Navigation

**Quick Navigation:**
- [DOCUMENTATION-NAVIGATION.md](DOCUMENTATION-NAVIGATION.md) - Comprehensive navigation guide

**Start Here:**
- [README.md](../../README.md) - Project overview
- [VISION.md](../../VISION.md) - Product vision
- [roadmap/MVP-ROADMAP.md](roadmap/MVP-ROADMAP.md) - MVP roadmap

**Feature Development:**
- [features/](features/) - Feature plans with POC/MVP/milestones
- [implementation/](implementation/) - Implementation guides
- [adr/](adr/) - Architecture decisions
- [patterns/](patterns/) - Code patterns

## Related Documentation

- **Product Vision**: [VISION.md](../../VISION.md)
- **Technical Spec**: [TECH-SPEC.md](../../TECH-SPEC.md)
- **Development Rules**: [.cursor/rules/](../rules/)
- **Setup Guide**: [docs/SETUP.md](../../docs/SETUP.md)
