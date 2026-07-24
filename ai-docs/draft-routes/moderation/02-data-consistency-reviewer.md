# Phase 2 Data Consistency Reviewer Handoff

## Target

- `solutionArtifactRoot`: `/Users/flackey/Source/Personal/FredLackeySandbox/spike-alltawk`
- Platform/work unit: desktop `moderation`
- Page catalog: `docs/concepts/APP_PAGES.md`

## Files Reviewed

- `docs/concepts/REQUIREMENTS.md`
- `docs/concepts/APP_PAGES.md`
- `docs/mockup/desktop/moderation/index.html`
- `docs/mockup/desktop/moderation/index.md`
- `docs/mockup/desktop/moderation/ticket.html`
- `docs/mockup/desktop/moderation/ticket.md`
- `docs/mockup/desktop/assets/app.js`
- `ai-docs/draft-routes/moderation/01-backend-data-action-analyst.md`

## Corrections Made

- Kept `docs/mockup/desktop/moderation/index.md` unchanged because its single retrieval action covers the authorized queue load, governed-conversation scope, populated and empty results, denied access, recoverable failure, retry, and authorized-origin entry behavior without turning in-memory filtering or navigation into extra backend actions.
- Updated `docs/mockup/desktop/moderation/ticket.md` so Required Outcomes no longer promise unsupported post-submission failure or stale-refresh UI. The mockup has no note-save or moderation-action failure branch, and its repeat-action guards either expose an already-applied state or close silently.
- Preserved the separate `Create Posting Suspension` and `Update Posting Suspension` actions. The initial active-participant state creates a restriction, while the post-create `Change` state replaces the current restriction and requires explicit acknowledgment before shortening it.
- Preserved distinct deletion, removal, and ban actions because they have different retained-data and participation outcomes in both the requirements and the mockup.
- Preserved `Create Reviewer Note`; there is no existing-note edit control, so no unsupported update-note action was added.

## Conflicts Resolved

- The requirements and page catalog take precedence over the static fixture where the fixture cannot select arbitrary tickets. Queue links carry `ticket` and `conversation`, but `ticket.html` always renders report `#1048`; the companion therefore records the required selected-ticket retrieval while this source limitation remains a mockup inconsistency.
- `ticket.html` returns to `index.html?conversation=design`, while `index.html` recognizes `origin`, not `conversation`, for preselection. This inconsistency does not create a new backend action; it affects only restoration of the queue's presentation context.
- Ticket statuses, assignment, notification, and closure rules remain unresolved in `docs/concepts/REQUIREMENTS.md`. No lifecycle-status action was added.
- A related moderation conversation is optional and the page links only to one that already exists. Opening that link is navigation, not a current-page backend action; no create-discussion action was invented.

## Unresolved Ambiguities And Mockup Gaps

- The static ticket does not derive its report number, source conversation, or authorization outcome from the `ticket` and `conversation` URL values.
- Note creation and confirmed moderation actions have pending and success behavior but no rendered persistence-failure branch.
- Repeat delete, remove, or ban confirmations are guarded in source, but some stale guards close without an explanatory visible outcome.
- The suspension update state is reachable only after creating a suspension during the current page session; there is no initial scenario for a ticket whose participant already has a suspension.
- The requirements leave the formal ticket workflow, status values, note visibility model, and whether a related moderation conversation is required unresolved.

## Action Coverage Matrix

