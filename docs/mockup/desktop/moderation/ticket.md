---
paired_html: docs/mockup/desktop/moderation/ticket.html
description: "Lets an authorized reviewer examine one flagged message, preserve review context, and apply supported moderation actions."
---

# Backend Data Actions

## Retrieve Moderation Ticket

### Page States

- Initial ticket load and retry after failed or timed-out retrieval.
- Normal evidence, previously deleted message with retained evidence, unavailable source conversation, and absent related-discussion variants.
- Still-loading, missing, and authorization-revoked outcomes.
- Post-action refresh state in which existing notes, message visibility, participant status, posting suspension, and applied effects determine available controls.

### Evidence

- `docs/mockup/desktop/moderation/ticket.html` — the loading lifecycle resolves fixtures into the report number, conversation tags, flagged message, adjacent context, reporter explanation, existing reviewer notes, action availability, and optional related discussion.
- `docs/mockup/desktop/moderation/ticket.html` — `?scenario=` branches render loading, missing, unauthorized, failed, timeout, previously deleted, unavailable-source, and no-discussion outcomes; failed and timeout states retry to loaded content.
- `docs/concepts/APP_PAGES.md` — Moderation Ticket requires the numbered report, flagged message, limited context, reporter explanation, reviewer notes, supported actions, and an optional existing related moderation conversation.
- `docs/concepts/REQUIREMENTS.md` — reports are available only to affected-conversation owners and administrators, and retained evidence and moderation history are not hard-deleted.

### Backend Need

The page needs authoritative ticket evidence and current moderation state scoped to a reviewer who still owns or administers the affected conversation. The response must preserve retained evidence while withholding it for missing or unauthorized access and must supply the current action availability needed to avoid applying stale or incompatible decisions.

### Visible Inputs

- Report number and source-conversation value carried in the current page URL.

### Required Outcomes

- A loaded case with flagged-message evidence, limited adjacent context, reporter identity and explanation, ordered reviewer notes, permitted moderation controls, and any existing related discussion.
- A retained-evidence presentation when the source message was already soft-deleted, including its current deletion outcome.
- Clear loading, missing, unauthorized, failed, timeout, unavailable-source, and no-related-discussion outcomes without disclosing inaccessible evidence.
- Retry recovery to current ticket data and action availability.

## Create Reviewer Note

### Page States

- Loaded authorized ticket with an existing ordered note list.
- Empty or whitespace-only submission, pending save, successful append, and duplicate-submit prevention while saving.

### Evidence

- `docs/mockup/desktop/moderation/ticket.html` — the Reviewer notes form validates trimmed text, shows `Saving…`, waits on a simulated save timer, appends the current reviewer and timestamp, and announces success.
- `docs/concepts/APP_PAGES.md` — an authorized reviewer must be able to add a reviewer note without an unresolved visibility selector.
- `docs/concepts/REQUIREMENTS.md` — owners and administrators may attach operational notes to a moderation ticket, and relevant notes remain associated with the ticket.

### Backend Need

The note must be durably created against the current moderation ticket under the authenticated reviewer identity and returned in authoritative order. The backend must reject invalid or stale access and ensure one submission does not create duplicate notes.

### Visible Inputs

- Report number carried by the current ticket page.
- Reviewer-entered note text.

### Required Outcomes

- Inline validation for blank note text without persistence.
- Pending state that prevents duplicate submission.
- Successful append showing author, timestamp, and note text in the ordered note list.

## Delete Reported Message

### Page States

- Loaded authorized ticket where the reported message is still visible in its source conversation.
- Confirmation dialog, pending action, successful soft deletion, already-deleted retained-evidence state, and stale recheck before confirmation.

### Evidence

- `docs/mockup/desktop/moderation/ticket.html` — Delete message opens a confirmation explaining soft deletion, uses a simulated action timer, marks the message as deleted, disables the action, preserves retained evidence, and displays an applied effect.
- `docs/concepts/APP_PAGES.md` — supported ticket outcomes include message deletion with confirmation and visible outcome feedback.
- `docs/concepts/REQUIREMENTS.md` — owners and administrators may delete reported messages; deleted messages disappear from the conversation but remain soft-deleted and associated with retained moderation history.

### Backend Need

Deleting the reported message is a privileged server-controlled action that must soft-delete the source message, preserve the ticket evidence, and associate the outcome with the ticket. The server must recheck current authorization and message state so an already-deleted or stale action is not applied twice.

### Visible Inputs

- Report number and reported-message reference carried forward from the loaded ticket.
- Explicit reviewer confirmation.

### Required Outcomes

- Confirmation without changing the message when canceled.
- Pending action that prevents duplicate confirmation.
- Success showing retained evidence, a disabled Deleted action, and an applied effect while leaving membership and posting ability unchanged.
- An already-deleted outcome that preserves the retained evidence and keeps the delete action unavailable.

## Create Posting Suspension

### Page States

- Loaded authorized ticket for an active participant who has no current posting suspension.
- Confirmation with missing, invalid, or non-future end time; pending creation; successful time-bounded suspension; and incompatible participant-state handling.

