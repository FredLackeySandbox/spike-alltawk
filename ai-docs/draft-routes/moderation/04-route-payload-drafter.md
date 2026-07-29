# Phase 4 Route Payload Drafter Handoff

## Target And Scope

- `solutionArtifactRoot`: `/Users/flackey/Source/Personal/FredLackeySandbox/spike-alltawk`
- Scenario: `root-artifact-monorepo`
- Work unit: desktop `moderation`
- Route file: `docs/mockup/routes/moderation-routes.md`
- Requirements and page catalog: `docs/concepts/REQUIREMENTS.md`, `docs/concepts/APP_PAGES.md`
- Source pages and companions:
  - `docs/mockup/desktop/moderation/index.html`
  - `docs/mockup/desktop/moderation/index.md`
  - `docs/mockup/desktop/moderation/ticket.html`
  - `docs/mockup/desktop/moderation/ticket.md`
- Supporting local behavior inspected: `docs/mockup/desktop/assets/app.js`
- Phase 3 input: `ai-docs/draft-routes/moderation/03-area-route-drafter.md`

All artifact path references in this handoff and the route file are repository-relative to `solutionArtifactRoot`; all filesystem reads and writes used absolute paths under that root.

## Routes And Payloads Reviewed

The fixed eight-route scope and all eight approved `### Source Actions` mappings were preserved:

1. `GET /api/v0/moderation/retrieve-reviewable-reports`
2. `GET /api/v0/moderation/retrieve-moderation-ticket`
3. `POST /api/v0/moderation/create-reviewer-note`
4. `DELETE /api/v0/moderation/delete-reported-message`
5. `POST /api/v0/moderation/create-posting-suspension`
6. `PATCH /api/v0/moderation/update-posting-suspension`
7. `DELETE /api/v0/moderation/remove-participant`
8. `POST /api/v0/moderation/ban-participant`

Every route has exactly one `### Example Request Payload` and one `### Example Response Payload`. Request examples contain only page URL values, prior UX API response UIDs, or reviewer-entered values. Responses contain display-ready ticket, queue, note, effect, participant, suspension, navigation, and allowed-action values needed by the referenced pages. All JSON examples parse, all public UID examples are 32-character hyphenless v4 values, and selectable enum values use all-caps strings.

The ticket retrieval response heading was normalized to the required exact subsection name. Its one concrete response example represents the initial no-suspension state, while adjacent contract text explains the existing-suspension continuation without creating a second payload subsection. The existing valid examples for the other seven routes were retained after full source-action, page-state, and invocation-feasibility review.

## Rendered Inspection

Both referenced HTML pages and all safely renderable source-action states were inspected at viewport width `1080` with Playwright:

- Queue: populated, authorized origin preselection, all governed conversations, empty, mixed-authority, denied, loading, recoverable failure, repeated failure, retry, and in-memory conversation filtering.
- Ticket entry: normal, retained deletion, unavailable source, no related discussion, loading, missing, unauthorized, failure, timeout, and retry recovery.
- Ticket interactions: blank-note validation, note pending/success, message deletion confirmation/success, suspension validation/create, shorter-suspension acknowledgment/update, participant removal, and participant ban.

Five Playwright tests passed. Fixtures, timers, deterministic scenario branches, generated timestamps, local state transitions, retained evidence, and action-state changes were treated as intended backend behavior signals.

## Playwright Runner Contract

- `id`: `local-node-modules-cli`
- `label`: `./node_modules/.bin/playwright`
- `usage`: `./node_modules/.bin/playwright`
- `command`: `/Users/flackey/Source/Personal/FredLackeySandbox/spike-alltawk/node_modules/.bin/playwright`
- `baseArgs`: `[]`
- `version`: `1.62.0`
- `testRunnerModule`: `/Users/flackey/Source/Personal/FredLackeySandbox/spike-alltawk/node_modules/playwright/test.js`

The generated CommonJS specification imported `test` and `expect` from the exact `testRunnerModule`. All specifications, configuration, screenshots, reports, traces, and test output were confined to `/Users/flackey/Source/Personal/FredLackeySandbox/spike-alltawk/.solpoc-tmp/draft-routes/moderation/04-route-payload-drafter/`. That private temporary directory was removed before this handoff was written.

## Route Authoring Rules Applied

- Preserved all source-action and mockup-file mappings and covered every discovered entry and post-action state.
- Kept posting-suspension create and update contracts separate.
- Confirmed every request value is available from the current URL, reviewer input, prior UX API response, or browser-managed session cookie.
- Kept queue and ticket retrieval responses UI-ready and continuation-complete.
- Returned editable/current suspension values and public carry-forward UIDs only when a later visible action needs them.
- Kept confirmation, authorization, stale-state checks, server time, identity, permissions, ownership, and data joins behind the UX API boundary.
- Kept browser-returned navigation and continuation values public-safe; no cookies, bearer tokens, credentials, database IDs, audit rows, or internal workflow state appear in JSON.
- Preserved concrete empty, denied, failure, retained-deletion, unavailable-source, no-discussion, and post-action semantics without inventing ticket statuses or assignments.

## Request Context And Ambiguities

- Every route retains concrete request context. The browser-managed `tawk_session` cookie is not copied into JSON.
- Queue origin preselection remains represented as `originConversationUid`; the mockup inconsistently uses `origin` on queue entry and `conversation` on return links.
- Ticket selection remains represented by `reportNumber` and `conversationUid`; the static mockup uses `ticket` and `conversation` and always renders fixture `#1048`.
- No initial already-suspended ticket scenario exists, but the post-create `Change` state safely exercises and requires the update continuation contract.
- Ticket statuses, assignment, notifications, closure, note visibility, suspension lifting, and related-discussion creation remain unresolved and were not invented.

## Validation And Scope Confirmation

- Route coverage validation passed: eight approved actions mapped to eight routes with no blockers.
- Payload structure validation passed: every route has exactly one request subsection and one exact response subsection; all request and response JSON blocks parse.
- Modified only `docs/mockup/routes/moderation-routes.md` and `ai-docs/draft-routes/moderation/04-route-payload-drafter.md`.
- Did not alter companions, HTML, CSS, JavaScript, concept files, schemas, application code, package files, OpenAPI YAML/JSON, downstream handoffs, or neighboring route artifacts.