| Requirements-backed capability or discovered page state | Final coverage |
| --- | --- |
| Owners and administrators can see reports only for affected conversations they currently govern | `docs/mockup/desktop/moderation/index.md` — `Retrieve Reviewable Reports` |
| Queue initial loading, populated reports, report numbers, conversation tags, reporter identity, and reason excerpts | `docs/mockup/desktop/moderation/index.md` — `Retrieve Reviewable Reports` |
| Queue empty across the authorized scope or empty for one selected governed conversation | `docs/mockup/desktop/moderation/index.md` — `Retrieve Reviewable Reports` |
| No governed conversations, revoked authority, or member-only conversation data must not disclose reports | `docs/mockup/desktop/moderation/index.md` — `Retrieve Reviewable Reports` |
| Queue load failure, held loading, retry success, and repeated retry failure | `docs/mockup/desktop/moderation/index.md` — `Retrieve Reviewable Reports` |
| Authorized conversation-origin preselection and rejection of stale or unauthorized origin values | `docs/mockup/desktop/moderation/index.md` — `Retrieve Reviewable Reports` |
| Changing the conversation filter over reports already loaded into the page | No separate backend action: the source filters the authoritative queue already returned by `Retrieve Reviewable Reports` entirely in memory. |
| Opening a selected report from its ticket reference | No separate queue-page action: navigation supplies the destination page-entry values; authoritative destination loading is covered by `Retrieve Moderation Ticket`. |
| Authorized retrieval of one numbered ticket, its conversation tags, flagged message, limited surrounding context, reporter, explanation, notes, participant state, and available actions | `docs/mockup/desktop/moderation/ticket.md` — `Retrieve Moderation Ticket` |
| Ticket initial loading, failed or timed-out retrieval, retry recovery, missing report, and authorization revoked | `docs/mockup/desktop/moderation/ticket.md` — `Retrieve Moderation Ticket` |
| Soft-deleted source message with retained moderation evidence and current deletion state | `docs/mockup/desktop/moderation/ticket.md` — `Retrieve Moderation Ticket` |
| Source conversation unavailable and optional related moderation discussion absent or present | `docs/mockup/desktop/moderation/ticket.md` — `Retrieve Moderation Ticket` |
| Existing related moderation conversation link | No separate current-page backend action: the ticket retrieval supplies whether the link exists, and selecting it is navigation to the normal conversation workspace. |
| Add an operational reviewer note associated with the ticket | `docs/mockup/desktop/moderation/ticket.md` — `Create Reviewer Note` |
| Reviewer-note blank validation, pending save, duplicate-submit prevention, successful ordered append with author and timestamp | `docs/mockup/desktop/moderation/ticket.md` — `Create Reviewer Note` |
| Delete the reported message while retaining the moderation copy and history | `docs/mockup/desktop/moderation/ticket.md` — `Delete Reported Message` |
| Delete confirmation and cancel, pending application, successful soft deletion, and already-deleted retained-evidence state | `docs/mockup/desktop/moderation/ticket.md` — `Delete Reported Message` |
| Apply a time-bounded posting suspension while the participant remains a member able to read | `docs/mockup/desktop/moderation/ticket.md` — `Create Posting Suspension` |
| Suspension missing, invalid, or non-future end-time validation; pending creation; success; unavailable action for former or banned participants | `docs/mockup/desktop/moderation/ticket.md` — `Create Posting Suspension` |
| Change an existing suspension rather than create a duplicate restriction | `docs/mockup/desktop/moderation/ticket.md` — `Update Posting Suspension` |
| Suspension replacement with a later end time or an explicitly acknowledged shorter end time | `docs/mockup/desktop/moderation/ticket.md` — `Update Posting Suspension` |
| End active membership without banning, while retaining membership history and attributed messages | `docs/mockup/desktop/moderation/ticket.md` — `Remove Participant` |
| Removal confirmation and cancel, pending application, successful former-participant state, and already-inactive action unavailability | `docs/mockup/desktop/moderation/ticket.md` — `Remove Participant` |
| Ban an identity from participation and rejoining while retaining historical records | `docs/mockup/desktop/moderation/ticket.md` — `Ban Participant` |
| Ban confirmation and cancel, pending application, successful banned state, and already-banned action unavailability | `docs/mockup/desktop/moderation/ticket.md` — `Ban Participant` |
| Create a ticket-status pipeline, assignments, bulk resolution, or automatic sanctions | No backend action: these behaviors are explicitly unresolved or omitted by `docs/concepts/REQUIREMENTS.md` and `docs/concepts/APP_PAGES.md`. |
| Create a related private moderation conversation from this page | No backend action: the requirement says the relationship is optional or unresolved, and the assigned mockup exposes only navigation to an existing discussion. |
| Edit or delete an existing reviewer note | No backend action: neither the requirements nor the assigned source provides those controls or behaviors. |

## Final Action Inventory

- `docs/mockup/desktop/moderation/index.md`
  - `Retrieve Reviewable Reports`
- `docs/mockup/desktop/moderation/ticket.md`
  - `Retrieve Moderation Ticket`
  - `Create Reviewer Note`
  - `Delete Reported Message`
  - `Create Posting Suspension`
  - `Update Posting Suspension`
  - `Remove Participant`
  - `Ban Participant`

## Scope Confirmation

- Changed only `docs/mockup/desktop/moderation/ticket.md` and `ai-docs/draft-routes/moderation/02-data-consistency-reviewer.md`.
- `docs/mockup/desktop/moderation/index.md` was reviewed and left unchanged.
- No route file, HTML, CSS, JavaScript, concept document, schema, mock data, package file, application source, backend design, frontend business rule, or database design was created or changed.
- All markdown path references above are repository-relative to `solutionArtifactRoot`; filesystem reads and writes used absolute paths under that root.
