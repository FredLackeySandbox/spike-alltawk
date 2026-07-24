# Architect Approval: Conversation Thread

## Assignment

- **Assigned page:** `docs/mockup/desktop/conversation/thread.html`
- **Page slug:** `conversation-thread`
- **Product Owner review:** `docs/mockup/tasks/conversation-thread-review.md`
- **Approval artifact:** `docs/mockup/tasks/conversation-thread-approval.md`

## Evidence reviewed

The validated Product Owner review includes the required rendered Playwright inspection route and desktop observations. Those observations establish the current thread position, message actions, note and report dialogs, reaction behavior, local posting and deletion behavior, last-owner warning, and current absence of loading, failure, retry, suspended-posting, and permitted-leave demonstrations.

Source documents reviewed:

- `docs/concepts/REQUIREMENTS.md`
- `docs/concepts/APP_PAGES.md`
- `docs/concepts/USER_TYPES.md`
- `docs/schemas/DICTIONARY.md`
- `docs/schemas/conversation.yaml`
- `docs/schemas/identity.yaml`
- `docs/schemas/membership.yaml`
- `docs/schemas/membership-role-period.yaml`
- `docs/schemas/message.yaml`
- `docs/schemas/emoji-reaction.yaml`
- `docs/schemas/note.yaml`
- `docs/schemas/moderation-ticket.yaml`
- `docs/schemas/posting-suspension.yaml`
- `docs/mockup/desktop/conversation/thread.html`
- `docs/mockup/tasks/conversation-thread-review.md`

## Recommendation decisions

### PO-001: Open at current conversation activity

- ***Decision:*** Approved with nuance
- **Approved behavior or rationale:** Opening the active conversation may show a brief local loading state before placing the newest message in view while preserving scroll access to older history. Populated, empty-active, load-failure, and retry states are approved, and message actions and the composer must remain unavailable until usable conversation and permission state has loaded. The former participant and bot distinctions already required by the page contract should remain visible. A definitive archived-conversation presentation is not approved because archived behavior in participant views remains unresolved; the mockup may demonstrate a clearly labeled read-only permission or inactive-membership fixture without presenting it as the settled archived experience.
- **State/data effect:** A successful local load establishes one conversation, current membership, identities, ordered visible messages, reactions, and permission state without creating activity. Retry replaces the failed transient state once and must not duplicate messages. Empty and read-only fixtures change no durable local records.
- **QA acceptance check:** Open the populated fixture and verify the newest message is initially visible, older messages remain scrollable, and bot and former-participant treatments remain distinct. Open the empty-active fixture and verify a first-message state with an enabled composer. Open the failure fixture and verify data-dependent actions are unavailable; select Retry and verify the thread appears once. Verify the read-only permission fixture disables posting without claiming to define archived-conversation behavior.
- **Constraints:** Keep the behavior page-local and fixture-backed. Do not invent archived-conversation discovery or participant-view rules, add a new thread section, or expose raw identifiers or soft-deletion metadata.

### PO-002: Post a message safely

- ***Decision:*** Approved
- **Approved behavior or rationale:** When an active, unsuspended participant submits non-whitespace text through Send or Enter, the composer should enter a brief pending state, prevent duplicate submission, and append exactly one newest own message on local success. Success brings the message into view, clears the draft, restores composer focus, and exposes the permitted message actions. Shift+Enter remains a newline action. Blank input, local failure, retry, lost permission, and time-bounded posting suspension require explicit visible outcomes.
- **State/data effect:** Success appends one schema-compatible local message associated with the current identity and conversation. Failure leaves the draft intact and appends nothing. A suspension fixture keeps membership active but denies posting for its bounded interval, including the visible end date/time.
- **QA acceptance check:** Verify Shift+Enter adds a newline without sending. Submit valid text and verify exactly one newest message, a cleared and refocused composer, and available own-message actions. Verify whitespace-only input shows feedback, a failed submission preserves the draft, one retry adds one message, and suspended or permission-lost fixtures add none.
- **Constraints:** All pending, failure, retry, stale, permission, and suspension outcomes must be controlled local states. Do not call a backend or imply durable persistence. Keep message content within the schema boundary and do not add moderation controls to the composer.

### PO-003: Add and remove an emoji reaction

