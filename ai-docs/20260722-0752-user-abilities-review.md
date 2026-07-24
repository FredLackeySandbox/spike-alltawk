# User Abilities Review Report

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
- `ai-docs/20260722-0750-user-abilities-draft.md`
- `ai-docs/20260722-0748-user-types-review.md`

No braindump files were read or used. The requirements, schemas, and prior phase reports were sufficient.

## Ability Decisions

| User type | Ability | Decision | Review rationale |
|---|---|---|---|
| Identified Person | Use an identified profile | Kept | A visible display name and non-anonymous human authentication are explicit requirements. |
| Identified Person | Discover and join listed conversations | Kept | Tag-assisted discovery, identifiable listed results, immediate joining, and the ban check are central day-one behavior. |
| Identified Person | Join known unlisted conversations | Kept | Complete-tag joining without revealing hidden identities or private-only tags is a defining product requirement. |
| Identified Person | Create tagged conversations | Kept | People may create listed or unlisted conversations, select listed matching behavior, and become first owner. |
| Identified Person | Participate according to conversation role | Kept | This correctly connects human identity access to the contextual owner, administrator, or member authority model without duplicating every role ability. |
| Bot Participant | Authenticate as an identified bot | Kept | Token authentication and a visible non-anonymous bot identity are explicit requirements and supported by Bot Credential and Identity. |
| Bot Participant | Find and join tagged conversations | Kept | Bots explicitly create and join conversations under the same conversation model as people; no separate bot discovery rule is warranted. |
| Bot Participant | Create tagged conversations | Kept | Bots are explicitly allowed to create either listed or unlisted conversations and become first owner. |
| Bot Participant | Participate according to conversation role | Kept | Bots use the same role model as people, so role-based delegation is complete without speculative bot-only permissions. |
| Conversation Owner | Manage conversation tags | Kept | Owners may add and remove tags, while the one-to-ten active-tag constraint must remain true. |
| Conversation Owner | Govern roles and ownership | Kept | Owner promotion, authority over owner membership, and the last-owner continuity rule distinguish this role from administrators. |
| Conversation Owner | Manage participants | Kept | Owners must manage active and former participants and can remove, ban, and restore them. |
| Conversation Owner | Moderate conversation conduct | Kept | Ticket review, moderation notes or discussion, message deletion, and bounded posting restrictions are requirements-backed; the schema-backed ability to lift a suspension stays within the same day-one moderation function. |
| Conversation Owner | Archive the conversation | Kept | Archival is the explicit owner-controlled replacement for conversation deletion. |
| Conversation Owner | Participate in the conversation | Kept | Owners retain ordinary participant abilities, with leaving constrained by ownership continuity. |
| Conversation Administrator | Manage conversation tags | Kept | Administrators are explicitly allowed to add and remove tags under the same one-to-ten constraint. |
| Conversation Administrator | Manage non-owner participants | Kept | Administrators may inspect former members and remove, ban, or restore participants but cannot alter owners. |
| Conversation Administrator | Moderate conversation conduct | Kept | The requirements assign administrators ticket review and the listed moderation actions; no ticket workflow beyond those actions is implied. |
| Conversation Administrator | Participate in the conversation | Kept | Administrators remain participants while lacking owner-only role control and archival authority. |
| Ordinary Member | Exchange messages | Kept | Reading, posting, and deleting one's own messages are core participant functions, and retention language remains a product rule rather than an implementation workflow. |
| Ordinary Member | React to messages | Kept | Emoji reactions are an explicit active-participant ability, stated without inventing an emoji set or multiplicity rule. |
| Ordinary Member | Add contextual notes | Kept | Conversation and message notes are explicit; the wording correctly avoids deciding the unresolved audience model. |
| Ordinary Member | Report concerning content | Kept | Flagging with an explanatory reason and creation of a numbered moderation ticket are explicit day-one requirements. |
| Ordinary Member | Manage own participation | Kept | Members may leave while their retained, undeleted messages remain attributable to them. |

No abilities were changed, removed, or added. Every one of the five user types has exactly one `#### Abilities` section, and the current ability set is both sufficient and conservative.

## Key Requirement Coverage

- **Identity and authentication:** Identified Person and Bot Participant cover non-anonymous profiles, human sign-in, bot tokens, and the common role model.
- **Conversation creation and discovery:** Both identity types can create conversations; listed discovery and privacy-preserving unlisted joining are covered without resolving open search semantics.
- **Participation:** Ordinary Member covers messages, own-message deletion, emoji reactions, notes, flagging, and voluntary departure. Owner and Administrator explicitly inherit participation behavior through their own participation abilities.
- **Membership and governance:** Owner covers promotions, owner continuity, archival, and participant control. Administrator covers the same non-owner participant operations while preserving the prohibition on altering owners.
- **Moderation:** Owner and Administrator cover ticket review, notes or linked discussion, message deletion, removal, banning and restoration, and time-bounded posting suspension. Ordinary Member covers report submission.
- **Retention:** The abilities preserve archival, soft deletion, membership history, and continuing message attribution at the product-behavior level without exposing database or transaction mechanics as user abilities.

No important functional area in the requirements is lost. Technical stack, persistence mechanics, schema validation, and DynamoDB transaction invariants correctly remain outside the user-ability model.

## YAGNI Review

The ability set does not add anonymous use, invitations or approvals, product-wide administration, bot-only conversation powers, bot credential administration, configurable retention, archived-conversation restoration, or implementation-facing operations. It also avoids deciding unresolved search semantics, note audiences, emoji multiplicity, moderation-ticket statuses and assignment, archived-conversation visibility, or detailed moderation-discussion workflow.

The apparent overlap between identity-type and conversation-role abilities is intentional and minimal: identity types explain authentication, discovery, joining, and creation, while contextual roles explain authority inside each conversation. Collapsing those dimensions would lose requirements-backed distinctions; expanding them into separate personas or duplicate task lists would overcomplicate the model.

## Remaining Direct Questions

The following product questions could refine later design documents but do not block the current abilities:

- Can both owners and administrators apply and lift every listed posting restriction, or are any moderation actions owner-only?
- Is a linked private moderation discussion available on demand, required for every ticket, or deferred from the POC?
- Which note audiences are supported for members, administrators, and owners?
- What archived-conversation access remains available to former or current participants after an owner archives it?
- What human authentication method establishes an Identified Person, and is bot credential administration exposed to any human user in the POC?

## Braindump Usage

Braindumps were not used. No prior-decision ambiguity required last-resort decision history.
