# User Types Review Report

## Files Reviewed

- `docs/concepts/REQUIREMENTS.md`
- `docs/schemas/DICTIONARY.md`
- `docs/schemas/bot-credential.yaml`
- `docs/schemas/conversation-tag.yaml`
- `docs/schemas/conversation.yaml`
- `docs/schemas/emoji-reaction.yaml`
- `docs/schemas/identity.yaml`
- `docs/schemas/membership-event.yaml`
- `docs/schemas/membership-role-period.yaml`
- `docs/schemas/membership.yaml`
- `docs/schemas/message.yaml`
- `docs/schemas/moderation-action.yaml`
- `docs/schemas/moderation-ticket.yaml`
- `docs/schemas/note.yaml`
- `docs/schemas/posting-suspension.yaml`
- `docs/schemas/tag.yaml`
- `docs/concepts/USER_TYPES.md`
- `ai-docs/20260722-0745-user-types-draft.md`

No braindump files were read or used; the requirements and schemas were sufficient.

## User Type Decisions

| User type | Decision | Review rationale |
|---|---|---|
| Identified Person | Kept | The requirements explicitly identify signed-in people as human participants and prohibit anonymous participation. Human authentication and direct interaction distinguish this type from token-authenticated bots, while conversation authority remains role-dependent. |
| Bot Participant | Kept | Bots are explicit non-human actors with token credentials and the same conversation role model as people. The identity and bot-credential schemas make the authentication distinction durable without implying different conversation permissions. |
| Conversation Owner | Kept | Owner-only responsibilities are explicit: controlling owner assignments, preserving at least one owner, and archiving conversations. This makes the role materially different from administrator and ordinary-member participation. |
| Conversation Administrator | Kept | The requirements define a delegated management and moderation role that can manage tags and participants but cannot alter owners or archive the conversation. This boundary is sufficiently clear for later design work. |
| Ordinary Member | Kept | The requirements explicitly distinguish ordinary participation from management and moderation. This type captures the baseline member experience shared by people and bots without inventing separate activity-based personas. |

No user types were changed, merged, removed, or added. `docs/concepts/USER_TYPES.md` already conforms to the prescribed format for this phase and correctly omits all `#### Abilities` sections.

## YAGNI Review

The draft avoids speculative personas. Anonymous visitors are explicitly out of scope, and listed visibility does not establish a separate unauthenticated product user. A product-wide administrator or internal operator is unsupported because all defined governance is scoped to individual conversations. A separate moderator would duplicate owner and administrator responsibilities. Former, removed, banned, and suspended participants are membership states rather than distinct user types, while reporter, note author, message author, and tag creator are activities of existing participants. A bot developer or operator is not required because the POC defines bot authentication and participation but no human-facing bot-management workflow.

The overlap between identity types and conversation roles is intentional rather than over-modeling: a person or bot may hold a different role in each conversation, and the two dimensions drive separate authentication and authorization design needs.

## Completeness Review

The five retained types cover every requirements-backed actor and authority boundary needed for later design work:

- Human and automated authentication are represented by Identified Person and Bot Participant.
- Baseline discovery, joining, messaging, reactions, notes, flagging, and departure are represented by Ordinary Member together with the applicable identity type.
- Conversation governance, ownership continuity, role management, and archival are represented by Conversation Owner.
- Delegated tag, participant, ticket, message, and posting-restriction management are represented by Conversation Administrator.

The schemas reinforce these boundaries through `Identity.type`, bot credentials, membership roles, membership history, and moderator-attributed actions. No missing actor is required by an explicit requirement or unavoidable schema-backed implication.

## Remaining Nonblocking Ambiguities

- Human authentication is not selected, but this affects implementation rather than the existence or definition of Identified Person.
- Requirements sometimes use “user” or “participant” generically. The stated assumptions resolve these references to an identified person or token-authenticated bot acting under a conversation role; no generic sixth type is needed.
- Note visibility and moderation-ticket workflow remain open product questions. They may shape later abilities and layouts but do not create another user type.
- Conversation roles can change over time and differ by conversation. Later documents should continue treating owner, administrator, and ordinary member as contextual roles rather than mutually exclusive identity classes.
