# Architect Approval: Moderation Ticket

- **Assigned page:** `docs/mockup/desktop/moderation/ticket.html`
- **Page slug:** `moderation-ticket`
- **Product Owner review:** `docs/mockup/tasks/moderation-ticket-review.md`
- **Approval role:** Architect

## Source documents and schema files reviewed

- `docs/concepts/REQUIREMENTS.md`
- `docs/concepts/APP_PAGES.md`
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
- `docs/mockup/desktop/moderation/ticket.html`
- `docs/mockup/tasks/moderation-ticket-review.md`

## Rendered-review evidence gate

The validated Product Owner review records a successful rendered inspection at a 1440 by 1000 desktop viewport using Node executable `/Users/flackey/.nvm/versions/node/v24.15.0/bin/node`, package directory `/Applications/ChatGPT.app/Contents/Resources/cua_node/lib/node_modules/playwright`, browser type `chromium`, and launch options `{"channel":"chrome","headless":true}`. It includes rendered interaction observations for reviewer notes, all four confirmation dialogs, suspension input, action outcomes, keyboard focus, navigation, reload behavior, overflow, and console/page errors. This satisfies the rendered-evidence prerequisite for architecture review.

## Recommendation decisions

### PO-001: Load an authorized ticket with complete evidence

- ***Decision:*** Approved with nuance
- **Approved behavior or rationale:** Opening a ticket must use a local ticket scenario to show a short loading state, then reveal the numbered report, source tags, reporter explanation, flagged message, available adjacent context, existing notes, related discussion when present, current reviewer role, and previously applied effects only to an authorized owner or administrator. Missing, failed, timed-out, and access-denied scenarios are approved because they make the case surface testable; they must not introduce ticket status, assignment, or closure UI. An unavailable adjacent message may be omitted with a restrained explanation, and retained evidence may remain on the ticket when the source conversation is unavailable.
- **State/data effect:** Loading and failure paths do not mutate records. The selected local fixture becomes the in-page source of truth for the ticket and referenced evidence, while access denial reveals none of that evidence. Previously applied effects may be summarized from local fixture state without creating new moderation history.
- **QA acceptance check:** Open normal, delayed, missing, failed, timed-out, unauthorized, and unavailable-source local scenarios. Only an authorized normal scenario reveals report evidence and eligible actions; retry recovers the local failed/timed-out scenario; opening any scenario performs no moderation write or external request.
- **Constraints:** Use only local fixtures and simulated transitions. Do not settle or display provisional ticket status/assignment fields, expose raw identifiers/schema metadata, invent adjacent messages, or add authentication-provider behavior. Authorization must respect the current active owner or administrator membership represented by the fixture.

### PO-002: Record reviewer notes without losing prior context

- ***Decision:*** Approved with nuance
- **Approved behavior or rationale:** An authorized reviewer may enter a non-whitespace note and activate Save note. The page must show local progress, append rather than replace the note with reviewer attribution and a readable mock time, clear the composer only after success, and provide nearby confirmation. Empty or whitespace-only text must receive inline feedback and keep focus; local failure, timeout, stale-ticket, permission-loss, retry, and repeated-submit behavior must preserve text and prevent duplicate notes. The unresolved visibility model must remain absent from this page.
- **State/data effect:** A successful save appends one local `Note` associated only with this moderation ticket and preserves earlier notes for the review session. Cancelled, invalid, failed, timed-out, stale, denied, and duplicate submissions create no record. The note body must remain within the schema's supported length.
- **QA acceptance check:** Save two valid notes and confirm both appear in order with reviewer attribution. Verify empty and whitespace-only input creates nothing; a recoverable local failure or timeout retains the draft; retry appends exactly once; repeated activation and denied/stale scenarios do not duplicate or discard content.
- **Constraints:** Keep the interaction local and ticket-scoped. Do not expose or choose a note-visibility value, add note deletion/edit history, call a backend, or display internal note or identity IDs.

### PO-003: Confirm or cancel each moderation action safely

- ***Decision:*** Approved
- **Approved behavior or rationale:** Each supported action must open one consequence-specific confirmation dialog, move focus inside it, prevent interaction with the background, contain keyboard focus, and restore focus to the initiating control after cancellation. Cancel, close, backdrop dismissal when retained, and Escape must make no change. Confirm must prevent repeated activation while the local result is pending and produce one visible success or failure outcome after rechecking the represented role and target state.
- **State/data effect:** Opening or dismissing a dialog changes no ticket, message, membership, role period, suspension, note, or moderation-action state. One successful confirmation applies exactly one action-specific local effect; failed, stale, timed-out, denied, or duplicated confirmations apply none.
- **QA acceptance check:** For delete, suspend, remove, and ban, open the dialog by keyboard, verify focus enters and cycles inside it, dismiss through every supported path, and confirm state remains unchanged with focus restored. Then test local success, failure, timeout, stale, denial, and repeated-confirm variants and verify at most one effect and one clear result.
- **Constraints:** Confirmation content may explain user-facing consequences and retained history but must not expose implementation internals. Do not add real authorization calls, real service requests, automatic sanctions, or actions beyond the four page-supported outcomes.

