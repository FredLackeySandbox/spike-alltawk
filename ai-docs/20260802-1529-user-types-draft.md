# User Types Draft Report

## Files Reviewed

- `docs/concepts/REQUIREMENTS.md`
- `docs/schemas/DICTIONARY.md`
- `docs/schemas/audit-event.yaml`
- `docs/schemas/bot-credential.yaml`
- `docs/schemas/conversation-tag.yaml`
- `docs/schemas/conversation.yaml`
- `docs/schemas/emoji-reaction.yaml`
- `docs/schemas/emoji.yaml`
- `docs/schemas/human-authentication.yaml`
- `docs/schemas/identity.yaml`
- `docs/schemas/membership-role-period.yaml`
- `docs/schemas/membership.yaml`
- `docs/schemas/message-thread.yaml`
- `docs/schemas/message.yaml`
- `docs/schemas/moderation-action.yaml`
- `docs/schemas/moderation-ticket.yaml`
- `docs/schemas/note.yaml`
- `docs/schemas/posting-suspension.yaml`
- `docs/schemas/tag.yaml`

`docs/concepts/USER_TYPES.md` did not exist before this phase.

## User Type Rationale

| User type | Requirements or schema rationale |
|---|---|
| Identified Person | Requirements explicitly define people as verified-email users who authenticate with OIDC or passwordless email. `identity.yaml` distinguishes human identities, and `human-authentication.yaml` persists their verified authentication connections. |
| Bot | Requirements explicitly allow token-authenticated bots to create, join, own, administer, and participate in conversations. `identity.yaml` includes bot identities and `bot-credential.yaml` persists their revocable credentials. |
| Conversation Owner | Requirements define owner-only responsibility for ownership changes and archival, require at least one owner per active conversation, and allow a person or bot to hold the role. `membership-role-period.yaml` persists the owner role over time. |
| Conversation Administrator | Requirements define administrators as trusted conversation operators and moderators who cannot alter owners. `membership-role-period.yaml`, `moderation-action.yaml`, and `posting-suspension.yaml` support this capacity. |
| Ordinary Member | Requirements explicitly define the non-management participant role for people and bots. `membership.yaml` and `membership-role-period.yaml` retain participation state and the member role. |

The model intentionally separates durable identity class (person or bot) from conversation-scoped authority (owner, administrator, or ordinary member). These dimensions overlap: any identified person or bot may hold one of the three roles in a given conversation.

## Candidates Excluded as YAGNI

- **Anonymous participant:** Explicitly out of scope; every participant must be identified.
- **Unauthenticated public visitor:** “Listed” describes conversation discoverability, but the documented search and join flows start with an identified user. No unauthenticated visitor behavior is required.
- **Application-wide administrator or internal operator:** The requirements define only conversation-scoped ownership and administration; no platform operations role is specified.
- **Dedicated moderator:** Moderation authority belongs to conversation owners and administrators, so a separate role would duplicate those user types.
- **Reporter:** Reporting is a temporary activity available to a participant, not a durable user type.
- **Former, removed, banned, or suspended participant:** These are membership or permission states, not distinct actors. The schemas retain them through membership status, role history, and posting suspensions.
- **Authentication or identity provider:** OIDC and passwordless-email services support authentication but do not use the Tawk product as actors.
- **Tag owner or conversation provider:** Tags are explicitly shared and unowned, and the requirements define no separate provider role.

## Ambiguities and Decision History

- The requirements call listed conversations public but consistently require identified actors for product actions and begin discovery flows with an identified user. The draft therefore does not infer an unauthenticated public-visitor user type.
- People and bots are durable identity classes, while owner, administrator, and member are conversation-scoped roles that either identity class can hold. The document preserves both dimensions because later ability design must distinguish authentication/profile needs from role-based authority.
- No braindump files were used; the requirements and schemas were sufficient.
