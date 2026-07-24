# Phase 4 Route Payload Drafter Handoff

## Target And Scope

- `solutionArtifactRoot`: `/Users/flackey/Source/Personal/FredLackeySandbox/spike-alltawk`
- Work unit: desktop `moderation`
- Route file updated: `docs/mockup/routes/moderation-routes.md`
- Routes updated:
  - `GET /api/v0/moderation/retrieve-reviewable-reports`
  - `GET /api/v0/moderation/retrieve-moderation-ticket`
  - `POST /api/v0/moderation/create-reviewer-note`
  - `DELETE /api/v0/moderation/delete-reported-message`
  - `POST /api/v0/moderation/create-posting-suspension`
  - `PATCH /api/v0/moderation/update-posting-suspension`
  - `DELETE /api/v0/moderation/remove-participant`
  - `POST /api/v0/moderation/ban-participant`

All Markdown path references in this handoff and the route file are repository-relative to `solutionArtifactRoot`. All filesystem reads and writes used absolute paths under that root.

## Inputs Read

- `docs/concepts/REQUIREMENTS.md`
- `docs/concepts/APP_PAGES.md`
- `docs/mockup/routes/moderation-routes.md`
- `docs/mockup/desktop/moderation/index.html`
- `docs/mockup/desktop/moderation/index.md`
- `docs/mockup/desktop/moderation/ticket.html`
- `docs/mockup/desktop/moderation/ticket.md`
- `docs/mockup/desktop/assets/app.js`
- `docs/mockup/desktop/assets/styles.css`
- `ai-docs/draft-routes/moderation/03-area-route-drafter.md`

## Rendered Inspection

Both moderation pages and their safely reachable representative states were rendered at the assigned 1080-pixel viewport before payload drafting.

- Queue states: authorized populated queue, authorized `origin=design` preselection, governed-conversation filter change, empty results, denied scope, held loading, recoverable failure, and successful retry.
- Ticket states: normal loaded evidence, arbitrary URL continuation input, failed load, retry recovery, missing, unauthorized, retained deleted evidence, unavailable source conversation, and absent related discussion.
- Ticket interactions: blank reviewer-note validation, successful reviewer-note append, message-deletion confirmation and applied state, suspension creation, shorter suspension replacement acknowledgment and update, participant removal, and participant ban.
- The inspection confirmed that `ticket=1046&conversation=garden` still renders fixture report `#1048`; payload provenance therefore follows the requested queue continuation values rather than the static fixture.

All screenshots, specifications, reports, and test results were temporary inspection evidence and were removed before this handoff was written.

## Playwright Runner Contract

- `id`: `npm-exec-no-cli`
- `label`: `npm exec --no --package playwright -- playwright`
- `usage`: `npm exec --no --package playwright -- playwright`
- `command`: `npm`
- `baseArgs`: `["exec", "--no", "--package", "playwright", "--", "playwright"]`
- `version`: `1.61.1`
- `testRunnerModule`: `/Users/flackey/.npm/_npx/e41f203b7505f1fb/node_modules/playwright/test.js`
- Invocation: `npm exec --no --package playwright -- playwright test moderation.spec.cjs --config playwright.config.cjs`
- Result: four Playwright tests passed.

The CommonJS specification imported `test` and `expect` from the exact absolute `testRunnerModule`. No package-name import, runner rediscovery, dependency installation, smoke-test command, or alternate runner was used.

## Payload Work Completed

- Added exactly one `### Example Request Payload` and one `### Example Response Payload` to every route.
- Used the exact no-body sentence for both retrieval routes and parseable, pretty-printed JSON for all mutation routes.
- Kept the queue response limited to governed conversation choices, the selected public conversation UID, reviewable report summaries, and the public continuation values needed to open a ticket.
- Made the ticket response UI-ready for evidence, ordered reviewer notes, source and related-discussion links, participant and posting state, applied effects, and allowed visible actions.
- Preserved the suspension lifecycle split:
  - creation accepts no pre-existing suspension UID and returns the new public suspension UID and effective end;
  - update carries the public suspension UID, current visible end, replacement end, and shorter-period acknowledgment.
- Returned display-ready action outcomes and allowed-action affordances for message deletion, suspension changes, participant removal, and banning.
- Used only 32-character hyphenless v4 UUID values for public UID examples and all-caps values for lookup-like states and roles.
- Kept reviewer identity, active governance scope, authorization, authoritative joins, role constraints, current-state validation, note ordering, retained history, and moderation decisions behind the UX API boundary.
- Preserved every route heading, description, `### Source Actions` mapping, and `### Mockup Files` list.

## Request Context Sources

- Every route depends on the browser-managed identified-session cookie; no cookie value or session identifier appears in JSON.
- Queue origin comes from the current queue URL and is accepted only when it identifies a returned governed conversation.
- Ticket `reportNumber` and source conversation public UID come from the selected queue result and current ticket URL.
- Reported-message, participant, related-discussion, and posting-suspension UIDs come from prior UX API responses.
- Reviewer-entered note text, suspension end values, shorter-period acknowledgment, and explicit confirmations are the only action-specific values supplied directly by the UI.

## Route Authoring Rules Applied

- Preserved all eight approved source actions and their route coverage.
- Covered the rendered queue, ticket, retry, alternate evidence, confirmation, and post-action states without adding ticket status or assignment concepts.
- Treated fixture loads, timers, generated timestamps, and in-page state changes as evidence of intended backend retrieval, persistence, and privileged actions.
- Kept create and update suspension contracts separate and invocation-feasible.
- Returned editable/current suspension values and public carry-forward identifiers needed for later visible actions.
- Classified browser-returned navigation URLs and UIDs as public-safe handoff values and omitted credentials, JWTs, secrets, private redirect targets, database IDs, audit rows, and permission internals.
- Kept requests and responses UI-facing and avoided application API, secure API, database, OpenAPI, schema, authorization-algorithm, or frontend-business-rule contracts.

## Ambiguities For Later Phases

- `index.html` accepts `origin`, while `ticket.html` links back using `conversation`. The route context records `origin` as the queue input and explicitly flags the alternate key for Phase 5 transport normalization.
- The ticket URL accepts `ticket` and `conversation`, but every static variant renders fixture report `#1048`. The response examples use public continuation values from the queue rather than treating the fixture as authoritative.
- The mockup exposes suspension update only after an in-page creation and has no initially suspended ticket fixture. The update request still carries the public suspension UID and current end returned by the prior UX response.
- Mutation submission failures, ticket statuses, assignments, notifications, closure, suspension lifting, and related-discussion creation remain unresolved or absent. No payload fields or routes were invented for them.

## Cleanup And Scope Confirmation

- Private Playwright directory used: `.solpoc-tmp/draft-routes/moderation/04-route-payload-drafter/`
- The private directory was removed before this handoff was written.
- No root-level Playwright specification, `test-results/`, `playwright-report/`, screenshot, trace, or temporary configuration was created.
- Changed only `docs/mockup/routes/moderation-routes.md` and `ai-docs/draft-routes/moderation/04-route-payload-drafter.md`.
- Did not change HTML, CSS, JavaScript, companions, concept documents, schemas, mock data, package files, application code, OpenAPI files, another area's routes, or any downstream handoff.