### PO-004: Delete the reported message while retaining moderation evidence

- ***Decision:*** Approved with nuance
- **Approved behavior or rationale:** After an authorized reviewer confirms Delete message, the page must show local progress, retain a readable moderation copy and attribution on the ticket, indicate that the message is no longer visible in the normal source conversation, clarify that membership and posting ability did not change, and make deletion unavailable for the already-deleted message. A stale/already-deleted scenario may reconcile to this retained-evidence state without recording the action again.
- **State/data effect:** Local message state gains soft-deletion metadata and one ticket-linked `deleteMessage` moderation action; message content and authorship remain retained for authorized ticket evidence. Membership, role, suspension, notes, and related discussion remain unchanged. Cancelled, failed, timed-out, denied, and stale duplicate attempts make no additional change.
- **QA acceptance check:** Confirm deletion and verify the normal conversation no longer displays the message or a deleted-message placeholder, the ticket retains the evidence and attribution, the delete control is unavailable, and the local effect survives the approved local reload/navigation scenario. Confirm cancel and all non-success variants leave the source message visible and create no moderation effect.
- **Constraints:** Deletion is always soft deletion. The ordinary conversation must not expose retained deleted content or a placeholder. Use local shared fixture state only; do not hard-delete, contact a backend, alter the participant, or invent ticket resolution behavior.

### PO-005: Apply a future-bounded posting suspension

- ***Decision:*** Approved with nuance
- **Approved behavior or rationale:** An authorized reviewer may choose Suspend posting, enter an end date/time later than the deterministic mock current time, and confirm. The dialog must state that reading remains allowed, identify the reviewer's local time-zone context, reject missing, malformed, current, or past values inline, and show the exact active end time after a successful local result. The action must then reflect the active restriction. An existing longer restriction must not be silently shortened; a deliberate replacement confirmation is acceptable for this supported conflict.
- **State/data effect:** Success creates one bounded local `Posting Suspension` linked to the ticket, membership, conversation, identity, and moderator, plus one ticket-linked `suspendPosting` moderation action. Membership remains active and messages remain unchanged. Cancel, invalid input, stale membership, denial, failure, and timeout create no restriction or moderation action.
- **QA acceptance check:** Try empty, malformed, current, and past times and verify inline rejection with the dialog still open. Apply a future time and verify the exact end remains visible and the linked local conversation blocks posting while retaining reading; confirm cancel, longer-existing-suspension, stale, denied, failed, and timed-out variants do not create or silently shorten a restriction.
- **Constraints:** `endsAt` must be later than `startsAt`, and the suspension's copied identity/conversation values must match the represented membership. Scope this mockup to the reported eligible active non-owner participant until the unresolved moderation-authority question is settled. Do not add indefinite suspension, automatic membership changes, live time services, or backend calls.

### PO-006: Remove an active non-owner participant

- ***Decision:*** Approved
- **Approved behavior or rationale:** An authorized reviewer may confirm removal of an eligible active non-owner. The confirmation must distinguish removal from banning; success must identify the participant as former, preserve attribution on undeleted messages, avoid claiming re-entry is blocked, and disable or revise actions whose preconditions no longer hold. Already-former, newly owner, stale-role, denied, failed, and timed-out scenarios must explain why removal was not applied.
- **State/data effect:** Success changes the local membership from active to removed, ends the active role period, records the removal event and one ticket-linked `removeParticipant` moderation action, and retains identity, membership history, messages, ticket evidence, and notes. No non-success path ends the membership.
- **QA acceptance check:** Remove the eligible active non-owner fixture and verify Members shows a retained former participant, undeleted messages remain attributed, and the UI does not describe rejoining as blocked. Verify cancel, owner, already-former, stale, denied, failed, and timed-out variants do not end or duplicate membership state.
- **Constraints:** Administrators must never remove or otherwise alter owners; owner-protection and last-owner rules remain authoritative. Do not hard-delete identity or membership data, add role-management controls, or contact a backend.

### PO-007: Ban a participant without erasing history

