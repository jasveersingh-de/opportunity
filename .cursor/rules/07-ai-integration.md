---
description: Rules for AI prompts, outputs, and safety guardrails
globs: "lib/ai/**"
alwaysApply: true
---

# AI Integration Rules

## AI Client Architecture

### Server-Side Only

**All AI calls must happen server-side only:**

```typescript
// lib/ai/client.ts
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Server-side only
});

export const aiClient = {
  async generateCV(params: {
    jobDescription: string;
    userProfile: UserProfile;
    promptVersion: string;
  }): Promise<{ content: string; model: string; version: string }> {
    const prompt = await getPrompt('cv-generation', params.promptVersion);
    // ... AI call
  },
};
```

**Never expose API keys to the client.** All AI operations must go through API routes or Server Actions.

## Prompt Management

### Prompt Storage

**Store prompts as templates in `lib/ai/prompts/`:**

```
lib/
  ai/
    prompts/
      cv-generation.ts
      cover-letter.ts
      ranking.ts
      message-draft.ts
```

### Prompt Template Structure

**Prompts must specify: role, inputs, output schema, constraints:**

```typescript
// lib/ai/prompts/cv-generation.ts
export const cvGenerationPrompt = {
  version: '1.0',
  template: `
You are a professional CV writer specializing in tailoring resumes for specific job applications.

## Task
Generate a tailored CV version for the following job posting.

## Job Description
{jobDescription}

## User Profile
- Target Roles: {targetRoles}
- Experience Level: {seniorityLevel}
- Key Skills: {keySkills}

## Requirements
1. Highlight relevant experience that matches the job requirements
2. Use keywords from the job description naturally
3. Keep the CV concise (2 pages maximum)
4. Use professional, action-oriented language
5. Do not make up experience or qualifications

## Output Format
Return a well-formatted CV in markdown format with the following sections:
- Professional Summary
- Work Experience
- Education
- Skills

## Constraints
- Do not include personal contact information (use placeholders)
- Do not claim skills or experience not mentioned in the user profile
- Be honest about qualifications
  `,
  
  variables: ['jobDescription', 'targetRoles', 'seniorityLevel', 'keySkills'],
  
  outputSchema: {
    type: 'object',
    properties: {
      content: { type: 'string' },
      sections: {
        type: 'array',
        items: { type: 'string' },
      },
    },
    required: ['content'],
  },
};
```

### Prompt Versioning

**Version all prompts and track usage:**

```typescript
// lib/ai/prompts/index.ts
export const PROMPT_VERSIONS = {
  'cv-generation': '1.0',
  'cover-letter': '1.0',
  'ranking': '1.0',
} as const;

export async function getPrompt(
  promptType: keyof typeof PROMPT_VERSIONS,
  version?: string
) {
  const promptVersion = version || PROMPT_VERSIONS[promptType];
  // Load prompt template
}
```

**Store prompt version in audit logs** (see [05-security-and-compliance.md](05-security-and-compliance.md)).

## Output Validation

### Schema Validation

**AI outputs must be validated against a schema:**

```typescript
// lib/ai/validation.ts
import { z } from 'zod';

export const cvOutputSchema = z.object({
  content: z.string().min(100).max(10000),
  sections: z.array(z.string()).optional(),
});

export function validateAIOutput<T>(
  output: unknown,
  schema: z.ZodSchema<T>
): T {
  const result = schema.safeParse(output);
  if (!result.success) {
    throw new Error(`AI output validation failed: ${result.error.message}`);
  }
  return result.data;
}
```

### Usage Example

```typescript
// lib/ai/client.ts
import { validateAIOutput, cvOutputSchema } from './validation';

export async function generateCV(params: GenerateCVParams) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.7, // Lower for structured outputs
    response_format: { type: 'json_object' }, // If using structured output
  });
  
  const rawOutput = JSON.parse(response.choices[0].message.content || '{}');
  const validated = validateAIOutput(rawOutput, cvOutputSchema);
  
  return validated;
}
```

## Deterministic Outputs

### Temperature Settings

**Keep outputs deterministic where possible:**

- **Structured outputs** (JSON): `temperature: 0.0` to `0.3`
- **Creative content** (cover letters): `temperature: 0.7` to `0.9`
- **Ranking/scoring**: `temperature: 0.0` to `0.2`

