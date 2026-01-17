# Feature: Job Application Pipeline Tracking

## Vision Alignment

**Original Vision:** "Job Application Tracking: Opportunity.ai includes a built-in pipeline tracker (inspired by the concept of a personal ATS or CRM for job seekers). When a user decides to apply to a job, they can add it to their pipeline and move it through stages such as 'Applied,' 'Interviewing,' 'Offer,' etc."

**Value Proposition:** Replace ad-hoc spreadsheets with a centralized pipeline tracker that ensures no application falls through the cracks.

**User Benefit:** Stay organized, track all applications in one place, get reminders, and never miss a follow-up.

**Competitive Context:**
- **Teal**: Chrome extension with basic tracking
- **Spreadsheets**: Manual, error-prone
- **Opportunity.ai Differentiator**: Integrated with job discovery and AI features, automated reminders

## Development Phases

### Proof of Concept (POC) - Week 1-2

**Goal:** Validate pipeline concept and basic tracking

**Scope:**
- Create application from job
- Basic status tracking (Saved, Applied, Rejected)
- Simple list view
- Mock data storage

**Milestones:**
- **M1.1**: Application creation from job
- **M1.2**: Status update UI
- **M1.3**: Basic pipeline list view

**Success Criteria:**
- User can create application from job
- User can update status
- Applications display in list

**Timeline:** 1-2 weeks

---

### MVP - Week 3-6

**Goal:** Production-ready pipeline with full status tracking and dashboard

**Scope:**
- Full status pipeline (Saved, Applied, Interview, Offer, Rejected)
- Pipeline view (Kanban or list)
- Application detail page
- Notes and timeline
- Basic dashboard with stats
- Follow-up reminders (basic)

**Milestones:**
- **M2.1**: Full status pipeline implementation
- **M2.2**: Pipeline view (Kanban/list)
- **M2.3**: Application detail with notes
- **M2.4**: Dashboard with stats
- **M2.5**: Basic reminder system

**Success Criteria:**
- All status stages functional
- Pipeline view is intuitive
- Dashboard shows useful stats
- Reminders work

**Timeline:** 4 weeks

---

### Full Product - Week 7+

**Goal:** Advanced pipeline with AI assistance

**Scope:**
- AI-generated follow-up email drafts
- Interview prep tips (AI-generated)
- Advanced analytics
- Calendar integration
- Automated reminders with AI suggestions

**Milestones:**
- **M3.1**: AI follow-up email generation
- **M3.2**: Interview prep tips
- **M3.3**: Advanced analytics dashboard
- **M3.4**: Calendar integration
- **M3.5**: Smart reminder system

**Success Criteria:**
- AI assistance functional
- Analytics provide insights
- Calendar sync works
- Reminders are helpful

**Timeline:** Ongoing

## Implementation Details

### POC Implementation

**Key Components:**
- `ApplicationForm` - Create from job
- `StatusSelector` - Update status
- `ApplicationList` - Basic list view

### MVP Implementation

**Key Components:**
- `PipelineView` - Kanban/list view
- `ApplicationDetail` - Full detail page
- `DashboardStats` - Stats cards
- `ReminderSystem` - Basic reminders
- `ApplicationTimeline` - Status history

### Full Product Implementation

**Advanced Features:**
- AI follow-up generator
- Interview prep AI
- Analytics engine
- Calendar sync
- Smart reminders

## Related Documentation

- **Implementation Plan**: [../implementation/ui-prototype.md](../implementation/ui-prototype.md)
- **Patterns**: [../patterns/component-patterns.md](../patterns/component-patterns.md)
