# User Abilities Draft

## Files Reviewed

- `docs/concepts/REQUIREMENTS.md`
- `docs/schemas/DICTIONARY.md`
- `docs/schemas/*.yaml`
- `docs/concepts/USER_TYPES.md`
- `ai-docs/20260802-1529-user-types-review.md`

No braindump files were needed.

## Abilities Added

| User type | Added abilities | Requirements or schema basis |
|---|---|---|
| Person | Authenticate as an identified person; present a recognizable profile | Human authentication requires verified OIDC or passwordless email, permits linked authentication connections, and provides a required display name plus supported profile attributes. |
| Bot | Authenticate as an identified bot; use the shared conversation role model | Bots authenticate with token credentials, have persistent visible identities, and can create, join, own, administer, or participate without bot-specific conversation permissions. |
| Conversation Owner | Create and configure a conversation; govern privileged roles and continuity; operate and moderate the conversation; participate as an active member; archive the conversation | The creator becomes first owner; owners control ownership continuity, conversation settings, moderation, participant management, custom emoji, top-level notes, and archival while retaining ordinary participant capabilities. |
| Conversation Administrator | Maintain conversation organization; manage participant access; review and resolve reported content; participate as an active member | Administrators manage tags, custom emoji, participants, posting restrictions, and moderation tickets but cannot alter owners. |
| Ordinary Member | Discover and join conversations; manage personal membership; exchange messages and reactions; keep contextual notes; report concerning content | Active participants use listed or exact-match unlisted discovery, may leave and rejoin when eligible, communicate and react, manage allowed notes, and flag messages without management authority. |

The actor classes and conversation-role types overlap. Identity and authentication abilities therefore remain under Person and Bot, while product work inside a conversation is described under the role types. Owner and administrator sections reference baseline participant behavior at a high level rather than copying the Ordinary Member ability list.

## Abilities Intentionally Excluded

- **Anonymous discovery or participation:** Explicitly out of scope because every product action requires an identified person or bot.
- **Application-wide administration:** No global administrator or internal-operator user type is defined for the MVP.
- **Bot-only conversation authority:** Bots use the same role model as people and receive no special conversation permissions.
- **Impersonation prevention, reputation scoring, and moderation karma:** These are explicitly excluded or undefined for the MVP.
- **Reporter access to other reports or reporters:** Each report is confidentially distinct, and reporting identities for other tickets must not be exposed.
- **Reviewer assignment and notification management:** Those ticket behaviors remain undefined.
- **Credential storage, database history, audit persistence, and soft-deletion mechanics:** These support the documented abilities but are implementation or retention concerns rather than user abilities.

## Requirements That Were Hard to Map

- People and bots are actor classes while owner, administrator, and ordinary member are conversation-scoped roles. The same identity can hold different roles in different conversations, so abilities were separated by dimension rather than repeated across all five sections.
- Listed and unlisted discovery occurs before or during joining, but no separate visitor or seeker user type exists because identification is required. Discovery and joining were placed with the baseline Ordinary Member role as the ordinary path into participation.
- Active owners and administrators also have ordinary participant capabilities. Their sections reference those baseline capabilities without restating the detailed member list.
- Conversation creation precedes the creator's owner assignment but immediately establishes that role. It was mapped to Conversation Owner to avoid duplicating the same creation ability under both Person and Bot.

No ambiguity required braindump consultation, and none blocks later validation.
