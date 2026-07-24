# Product Owner UX Review: Moderation Ticket

- **Assigned page:** `docs/mockup/desktop/moderation/ticket.html`
- **Page slug:** `moderation-ticket`
- **Review role:** Product Owner

## Source documents reviewed

- `docs/concepts/REQUIREMENTS.md`
- `docs/concepts/APP_PAGES.md`
- `docs/concepts/USER_TYPES.md`
- `docs/mockup/desktop/moderation/ticket.html`
- `docs/mockup/desktop/assets/app.js` as a directly referenced local behavior asset

## Page purpose and user journey

The page serves an identified conversation owner or administrator who is authorized to moderate the conversation represented by the visible tag combination. Its primary job is to put the numbered report, flagged message, limited surrounding context, reporter explanation, reviewer notes, and supported sanctions in one decision surface without inventing a ticket-status workflow.

The likely entry path is the Reported Messages queue at `docs/mockup/desktop/moderation/index.html`. Natural next actions are to return to that queue, inspect the source conversation, inspect the reported participant in Members and Roles, or open the already-linked private moderation conversation. After recording a note or sanction, the reviewer should remain on this ticket with a clear, durable local result so they can understand what has already happened.

## Playwright route used for rendered inspection

Rendered inspection used the supplied `system-node-package` route exactly: Node executable `/Users/flackey/.nvm/versions/node/v24.15.0/bin/node`, package directory `/Applications/ChatGPT.app/Contents/Resources/cua_node/lib/node_modules/playwright`, browser type `chromium`, and launch options `{"channel":"chrome","headless":true}`. Playwright loaded the assigned local HTML file at a 1440 by 1000 desktop viewport; no package resolution, installation, download, real service, or external network call was used.

## Rendered Playwright observations

- The page rendered as a readable two-column evidence-and-controls layout with no horizontal overflow at 1440 pixels. Its 1,386-pixel document height requires a normal vertical scroll and keeps the report heading, tags, evidence, reviewer note, four moderation choices, participant link, and related discussion legible.
- The numbered report, three source tags, one message before and after, flagged message, reporter identity and explanation, and current reviewer identity are all visibly present. The evidence-first hierarchy supports a coherent moderation decision.
- Saving a non-empty reviewer note displays the entered text in a saved-note card, clears the textarea, and shows a success toast. An empty submission triggers native required-field validation, but whitespace-only input produces no visible explanation because the script silently returns after trimming it.
- Each Choose button opens the expected delete, suspend, remove, or ban confirmation dialog. Escape closes an open dialog, and Cancel/close/backdrop controls are present. Opening a dialog does not move focus into it; focus remains on the underlying Choose button, so keyboard focus is not contained in the active modal.
- Delete, remove, and ban confirmations close their dialogs and display distinct success outcomes. Delete only reduces the reported evidence opacity; all four action controls remain enabled and repeatable after every outcome.
- Suspension with no end value keeps the dialog open and shows a toast. A date before the input's displayed minimum was nevertheless accepted and produced a successful posting-suspended outcome, so the time boundary is not actually enforced by the action.
- The source conversation, participant context, report queue, and related discussion are all rendered as links. The source conversation and related private discussion currently point to the same generic thread file, so the mockup does not preserve which conversation context the reviewer intended to open.
- Reloading resets saved notes and applied actions. No console or page errors appeared during the inspected interactions.

## Code inspection observations

The page uses only local HTML and a shared local script. No real API, backend, authentication, authorization, notification, or third-party call was observed. In-page JavaScript directly mutates the note card, outcome banner, modal classes, and reported-message opacity. The shared modal behavior closes on Escape or backdrop click but does not establish initial dialog focus, trap focus, or explicitly restore it. The action handlers do not maintain a coherent ticket, message, membership, or restriction state after the success banner is shown.

## Recommended user experience and interactions

### PO-001: Load an authorized ticket with complete evidence

