# Project Plan: Opportunity.ai MVP

Incremental execution plan to build the MVP, organized into testable milestones.

## Current Status

**Completed:**
- ✅ Foundation: Cursor rules, database schema, migrations, Supabase config
- ✅ Documentation: VISION, TECH-SPEC, SETUP guide
- ✅ Security: RLS policies, security rules
- ✅ CI/CD: GitHub Actions workflow

**Next:** Initialize Next.js app and build core features

---

## Milestone 1: Application Foundation (Week 1)

**Goal:** Working Next.js app with authentication

### 1.1 Initialize Next.js Application
- [ ] Run `pnpm create next-app@latest .`
- [ ] Install core dependencies (Supabase, shadcn/ui)
- [ ] Set up TypeScript configuration
- [ ] Configure Tailwind CSS
- [ ] Create project structure (app/, components/, lib/)

### 1.2 Supabase Integration
- [ ] Create Supabase client utilities (client, server-client, admin)
- [ ] Generate TypeScript types from schema
- [ ] Set up environment validation
- [ ] Test database connection

### 1.3 Authentication Infrastructure
- [ ] Create middleware for route protection
- [ ] Implement auth callback handler
- [ ] Set up LinkedIn OAuth in Supabase
- [ ] Create login page with LinkedIn button
- [ ] Create protected dashboard layout

**Definition of Done:**
- User can sign in with LinkedIn
- User is redirected to dashboard after login
- Protected routes require authentication
- Session persists across page refreshes

**Estimated Time:** 2-3 days

---

## Milestone 2: User Profile & Preferences (Week 1-2)

**Goal:** Users can set up their profile and preferences

### 2.1 Profile Creation
- [ ] Create profile on first login (server action)
- [ ] Profile setup page/form
- [ ] Update profile preferences
- [ ] Display profile in settings

### 2.2 Profile UI
- [ ] Profile form component (countries, roles, seniority, remote preference)
- [ ] Settings page layout
- [ ] Form validation with Zod
- [ ] Success/error feedback

**Definition of Done:**
- New users see profile setup after first login
- Users can update preferences
- Preferences saved to database
- RLS policies enforce user ownership

**Estimated Time:** 1-2 days

---

## Milestone 3: Job Ingestion (Week 2)

**Goal:** Users can add jobs to their list

### 3.1 Manual Job Entry
- [ ] Job entry form (title, company, description, URL, location, etc.)
- [ ] Server action to create job
- [ ] Job list display (basic table/cards)
- [ ] Job detail view

### 3.2 CSV/JSON Upload
- [ ] File upload component
- [ ] CSV parser (title, company, description, url, etc.)
- [ ] JSON parser
- [ ] Bulk job creation (server action)
- [ ] Upload progress/feedback

### 3.3 Job Management
- [ ] Edit job details
- [ ] Delete job
- [ ] Job list pagination
- [ ] Basic filtering (by status)

**Definition of Done:**
- User can manually add a job
- User can upload CSV/JSON with multiple jobs
- Jobs appear in job list
- User can edit/delete own jobs
- All actions logged to audit_log

**Estimated Time:** 2-3 days

---

## Milestone 4: AI-Powered Job Ranking (Week 3)

**Goal:** Jobs are ranked by AI based on user profile

### 4.1 AI Client Setup
- [ ] Create OpenAI client module
- [ ] Prompt template for job ranking
- [ ] Rate limiting implementation
- [ ] Error handling and retries

### 4.2 Ranking Service
- [ ] Ranking algorithm (job description vs user profile)
- [ ] Generate rank_score (0-100)
- [ ] Store score in jobs table
- [ ] Batch ranking for multiple jobs

### 4.3 Ranking UI
- [ ] "Rank Jobs" button/action
- [ ] Loading state during ranking
- [ ] Display rank_score in job list
- [ ] Sort by rank_score
- [ ] Visual indicator (badge/color)

**Definition of Done:**
- User can trigger job ranking
- AI analyzes job vs profile and generates score
- Scores displayed in UI
- Jobs sortable by rank
- Ranking logged to audit_log

**Estimated Time:** 2-3 days

---

## Milestone 5: Application Pipeline Tracking (Week 3-4)

**Goal:** Users can track application status

### 5.1 Application CRUD
- [ ] Create application from job (server action)
- [ ] Update application status
- [ ] Add notes to application
- [ ] Set applied_at timestamp
- [ ] Delete application

### 5.2 Pipeline UI
- [ ] Pipeline view (kanban or list by status)
- [ ] Status filters (Saved, Applied, Interview, Offer, Rejected)
- [ ] Application detail view
- [ ] Quick status update (dropdown/buttons)
- [ ] Application notes editor

