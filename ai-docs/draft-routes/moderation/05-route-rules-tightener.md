# Moderation Route Rules Tightener Handoff

## Scope

- solutionArtifactRoot: `/Users/flackey/Source/Personal/FredLackeySandbox/spike-alltawk`
- Platform/work unit: desktop `moderation`
- Route file tightened: `docs/mockup/routes/moderation-routes.md`
- Read `docs/concepts/REQUIREMENTS.md`, `docs/concepts/APP_PAGES.md`, both moderation companions, both moderation HTML pages, the directly referenced `docs/mockup/desktop/assets/app.js` and `docs/mockup/desktop/assets/styles.css`, and the Phase 3 and Phase 4 handoffs.
- Repository-relative paths in this handoff, the route file, `### Source Actions`, and `### Mockup Files` are relative to `solutionArtifactRoot`; all filesystem operations used absolute paths under that root.

## Rendered Inspection

Rendered `docs/mockup/desktop/moderation/index.html` and `docs/mockup/desktop/moderation/ticket.html` at the discovered 1080-pixel viewport before tightening the contracts. Safe local inspection covered:

- Queue populated, empty, mixed-authority, denied, loading, retry-success, retry-failure, authorized-origin, filter-change, and return-context states.
- Ticket normal, loading, missing, unauthorized, failed, timeout, retry-success, deleted-message, unavailable-source, and no-related-discussion states.
- Reviewer-note creation and the delete-message, create-suspension, update-suspension with shorter-period acknowledgment, remove-participant, and ban-participant confirmation and applied states.

The inspection exercised only local mockup behavior and did not call APIs, authentication services, live backends, or third parties.

## Playwright Runner Contract

- id: `npm-exec-no-cli`
- label: `npm exec --no --package playwright -- playwright`
- usage: `npm exec --no --package playwright -- playwright`
- command: `npm`
- baseArgs: `["exec", "--no", "--package", "playwright", "--", "playwright"]`
- version: `1.61.1`
- testRunnerModule: `/Users/flackey/.npm/_npx/e41f203b7505f1fb/node_modules/playwright/test.js`
- Invocation: `npm exec --no --package playwright -- playwright test moderation.spec.cjs --config playwright.config.cjs`
- Result: four Playwright tests passed.

The CommonJS specification imported `test` and `expect` from the exact absolute `testRunnerModule`. No package-name import, alternate route, dependency installation, runner rediscovery, `npx`, or smoke-test command was used.

## Routes Tightened

Added exactly one `### Route` subsection with a fenced `http` request shape and kept exactly one `### Request Context` subsection for each of the eight existing routes:

- Retrieve Reviewable Reports
- Retrieve Moderation Ticket
- Create Reviewer Note
- Delete Reported Message
- Create Posting Suspension
- Update Posting Suspension
- Remove Participant
- Ban Participant

Every request shape now names the API path, browser-managed session cookie, `Accept` or `Content-Type` header as applicable, query parameters for retrieval, and the body values for mutations. Placeholders are used for public identifiers, user-entered values, and the opaque session reference. No cookie value, session identifier, token, secret, database ID, authorization internals, or lower-layer contract appears in an example.

## Route Authoring Rules Applied

- Preserved all eight route headings, purposes, source-action mappings, mockup-file lists, and approved action coverage. No route was added, removed, renamed, or broadened.
- Normalized queue origin provenance as `originConversationUid`, sourced from the current page URL and a prior UI-facing response. The UX API honors it only within the reviewer's current governed scope.
- Made ticket continuation concrete with `reportNumber` and `conversationUid` carried from the queue response into the current ticket URL and the ticket retrieval request.
- Added `conversationUid` to every ticket mutation example so the browser carries the visible source-conversation context while the UX API still binds and authorizes the report, conversation, message, participant, and suspension server-side.
- Kept create and update suspension contracts separate. Creation carries no suspension UID or current end. Update carries the prior public `suspensionUid`, the current displayed end, the reviewer-entered replacement end, and the explicit shorter-period acknowledgment.
- Documented that queue and ticket retrieval recheck current authority and return non-disclosing denied, missing, or failed states without trusting mockup fixture data.
- Documented the exact source of note text, confirmations, suspension times, participant UID, reported-message UID, suspension UID, and current suspension end.
- Preserved UI-ready responses for editable suspension state, report evidence, reviewer notes, governed conversation choices, source and related-discussion navigation, applied effects, allowed actions, public continuation identifiers, and retained-history outcomes.
- Kept returned conversation URLs and UIDs public-safe. Authentication, authorization, role enforcement, target binding, state validation, note ordering, server time, joins, and retention behavior remain behind the UX API boundary.
- Kept every request/response JSON example parseable and every example UID in 32-character hyphenless v4 form.

## Response Branches And Continuation

- The queue contract supports populated, filtered, empty, denied, failed, and retry outcomes while exposing only currently governed conversations.
- The ticket contract supports ready, deleted-evidence, unavailable-source, no-discussion, missing, unauthorized, failed, timeout, retry, and post-action refresh states.
- Mutation responses preserve the display-ready applied effect and allowed next actions needed by the page after message deletion, suspension creation or replacement, removal, and banning.
- Public source-conversation provenance remains available for returning to the normalized filtered queue.

## Unresolved Ambiguities

- Ticket status, assignment, notification, and closure behavior remain unresolved in `REQUIREMENTS.md`; no fields or routes were invented.
- The static ticket page always renders report `#1048` even when alternate URL values are supplied. The tightened contract requires the production page to render the report returned for the requested continuation values.
- The mockup uses `origin` on queue entry but `conversation` on ticket return links. The tightened transport uses one public `originConversationUid` value; implementation must normalize the browser page URL accordingly.
- The mockup exposes suspension update only after an in-page creation and has no initially suspended ticket fixture. The update contract remains continuable from either the ticket response or the create-suspension response.
- Mutation submission failure presentations and related-discussion creation are absent from the initialized mockup and requirements; no speculative payload branches were added.

## Cleanup And Write Confirmation

- Private Playwright directory used: `/Users/flackey/Source/Personal/FredLackeySandbox/spike-alltawk/.solpoc-tmp/draft-routes/moderation/05-route-rules-tightener/`
- The private directory, including specifications, screenshots, reports, traces, and test output, was removed before this handoff was written.
- No root-level Playwright specification, `test-results/`, `playwright-report/`, screenshot, trace, or temporary configuration was created.
- Changed only `docs/mockup/routes/moderation-routes.md` and `ai-docs/draft-routes/moderation/05-route-rules-tightener.md`.
- Did not change HTML, CSS, JavaScript, companions, concept documents, schemas, mock data, package files, application code, OpenAPI files, another area's routes, source-action mappings, mockup-file lists, or downstream handoffs.
