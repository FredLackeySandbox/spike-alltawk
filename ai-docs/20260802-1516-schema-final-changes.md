# Final Schema Changes

## Sources used

- Final review: `ai-docs/20260802-1510-schema-final-review.md`
- Answered questions: `ai-docs/20260802-1426-schema-questions.md`
- Requirements context checked without modification: `docs/concepts/REQUIREMENTS.md`
- Current schema contract checked and updated where noted: `docs/schemas/DICTIONARY.md` and the 17 current `docs/schemas/*.yaml` files

## Summary

All seven `FR-*` recommendations were accepted because each is narrowly supported by the cited recorded answer and fits the existing MVP data model. The changes add a durable keep-or-remove disposition to closed moderation tickets, make concurrent reports safe by deriving hidden and paused state from all unresolved tickets, add a retained identity-warning action without inventing a reputation formula, make closed tickets terminal, enforce the 15-character tag-component limit, require an audit event when an author changes an active note's visibility, and restrict conversation-scoped custom emoji creation to current owners and administrators.

A **cross-record rule** is application or data-access behavior that compares separate records because one standalone JSON Schema file cannot enforce the relationship. A **terminal state** is a lifecycle state that cannot transition to another state.

## Recommendation decisions

| Final review ID | Source question ID | Affected schema item | Decision | What changed or why it did not change | Decision evidence | Remaining risk |
|---|---|---|---|---|---|---|
| `FR-01` | `SQ-01` | `docs/schemas/moderation-ticket.yaml`, object `Moderation Ticket`, fields `status`, new `disposition`, and `closedAt`; `docs/schemas/moderation-action.yaml`, object `Moderation Action`, fields `ticketId`, `actionType`, and `targetMessageId`; `docs/schemas/DICTIONARY.md`, `Moderation Ticket` and cross-record rules | Accepted | Added optional `ModerationTicket.disposition` with `keepMessage` and `removeMessage`. The schema now requires it when `status` is `closed` and prohibits it before closure. The dictionary requires a ticket-linked `deleteMessage` action targeting `ModerationTicket.messageId` for `removeMessage`; `keepMessage` records the case decision but does not restore content until all reports permit it. | `SQ-01` says the reviewer chooses to keep or remove the message when closing the case. This exact per-ticket result is needed because `SQ-02` permits concurrent reports. | JSON Schema cannot verify the required `ModerationAction` against the ticket; application/data-access logic must enforce that cross-record rule. |
| `FR-02` | `SQ-01`, `SQ-02` | `docs/schemas/message.yaml`, object `Message`, removed field `hiddenByTicketId` and field `status`; `docs/schemas/message-thread.yaml`, object `Message Thread`, removed field `pausedByTicketId` and fields `status`, `pausedAt`, `resumedAt`; `docs/schemas/moderation-ticket.yaml`, object `Moderation Ticket`, fields `messageId`, `status`, `discussionConversationId`, `reportedById`, and `disposition`; `docs/schemas/DICTIONARY.md`, moderation cross-record rules | Accepted | Removed the two single-ticket pointer fields. The dictionary now derives `Message.status: hiddenPendingReview` and `MessageThread.status: paused` from every non-closed ticket for the message, restores a kept message only after the last unresolved ticket closes, leaves any accepted removal deleted, and requires append-only `AuditEvent` history for thread pause/resume transitions. It also retains one globally unique discussion conversation per ticket and restricts reporter identity and ticket-discussion access to current owners and administrators of the source conversation. | `SQ-02` allows multiple simultaneous reports, requires a distinct report view or conversation, and prohibits reporters from seeing other reporters. `SQ-01` makes the keep-or-remove decision part of ticket closure. | Existing persisted records that contain `Message.hiddenByTicketId` or `MessageThread.pausedByTicketId` will need a bounded data migration or compatibility handling before the new `additionalProperties: false` schemas are used against them. The aggregate ticket checks remain application/data-access responsibilities. |
| `FR-03` | `SQ-01` | `docs/schemas/moderation-action.yaml`, object `Moderation Action`, fields `actionType`, `targetIdentityId`, `ticketId`, and `rationale`; `docs/schemas/DICTIONARY.md`, `Moderation Action` and cross-record rules | Accepted | Added `warnIdentity` to `ModerationAction.actionType`. Its action-specific branch requires `targetIdentityId`, `ticketId`, and `rationale` and prohibits message and suspension targets. The dictionary restricts the target to the ticket's reporter or reported message author and requires a current source-conversation owner or administrator as actor. No karma, warning-point, or reputation field was added. | `SQ-01` clearly authorizes a warning against either a false reporter or the author of the reported message, but describes karma and reputation only as possible future mechanics. | The product still has no formula for score changes, warning accumulation, decay, appeals, or reputation display. `warnIdentity` therefore remains a durable moderation fact rather than a calculated score. |
| `FR-04` | `SQ-03` | `docs/schemas/moderation-ticket.yaml`, object `Moderation Ticket`, field `status`; `docs/schemas/DICTIONARY.md`, `Moderation Ticket` lifecycle rule | Accepted | Updated the field and dictionary descriptions to make `closed` terminal. The dictionary requires application/data-access logic to reject every later change to a closed ticket's status, disposition, or lifecycle timestamps. | `SQ-03` states that tickets cannot be reopened. | A standalone current-state schema cannot inspect a prior stored value, so transition rejection must occur in update logic. |
| `FR-05` | `SQ-04` | `docs/schemas/tag.yaml`, object `Tag`, field `value`; `docs/schemas/DICTIONARY.md`, `Tag` entry | Accepted | Added `maxLength: 31` and replaced the pattern so a simple tag has one 1-to-15-character component and a `key:value` tag has two independently bounded 1-to-15-character components separated by one colon. Lowercase letters, digits, internal hyphens, and the no-leading-or-trailing-hyphen rule remain intact. | `SQ-04` sets the maximum size of each tag component to 15 characters. | Clients and APIs must use this same pattern or equivalent component-aware validation so they do not accept a value that storage rejects. |
| `FR-06` | `SQ-06` | `docs/schemas/note.yaml`, object `Note`, fields `authorIdentityId`, `visibility`, `status`, and `updatedAt`; `docs/schemas/audit-event.yaml`, object `Audit Event`, fields `subjectType`, `subjectId`, `actorIdentityId`, `action`, `details`, and `occurredAt`; `docs/schemas/DICTIONARY.md`, `Note` entry | Accepted | No YAML shape change was needed because `Note` already stores the current allowed audience and `AuditEvent` already supports note events. The dictionary now permits only the note author to change visibility while the note is active, requires the new audience to remain valid for the target context, updates `Note.updatedAt`, and requires an append-only `noteVisibilityChanged` event whose details contain only `previousVisibility` and `newVisibility`. | `SQ-06` says the author may change an active note's visibility and requires the change to be tracked. | `AuditEvent.action` and `details` remain intentionally flexible in YAML, so application/data-access logic must enforce this event name and exact small detail payload. |
| `FR-07` | `SQ-07` | `docs/schemas/emoji.yaml`, object `Emoji`, fields `type`, `scope`, `ownerIdentityId`, and `conversationId`; `docs/schemas/membership.yaml`, object `Membership`, field `status`; `docs/schemas/membership-role-period.yaml`, object `Membership Role Period`, field `role`; `docs/schemas/DICTIONARY.md`, `Emoji` and cross-record rules | Accepted | Updated `Emoji.scope` documentation and added a cross-record rule requiring a conversation-scoped custom emoji's `ownerIdentityId` to have an active membership in `Emoji.conversationId` with a current role of `owner` or `administrator` when the emoji is created. Asset and scope field shapes were left unchanged. | `SQ-07` selects owners and administrators as the allowed creators. | JSON Schema cannot query current membership and role-period records; creation authorization must be enforced by application/data-access logic at write time. |

