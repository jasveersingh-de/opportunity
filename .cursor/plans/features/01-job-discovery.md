---
title: Feature Plan - AI-Powered Job Discovery
type: feature-plan
status: ready
phase: poc
tags: [job-discovery, ai, ranking, ingestion]
last-updated: 2024-01-15
---

# Feature: AI-Powered Job Discovery

## Vision Alignment

**Original Vision:** "AI-Powered Job Discovery: Users can discover job openings across multiple countries and platforms from one interface with semantic search and matching."

**Value Proposition:** Consolidate job discovery from multiple sources (LinkedIn, company websites, Xing, etc.) into a single interface with AI-powered matching and ranking.

**User Benefit:** Save time by not visiting multiple job boards, discover opportunities across regions, and get personalized job recommendations.

**Competitive Context:**
- **Teal**: Chrome extension for job tracking, limited discovery
- **LinkedIn**: Native job search, but fragmented across regions
- **Opportunity.ai Differentiator**: Unified multi-platform discovery with AI matching

## Development Phases

### Proof of Concept (POC) - Week 1-2

**Goal:** Validate core job ingestion and basic display

**Scope:**
- Manual job entry form
- Basic job list display
- Simple job card component
- Mock data storage

**Milestones:**
- **M1.1**: Job entry form (manual)
- **M1.2**: Job list UI
- **M1.3**: Job detail view

**Success Criteria:**
- User can manually add a job
- Jobs display in a list
- Basic job information visible

**Timeline:** 1-2 weeks

---

### MVP - Week 3-6

**Goal:** Production-ready job discovery with ingestion and basic AI ranking

**Scope:**
- Manual job entry
- CSV/JSON upload
- Job list with filters
- Basic AI ranking (fit score)
- Job detail page

**Milestones:**
- **M2.1**: Enhanced job entry (manual + file upload)
- **M2.2**: Job list with filters (country, role, remote)
- **M2.3**: AI ranking integration
- **M2.4**: Job detail and actions

**Success Criteria:**
- User can ingest jobs via multiple methods
- Jobs are ranked by AI fit score
- Filters work correctly
- All data persists to database

**Timeline:** 4 weeks

---

### Full Product - Week 7+

**Goal:** Advanced discovery with multi-platform integration

**Scope:**
- LinkedIn OAuth integration
- Official API integrations (where available)
- Semantic search
- Job recommendations
- Multi-platform aggregation

**Milestones:**
- **M3.1**: LinkedIn OAuth and profile import
- **M3.2**: Official API integrations
- **M3.3**: Semantic search implementation
- **M3.4**: Job recommendations engine

**Success Criteria:**
- Multiple platforms integrated
- Semantic search functional
- Personalized recommendations
- Multi-country support

**Timeline:** Ongoing

## Implementation Details

### POC Implementation

**Tech Stack:**
- Next.js App Router
- React Server Components
- Mock data (in-memory)
- Basic UI components

**Key Components:**
- `JobEntryForm` - Manual entry
- `JobList` - Display jobs
- `JobCard` - Individual job display

### MVP Implementation

**Tech Stack:**
- Supabase for data persistence
- File upload handling
- AI ranking service
- Filter state management

**Key Components:**
- `JobEntryForm` - Enhanced with file upload
- `JobList` - With filters and sorting
- `JobFilters` - Country, role, remote filters
- `JobRankingService` - AI ranking integration

### Full Product Implementation

**Tech Stack:**
- LinkedIn OAuth
- External API integrations
- Vector search (for semantic matching)
- Recommendation engine

## Related Documentation

- **Implementation Plan**: [../implementation/ui-prototype.md](../implementation/ui-prototype.md)
- **ADR**: [../adr/003-linkedin-integration.md](../adr/003-linkedin-integration.md)
- **Patterns**: [../patterns/service-patterns.md](../patterns/service-patterns.md)
