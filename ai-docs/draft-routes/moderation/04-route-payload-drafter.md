# Phase 4 Route Payload Drafter Handoff

## Target And Scope

- `solutionArtifactRoot`: `/Users/flackey/Source/Personal/FredLackeySandbox/spike-alltawk`
- Scenario: `root-artifact-monorepo`
- Work unit: desktop `moderation`
- Route namespace: `moderation`
- Route file: `docs/mockup/routes/moderation-routes.md`
- Requirements and page catalog read: `docs/concepts/REQUIREMENTS.md`, `docs/concepts/APP_PAGES.md`
- Phase 3 input read: `ai-docs/draft-routes/moderation/03-area-route-drafter.md`
- Mockup files inspected:
  - `docs/mockup/desktop/moderation/index.html`
  - `docs/mockup/desktop/moderation/index.md`
  - `docs/mockup/desktop/moderation/ticket.html`
  - `docs/mockup/desktop/moderation/ticket.md`
- Directly referenced supporting behavior inspected: `docs/mockup/desktop/assets/app.js`

All markdown path references are repository-relative to `solutionArtifactRoot`. Every filesystem read and write used the assigned absolute path under that root.

## Routes Updated

The fixed eight-route scope, headings, descriptions, identities, source-action mappings, and mockup-file mappings were preserved:

1. `GET /api/v0/moderation/retrieve-reviewable-reports`
2. `GET /api/v0/moderation/retrieve-moderation-ticket`
3. `POST /api/v0/moderation/create-reviewer-note`
4. `DELETE /api/v0/moderation/delete-reported-message`
5. `POST /api/v0/moderation/create-posting-suspension`
6. `PATCH /api/v0/moderation/update-posting-suspension`
7. `DELETE /api/v0/moderation/remove-participant`
8. `POST /api/v0/moderation/ban-participant`

Each route now has exactly one `### Example Request Payload` and one `### Example Response Payload`. The two retrieval routes use the exact no-body statement; the six mutation routes use concrete, parseable JSON requests. Responses provide the minimal UI-ready queue, ticket evidence, continuation values, created note, retained-deletion effect, suspension state, and participant-state effects needed by the referenced pages.

## Rendered Inspection

Playwright rendered both referenced HTML pages at viewport width `1080`.

- Queue states: populated, authorized-origin preselection, stale-origin reset, loading, empty, mixed-authority, denied, recoverable failure, persistent failure, retry success, and retry failure.
- Ticket entry states: normal, loading, missing, unauthorized, failed, timeout, retry recovery, retained-deleted message, unavailable source conversation, and no related discussion.
- Ticket action states: reviewer-note pending and success, confirmed soft deletion, posting-suspension create, shorter-suspension replacement with explicit acknowledgment, participant removal, and participant ban.

An initial inspection run exposed an incorrect test selector for the ticket retry button; this was an inspection-spec issue, not a selected runner failure. The corrected inspection reran with the exact approved runner contract and all eight tests passed.

## Playwright Runner Contract

- `id`: `local-node-modules-cli`
- `label`: `./node_modules/.bin/playwright`
- `usage`: `./node_modules/.bin/playwright`
- `command`: `/Users/flackey/Source/Personal/FredLackeySandbox/spike-alltawk/node_modules/.bin/playwright`
- `baseArgs`: `[]`
- `version`: `1.62.0`
- `testRunnerModule`: `/Users/flackey/Source/Personal/FredLackeySandbox/spike-alltawk/node_modules/playwright/test.js`

The CommonJS inspection specification imported `test` and `expect` from the exact absolute `testRunnerModule` and invoked the supplied command with the `test` subcommand. All specifications, configuration, screenshots, reports, and test output were confined to `/Users/flackey/Source/Personal/FredLackeySandbox/spike-alltawk/.solpoc-tmp/draft-routes/moderation/04-route-payload-drafter/`. That private temporary directory was removed before this handoff was written.

## Request Context Sources

- Every route documents the browser-managed authenticated session cookie as outside-body context; no cookie value appears in JSON.
- Queue origin selection comes from the current page URL only when it names an authorized governed conversation.
- Ticket selection uses public `reportUid` and `conversationUid` values returned by the queue and carried in the current page URL.
- Ticket mutation requests carry the public `reportUid` plus the applicable `messageUid`, `participantUid`, or `suspensionUid` from ticket retrieval or the prior suspension response.
- Reviewer note text, suspension end time, confirmation, and shorter-period replacement acknowledgment come from visible controls.
- Reviewer identity, current roles, permissions, ownership, authoritative timestamps, validation decisions, and current record state stay behind the UX API boundary.

## Route Authoring Rules Applied

- Preserved all eight approved source actions and all discovered page states.
- Kept posting-suspension create and update contracts separate.
- Made the ticket retrieval response continuation-complete for every visible moderation action and included current suspension continuation fields when present.
- Returned editable/current values and public identifiers only where the UI needs them for rendering or a later visible action.
- Kept requests limited to user-entered values, visible confirmation intent, selected public UIDs, and carry-forward version/state values needed for safe updates.
- Used 32-character hyphenless v4 UUID examples for every UID and all-caps strings for selectable state and action values.
- Classified browser-returned navigation URLs and continuation UIDs as public-safe; no raw credentials, tokens, database IDs, audit rows, permission internals, or lower-layer contracts appear in JSON.
- Represented a concrete successful branch per route without inventing unresolved ticket status, assignment, notification, closure, note-visibility, or related-discussion-creation behavior.

## Unresolved Ambiguities

- The static queue uses `origin`, while ticket return links use `conversation`; Phase 5 should normalize the documented browser transport without changing route identity.
- The static ticket always renders fixture report `#1048` rather than binding displayed evidence to its URL values; the payload uses public values from the selected queue result as required by the corrected companion and Phase 3 feasibility findings.
- The mockup has no initial already-suspended scenario. The rendered post-create `Change` state proves the update continuation and shorter-period acknowledgment behavior.
- Ticket status, assignment, notification, closure, note visibility, suspension cancellation, and related-discussion creation remain unresolved and were not added.

## Validation And Scope Confirmation

- Confirmed eight route sections remain.
- Confirmed every route has exactly one `### Source Actions`, `### Mockup Files`, `### Example Request Payload`, and `### Example Response Payload`.
- Parsed every JSON example successfully.
- Confirmed every UID example is 32 characters, hyphenless, version 4, and uses an RFC 4122 variant nibble.
- Modified only `docs/mockup/routes/moderation-routes.md` and `ai-docs/draft-routes/moderation/04-route-payload-drafter.md`.
- Did not edit companions, HTML, CSS, JavaScript, concept docs, schemas, mock data, application code, package files, OpenAPI files, lower-layer API contracts, frontend business rules, or downstream handoffs.