```typescript
// lib/ai/client.ts
const TEMPERATURE = {
  structured: 0.2,
  creative: 0.7,
  ranking: 0.0,
} as const;

export async function generateRanking(jobs: Job[]) {
  return openai.chat.completions.create({
    model: 'gpt-4',
    temperature: TEMPERATURE.ranking, // Deterministic
    // ...
  });
}
```

## Human-in-the-Loop

### Approval Workflow

**AI can suggest edits and drafts; user must approve before export/use:**

```typescript
// lib/artifacts/service.ts
export async function generateCVForJob(
  userId: string,
  jobId: string
): Promise<Artifact> {
  // Generate CV
  const cvContent = await aiClient.generateCV({...});
  
  // Store as draft (not approved)
  const artifact = await db.artifacts.create({
    user_id: userId,
    job_id: jobId,
    type: 'cv',
    content: cvContent.content,
    approved: false, // User must approve
    version: '1.0',
    model: 'gpt-4',
    prompt_version: PROMPT_VERSIONS['cv-generation'],
  });
  
  return artifact;
}

// User approves
export async function approveArtifact(artifactId: string) {
  await db.artifacts.update(artifactId, { approved: true });
}
```

### Fact-Checking Disclaimer

**Never claim that content is fact-checked unless you actually verified it:**

```typescript
// UI component
<Alert>
  <AlertTitle>Review Required</AlertTitle>
  <AlertDescription>
    This content was generated by AI. Please review and verify all information
    before using it. AI may make mistakes or include inaccurate information.
  </AlertDescription>
</Alert>
```

## Traceability

### Audit Logging

**Store prompt version + model identifier + timestamp in audit logs:**

```typescript
// lib/artifacts/service.ts
import { logAction } from '@/lib/audit/log';

export async function generateCVForJob(userId: string, jobId: string) {
  const startTime = Date.now();
  const cvContent = await aiClient.generateCV({...});
  const duration = Date.now() - startTime;
  
  // Log AI generation event
  await logAction({
    userId,
    action: 'generate_cv',
    resource: 'cv',
    resourceId: artifact.id,
    metadata: {
      job_id: jobId,
      model: 'gpt-4',
      prompt_version: PROMPT_VERSIONS['cv-generation'],
      duration_ms: duration,
      token_count: cvContent.usage?.total_tokens,
      // No sensitive content
    },
  });
}
```

## Error Handling

### AI Service Errors

**Handle AI service failures gracefully:**

```typescript
// lib/ai/client.ts
export async function generateCV(params: GenerateCVParams) {
  try {
    const response = await openai.chat.completions.create({...});
    return response;
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      // Handle API errors
      if (error.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }
      if (error.status === 401) {
        throw new Error('AI service authentication failed.');
      }
    }
    throw new Error('Failed to generate CV. Please try again.');
  }
}
```

## Testing AI Integration

### Mock AI Client

**Mock AI client for tests:**

```typescript
// tests/mocks/ai-client.ts
import { vi } from 'vitest';

export const mockAIClient = {
  generateCV: vi.fn().mockResolvedValue({
    content: 'Mock CV content',
    sections: ['Summary', 'Experience', 'Education'],
  }),
  generateCoverLetter: vi.fn(),
  rankJobs: vi.fn(),
};

vi.mock('@/lib/ai/client', () => ({
  aiClient: mockAIClient,
}));
```

### Snapshot Testing

**Use snapshot tests for prompt outputs (when deterministic):**

```typescript
// tests/ai/prompts.test.ts
import { generatePrompt } from '@/lib/ai/prompts/cv-generation';

describe('CV Generation Prompt', () => {
  it('should generate consistent prompt', () => {
    const prompt = generatePrompt({
      jobDescription: 'Test job',
      targetRoles: ['Software Engineer'],
      // ...
    });
    expect(prompt).toMatchSnapshot();
  });
});
```

## Related Rules

- See [02-architecture.md](02-architecture.md) for AI client architecture
- See [05-security-and-compliance.md](05-security-and-compliance.md) for audit logging
- See [10-error-handling.md](10-error-handling.md) for error handling patterns