## Changed files

- `docs/schemas/moderation-ticket.yaml`
  - Added `ModerationTicket.disposition` with `keepMessage` and `removeMessage`.
  - Updated `ModerationTicket.status` to state that `closed` is terminal.
  - Updated the `status: closed` condition to require `disposition` and `closedAt`; the same condition prohibits `disposition` for `reported`, `underReview`, and `reviewed` tickets.
- `docs/schemas/message.yaml`
  - Removed `Message.hiddenByTicketId` because one UUID cannot represent the multiple unresolved tickets allowed by `SQ-02`.
  - Updated `Message.status` to identify `hiddenPendingReview` as an aggregate state derived from all tickets for the message.
- `docs/schemas/message-thread.yaml`
  - Removed `MessageThread.pausedByTicketId` for the same multiple-ticket reason.
  - Updated `MessageThread.status`, `pausedAt`, and `resumedAt` descriptions for aggregate review state and most-recent transition timestamps.
  - A paused thread now requires `pausedAt` without requiring a single-ticket pointer.
- `docs/schemas/moderation-action.yaml`
  - Added `warnIdentity` to `ModerationAction.actionType`.
  - Added an action-specific `warnIdentity` branch requiring `targetIdentityId`, `ticketId`, and `rationale` while prohibiting `targetMessageId` and `postingSuspensionId`.
  - Updated `ModerationAction.targetIdentityId` to include warning targets.