- **Scenario:** An owner or administrator opens a numbered report and needs enough trusted context to decide what to do.
- **Trigger:** The reviewer opens the ticket from the Reported Messages queue or follows a direct local ticket link.
- **Preconditions:** A local ticket fixture identifies the ticket number, governed conversation tags, reporter, flagged message, one adjacent message on each side when available, reported participant, reviewer role, existing notes, related discussion reference, and any already-applied moderation effects.
- **Expected behavior:** The page first indicates that the ticket is loading, then renders the evidence and enables only actions permitted for the current owner or administrator. A missing adjacent message is simply omitted and described as unavailable rather than replaced with invented content. Already-applied effects are visibly summarized without introducing ticket status, assignment, or closure concepts.
- **State/data effect:** Loading is read-only. The selected local ticket fixture becomes the authoritative in-page state; opening the page does not alter the message, membership, notes, or restrictions.
- **Alternate paths:** A missing ticket shows a ticket-not-found state with a return to reports; a fixture failure or simulated timeout shows a retry that remains local; an unauthorized or newly stale role shows access denied without exposing report evidence; an archived or otherwise unavailable source conversation preserves the retained ticket evidence while disabling navigation that cannot succeed.
- **QA acceptance check:** Open the normal, delayed, missing, failed, and unauthorized local ticket variants. Confirm that only the normal authorized variant reveals evidence and enables allowed actions, retry recovers the failed variant locally, and none of the variants contacts a live API or external service.

### PO-002: Record reviewer notes without losing prior context

- **Scenario:** An authorized reviewer records reasoning that other authorized reviewers need for this ticket.
- **Trigger:** The reviewer enters note text and activates Save note.
- **Preconditions:** The ticket is loaded, the reviewer remains authorized, and the note contains at least one non-whitespace character.
- **Expected behavior:** Save indicates brief local progress, appends the new note with the current reviewer and a readable mock timestamp, clears the composer only after success, and confirms the result near the notes. Existing notes remain visible; saving another note must not overwrite the prior one. The page must not expose a note-visibility selector because that model is unresolved.
- **State/data effect:** One local note record is appended to this ticket fixture. The note text and existing records remain unchanged on cancellation or failure, and the saved note remains present for the rest of the local review session.
- **Alternate paths:** Empty or whitespace-only input shows an inline validation message and preserves focus; a simulated save failure or timeout preserves the entered text and offers retry; permission loss or a stale ticket prevents the append and explains that no note was recorded; repeated activation while saving does not duplicate the note.
- **QA acceptance check:** Save two valid notes and confirm both remain in order with reviewer attribution; try empty and whitespace-only text and confirm no note is created; run the failure, timeout, retry, duplicate-submit, and permission-denied variants and verify that local note state changes exactly once only after a successful save.

### PO-003: Confirm or cancel each moderation action safely

- **Scenario:** A reviewer needs to understand the consequence of a sanction before applying it and must be able to leave without accidental change.
- **Trigger:** The reviewer activates Choose for delete, suspension, removal, or ban, then confirms, cancels, presses Escape, or closes the dialog.
- **Preconditions:** The action is currently allowed by the reviewer's role and the reported participant's latest local membership state.
- **Expected behavior:** A single clearly named confirmation dialog opens, moves keyboard focus inside, keeps focus within the dialog, and describes the user-facing consequence and retained history. Cancel, Escape, and the close control dismiss it with no change and return focus to the initiating action. Confirm prevents repeat activation while the local result is pending and then returns focus to a meaningful result or control.
- **State/data effect:** Merely opening or dismissing a dialog changes no ticket, message, membership, restriction, or note data. Only a successful confirmation applies the action-specific local effect.
- **Alternate paths:** A permission denial, stale participant state, simulated failure, or timeout keeps data unchanged and offers a safe return or retry; only one dialog can be active; background controls cannot be operated while it is open; a repeated confirmation cannot apply the same action twice.
- **QA acceptance check:** For every action, open the dialog by keyboard, verify focus enters and cycles within it, cancel once by each supported dismissal, and confirm no state changes. Then confirm under success, failure, stale, timeout, and permission-denied local variants and verify one visible result and at most one data effect.

### PO-004: Delete the reported message while retaining moderation evidence

