# AI Features Implementation Plan

## Vision Alignment

This plan implements the AI-powered features from the [original Opportunity.ai Vision PDF](file://Opportunity.ai%20Vision.pdf):

- **AI-Powered Job Ranking**: "Personalized 'fit score,' indicating how well a role aligns with the user's profile"
- **CV Generation**: "Generate or suggest improvements to resumes... targeted to the specific job description"
- **Cover Letter Generation**: "AI-drafted cover letter... targeted to the specific job description"
- **Outreach Draft Generator**: "Outreach Draft Generator can produce a polite, personalized email or cover letter"

**Competitive Context:**
- **Jobscan/ResyMatch**: Resume-to-job matching (comparison only)
- **AIApply.com**: Automated resume/cover letter creation
- **Opportunity.ai Differentiator**: Unified platform with ranking + generation + tracking

## Architecture Decision

**ADR Reference:** [ADR-004: AI Prompt Strategy](../adr/004-ai-prompt-strategy.md)

**Key Principles:**
- Version all prompts
- Validate all outputs
- Require user approval
- Log all AI operations

## Overview

Implement AI features for job ranking, CV generation, cover letter generation, and outreach message drafting using OpenAI API.

## Phase 1: AI Client Setup (Week 1)

**Goal:** Set up AI client infrastructure

### 1.1 OpenAI Client
- [ ] Create OpenAI client module
- [ ] Set up API key management
- [ ] Implement rate limiting
- [ ] Add error handling and retries
- [ ] Create prompt template structure

### 1.2 Prompt Management
- [ ] Create prompt versioning system
- [ ] Set up prompt templates directory
- [ ] Document prompt structure
- [ ] Create prompt testing utilities

**Success Criteria:**
- AI client is configured
- Prompts are versioned
- Rate limiting works
- Error handling is robust

---

## Phase 2: Job Ranking (Week 2)

**Goal:** Implement AI-powered job ranking

### 2.1 Ranking Algorithm
- [ ] Create job ranking prompt template
- [ ] Implement ranking service
- [ ] Generate fit score (0-100)
- [ ] Store score in jobs table
- [ ] Support batch ranking

### 2.2 Ranking UI Integration
- [ ] Connect "Rank Jobs" button to service
- [ ] Show ranking progress
- [ ] Display rank scores
- [ ] Enable sorting by rank
- [ ] Add visual indicators

**Success Criteria:**
- Jobs are ranked by AI
- Scores are accurate and useful
- UI displays scores clearly
- Ranking is logged

---

## Phase 3: Material Generation (Weeks 3-5)

**Goal:** Implement CV, cover letter, and outreach generation

### 3.1 CV Generation
- [ ] Create CV generation prompt template
- [ ] Implement CV generation service
- [ ] Support versioning
- [ ] Store in artifacts table
- [ ] Connect to UI

### 3.2 Cover Letter Generation
- [ ] Create cover letter prompt template
- [ ] Implement cover letter service
- [ ] Store in artifacts table
- [ ] Connect to UI

### 3.3 Outreach Draft Generator
- [ ] Create outreach message prompt template
- [ ] Support multiple message types (email, LinkedIn)
- [ ] Implement outreach service
- [ ] Store in artifacts table
- [ ] Connect to UI

**Success Criteria:**
- All three material types generatable
- Outputs are validated
- User approval workflow works
- Versions are tracked

---

## Implementation Patterns

### AI Service Pattern

```typescript
// lib/services/ai/cv-generation.service.ts
import { aiClient } from '@/lib/ai/client';
import { generateCVPrompt, PROMPT_VERSIONS } from '@/lib/ai/prompts/cv-generation';

export class CVGenerationService {
  async generateCV(
    userProfile: UserProfile,
    jobDescription: string,
    userId: string
  ): Promise<string> {
    const prompt = generateCVPrompt(userProfile, jobDescription);
    
    const content = await aiClient.generateText(prompt, {
      model: 'gpt-4',
      temperature: 0.7,
    });
    
    // Validate and log
    await this.audit.log({
      userId,
      action: 'generate_cv',
      metadata: {
        prompt_version: PROMPT_VERSIONS['cv-generation'],
        model: 'gpt-4',
      },
    });
    
    return content;
  }
}
```

## Related Documentation

- **Feature Plans**: 
  - [../features/02-application-materials.md](../features/02-application-materials.md) - Application materials feature
  - [../features/01-job-discovery.md](../features/01-job-discovery.md) - Job discovery with ranking
- **ADR**: [../adr/004-ai-prompt-strategy.md](../adr/004-ai-prompt-strategy.md) - Prompt strategy
- **Patterns**: [../patterns/ai-integration-patterns.md](../patterns/ai-integration-patterns.md) - AI patterns
- **Rules**: [../../rules/07-ai-integration.md](../../rules/07-ai-integration.md) - AI integration rules