- ***Decision:*** Approved with nuance
- **Approved behavior or rationale:** An active participant may toggle an existing reaction or choose an emoji from the current local picker. A successful add or removal updates the current participant's selected state and changes the displayed count by exactly one; choosing an already represented emoji updates its existing chip. Cancel returns focus without mutation, and a local failure or stale target restores the prior visible state. The demonstration must not imply a settled answer to whether one identity may hold multiple different emoji reactions.
- **State/data effect:** Local reaction associations retain message, conversation, identity, emoji, and soft-removal state. Counts are derived from active associations and cannot become negative; other participants' associations do not change.
- **QA acceptance check:** Toggle one existing reaction on and off and verify a one-step count change each way. Choose an emoji whose chip already exists and verify no duplicate chip. Close the picker without choosing and verify no change and restored focus. Exercise failure or unavailable-message state and verify the original association and count remain.
- **Constraints:** Use only the existing small fixture-supported emoji set for the mockup. Do not define global emoji policy or reaction multiplicity, and do not use a remote emoji or messaging service.

### PO-004: Save a note on a message

- ***Decision:*** Approved with nuance
- **Approved behavior or rationale:** Selecting Add note for a message may open a focused dialog that identifies the stable target by visible author, time, and excerpt. Non-whitespace content saves to that message in local state, closes with restrained confirmation, leaves a quiet target-specific indication, and is available when the same action is reopened. Empty input, cancellation, changed-draft dismissal, local failure with retry, and a deleted or stale target require explicit non-mutating outcomes. The experience must not expose or imply a settled visibility audience.
- **State/data effect:** Success creates or updates only the current mock participant's note attached to the selected message. Cancel, failure, or stale-target handling leaves any prior saved note unchanged and creates no orphan note.
- **QA acceptance check:** Open Add note on a known message and verify its visible context. Save valid content, reopen that same message action, and verify the content remains attached there. Verify whitespace validation, edited-draft cancellation, failure and retry, focus restoration, and stale-message handling without creating or moving a note.
- **Constraints:** The fixture must attach a note to exactly one schema-supported target. Do not add a visibility selector, claim an audience, publish the note into the message stream, or prescribe a broader notes-management feature.

### PO-005: Save a conversation note

- ***Decision:*** Approved with nuance
- **Approved behavior or rationale:** Both existing Add conversation note triggers should open the same focused, conversation-context dialog and expose the same local saved note state. Valid save closes with confirmation; empty input, edited-draft dismissal, cancellation, local failure, and retry have explicit outcomes and restore focus to the trigger used. Reopening from either entry point may expose the saved local content, without representing note visibility as resolved.
- **State/data effect:** Success creates or updates a local note attached only to the conversation and current identity. Failure or cancellation does not create a thread message or change saved conversation-note state.
- **QA acceptance check:** Open the dialog from each entry point and verify the same tag context. Save from one, reopen from the other, and verify the saved content is reachable. Verify blank input, changed-draft cancellation, failure and retry, and focus restoration; none may add a message or show a visibility choice.
- **Constraints:** Keep one small page-local note demonstration. Do not add a notes list or major section, settle note audiences, or require backend persistence.

### PO-006: Report a message for moderator review

- ***Decision:*** Approved with nuance
- **Approved behavior or rationale:** Reporting a visible message with a non-whitespace explanation may create exactly one numbered local moderation ticket after a brief duplicate-preventing pending state. The dialog must identify the selected message, success must show the newly allocated number and a restrained reported indication on that message, and cancellation, validation failure, permission denial, local mutation failure, retry, or stale target must not create partial or duplicate tickets. A schema-required provisional status may exist in the fixture, but the thread must not expose or imply a settled ticket workflow.
- **State/data effect:** Success appends one schema-compatible local ticket with a mock-unique number, conversation, message, reporting identity, reason, provisional fixture status, and report time. Number allocation occurs only on successful local submission; unsuccessful paths append nothing and consume no visible duplicate number.
- **QA acceptance check:** Report a known message and verify one ticket fixture contains the matching conversation, message, reporter, explanation, and a unique number shown in the success result. Verify the message's local reported indication. Exercise blank, cancel, failure and retry, stale-target, and permission-denied states and verify no duplicate or partial ticket appears and no ticket status is presented as product behavior.
- **Constraints:** Keep the behavior local and fixture-backed, reveal no moderator-only data, and do not add statuses, assignments, queue behavior, notifications, or real moderation-service calls to this page.

