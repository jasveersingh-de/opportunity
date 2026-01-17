# AI Integration Patterns

## Overview

Patterns for integrating AI services (OpenAI) for job ranking, CV generation, cover letters, and outreach messages.

## AI Client Pattern

### Pattern: AI Client Singleton

**Structure:**
```typescript
// lib/ai/client.ts
import OpenAI from 'openai';

class AIClient {
  private client: OpenAI;
  
  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  
  async generateText(prompt: string, options: GenerateOptions): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: options.model || 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: options.temperature || 0.7,
    });
    
    return response.choices[0].message.content || '';
  }
}

export const aiClient = new AIClient();
```

## Prompt Template Pattern

### Pattern: Versioned Prompt Templates

**Structure:**
```typescript
// lib/ai/prompts/cv-generation.ts
export const PROMPT_VERSIONS = {
  'cv-generation': '1.0',
} as const;

export function generateCVPrompt(
  userProfile: UserProfile,
  jobDescription: string
): string {
  return `
You are a professional resume writer. Generate a tailored CV for the following job:

Job Description:
${jobDescription}

User Profile:
${JSON.stringify(userProfile, null, 2)}

Requirements:
- Highlight relevant skills and experience
- Match keywords from job description
- Keep professional tone
- Format as markdown

Generate the CV:
  `.trim();
}
```

## AI Service Pattern

### Pattern: AI Service with Validation

**Structure:**
```typescript
// lib/services/ai/cv-generation.service.ts
import { aiClient } from '@/lib/ai/client';
import { generateCVPrompt, PROMPT_VERSIONS } from '@/lib/ai/prompts/cv-generation';
import { AuditLogger } from '@/lib/audit/logger';
import { z } from 'zod';

const CVSchema = z.object({
  content: z.string(),
  sections: z.array(z.string()),
});

export class CVGenerationService {
  constructor(private audit: AuditLogger = new AuditLogger()) {}
  
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
    
    // Validate output
    const validated = CVSchema.parse({ content, sections: extractSections(content) });
    
    // Audit log
    await this.audit.log({
      userId,
      action: 'generate_cv',
      metadata: {
        prompt_version: PROMPT_VERSIONS['cv-generation'],
        model: 'gpt-4',
      },
    });
    
    return validated.content;
  }
}
```

## Related Documentation

- [Component Patterns](./component-patterns.md)
- [Service Patterns](./service-patterns.md)
- [AI Integration Rules](../../rules/07-ai-integration.md)
