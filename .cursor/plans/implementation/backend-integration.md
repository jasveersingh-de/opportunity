---
title: Implementation Plan - Backend Integration
type: implementation-plan
status: pending
phase: 2
tags: [backend, supabase, integration, database]
last-updated: 2024-01-15
---

# Backend Integration Implementation Plan

## Vision Alignment

This plan implements the backend integration phase, connecting the UI prototype to Supabase and enabling production-ready features from the [original Opportunity.ai Vision PDF](file://Opportunity.ai%20Vision.pdf).

**Key Features to Enable:**
- Real data persistence (jobs, applications, artifacts)
- LinkedIn OAuth authentication
- AI service integration
- Audit logging
- Production deployment

## Architecture Decision

**ADR Reference:** [ADR-001: UI-First Development Approach](../adr/001-ui-first-approach.md)

**Context:** This phase replaces mock services with real implementations while maintaining the same service interfaces.

## Overview

Connect UI prototype to Supabase backend, replace mock services with real database operations, and enable production-ready features.

## Phase 1: Backend Foundation (Week 1)

**Goal:** Set up Supabase integration and authentication

### 1.1 Supabase Client Setup
- [ ] Create Supabase client utilities (client, server-client, admin)
- [ ] Generate TypeScript types from schema
- [ ] Set up environment validation
- [ ] Test database connection

### 1.2 Authentication Integration
- [ ] Set up LinkedIn OAuth in Supabase dashboard
- [ ] Create middleware for route protection
- [ ] Implement auth callback handler
- [ ] Replace mock auth with real Supabase auth
- [ ] Test authentication flow

**Success Criteria:**
- User can sign in with LinkedIn
- Session persists across refreshes
- Protected routes require authentication
- Types are generated and up-to-date

---

## Phase 2: Data Layer Integration (Week 2)

**Goal:** Replace mock services with real database operations

### 2.1 Profile Service Integration
- [ ] Create profile on first login (server action)
- [ ] Replace mock profile service with real queries
- [ ] Connect profile UI to database
- [ ] Test RLS policies

### 2.2 Job Service Integration
- [ ] Replace mock job service with real queries
- [ ] Connect job CRUD to database
- [ ] Implement job ingestion (manual, CSV, JSON)
- [ ] Test RLS policies and audit logging

### 2.3 Application Service Integration
- [ ] Replace mock application service with real queries
- [ ] Connect application CRUD to database
- [ ] Test pipeline operations
- [ ] Verify audit logging

### 2.4 Artifact Service Integration
- [ ] Replace mock artifact service with real queries
- [ ] Connect artifact CRUD to database
- [ ] Test version management
- [ ] Verify RLS policies

**Success Criteria:**
- All mock services replaced with real database operations
- All data persists to Supabase
- RLS policies enforced
- Audit logging working
- UI fully functional with real data

---

## Implementation Patterns

### Service Replacement Pattern

**Before (Mock):**
```typescript
// lib/services/jobs/job.service.mock.ts
export class MockJobService {
  private jobs: Job[] = [];
  async createJob(data: CreateJobInput): Promise<Job> { ... }
}
```

**After (Real):**
```typescript
// lib/services/jobs/job.service.ts
export class JobService {
  constructor(private queries: JobQueries) {}
  async createJob(data: CreateJobInput, userId: string): Promise<Job> {
    // Real database operation
    return this.queries.create({ ...data, user_id: userId });
  }
}
```

**Migration Strategy:**
1. Keep same service interface
2. Replace implementation
3. Update dependency injection
4. Test thoroughly

## Related Documentation

- **Feature Plans**: [../features/](../features/) - Feature-specific plans
- **ADR**: [../adr/001-ui-first-approach.md](../adr/001-ui-first-approach.md) - UI-first decision
- **Patterns**: [../patterns/service-patterns.md](../patterns/service-patterns.md) - Service patterns
- **Rules**: [../../rules/14-supabase-integration.md](../../rules/14-supabase-integration.md) - Supabase integration rules
