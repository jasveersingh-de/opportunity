---
title: Project Plan - Opportunity.ai MVP
type: master-plan
status: active
phase: mvp
tags: [mvp, execution-plan, milestones]
last-updated: 2024-01-15
---

# Project Plan: Opportunity.ai MVP

Incremental execution plan to build the MVP, organized into testable milestones with POC/MVP distinctions.

## Vision Alignment

This plan implements the core MVP features from the [original Opportunity.ai Vision PDF](file://Opportunity.ai%20Vision.pdf):

- **AI-Powered Job Discovery**: Multi-country job aggregation with AI matching
- **Tailored Application Materials**: CV, cover letter, and outreach draft generation
- **Job Application Tracking**: Personal ATS/CRM pipeline tracker
- **User Control & Privacy**: GDPR compliant, user-controlled data

**Competitive Context:** Unified platform vs. fragmented tools (Teal, AIApply, spreadsheets).

## Current Status

**Completed:**
- ✅ Foundation: Cursor rules, database schema, migrations, Supabase config
- ✅ Documentation: VISION, TECH-SPEC, SETUP guide
- ✅ Security: RLS policies, security rules
- ✅ CI/CD: GitHub Actions workflow
- ✅ Project planning: Restructured plans folder with POC/MVP/milestones

**Next:** Phase 1 - UI Prototype (Weeks 1-6)

**See detailed plans:**
- [Product Roadmap](roadmap/PRODUCT-ROADMAP.md) - Overall product roadmap
- [MVP Roadmap](roadmap/MVP-ROADMAP.md) - MVP-specific roadmap
- [Feature Plans](features/) - Feature-specific plans with POC/MVP
- [Implementation Plans](implementation/) - Step-by-step implementation guides

## Development Approach: UI-First

This project follows a **UI-first development approach**:

1. **Phase 1: UI Prototype** - Build complete UI with mock data and services
2. **Phase 2: Backend Integration** - Connect UI to Supabase backend
3. **Phase 3: AI Features** - Integrate AI services with real implementations
4. **Phase 4: Polish & Launch** - Testing, optimization, and deployment

**Benefits:**
- Faster feedback on UX and design
- Parallel development of UI and backend
- Easier to iterate on user experience
- Clean architecture separation from the start

**See detailed plans:**
- [PLAN-INDEX.md](PLAN-INDEX.md) - Index of all plans
- [roadmap/MVP-ROADMAP.md](roadmap/MVP-ROADMAP.md) - MVP roadmap and scope
- [features/](features/) - Feature plans with POC/MVP/milestones
- [implementation/ui-prototype.md](implementation/ui-prototype.md) - UI prototype implementation

---

## Phase 1: UI Prototype (Weeks 1-6)

**Goal:** Build complete UI prototype with clean architecture, mock data, and all MVP features

**Detailed Plan:** See [implementation/ui-prototype.md](implementation/ui-prototype.md)

**Feature Plans:** See [features/](features/) for POC/MVP breakdown of each feature

**Approach:** Build UI components first with mock services, then add service layer progressively. No backend integration yet.

---

### Milestone 1: Foundation UI (Week 1)

**Goal:** Working Next.js app with authentication

### 1.1 Design System Setup
- [ ] Run `pnpm create next-app@latest .`
- [ ] Install core dependencies (shadcn/ui)
- [ ] Set up TypeScript configuration
- [ ] Configure Tailwind CSS
- [ ] Create design tokens (colors, typography, spacing)
- [ ] Create base UI primitives (Button, Input, Card, Badge)

### 1.2 Layout Components
- [ ] DashboardLayout (with Header, Sidebar)
- [ ] AuthLayout (for login page)
- [ ] Navigation components (Sidebar, Header menu)
- [ ] Responsive breakpoints

### 1.3 Authentication UI (Mock)
- [ ] Login page UI (LinkedIn button - mock for now)
- [ ] Auth callback page UI
- [ ] Loading states
- [ ] Error states
- [ ] Mock auth service (returns mock user)

**Definition of Done:**
- Design system set up with shadcn/ui
- Layout components created and responsive
- Login page UI complete (mock authentication)
- Dashboard layout structure in place
- All UI components follow clean architecture (presentation layer)

**Estimated Time:** 1 week

**Note:** Authentication is UI-only with mock service. Real auth integration happens in Phase 2.

---

### Milestone 2: Job Management UI (Week 2)

**Goal:** Complete job ingestion and management UI

### 2.1 Job List UI
- [ ] JobCard component (presentation)
- [ ] JobList component (presentation)
- [ ] Empty states
- [ ] Loading skeletons

### 2.2 Job Forms
- [ ] JobEntryForm (manual entry)
- [ ] FileUpload component (CSV/JSON)
- [ ] Form validation UI
- [ ] Success/error feedback

### 2.3 Job Detail UI
- [ ] JobDetail page layout
- [ ] Job information display
- [ ] Action buttons (edit, delete, create application)
- [ ] Related artifacts list

### 2.4 Mock Job Service
- [ ] Create mock job service (in-memory data)
- [ ] Mock job CRUD operations
- [ ] Service layer pattern established

**Definition of Done:**
- All job UI components created
- Mock job service handles CRUD operations
- Job list, detail, and forms work with mock data
- Service layer pattern implemented

**Estimated Time:** 1 week

**Note:** Uses mock data. Real database integration happens in Phase 2.

---

### Milestone 3: Pipeline & Applications UI (Week 3)

**Goal:** Application pipeline tracking UI

### 3.1 Pipeline View
- [ ] Kanban board component (or list view)
- [ ] Status columns (Saved, Applied, Interview, Offer, Rejected)
- [ ] Drag-and-drop (optional, or click-based)
- [ ] Application cards

### 3.2 Application Detail
- [ ] Application detail page
- [ ] Status update UI
- [ ] Notes editor
- [ ] Timeline/history view

### 3.3 Dashboard Overview
- [ ] Stats cards component
- [ ] Recent activity feed
- [ ] Quick actions panel

### 3.4 Mock Application Service
- [ ] Create mock application service
- [ ] Mock application CRUD operations

**Definition of Done:**
- Pipeline UI complete with all status columns
- Application detail page functional
- Dashboard overview shows stats
- Mock services handle all operations

**Estimated Time:** 1 week

---

### Milestone 4: AI Features UI (Week 4-5)

**Goal:** AI generation interfaces (UI only, mock AI responses)

### 4.1 Ranking UI
- [ ] Rank button/action
- [ ] Ranking progress indicator
- [ ] Rank score display (badge, visual)
- [ ] Sort by rank
- [ ] Mock ranking service (returns random scores)

### 4.2 CV Generation UI
- [ ] Generate CV button
- [ ] CV preview component
- [ ] Approve/reject actions
- [ ] Version comparison
- [ ] Download button
- [ ] Mock CV generation service

### 4.3 Cover Letter UI
- [ ] Generate cover letter button
- [ ] Cover letter editor/preview
- [ ] Approve/reject
- [ ] Download
- [ ] Mock cover letter service

### 4.4 Message Drafting UI
- [ ] Draft message button
- [ ] Message editor
- [ ] Message type selector
- [ ] Copy to clipboard
- [ ] Mock message service

**Definition of Done:**
- All AI feature UIs complete
- Mock services return sample data
- User can interact with all AI features
- UI handles loading, success, and error states

**Estimated Time:** 2 weeks

**Note:** Uses mock AI responses. Real AI integration happens in Phase 3.

---

### Milestone 5: Enhanced Features UI (Week 6)

**Goal:** Advanced filtering, search, organization UI

### 5.1 Advanced Filters
- [ ] Filter components (country, role, seniority, remote, salary)
- [ ] Filter state management
- [ ] URL-based filter persistence
- [ ] Clear filters action

### 5.2 Search UI
- [ ] Search input component
- [ ] Search results highlighting
- [ ] Search suggestions (optional)

### 5.3 Organization UI
- [ ] Tags/labels component
- [ ] Bulk actions UI
- [ ] Custom lists/collections

### 5.4 Profile & Settings UI
- [ ] Profile form component (countries, roles, seniority, remote preference)
- [ ] Settings page layout
- [ ] Form validation UI
- [ ] Success/error feedback

**Definition of Done:**
- All enhanced features UI complete
- Filters, search, and organization work with mock data
- Profile/settings UI functional
- All UI components polished and accessible

**Estimated Time:** 1 week

---

## Phase 2: Backend Integration (Weeks 7-8)

**Goal:** Connect UI prototype to Supabase backend, replace mock services with real implementations

---

### Milestone 6: Backend Foundation (Week 7)

**Goal:** Set up backend infrastructure and connect to Supabase

### 6.1 Next.js Application Setup
- [ ] Initialize Next.js app (if not done)
- [ ] Install Supabase dependencies
- [ ] Set up TypeScript configuration
- [ ] Configure environment variables

### 6.2 Supabase Integration
- [ ] Create Supabase client utilities (client, server-client, admin)
- [ ] Generate TypeScript types from schema
- [ ] Set up environment validation
- [ ] Test database connection

### 6.3 Authentication Infrastructure
- [ ] Create middleware for route protection
- [ ] Implement auth callback handler
- [ ] Set up LinkedIn OAuth in Supabase
- [ ] Replace mock auth with real Supabase auth
- [ ] Connect login page to real authentication

**Definition of Done:**
- Supabase client configured and tested
- Real authentication working (LinkedIn OAuth)
- User can sign in and session persists
- Protected routes require authentication
- Types generated from database schema

**Estimated Time:** 1 week

---

### Milestone 7: Data Layer Integration (Week 8)

**Goal:** Replace mock services with real database operations

### 7.1 Profile Service Integration
- [ ] Create profile on first login (server action)
- [ ] Replace mock profile service with real queries
- [ ] Connect profile UI to database
- [ ] Test RLS policies

### 7.2 Job Service Integration
- [ ] Replace mock job service with real queries
- [ ] Connect job CRUD to database
- [ ] Implement job ingestion (manual, CSV, JSON)
- [ ] Test RLS policies and audit logging

### 7.3 Application Service Integration
- [ ] Replace mock application service with real queries
- [ ] Connect application CRUD to database
- [ ] Test pipeline operations
- [ ] Verify audit logging

**Definition of Done:**
- All mock services replaced with real database operations
- Profile, jobs, and applications persist to database
- RLS policies enforced
- Audit logging working
- UI fully functional with real data

**Estimated Time:** 1 week

---

## Phase 3: AI Features Integration (Weeks 9-10)

**Goal:** Integrate real AI services, replace mock AI responses with OpenAI API

---

### Milestone 8: AI Services Integration (Week 9)

**Goal:** Set up AI client and integrate job ranking

### 8.1 AI Client Setup
- [ ] Create OpenAI client module
- [ ] Prompt template for job ranking
- [ ] Rate limiting implementation
- [ ] Error handling and retries

### 8.2 Ranking Service Integration
- [ ] Replace mock ranking with real AI service
- [ ] Ranking algorithm (job description vs user profile)
- [ ] Generate rank_score (0-100)
- [ ] Store score in jobs table
- [ ] Batch ranking for multiple jobs

### 8.3 Connect Ranking UI
- [ ] Connect "Rank Jobs" button to real service
- [ ] Real-time ranking progress
- [ ] Display actual rank scores
- [ ] Error handling for AI failures

**Definition of Done:**
- Real AI ranking working
- Jobs ranked by AI based on user profile
- Scores displayed and sortable in UI
- Ranking logged to audit_log
- Error handling for AI failures

**Estimated Time:** 1 week

---

### Milestone 9: AI Generation Features (Week 10)

**Goal:** Integrate CV, cover letter, and message generation

### 9.1 CV Generation Service
- [ ] Replace mock CV service with real AI service
- [ ] Prompt template for CV tailoring
- [ ] AI service to generate CV content
- [ ] Store CV in artifacts table
- [ ] Version management (v1.0, v1.1, etc.)

### 9.2 Cover Letter Service
- [ ] Replace mock cover letter service with real AI service
- [ ] Prompt template for cover letters
- [ ] AI service to generate cover letter
- [ ] Store in artifacts table

### 9.3 Message Service
- [ ] Replace mock message service with real AI service
- [ ] Prompt template for outreach messages
- [ ] AI service to generate message
- [ ] Support different message types

**Definition of Done:**
- All AI generation features use real OpenAI API
- CVs, cover letters, and messages generated by AI
- All artifacts stored in database
- User can approve, reject, and regenerate
- Error handling for AI failures

**Estimated Time:** 1 week

---

## Phase 4: Polish & Launch (Week 11)

**Goal:** Production-ready MVP with comprehensive testing and optimization

---

### Milestone 10: Polish & Testing (Week 11)

**Goal:** Production-ready MVP

### 10.1 Error Handling
- [ ] Comprehensive error boundaries
- [ ] User-friendly error messages
- [ ] Error logging to audit_log
- [ ] Retry mechanisms for AI calls

### 10.2 Performance
- [ ] Optimize database queries
- [ ] Add loading states
- [ ] Implement pagination
- [ ] Cache frequently accessed data

### 10.3 Testing
- [ ] Unit tests for services
- [ ] Integration tests for API routes
- [ ] RLS policy tests
- [ ] E2E tests for critical flows

### 10.4 Documentation
- [ ] Update README with features
- [ ] API documentation
- [ ] User guide (optional)

**Definition of Done:**
- All features tested
- Error handling comprehensive
- Performance acceptable
- Documentation complete

**Estimated Time:** 3-4 days

---

## Execution Strategy

### Incremental Development

**Each milestone:**
1. Implement feature
2. Test locally
3. Commit with conventional commits
4. Verify Definition of Done
5. Move to next milestone

### Testing Strategy

- **After each milestone:** Run `pnpm typecheck && pnpm lint && pnpm test`
- **Before merging:** All checks pass
- **Manual testing:** Test user flows end-to-end

### Deployment Strategy

- **Local:** Test all features locally first
- **Staging:** Deploy to staging after Milestone 5 (Pipeline Tracking)
- **Production:** Deploy after Milestone 10 (Polish & Testing)

---

## Success Criteria

**MVP Complete When:**
- [ ] User can sign in with LinkedIn
- [ ] User can add jobs (manual, CSV, JSON)
- [ ] Jobs are ranked by AI (fit score 0-100)
- [ ] User can generate CVs tailored to jobs
- [ ] User can generate cover letters tailored to jobs
- [ ] **Outreach Draft Generator** works (email/LinkedIn messages)
- [ ] User can track application pipeline (all status stages)
- [ ] User can view dashboard with stats
- [ ] All features have error handling
- [ ] All features have basic tests
- [ ] Application is deployable

---

## Timeline Estimate

**Total:** 11 weeks for MVP

### Phase 1: UI Prototype (Weeks 1-6)
- Week 1: Foundation UI + Layout
- Week 2: Job Management UI
- Week 3: Pipeline UI
- Week 4-5: AI Features UI
- Week 6: Enhanced Features UI

### Phase 2: Backend Integration (Weeks 7-8)
- Week 7: Backend Foundation + Auth
- Week 8: Data Layer Integration

### Phase 3: AI Features (Weeks 9-10)
- Week 9: AI Services Integration (Ranking)
- Week 10: AI Generation Features

### Phase 4: Polish & Launch (Week 11)
- Week 11: Testing, Optimization, Documentation

**Note:** Timeline is flexible. Focus on quality over speed. UI-first approach allows for faster iteration and better UX.

---

## Next Steps

1. **Start Phase 1, Milestone 1:** Foundation UI - Design system and layout components
2. **Follow UI Prototype Plan:** See [.cursor/plans/ui-prototype-plan.md](.cursor/plans/ui-prototype-plan.md) for detailed implementation
3. **Follow Definition of Done:** Each feature must meet criteria
4. **Commit incrementally:** Small, reviewable commits
5. **Test continuously:** Don't accumulate technical debt

## Related Documentation

- **Plan Index:** [PLAN-INDEX.md](PLAN-INDEX.md) - Quick reference to all plans
- **MVP Roadmap:** [roadmap/MVP-ROADMAP.md](roadmap/MVP-ROADMAP.md) - MVP scope and timeline
- **Implementation Plans:** [implementation/](implementation/) - Step-by-step guides
- **Development Rules:** [.cursor/rules/](../rules/) - Cursor rules for development
- **Setup Guide:** [docs/SETUP.md](../../docs/SETUP.md) - Development environment setup
