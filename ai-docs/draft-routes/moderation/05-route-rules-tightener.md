# Phase 5 Route Rules Tightener Handoff

## Target And Scope

- `solutionArtifactRoot`: `/Users/flackey/Source/Personal/FredLackeySandbox/spike-alltawk`
- Scenario: `root-artifact-monorepo`
- Work unit: desktop `moderation`
- Tightened route file: `docs/mockup/routes/moderation-routes.md`
- Requirements and page catalog read: `docs/concepts/REQUIREMENTS.md`, `docs/concepts/APP_PAGES.md`
- Source companions and pages read:
  - `docs/mockup/desktop/moderation/index.md`
  - `docs/mockup/desktop/moderation/index.html`
  - `docs/mockup/desktop/moderation/ticket.md`
  - `docs/mockup/desktop/moderation/ticket.html`
- Directly referenced behavior inspected: `docs/mockup/desktop/assets/app.js`
- Prior handoffs read:
  - `ai-docs/draft-routes/moderation/03-area-route-drafter.md`
  - `ai-docs/draft-routes/moderation/04-route-payload-drafter.md`

All artifact path references in this handoff, the route file, `### Source Actions`, and `### Mockup Files` are repository-relative to `solutionArtifactRoot`; all filesystem operations used absolute paths under that root.

## Rendered Inspection

Playwright rendered both referenced HTML pages at viewport width `1080` and exercised every safely reachable source-action state:

- Queue: populated, empty, mixed-authority, denied, persistent loading, recoverable failure, repeated failure, retry success, authorized origin selection, stale-origin normalization, in-memory filtering, and return-context updates.
- Ticket retrieval: normal, retained deletion, unavailable source, no related discussion, persistent loading, missing, unauthorized, failed, timeout, and retry recovery.
- Ticket actions: blank-note validation, pending/successful note creation, message-deletion confirmation and retained-evidence result, posting-suspension creation, shorter-period acknowledgment and suspension update, participant removal, and participant banning.

Fixtures, timers, generated display timestamps, simulated authorization branches, and local action-state transitions were treated as evidence for intended backend retrieval, persistence, and privileged moderation behavior. Five Playwright tests passed. Inspection remained local and called no API, authentication service, backend, or third party.

## Playwright Runner Contract

- `id`: `local-node-modules-cli`
- `label`: `./node_modules/.bin/playwright`
- `usage`: `./node_modules/.bin/playwright`
- `command`: `/Users/flackey/Source/Personal/FredLackeySandbox/spike-alltawk/node_modules/.bin/playwright`
- `baseArgs`: `[]`
- `version`: `1.62.0`
- `testRunnerModule`: `/Users/flackey/Source/Personal/FredLackeySandbox/spike-alltawk/node_modules/playwright/test.js`
- Invocation used the supplied command with the `test` subcommand and the private specification/configuration paths.

The CommonJS specification imported `test` and `expect` from the exact absolute `testRunnerModule`. No package-name import, alternate runner, rediscovery, `npx`, dependency installation, or smoke-test command was used.

## Routes Tightened

The fixed eight-route scope and all eight approved `### Source Actions` mappings were preserved:

1. `GET /api/v0/moderation/retrieve-reviewable-reports`
2. `GET /api/v0/moderation/retrieve-moderation-ticket`
3. `POST /api/v0/moderation/create-reviewer-note`
4. `DELETE /api/v0/moderation/delete-reported-message`
5. `POST /api/v0/moderation/create-posting-suspension`
6. `PATCH /api/v0/moderation/update-posting-suspension`
7. `DELETE /api/v0/moderation/remove-participant`
8. `POST /api/v0/moderation/ban-participant`

Every route has exactly one `### Route` subsection with a fenced `http` request shape and exactly one `### Request Context` subsection. The request shapes name the method, path, query values or JSON body values, browser-managed `tawk_session` cookie, and applicable `Accept` or `Content-Type` header. All public identifiers, user-entered values, and the cookie use parameterized placeholders; no secret-looking or hard-coded UID value appears in the transport shapes.

## Route Authoring Rules Applied

- Preserved route headings, descriptions, source-action mappings, mockup-file lists, create/update separation, and all approved page-state coverage; no route was added, removed, renamed, or broadened.
- Confirmed queue origin provenance comes from the current page URL or prior UI-facing response and is accepted only within the signed-in reviewer's current governed scope.
- Confirmed ticket continuation uses `reportNumber` and `conversationUid` carried from the queue response into the page URL.
- Confirmed ticket mutations receive every browser-supplied value from that page URL, reviewer input, or the prior moderation-ticket/create-suspension response.
- Kept posting-suspension creation free of a pre-existing suspension UID and current end time. Kept update bound to the public `suspensionUid`, displayed `currentEndsAt`, reviewer-entered replacement, and explicit shorter-period acknowledgment.
- Kept identity, owner/administrator scope, authorization, report/message/participant binding, authoritative current state, note attribution and ordering, server time, retained history, and data joins behind the UX API boundary.
- Kept responses UI-facing with public continuation UIDs, editable/current suspension values, display-ready notes and effects, and allowed-action affordances. Raw credentials, tokens, database IDs, audit rows, permission internals, and lower-layer contracts remain omitted.
- Clarified concrete alternate response branches for queue empty/denied/failed states; ticket retained-deletion, unavailable-source, no-discussion, missing, unauthorized, failed, and timeout states; note unavailability; already-deleted message; ineligible suspension; stale suspension update; already-inactive removal; and already-banned outcomes.
- Documented which fields remain, become `null`, or are omitted in those branches and whether the page retries, returns to the queue, keeps a form open, or reloads current ticket state.
- Preserved the exact no-body sentence for both retrieval routes and retained parseable JSON for every request and response example.

## Validation

- `validate-route-coverage.mjs` passed with eight approved actions, eight mapped actions, and eight routes.
- Structural inspection confirmed every route has one `### Source Actions`, `### Mockup Files`, `### Route`, `### Request Context`, `### Example Request Payload`, and `### Example Response Payload` subsection.
- All eight `http` route blocks are present.
- Every JSON request and response example parses.

## Unresolved Ambiguities

- Ticket status, assignment, notification, closure, note visibility, suspension lifting, and related-discussion creation remain unresolved or absent; no routes, fields, or workflow states were invented for them.
- The static ticket page always renders report `#1048` even when alternate URL values are supplied; the production page must render the returned report for its public continuation values.
- The mockup uses `origin` for queue entry and `conversation` for ticket return links. The route contract retains normalized `originConversationUid` transport for production.
- The mockup has no initially suspended fixture, but its post-create Change state proves update continuation. The route remains continuable from either the ticket response or the create-suspension response.

## Cleanup And Write Confirmation

- Private Playwright directory used: `/Users/flackey/Source/Personal/FredLackeySandbox/spike-alltawk/.solpoc-tmp/draft-routes/moderation/05-route-rules-tightener/`
- The private directory, including specifications, configuration, reports, test output, screenshots, and traces, was removed before this handoff was written.
- No root-level Playwright specification, `test-results/`, `playwright-report/`, screenshot, trace, or temporary configuration was created.
- Changed only `docs/mockup/routes/moderation-routes.md` and `ai-docs/draft-routes/moderation/05-route-rules-tightener.md`.
- Did not change HTML, CSS, JavaScript, companions, concept documents, schemas, mock data, package files, application code, OpenAPI files, another area's routes, neighboring review files, or downstream handoffs.
