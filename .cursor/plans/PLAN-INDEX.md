# Plan Index

Quick reference to all project plans and their purposes.

## Master Plan

- **[PROJECT-PLAN.md](PROJECT-PLAN.md)** - High-level milestones, timeline, and execution strategy for the MVP (this directory)

## Detailed Implementation Plans

### Active Plans

- **[ui-prototype-plan.md](ui-prototype-plan.md)** - UI prototype with clean architecture approach
  - **Status:** 🟡 Ready to start
  - **Purpose:** Build complete UI prototype following clean architecture principles
  - **Timeline:** 6 weeks
  - **Phases:** Foundation UI → Job Management → Pipeline → AI Features → Enhanced Features

### Future Plans

- **[backend-integration-plan.md](backend-integration-plan.md)** - Backend services integration (to be created)
  - **Purpose:** Connect UI prototype to Supabase backend
  - **Timeline:** 2 weeks (after UI prototype)

- **[ai-features-plan.md](ai-features-plan.md)** - AI features detailed plan (to be created)
  - **Purpose:** Detailed implementation of AI ranking, CV generation, cover letters
  - **Timeline:** 2 weeks (after backend integration)

## Analysis & Improvement Plans

### Review & Strategy Documents

- **[WORKSPACE-REVIEW.md](WORKSPACE-REVIEW.md)** - Comprehensive workspace review and documentation strategy
  - **Status:** ✅ Complete
  - **Purpose:** Analyze current state, identify gaps, recommend best practices
  - **Key Topics:** Plans as documentation, ADRs, patterns, searchability

- **[IMPROVEMENT-PLAN.md](IMPROVEMENT-PLAN.md)** - Workspace improvement plan aligned with original vision
  - **Status:** 🟡 Ready to implement
  - **Purpose:** Align workspace with original Opportunity.ai Vision PDF and enhance plans
  - **Key Topics:** Vision alignment, feature gaps, competitive context, documentation enhancement

## Plan Status Legend

- 🟢 **Complete** - All tasks finished
- 🟡 **In Progress** - Currently working on
- ⚪ **Pending** - Not started yet
- 🔴 **Blocked** - Waiting on dependencies

## How to Use Plans

### When Starting a New Phase

1. Open the relevant plan in this directory (`.cursor/plans/`)
2. Review tasks and dependencies
3. Update status in plan
4. Reference plan in Cursor chat

### When Completing Tasks

1. Mark tasks complete in plan
2. Update [PROJECT-PLAN.md](PROJECT-PLAN.md) milestone status
3. Update this index if needed
4. Commit plan updates with code changes

### When Creating New Plans

1. Create new plan in this directory (`.cursor/plans/`)
2. Add entry to this index
3. Reference in [PROJECT-PLAN.md](PROJECT-PLAN.md) if major phase
4. Update [.cursor/rules/00-operating-system.md](../rules/00-operating-system.md) if needed

## Plan References in Code

When working on features, reference plans in code comments:

```typescript
/**
 * Job Card Component
 * 
 * Part of UI Prototype Phase 2: Job Management UI
 * See: .cursor/plans/ui-prototype-plan.md#phase-2
 */
export function JobCard() { ... }
```

## Related Documentation

- See [PROJECT-PLAN.md](PROJECT-PLAN.md) for high-level milestones (this directory)
- See [.cursor/rules/00-operating-system.md](../rules/00-operating-system.md) for plan management workflow
- See [docs/SETUP.md](../../docs/SETUP.md) for development setup
