# User Types Review

## Files Reviewed

- `docs/concepts/REQUIREMENTS.md`
- `docs/schemas/DICTIONARY.md`
- `docs/schemas/*.yaml`
- `docs/concepts/USER_TYPES.md`
- `ai-docs/20260802-1529-user-types-draft.md`

No braindump files were needed.

## Decisions

| User type | Decision | Rationale |
|---|---|---|
| Identified Person | Changed to **Person** | The requirements name this actor class “People.” The shorter name remains explicit because the access and distinctness fields state that authentication and identity are required. Wording was also adjusted to avoid implying that every OIDC or passwordless-email interaction must be conventionally interactive. |
| Bot | Kept | Bots are an explicit non-human actor class with token authentication and the same conversation-role model as people. |
| Conversation Owner | Kept | Ownership is an explicit conversation-scoped role with unique authority over other owners and a required continuity invariant. |
| Conversation Administrator | Kept | Administration is an explicit conversation-scoped role with substantial operating and moderation authority but no authority over owners. |
| Ordinary Member | Kept | Ordinary membership is the explicit non-management participation role for either a person or a bot. |

The summary was clarified to state that people and bots are actor classes while owner, administrator, and ordinary member are overlapping conversation-scoped roles, not five mutually exclusive categories.

## YAGNI Review

- No anonymous participant was added because anonymous participation is explicitly excluded.
- No public visitor was added because every documented product action, including discovery, is performed by an identified person or bot.
- No application-wide administrator, internal operator, dedicated moderator, reporter, or identity provider was added. The requirements do not define those as day-one users; moderation belongs to conversation owners and administrators, reporting is an ordinary participant activity, and authentication providers are supporting services.
- Former, removed, banned, and posting-suspended participants remain states of membership or permission rather than separate user types.

## Completeness Review

- The two authentication and profile models are covered by Person and Bot.
- All active conversation authority levels are covered by Conversation Owner, Conversation Administrator, and Ordinary Member.
- The document supports either actor class holding any active conversation role, as required.
- The schema-only `none` role is correctly treated as a retained ban state rather than an active user type.
- No abilities were added during this phase.

## Remaining Non-Blocking Ambiguities

- The requirements do not specify an unauthenticated product surface. If later product decisions introduce meaningful pre-authentication browsing or marketing behavior, a public visitor may need to be reconsidered.
- People and bots can each hold different roles in different conversations. Later ability documentation should keep actor-class abilities separate from conversation-role abilities and avoid duplicating the same capability across both dimensions.
