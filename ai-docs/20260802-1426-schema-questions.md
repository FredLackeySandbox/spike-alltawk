# Schema Questions

## Source reports reviewed

- `ai-docs/20260802-1413-schema-review.md`
- `ai-docs/20260802-1421-schema-changes.md`

Agent 2 implemented every `SR-*` recommendation from the initial review and made conservative partial changes for two simplification candidates. The questions below are limited to product decisions that the requirements still leave open and that would materially change a schema field, lifecycle rule, or cross-record integrity rule. In this report, a **lifecycle rule** defines how a record moves between states such as `reported`, `reviewed`, and `closed`. A **cross-record integrity rule** is a rule the application must enforce by comparing separate records because one standalone YAML schema cannot express it.

## Moderation lifecycle

### SQ-01 — Restore content after a non-deletion review

**Affected schema item:** `docs/schemas/message.yaml`, object `Message`, fields `status` and `hiddenByTicketId`; `docs/schemas/message-thread.yaml`, object `Message Thread`, fields `status`, `pausedByTicketId`, and `resumedAt`; `docs/schemas/moderation-ticket.yaml`, object `Moderation Ticket`, field `status`; and `docs/schemas/moderation-action.yaml`, object `Moderation Action`, field `actionType` value `restoreMessage`.

**Current state:** A reported message can be set to `status: hiddenPendingReview`, and its thread can be set to `status: paused`. A ticket can advance through `reported`, `underReview`, `reviewed`, and `closed`, but no rule says when a message that is not deleted returns to `visible` or when its thread returns to `active`. `ModerationAction.actionType` supports `restoreMessage`, but the schema does not say which ticket transition requires that action.

**Requirement context:** When a participant reports a message, the requirements say to hide it from everyone during review and pause its thread so nobody can reply. Reviewers may delete the message, but the requirements do not define the outcome when they decide not to delete it.

**Direct question:** When a reviewer decides not to delete the reported message, should the message become `visible` and its thread become `active` when the ticket reaches `reviewed`, or only when the ticket reaches `closed`?

**Why it matters:** Without one transition point, a completed review can leave a message hidden and a thread paused forever, or different application components can restore them at different times.

**Decision unlocked:** The answer determines the lifecycle rule connecting `ModerationTicket.status` to `Message.status`, `Message.hiddenByTicketId`, `MessageThread.status`, `MessageThread.pausedByTicketId`, `MessageThread.resumedAt`, and any required `restoreMessage` action.

**Recorded answer:** Yes. The reviewer is going to have the ability to determine if the case is closed and what the action is. So when they close the case, what is the action? They're either going to keep or remove the message. And I guess with that, they should also have some ability to take action against either the person who made the report, because it may have been a fictitious or false claim, or against the person who actually made the post. I'm thinking we need to give them some type of warning. Maybe that just increases their, you know, karma or warning points or something like that. And I kind of like the idea of karma. Maybe it decreases their reputation, similar to how Stack Overflow works.

### SQ-02 — Number of simultaneous open tickets for one message

**Affected schema item:** `docs/schemas/moderation-ticket.yaml`, object `Moderation Ticket`, fields `messageId` and `status`; `docs/schemas/message.yaml`, object `Message`, field `hiddenByTicketId`; `docs/schemas/message-thread.yaml`, object `Message Thread`, field `pausedByTicketId`; and the `Cross-record integrity rules` section of `docs/schemas/DICTIONARY.md`.

**Current state:** Any number of `ModerationTicket` records can reference the same `messageId`, but `Message.hiddenByTicketId` and `MessageThread.pausedByTicketId` can each hold only one ticket identifier. The dictionary does not restrict the number of tickets that may remain open for one message.

**Requirement context:** Any participant may flag a message, but the requirements do not say whether another flag on a message already under review creates a second ticket, is attached to the existing ticket, or is rejected.

**Direct question:** Should Tawk allow at most one non-closed moderation ticket per message, or allow multiple non-closed tickets for the same message at the same time?

**Why it matters:** With multiple open tickets, one ticket identifier can overwrite another, and resolving one ticket could restore content while another report still requires it to remain hidden.