- `docs/schemas/tag.yaml`
  - Updated `Tag.value.maxLength`, `Tag.value.pattern`, and `Tag.value.description` to enforce 15 characters per component and 31 characters total for `key:value`.
- `docs/schemas/emoji.yaml`
  - Updated `Emoji.scope` documentation to state the owner-or-administrator creation rule for conversation-scoped custom emoji; the record shape is unchanged.
- `docs/schemas/DICTIONARY.md`
  - Updated the `Emoji`, `Message Thread`, `Message`, `Moderation Action`, `Moderation Ticket`, `Note`, and `Tag` entries.
  - Updated the relationship summary and added exact cross-record rules for concurrent moderation reports, reporter privacy, terminal closure, keep/remove dispositions, aggregate message/thread state, warnings, note-visibility audit history, and custom-emoji authorization.

## Rejection rationale

No `FR-*` recommendation was rejected or only partially implemented. The speculative parts of `SQ-01` were deliberately excluded from `FR-03`: no karma, warning-count, or reputation mechanism was added because the recorded answer does not define its calculation or lifecycle. `SQ-05` produced no `FR-*` recommendation, so `Identity.email` and `HumanAuthentication.email` were not changed; their canonical relationship remains unresolved.

## Manual checks performed

- Inspected all seven `FR-*` rows in `ai-docs/20260802-1510-schema-final-review.md` against their exact recorded answers in `ai-docs/20260802-1426-schema-questions.md` and the current requirements context.
- Inspected all 17 current YAML schema files and `docs/schemas/DICTIONARY.md` before editing.
- Re-read the changed YAML sections to confirm that `ModerationTicket.disposition` has a closed-only condition, every `ModerationAction.actionType` has one compatible target branch, the removed single-ticket pointer fields are no longer required, and the `Tag.value` description and pattern use the same 15-character component rule.
- Re-read the dictionary object entries and cross-record rules to confirm they use the same field names and enum values as the YAML files: `keepMessage`, `removeMessage`, `warnIdentity`, `noteVisibilityChanged`, `owner`, and `administrator`.
- Confirmed by inspection that `docs/schemas/audit-event.yaml`, object `Audit Event`, already accepts `subjectType: note`, `actorIdentityId`, the stable `action` string, `occurredAt`, and a small `details` object, so `FR-06` does not require a new YAML property.
- Confirmed by inspection that `docs/schemas/membership.yaml` and `docs/schemas/membership-role-period.yaml` already provide the `active`, `owner`, and `administrator` values needed by `FR-07`.
- No validator, linter, test suite, package script, dependency install, or automated schema validation was run.

## Remaining known risks

- **Affected items:** `docs/schemas/message.yaml`, removed `Message.hiddenByTicketId`; `docs/schemas/message-thread.yaml`, removed `MessageThread.pausedByTicketId`. **Current result:** review state now derives from all moderation tickets. **Why it matters:** previously persisted documents containing either removed field conflict with `additionalProperties: false`. **Disposition:** implementation work must migrate or compatibly read those records before enforcing the updated schemas.
- **Affected items:** moderation, note-audit, and emoji-authorization rules in `docs/schemas/DICTIONARY.md`. **Current result:** their exact behavior is documented, but it depends on comparisons across records or prior state. **Why it matters:** JSON Schema validates one document and cannot enforce those comparisons. **Disposition:** the framework-neutral API/data package must enforce the documented transitions, authorization checks, reporter privacy, aggregate ticket calculations, and required linked records.
- **Affected items:** potential reputation data on `Identity` and sign-in address relationships between `Identity.email` and `HumanAuthentication.email`. **Current result:** neither contract was changed. **Why it matters:** the recorded answers do not define a reputation model or a canonical email relationship. **Disposition:** warnings remain append-only moderation actions, and each authentication email remains verified sign-in evidence without an invented canonical-address rule.

No requirements file, questions report, review report, schema file outside the seven changed files above, or other project artifact was changed in this phase. This report hands control to the requirements-reconciliation phase and does not create another review or questions report.