- **Scenario:** A reviewer decides that the reported message should no longer be visible in the source conversation.
- **Trigger:** The reviewer chooses Delete message and confirms the deletion dialog.
- **Preconditions:** The reviewer is authorized, the flagged message has not already been deleted, and the ticket's local message reference is current.
- **Expected behavior:** The page indicates brief progress, then marks the evidence as deleted from participant view while keeping its retained moderation copy readable on this ticket. A clear outcome explains that the author's membership and posting ability did not change. The delete action becomes unavailable so the result cannot be applied twice.
- **State/data effect:** The local message fixture gains a soft-deleted/hidden-from-conversation state; ticket evidence and authorship remain retained. Membership, posting suspension, notes, and related discussion state remain unchanged.
- **Alternate paths:** Cancel leaves the message untouched; an already-deleted or stale message refreshes to the retained-evidence state without duplicating the action; a simulated failure, timeout, or permission denial leaves the message visible in the source fixture and provides retry or return; deletion never becomes hard deletion.
- **QA acceptance check:** Confirm deletion and verify the source-conversation view no longer shows the message, the ticket still shows retained evidence and attribution, the delete control is unavailable, and reload of the local scenario preserves the effect. Verify cancel and all failure variants leave both views unchanged.

### PO-005: Apply a future-bounded posting suspension

- **Scenario:** A reviewer allows the participant to remain and read while preventing new posts until a chosen end time.
- **Trigger:** The reviewer chooses Suspend posting, selects a date and time, and confirms.
- **Preconditions:** The reviewer is authorized, the reported participant is an active member who can currently post, and the entered end time is later than the mock current time.
- **Expected behavior:** The dialog explains that reading remains available, identifies the reviewer's local time zone, validates the end time before applying, and then shows the exact suspension end in a persistent ticket outcome. The action reflects the active restriction instead of remaining an unchanged, repeatable choice.
- **State/data effect:** A time-bounded posting-suspension record is added to the participant's local conversation state. Membership and existing messages remain unchanged.
- **Alternate paths:** Missing, invalid, or past end times show inline validation and keep the dialog open; cancel creates no restriction; an existing longer suspension requires an explicit replacement confirmation rather than silent shortening; a stale membership, permission denial, simulated failure, or timeout changes nothing and permits a local retry where appropriate.
- **QA acceptance check:** Attempt empty, malformed, current, and past values and confirm none apply. Apply a valid future time and verify the exact end appears on the ticket and the source conversation blocks only posting for that participant; test cancel, existing-restriction, failure, timeout, and permission-denied variants for no unintended state change.

### PO-006: Remove an active non-owner participant

- **Scenario:** A reviewer ends the reported participant's active membership without banning re-entry.
- **Trigger:** The reviewer chooses Remove participant and confirms the removal dialog.
- **Preconditions:** The reviewer is authorized, the participant is active, and the current local membership confirms the reviewer may alter that participant; an administrator must not remove or otherwise alter an owner.
- **Expected behavior:** The confirmation distinguishes removal from banning. On success, the page identifies the participant as former, confirms that undeleted messages remain attributed, and updates the available actions to the new state. Removal must not claim that the participant is blocked from rejoining.
- **State/data effect:** The local membership period ends and the participant becomes former/inactive. Identity, retained membership history, messages, ticket evidence, and notes remain; any action whose preconditions no longer hold becomes unavailable.
- **Alternate paths:** Cancel changes nothing; if the participant is already former, has become an owner, or the reviewer's permission is stale, the page explains that removal was not applied and refreshes the visible local state; simulated failure or timeout leaves the active membership unchanged and offers retry.
- **QA acceptance check:** Remove the active non-owner fixture and verify Members shows the participant as former while undeleted messages remain attributed and rejoining is not described as blocked. Verify cancel, owner, already-former, failure, timeout, and permission-denied variants do not end an ineligible membership.

### PO-007: Ban a participant without erasing history

- **Scenario:** A reviewer must end current participation and prevent the identity from rejoining the governed conversation.
- **Trigger:** The reviewer chooses Ban participant and confirms the ban dialog.
- **Preconditions:** The reviewer is authorized to alter the reported participant, the participant is not an owner protected from the reviewer's role, and the identity is not already banned.
- **Expected behavior:** The dialog clearly distinguishes banning from message deletion and removal. On success, the page confirms that the participant cannot participate or rejoin while retained messages, membership history, identity, and ticket evidence remain available to authorized reviewers. Conflicting or duplicate sanctions update to match the banned state.
- **State/data effect:** The local membership becomes banned/role-none and active permissions end. The participant's retained content and history are not deleted; notes and the related discussion remain unchanged.
- **Alternate paths:** A former non-banned participant may still be banned after explicit confirmation; cancel changes nothing; already-banned, newly owner, stale, permission-denied, simulated failure, and timeout variants apply no duplicate or unauthorized effect and show the current state with retry only when meaningful.
- **QA acceptance check:** Ban active and former eligible fixtures and verify both cannot post or rejoin while their undeleted messages and retained history remain visible to authorized reviewers. Verify cancel, already-banned, owner, stale, failure, timeout, and permission-denied variants produce no extra membership period or data loss.