- ***Decision:*** Approved with nuance
- **Approved behavior or rationale:** An authorized reviewer may confirm banning an eligible active or former non-owner. The dialog must distinguish banning from both removal and message deletion. Success must show that the participant cannot participate or rejoin while retained messages, identity, membership history, ticket evidence, notes, and related discussion remain available to authorized reviewers. An already-banned or otherwise ineligible target must reconcile to current state without a duplicate effect.
- **State/data effect:** Success sets the retained local membership to banned with role `none`, ends any active permissions, records the required membership transition/history, and appends one ticket-linked `banParticipant` moderation action. Existing content is not deleted. For a former participant, retained prior-role context may support the ban transition without creating an extra active membership period.
- **QA acceptance check:** Ban eligible active and former fixtures and verify both cannot post or rejoin while authorized reviewers retain their history and undeleted messages. Verify cancel, already-banned, newly owner, stale, denied, failed, and timed-out variants produce no duplicate role period, membership event, moderation action, or data loss.
- **Constraints:** Administrators cannot ban or otherwise alter owners. Preserve temporal membership history and use role `none` only with banned status; do not disable or delete the global identity, erase content, add unban controls to this ticket, or contact a real service.

### PO-008: Preserve context across moderation navigation

- ***Decision:*** Approved with nuance
- **Approved behavior or rationale:** Back to reports must restore the prior governed-conversation filter; Open source conversation must open the ticket's source context; View participant context must open the authorized roster context for the reported participant; and an existing related-discussion link must open its distinct linked moderation conversation. Each destination must offer a clear return to report 1048. When the reported message is deleted, the ordinary conversation may land near surviving adjacent context with a restrained unavailable indication, but it must not reveal retained deleted content or display a deleted-message placeholder.
- **State/data effect:** Navigation makes no moderation or note change. Local navigation state preserves the selected ticket, source conversation, participant, and optional distinct discussion reference. Missing, stale, unauthorized, or unavailable destinations retain ticket state and expose no protected content.
- **QA acceptance check:** Activate each link, verify it opens ticket 1048's correct queue filter, source conversation, reported participant, or distinct ticket-linked moderation discussion, and return to the same ticket. Repeat with no discussion, deleted message, unavailable source, stale destination, and unauthorized fixtures and verify there is no dead route, wrong generic destination, deleted-content exposure, or protected-membership disclosure.
- **Constraints:** Omit the related-discussion card when no linked moderation-discussion conversation exists; do not create one automatically. Its local fixture must be an unlisted `moderationDiscussion` conversation linked to this ticket. Do not resolve archived-conversation behavior, expose former-member context to ordinary members, invent new pages, or perform external navigation/service calls.

## Data and schema feasibility notes

The approved behavior fits the existing model. `Moderation Ticket` supplies the unique ticket number and references to the source conversation, message, reporting identity, and explanation; its provisional status and assignment fields are intentionally not surfaced. `Note` supports append-only ticket notes without requiring a visibility value. `Message` supports soft deletion while retaining the body and author. `Moderation Action` represents delete, suspension, removal, and ban outcomes and can link each result back to the ticket. `Posting Suspension` requires a bounded interval and matching membership, identity, and conversation context. `Membership`, `Membership Role Period`, and `Membership Event` preserve removed and banned states and their history, while `Identity` preserves attribution. `Conversation` can represent an optional distinct unlisted moderation discussion linked to the ticket. Conversation tags are presentation context only; bot credentials, reactions, and tag records do not require page-level changes.

The local scenarios must respect cross-record invariants: the reported message belongs to the ticket's conversation; the reviewer is an active owner or administrator for that conversation; the target membership matches the target identity and conversation; suspension end follows start; moderation actions point to the correct message, identity, suspension, and ticket; administrators do not alter owners; and retained data is not hard-deleted.

## Mock data and local fixture expectations

A minimal fixture set may contain the assigned ticket; source and optional moderation-discussion conversations; displayed tags; reported and adjacent messages; reporter, participant, and reviewer identities; current membership and role context; existing notes; optional prior moderation actions and suspension; and navigation references. Deterministic local variants may cover loading, missing, failure, timeout, stale data, permission denial, already-applied effects, missing adjacent context, unavailable source, and absent related discussion. These variants are approved only to exercise the specified page behaviors and linked context; they must not expose raw JSON, IDs, schema metadata, exhaustive audit history, or speculative product fields.

## External service and real API avoidance

All loading, authorization, persistence, delays, retries, outcomes, failure/timeout variants, cross-page effects, and navigation context must be local or fixture-backed. The mockup must not call a real API, backend, authentication or authorization provider, notification system, production data source, or third-party service. The identified reviewer session is assumed and simulated; no authentication UI or integration is approved.

## YAGNI and YACNI constraints

Do not add ticket statuses, assignment, closure, resolution pipelines, queues beyond the existing reports page, service-level timers, notifications, automatic sanctions, bulk actions, exhaustive audit history, new role-management features, note-visibility choices, related-discussion creation, raw record fields, or new pages/major sections. Do not resolve open questions about archived conversation visibility or broad moderation-authority rules through this page. Implement only the local evidence, note, four supported action outcomes, necessary state variants, and context-preserving navigation approved above.

## Change statement

No mockup HTML, CSS, JavaScript, concept, schema, application, mock-data, or asset files were changed. This Architect phase created only `docs/mockup/tasks/moderation-ticket-approval.md`.
