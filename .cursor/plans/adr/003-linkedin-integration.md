# ADR-003: LinkedIn Integration Strategy

**Status:** Accepted  
**Date:** 2024-01-15  
**Context:** Need to integrate with LinkedIn for profile data and job discovery while respecting ToS and compliance requirements.

## Decision

Use LinkedIn OAuth for authentication and profile import. Use official APIs only (no scraping). Support multiple platforms (Xing, etc.) through provider-agnostic architecture.

## Rationale

1. **Compliance**: Respect LinkedIn ToS, avoid legal issues
2. **Reliability**: Official APIs are more stable than scraping
3. **User Trust**: Transparent, official integrations build trust
4. **Scalability**: Provider-agnostic architecture supports multiple platforms
5. **Future-Proof**: Can add new platforms without major changes

## Implementation Strategy

### Phase 1: LinkedIn OAuth (MVP)
- OAuth authentication
- Profile data import
- Basic job search (if API available)

### Phase 2: Multi-Platform Support
- Provider abstraction layer
- Add Xing support
- Add other platforms as needed

## Consequences

**Positive:**
- ✅ Compliant with ToS
- ✅ Reliable integration
- ✅ User trust
- ✅ Scalable architecture

**Negative:**
- ⚠️  Limited by API availability
- ⚠️  May not have all desired features via API
- ⚠️  Requires API key management

**Mitigation:**
- Use manual entry as fallback
- Design for multiple providers from start
- Clear user communication about limitations

## Alternatives Considered

### Web Scraping
- **Rejected**: Violates ToS, unreliable, legal risk
- **Why**: Not compliant, can break, legal issues

### LinkedIn Only
- **Rejected**: Limits user base, especially in DACH region (Xing)
- **Why**: Need multi-platform support for global reach

## Vision Alignment

Original vision emphasizes:
- **Compliance First**: "Respect platform ToS, no unauthorized scraping"
- **Multi-Country Focus**: Need multiple platforms for global reach
- **User Trust**: Official integrations build trust

## Implementation

See [feature plan: Job Discovery](../features/01-job-discovery.md) for detailed implementation.

## Related ADRs

- [ADR-004: AI Prompt Strategy](./004-ai-prompt-strategy.md) - AI features that use profile data

## References

- [LinkedIn ToS](https://www.linkedin.com/legal/user-agreement)
- [Supabase Auth OAuth](https://supabase.com/docs/guides/auth/social-login)