**Decision unlocked:** A one-ticket answer allows a documented uniqueness rule on non-closed `ModerationTicket.messageId`. A multiple-ticket answer requires hiding and thread pausing to be derived from all open tickets instead of the single `hiddenByTicketId` and `pausedByTicketId` fields.

**Recorded answer:** We can have multiple reports for the same message. The people reporting it do not see who the other people are who reported it. Each report is going to open a distinct view for that message, or a distinct conversation for that report.

### SQ-03 — Reopening a closed moderation ticket

**Affected schema item:** `docs/schemas/moderation-ticket.yaml`, object `Moderation Ticket`, fields `status`, `reviewStartedAt`, `reviewedAt`, and `closedAt`; and any `Moderation Action` records linked through `docs/schemas/moderation-action.yaml` field `ticketId`.

**Current state:** `ModerationTicket.status` includes `closed`, but the schema does not prohibit changing a closed ticket back to `underReview`. Its single `reviewStartedAt`, `reviewedAt`, and `closedAt` fields cannot preserve more than one review-and-close cycle without overwriting earlier timestamps.

**Requirement context:** The requirements define the basic ticket statuses but explicitly state that whether a closed ticket can be reopened is not yet defined. Moderation history must be retained rather than silently replaced.

**Direct question:** Must the MVP allow a `closed` moderation ticket to be reopened: yes or no?

**Why it matters:** If reopening is allowed, reusing the existing timestamp fields would erase or confuse the first review cycle. If it is not allowed, the application needs an explicit terminal-state rule for `status: closed`.

**Decision unlocked:** A no answer permits the dictionary to mark `closed` as terminal. A yes answer requires a retained ticket-status history or another time-bounded structure instead of treating the four timestamps as the complete lifecycle record.

**Recorded answer:** Tickets cannot be reopened.

## Tags

### SQ-04 — Maximum tag component length

**Affected schema item:** `docs/schemas/tag.yaml`, object `Tag`, field `value`; and the `Tag` entry in `docs/schemas/DICTIONARY.md`.

**Current state:** `Tag.value` enforces lowercase Latin letters, numbers, internal hyphens, and at most one colon, but it has no `maxLength` and no numeric limit for either side of a key/value tag.

**Requirement context:** The requirements say a tag component may contain any number of internal separator hyphens within that component's maximum length, but they never provide the maximum.

**Direct question:** What maximum number of characters should be allowed in each tag component, using the same limit for a simple tag and for each side of a `key:value` tag?

**Why it matters:** A numeric limit lets the UI and API reject the same values and prevents unbounded tags from causing inconsistent display, search, or key behavior.

**Decision unlocked:** The answer supplies the exact component-length constraint for `Tag.value` and the matching dictionary rule; a `key:value` tag would then allow two bounded components plus the colon.

**Recorded answer:** Let's go with a maximum size of fifteen characters for each tag component.

## Human identity and authentication

### SQ-05 — Relationship between profile email and sign-in emails

**Affected schema item:** `docs/schemas/identity.yaml`, object `Identity`, fields `email` and `emailVerified`; `docs/schemas/human-authentication.yaml`, object `Human Authentication`, fields `identityId`, `email`, and `emailVerified`; and the `Identity` and `Human Authentication` entries in `docs/schemas/DICTIONARY.md`.

**Current state:** Every human `Identity` requires a verified `Identity.email`, and every `HumanAuthentication` connection requires its own verified `HumanAuthentication.email`. One identity may have multiple authentication connections, but no cross-record rule says how their email values relate.

**Requirement context:** Every successful human authentication must resolve to a positively identified email, and the data model says a human identity stores an email. The requirements do not prohibit one person from linking multiple OIDC or passwordless connections.

**Direct question:** Should `Identity.email` be a canonical profile address that must match every linked `HumanAuthentication.email`, match at least one linked authentication email, or be an independently selected verified address?

**Why it matters:** Account linking, profile display, moderation lookup, and sign-in lookup can identify the same person by different addresses unless one record is defined as authoritative and its relationship to authentication records is explicit.

**Decision unlocked:** The answer determines the cross-record consistency rule for `Identity.email` and whether the dictionary must define how a canonical address is selected or changed.