### PO-007: Confirm deletion of an owned message

- ***Decision:*** Approved
- **Approved behavior or rationale:** Selecting Delete message on the current participant's own message should open a target-specific confirmation whose safe path is cancellation. Confirm enters a brief pending state, then hides the message on local success with completion feedback. Cancel, Escape, close, local failure, permission loss, or stale target leaves or restores the eligible visible message and returns focus appropriately. An ordinary participant must not receive self-delete on another author's message.
- **State/data effect:** Success retains the mock message record and body while adding soft-deletion time and actor state, then excludes it from the visible collection. Cancellation and failure make no deletion change.
- **QA acceptance check:** Select Delete on an own message, cancel, and verify it remains. Confirm on a second attempt and verify the message disappears with no placeholder or metadata visible while the retained fixture is marked soft-deleted by the current identity. Verify another participant's message lacks self-delete and a failed deletion does not remove the message.
- **Constraints:** Do not physically erase the retained fixture, display deletion metadata or a placeholder, or expand owner/administrator moderation deletion into this thread interaction.

### PO-008: Leave only when ownership continuity permits

- ***Decision:*** Approved with nuance
- **Approved behavior or rationale:** Both existing Leave conversation entry points should use one role-aware local flow. An ordinary participant, administrator, or owner with another active owner may review a confirmation, cancel safely, or confirm departure and return to the conversation hub while existing messages remain attributed. A last owner must receive the existing blocking outcome with navigation to manage owners or the owner-only archive path, and no membership mutation. The confirmation must recheck local ownership and membership state before completing. Navigating to the archive path does not itself archive the conversation.
- **State/data effect:** A permitted local leave ends the current membership and its open role period without deleting messages. A blocked, canceled, stale, failed, or navigation-only outcome changes neither membership nor conversation state.
- **QA acceptance check:** With the sole-owner fixture, invoke both Leave entry points and verify the same block, no membership change, and working manage-owner and archive navigation. With another-owner and ordinary-member fixtures, cancel once without change, then confirm and verify membership and the active role period end, retained messages remain attributed, and the hub opens. Change ownership while the confirmation is open and verify the rule is reevaluated; verify a local failure retains membership and allows retry.
- **Constraints:** Enforce ownership continuity from current local fixtures. Offer Archive instead only to an owner, do not archive through navigation alone, do not let administrators alter owners, and do not define unresolved archived-conversation presentation.

## Data and schema feasibility

The approved behavior is feasible with the documented objects. Conversation and Membership establish active/read-only state and role; Membership Role Period supports retained departure history; Message supports persistent attribution and soft deletion; Emoji Reaction supports identity-specific retained associations; Note supports exactly one conversation, message, or ticket target; Moderation Ticket supports a unique human-readable number and required report references; and Posting Suspension supplies a bounded posting restriction while membership remains active. Cross-record checks remain necessary in the local fixture for ownership continuity, report/message conversation consistency, active reaction permission, and deletion authorization.

## Mock data and local fixture feasibility

No shared `assets/mockup-data/**` evidence is present, which is not a blocker. A compact page-local fixture can cover the current conversation, identities, current and former memberships, ordered messages, reactions, notes, a ticket-number sequence, and a posting suspension. Controlled fixture variants may demonstrate loading, empty, failure, retry, stale target, permission loss, another-owner, ordinary-member, and read-only states. These variants should remain small and deterministic and reset safely on reload.

## External service and real API avoidance

The current page uses only in-document and in-page state. Every approved post, reaction, note, report, deletion, leave, retry, failure, timeout, stale-target, and permission outcome must remain local, fixture-backed, or intercepted. No real API, backend, authentication provider, bot service, notification service, or third-party moderation system is approved.

## YAGNI/YACNI constraints

Do not add conversation titles or descriptions, major thread sections, note-management screens, moderation queues, role-management controls, archived-view rules, ticket statuses or assignments, audit timelines, raw identifiers, production persistence, or deleted-message placeholders. Preserve the existing page purpose: message participation with quiet page-local secondary actions and authorized navigation to governance or moderation pages.

## Mockup change statement

No mockup files were changed. This approval created only `docs/mockup/tasks/conversation-thread-approval.md`.
