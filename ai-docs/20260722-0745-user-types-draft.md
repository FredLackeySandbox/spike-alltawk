# User Types Draft Report

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

`docs/concepts/USER_TYPES.md` did not exist before this phase.

## User Type Rationale

| User type | Requirements or schema rationale |
|---|---|
| Identified Person | The requirements name people as direct users, prohibit anonymous participation, require a display name, and leave the human authentication mechanism open. `identity.yaml` confirms a durable `person` identity type. |
| Bot Participant | The requirements explicitly allow bots to create, join, own, administer, and participate in conversations through token authentication. `identity.yaml` and `bot-credential.yaml` confirm a distinct non-human identity and credential model. |
| Conversation Owner | The requirements define owner-only governance, including changing owner assignments, preserving at least one owner, and archiving a conversation. Membership and role-period schemas retain this role over time. |
| Conversation Administrator | The requirements define delegated tag, participant, ticket, and message-moderation authority while explicitly preventing administrators from altering owners. Moderation schemas consistently identify owners or administrators as action actors. |
| Ordinary Member | The requirements explicitly distinguish participants who can message, react, leave, add notes, and flag content but cannot manage conversations or other participants. Membership schemas retain `member` as a separate role. |

## Intentionally Excluded Candidates

- **Anonymous or public visitor:** Anonymous participation is explicitly out of scope, and the listed-conversation flows begin with an identified user. Publicly listed discovery describes conversation visibility, not a separate anonymous user type.
- **Global application administrator or internal operator:** No product-wide administrative role or internal operations workflow is required. Moderation authority is scoped to conversation owners and administrators.
- **Moderator:** This was not added as a separate type because moderation is already an explicit part of the owner and administrator roles; adding it would duplicate those capacities.
- **Former member, banned identity, removed participant, or suspended participant:** These are lifecycle or restriction states of an existing identity and membership, not distinct actors with their own product purpose.
- **Tag creator, reporter, note author, or message author:** These are temporary activities performed by existing participants, not durable user types.
- **Bot developer or bot operator:** The POC requires token-authenticated bots but does not define a separate human-facing bot management persona or workflow.
- **Moderation ticket assignee:** The schema permits assignment to an owner or administrator, but this remains part of the existing moderation roles and does not justify another type.

## Ambiguities and Decisions

- Identity type and conversation role are two intersecting dimensions: a person or bot may be an owner, administrator, or ordinary member in each conversation. The draft preserves both dimensions because they drive different authentication and authority needs, while stating their overlap to avoid implying five mutually exclusive identity classes.
- Human authentication remains unresolved, but that implementation choice does not prevent identifying the human user type.
- The requirements use “user” generically in some search and joining flows. The overview and assumptions establish that both identified people and token-authenticated bots can create or join, so no additional generic user type was introduced.

## Braindump Use

No braindump files were read or used. The requirements and schemas were sufficient.