### PO-008: Preserve context across moderation navigation

- **Scenario:** A reviewer needs more source, participant, or private discussion context and then needs to return to the same ticket.
- **Trigger:** The reviewer activates Back to reports, Open source conversation, View participant context, or the existing related-discussion link.
- **Preconditions:** The selected local ticket fixture supplies the source conversation reference and, only when applicable, a distinct related moderation conversation reference.
- **Expected behavior:** Back returns to the reports queue with its prior governed-conversation filter; source opens the reported conversation around the retained message context or its deleted location; participant context opens the reported participant within that conversation's authorized roster; related discussion opens the distinct linked private conversation. Each destination provides a clear path back to this numbered report.
- **State/data effect:** Navigation does not modify ticket, message, membership, suspension, or note data. The local navigation context preserves the selected ticket and conversation so generic thread or member pages show the intended fixture.
- **Alternate paths:** If no related discussion exists, that card/link is omitted without creating one automatically; an unavailable source preserves the ticket evidence and offers return; permission denial reveals no protected conversation or former-member details; a stale or missing destination returns to the ticket with a concise local error rather than a dead link.
- **QA acceptance check:** Activate each link and verify the destination matches ticket 1048's source, participant, or distinct related discussion, then return to the same ticket. Repeat with no-discussion, unavailable-source, stale-link, and unauthorized fixtures and verify no dead route or protected-data disclosure occurs.

## Dynamic data, local fixture, and state expectations

The minimal local model is one moderation-ticket fixture plus referenced conversation, message, identity, membership, suspension, note, reviewer-permission, and optional related-conversation records. It needs deterministic variants for normal, loading, missing, failed, timeout, stale, and permission-denied review; action state should persist across page-local navigation or reload strongly enough for QA to observe consequences. This is mock data needed to exercise the approved page, not a request to expose raw identifiers, JSON, schema metadata, audit history, or additional product fields in the interface.

## External service and real API avoidance

No real API, backend, authentication, or third-party behavior was observed in the current page, and none is needed. Authorization, loading delay, save/action success, failure, timeout, stale data, and retry must be fixture-backed or simulated locally. The identified reviewer session is assumed; do not add or contact an authentication provider. Reviewer-note or moderation outcomes must not send notifications or call production services.

## Validation, confirmation, and linked-control expectations

- Reviewer notes reject empty and whitespace-only input inline and retain unsaved content through recoverable failures.
- Suspension requires a valid end date/time later than the mock current time and clearly uses the reviewer's local time zone.
- Every sanction uses a consequence-specific confirmation, supports safe cancellation, and rechecks local authorization and current participant/message state before applying.
- Applied actions update related controls so duplicate, contradictory, or no-longer-eligible choices cannot silently mutate state.
- Queue, source, participant, and related-discussion links carry the ticket's local context and never substitute one destination for another.

## Buttons and links to retain or clarify

- Retain Back to reports for returning to the moderation queue and its prior conversation filter.
- Retain Open source conversation for inspecting the governed conversation, including a locally represented deleted-message location when applicable.
- Retain View participant context for the authorized roster entry; it must not grant ordinary members access to former-member details.
- Retain the related-discussion link only when the ticket fixture actually references an existing private moderation conversation, and make that destination distinct from the source conversation.
- Keep the four moderation choices explicit. Their post-action labels or availability should reflect the current local state rather than remaining generic repeated Choose buttons.

## Intentionally out of scope

- Ticket statuses, assignment, closure, queues beyond the existing reports page, service-level timers, notifications, and automatic sanctions.
- Creating a related moderation conversation from this page or making such a conversation mandatory.
- Resolving note visibility with a selector, exposing exhaustive moderation/audit history, or showing raw IDs, JSON, schema fields, soft-delete metadata, or role-period internals.
- Changing owners, adding participant-management features beyond the supported ticket actions, hard-deleting messages or identities, or adding new pages or major sections.
- Real API, backend, authentication, authorization-provider, notification, or third-party integrations.

## Change statement

No mockup HTML, CSS, JavaScript, concept, schema, application, or asset files were changed. This Product Owner phase created only `docs/mockup/tasks/moderation-ticket-review.md`.
