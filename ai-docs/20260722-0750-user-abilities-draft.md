# User Abilities Draft Report

## Files Reviewed

- `docs/concepts/REQUIREMENTS.md`
- `docs/concepts/USER_TYPES.md`
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
- `ai-docs/20260722-0748-user-types-review.md`

No braindump files were read or used. The requirements, schemas, and user-type review were sufficient.

## Abilities Added

| User type | Added abilities |
|---|---|
| Identified Person | Use an identified profile; discover and join listed conversations; join known unlisted conversations; create tagged conversations; participate according to conversation role. |
| Bot Participant | Authenticate as an identified bot; find and join tagged conversations; create tagged conversations; participate according to conversation role. |
| Conversation Owner | Manage conversation tags; govern roles and ownership; manage participants; moderate conversation conduct; archive the conversation; participate in the conversation. |
| Conversation Administrator | Manage conversation tags; manage non-owner participants; moderate conversation conduct; participate in the conversation. |
| Ordinary Member | Exchange messages; react to messages; add contextual notes; report concerning content; manage own participation. |

The identity-type abilities and conversation-role abilities intentionally overlap only at their boundary. Identified Person and Bot Participant describe how an actor enters, discovers, joins, or creates conversations; Owner, Administrator, and Ordinary Member describe what that actor can do inside a conversation according to the current role.

## Excluded Abilities

- **Anonymous browsing or participation:** Explicitly out of scope because every participant must have an identified person or bot profile.
- **Bot credential administration:** Credential revocation, expiry, rotation, and audit are durable schema capabilities, but the requirements do not define a user-facing bot-management workflow or a bot developer/operator user type.
- **Product-wide administration:** Governance is scoped to conversations; no global administrator or internal-operator abilities are required.
- **Special bot permissions:** Bots explicitly use the same conversation role model as people, so no bot-only conversation abilities were added.
- **Invitation, approval, or membership-request management:** Matching listed conversations can be joined immediately, and no approval queue is required.
- **Detailed moderation-ticket workflow:** Assignment, notifications, exact statuses, and closure behavior remain unresolved, so the abilities stop at reviewing reports and taking explicitly supported actions.
- **Detailed note-audience controls:** Note visibility remains unresolved, so abilities mention notes without inventing audience-management behavior.
- **Archived-conversation browsing or restoration:** Post-archive visibility and participant access are unresolved, and restoration is not required.
- **Implementation-facing capabilities:** API access, database/history inspection, token-digest handling, DynamoDB transactions, Docker operation, and authorization mechanics are implementation concerns rather than user abilities.

## Requirements That Were Hard to Map

- Conversation roles are contextual and overlap identity types: a person or bot may be an ordinary member, administrator, or owner in different conversations. The document therefore assigns authentication, discovery, joining, and creation to identity types, then assigns participation and governance to conversation roles.
- The requirements allow both owners and administrators to moderate but leave exact action-level authority partially open. The draft includes only the moderation actions explicitly described for both roles and preserves the clear owner-only boundaries for owner management and archival.
- Linked private moderation discussions are described as optional or unresolved. They are included conservatively as an available moderation aid rather than a mandatory workflow.
- Notes are explicitly valuable to members and moderators, but their visibility rules are unresolved. The abilities acknowledge note creation without specifying unsupported audiences or access controls.
- Human authentication, exact tag-search semantics, emoji limits, and archived-conversation behavior remain open. None requires another ability category at this stage.

## Braindump Usage

Braindumps were not used. No prior-decision ambiguity required last-resort decision history.