### 5.3 Dashboard Overview
- [ ] Dashboard home page
- [ ] Stats cards (total jobs, applications, by status)
- [ ] Recent activity feed
- [ ] Quick actions

**Definition of Done:**
- User can create application from job
- User can update status through pipeline
- Applications grouped by status
- Dashboard shows overview stats
- All actions logged

**Estimated Time:** 2-3 days

---

## Milestone 6: CV Generation (Week 4-5)

**Goal:** Generate tailored CVs for specific jobs

### 6.1 CV Generation Service
- [ ] Prompt template for CV tailoring
- [ ] AI service to generate CV content
- [ ] Store CV in artifacts table
- [ ] Version management (v1.0, v1.1, etc.)

### 6.2 CV UI
- [ ] "Generate CV" button on job detail
- [ ] CV preview component
- [ ] Approve/reject CV
- [ ] Regenerate CV (creates new version)
- [ ] Download CV (PDF/Markdown)
- [ ] CV history/versions list

### 6.3 CV Management
- [ ] List all CVs for a job
- [ ] Compare CV versions
- [ ] Mark CV as approved
- [ ] Delete CV

**Definition of Done:**
- User can generate CV for a job
- AI creates tailored CV based on job description
- User can preview, approve, or regenerate
- CVs stored with version tracking
- User can download approved CVs

**Estimated Time:** 3-4 days

---

## Milestone 7: Cover Letter Generation (Week 5)

**Goal:** Generate tailored cover letters

### 7.1 Cover Letter Service
- [ ] Prompt template for cover letters
- [ ] AI service to generate cover letter
- [ ] Store in artifacts table
- [ ] Link to job and user

### 7.2 Cover Letter UI
- [ ] "Generate Cover Letter" button
- [ ] Cover letter preview/editor
- [ ] Approve/reject
- [ ] Regenerate
- [ ] Download (PDF/Markdown)

**Definition of Done:**
- User can generate cover letter for job
- AI creates personalized cover letter
- User can edit, approve, download
- Cover letters stored with audit trail

**Estimated Time:** 2 days

---

## Milestone 8: Message Drafting (Week 5-6)

**Goal:** Draft outreach messages

### 8.1 Message Service
- [ ] Prompt template for outreach messages
- [ ] AI service to generate message
- [ ] Store in artifacts table
- [ ] Support different message types (LinkedIn, email, etc.)

### 8.2 Message UI
- [ ] "Draft Message" button
- [ ] Message preview/editor
- [ ] Message type selector
- [ ] Copy to clipboard
- [ ] Mark as sent (manual)

**Definition of Done:**
- User can generate outreach message
- AI creates personalized message
- User can edit and copy message
- Messages tracked in artifacts

**Estimated Time:** 1-2 days

---

## Milestone 9: Enhanced Job Management (Week 6)

**Goal:** Better job discovery and organization

### 9.1 Advanced Filtering
- [ ] Filter by country
- [ ] Filter by role/seniority
- [ ] Filter by remote type
- [ ] Filter by salary range
- [ ] Filter by rank_score
- [ ] Combined filters

### 9.2 Job Search
- [ ] Search by title/company
- [ ] Search by description keywords
- [ ] Search results highlighting

### 9.3 Job Organization
- [ ] Tags/labels for jobs
- [ ] Custom job lists/collections
- [ ] Bulk actions (delete, update status)

**Definition of Done:**
- User can filter jobs by multiple criteria
- User can search jobs
- User can organize jobs with tags
- Filters persist in URL

**Estimated Time:** 2-3 days

---

## Milestone 10: Polish & Testing (Week 6-7)

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
- [ ] Jobs are ranked by AI
- [ ] User can generate CVs and cover letters
- [ ] User can track application pipeline
- [ ] User can draft outreach messages
- [ ] All features have error handling
- [ ] All features have basic tests
- [ ] Application is deployable

---

## Timeline Estimate

**Total:** 6-7 weeks for MVP

- Week 1: Foundation + Auth + Profile
- Week 2: Job Ingestion
- Week 3: Ranking + Pipeline
- Week 4: CV Generation
- Week 5: Cover Letter + Messages
- Week 6: Enhanced Features
- Week 7: Polish & Testing

**Note:** Timeline is flexible. Focus on quality over speed.

---

## Next Steps

1. **Start Milestone 1:** Initialize Next.js app
2. **Follow Definition of Done:** Each feature must meet criteria
3. **Commit incrementally:** Small, reviewable commits
4. **Test continuously:** Don't accumulate technical debt

See [docs/SETUP.md](docs/SETUP.md) to begin setup.
See [.cursor/rules/](.cursor/rules/) for development guidelines.
