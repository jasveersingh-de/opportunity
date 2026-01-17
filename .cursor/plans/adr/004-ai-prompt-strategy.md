# ADR-004: AI Prompt Strategy and Versioning

**Status:** Accepted  
**Date:** 2024-01-15  
**Context:** Need consistent, versioned AI prompts for CV generation, cover letters, and outreach messages. Prompts must be testable and traceable.

## Decision

Store prompts as versioned templates in `lib/ai/prompts/`. Track prompt versions in audit logs. Use structured output with Zod validation.

## Rationale

1. **Version Control**: Track prompt changes, rollback if needed
2. **Testability**: Can test prompts independently
3. **Traceability**: Know which prompt version generated content
4. **Consistency**: Same prompts across environments
5. **Compliance**: Audit trail for AI-generated content

## Implementation

### Prompt Storage
```
lib/ai/prompts/
├── cv-generation.ts
├── cover-letter.ts
├── outreach-message.ts
└── job-ranking.ts
```

### Version Tracking
```typescript
export const PROMPT_VERSIONS = {
  'cv-generation': '1.0',
  'cover-letter': '1.0',
  'outreach-message': '1.0',
  'job-ranking': '1.0',
} as const;
```

### Audit Logging
```typescript
await logAction({
  action: 'generate_cv',
  metadata: {
    prompt_version: PROMPT_VERSIONS['cv-generation'],
    model: 'gpt-4',
    job_id: job.id,
  },
});
```

## Consequences

**Positive:**
- ✅ Version control for prompts
- ✅ Can test and compare prompt versions
- ✅ Full audit trail
- ✅ Easy to update prompts

**Negative:**
- ⚠️  More structure initially
- ⚠️  Need to update versions when changing prompts

**Mitigation:**
- Version updates are explicit and tracked
- Testing ensures prompt changes work

## Alternatives Considered

### Hardcoded Prompts
- **Rejected**: No versioning, hard to test, no audit trail
- **Why**: Need versioning and traceability

### External Prompt Management
- **Rejected**: Over-engineering for MVP, adds complexity
- **Why**: Can manage in code for MVP, can migrate later if needed

## Vision Alignment

Original vision emphasizes:
- **Transparency**: "Clear about AI capabilities and limitations"
- **User Control**: "AI suggests and drafts; users always approve"
- **Traceability**: Need to know what AI generated and how

## Implementation

See [feature plan: Application Materials](../features/02-application-materials.md) for detailed implementation.

## Related ADRs

- [ADR-003: LinkedIn Integration](./003-linkedin-integration.md) - Profile data used in prompts

## References

- [AI Integration Rules](../../rules/07-ai-integration.md)
- [Prompt Versioner Subagent](../../AGENTS.md#prompt-versioner)