### Evidence

- `docs/mockup/desktop/moderation/ticket.html` — Suspend posting requires a local date/time after the displayed current time, simulates pending work, records an end time, updates the action to Change, and displays that the participant may still read.
- `docs/concepts/APP_PAGES.md` — ticket review supports a time-bounded posting suspension with confirmation and outcome feedback.
- `docs/concepts/REQUIREMENTS.md` — owners and administrators may prevent a participant from posting until a specified end date or time while the participant remains a member.

### Backend Need

The backend must create a durable, time-bounded posting restriction for the active participant and associate the moderation outcome with the ticket. It must validate current authority, participant eligibility, and the future end time before returning the effective restriction.

### Visible Inputs

- Report number and target participant carried forward from the loaded ticket.
- Reviewer-entered suspension end date and time.
- Explicit reviewer confirmation.

### Required Outcomes

- Validation for missing, invalid, or non-future end time without creating a restriction.
- Pending state that prevents duplicate submission.
- Success showing the effective end date and time, retained reading access, an applied effect, and a Change continuation.
- An incompatible former-or-banned participant state in which suspension is unavailable.

## Update Posting Suspension

### Page States

- Loaded or post-action ticket where an active participant already has a posting suspension and the action is labeled Change.
- Proposed later end time, proposed shorter replacement requiring an extra acknowledgment, pending update, and successful replacement.

### Evidence

- `docs/mockup/desktop/moderation/ticket.html` — an applied suspension changes the control to Change; the handler compares the proposed end with the current suspension and requires an explicit replacement checkbox before shortening it.
- `docs/mockup/desktop/moderation/ticket.html` — successful replacement updates the displayed effective end time and overwrites the suspension effect rather than creating a duplicate effect.
- `docs/concepts/REQUIREMENTS.md` — posting suspension is a durable, time-bounded moderation restriction associated with an identity and conversation.

### Backend Need

The backend must update the current posting suspension rather than create a second ambiguous restriction. It must recheck the existing effective restriction and require the reviewer's explicit replacement intent when shortening the active period.

### Visible Inputs

- Report number, target participant, and current effective suspension carried forward from the loaded ticket.
- Reviewer-entered replacement end date and time.
- Explicit shorter-period replacement acknowledgment when applicable.

### Required Outcomes

- Validation that explains when the proposed end would shorten an existing suspension and requires explicit acknowledgment.
- Pending state that prevents duplicate updates.
- Success showing one authoritative replacement end time and updated applied effect.

## Remove Participant

### Page States

- Loaded authorized ticket for an active non-owner participant.
- Confirmation, pending action, successful removal to former-participant state, and stale or already-inactive handling.

### Evidence

- `docs/mockup/desktop/moderation/ticket.html` — Remove participant confirms that removal is not a ban, simulates pending work, changes the participant to former, disables removal and suspension, and retains attributed messages.
- `docs/concepts/APP_PAGES.md` — participant removal is a supported ticket action with confirmation and outcome feedback.
- `docs/concepts/REQUIREMENTS.md` — owners and administrators may remove participants by ending active membership while retained messages and membership history remain stored.

### Backend Need

Removal must durably end the participant's active membership without banning the identity or deleting retained history, and the action must remain associated with the ticket. The server must recheck current authorization, participant state, and role constraints before applying it.

### Visible Inputs

- Report number and target participant carried forward from the loaded ticket.
- Explicit reviewer confirmation.

### Required Outcomes

- Confirmation that removal permits later rejoining and retains attributed messages.
- Pending state that prevents duplicate application.
- Success showing the former-participant outcome and disabling actions that require active membership.
- An already-inactive outcome in which removal and suspension are unavailable.

## Ban Participant

### Page States

- Loaded authorized ticket for a participant who is not currently banned.
- Confirmation, pending action, successful ban, and stale or already-banned handling.

### Evidence

- `docs/mockup/desktop/moderation/ticket.html` — Ban participant confirms that the ban blocks posting and rejoining, simulates pending work, changes the participant to banned, disables ban/removal/suspension, and retains membership, messages, and report evidence.
- `docs/concepts/APP_PAGES.md` — banning is a supported ticket outcome with confirmation and visible feedback.
- `docs/concepts/REQUIREMENTS.md` — owners and administrators may ban a participant by retaining membership history with no active participation rights, preventing the identity from rejoining.

### Backend Need

Banning is a privileged durable membership action that must end active participation, prevent rejoining, retain historical records, and associate the moderation outcome with the ticket. The server must recheck current authorization, target state, and applicable role constraints before applying the ban.

### Visible Inputs

- Report number and target participant carried forward from the loaded ticket.
- Explicit reviewer confirmation.

### Required Outcomes

- Confirmation that distinguishes a ban from removal and message deletion.
- Pending state that prevents duplicate application.
- Success showing the banned outcome, blocked posting and rejoining, retained history, and disabled incompatible actions.
- An already-banned outcome in which ban, removal, and suspension are unavailable.