**Recorded answer:** I think the user will be able to add additional email addresses to their account, and probably other mobile numbers at some point. We would need to resolve the email address from the OIDC login to the email address.

## Notes

### SQ-06 — Changing note visibility after creation

**Affected schema item:** `docs/schemas/note.yaml`, object `Note`, fields `visibility`, `status`, and `updatedAt`; and the `Note` entry in `docs/schemas/DICTIONARY.md`.

**Current state:** `Note.visibility` is restricted to the correct audience for each target context, but the schema and dictionary do not say whether an active note's author may later change that audience. No field records who changed visibility or when it changed apart from the general `updatedAt` timestamp.

**Requirement context:** The requirements define private, thread-participant, conversation-participant, and moderator visibility by note context, but explicitly leave visibility changes after creation undefined. Notes and relevant history are retained for the MVP.

**Direct question:** Should `Note.visibility` be immutable after creation, or may the note's author change it while the note is active?

**Why it matters:** Changing a private note to a participant-visible note can disclose previously private content, while narrowing visibility can remove access that participants previously had. Developers need one rule for authorization and history.

**Decision unlocked:** An immutable answer allows the dictionary to prohibit visibility updates. A mutable answer requires rules for who may change it and whether visibility-change history needs a dedicated audit record rather than relying only on `Note.updatedAt`.

**Recorded answer:** Yes, the note's author may change its visibility while it is active, but we need to track the visibility change.

## Custom emoji

### SQ-07 — Who may create conversation-scoped custom emoji

**Affected schema item:** `docs/schemas/emoji.yaml`, object `Emoji`, fields `type`, `scope`, `ownerIdentityId`, and `conversationId`; and the `Emoji` entry in `docs/schemas/DICTIONARY.md`.

**Current state:** A custom `Emoji` with `scope: conversation` requires both `ownerIdentityId` and `conversationId`, but neither the schema nor the dictionary requires the supplying identity to have a particular role or active membership in that conversation.

**Requirement context:** The requirements support custom PNG, JPEG, or animated GIF emoji supplied by people or conversation owners, but explicitly state that no further custom-emoji permission rules are defined.

**Direct question:** Who may create a conversation-scoped custom emoji: conversation owners only, owners and administrators, or any active participant?

**Why it matters:** Without one permission rule, different clients or API routes can allow different people to add assets that become available to an entire conversation.

**Decision unlocked:** The answer determines the cross-record authorization rule connecting `Emoji.ownerIdentityId` and `Emoji.conversationId` to the supplier's current `Membership` role.

**Recorded answer:** Owners and administrators.

## Issues resolved without another question

- `SR-01` through `SR-10` need no question because Agent 2 implemented each requirements-backed correction, including confidential moderation-discussion access, context-specific note audiences, action-specific moderation targets, consistent lifecycle fields, valid standard/custom emoji shapes, and the cross-record integrity rules in `docs/schemas/DICTIONARY.md`.
- `OS-01`, `docs/schemas/moderation-ticket.yaml` field `assignedReviewerId`, needs no question in this pass because Agent 2 removed the speculative field. Role-based reviewer access remains sufficient for the stated MVP, and the requirements already record reviewer assignment as undefined.
- `OS-02`, `docs/schemas/bot-credential.yaml` field `tokenPrefix`, needs no product question because Agent 2 made it optional and documented it as an implementation-specific lookup hint rather than an authorization fact.
- `OS-03`, `docs/schemas/audit-event.yaml` field `details`, needs no question because Agent 2 retained its flexible shape while documenting that it must remain small, non-authoritative, and must not duplicate complete source records. A closed event-payload design would be speculative because the requirements do not enumerate every audit action.
- Cross-record date ordering needs no product question because Agent 2 documented the expected ordering in `docs/schemas/DICTIONARY.md`; standalone JSON Schema cannot compare separate date-time values, so enforcement belongs in application/data-access logic.
- Requirements prose that still calls ticket statuses, note audiences, required moderation discussions, custom emoji formats, or archive behavior unresolved needs no question because later recorded answers in `docs/concepts/REQUIREMENTS.md` already decide those points. It should be corrected during bounded requirements reconciliation rather than asked again.
