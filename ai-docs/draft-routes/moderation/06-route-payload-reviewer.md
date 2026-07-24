# Moderation Route Payload Reviewer Handoff

## Scope

- `solutionArtifactRoot`: `/Users/flackey/Source/Personal/FredLackeySandbox/spike-alltawk`
- Platform/work unit: desktop `moderation`
- Route file reviewed and updated: `docs/mockup/routes/moderation-routes.md`
- Repository-relative paths in this handoff, the route file, `### Source Actions`, and `### Mockup Files` are relative to `solutionArtifactRoot`. All filesystem reads and writes used absolute paths under that root.
- Read `docs/concepts/REQUIREMENTS.md`, `docs/concepts/APP_PAGES.md`, both moderation companions, both moderation HTML pages, the directly referenced `docs/mockup/desktop/assets/app.js` and `docs/mockup/desktop/assets/styles.css`, and the Phase 3, Phase 4, and Phase 5 handoffs.

## Routes Reviewed

- `GET /api/v0/moderation/retrieve-reviewable-reports`
- `GET /api/v0/moderation/retrieve-moderation-ticket`
- `POST /api/v0/moderation/create-reviewer-note`
- `DELETE /api/v0/moderation/delete-reported-message`
- `POST /api/v0/moderation/create-posting-suspension`
- `PATCH /api/v0/moderation/update-posting-suspension`
- `DELETE /api/v0/moderation/remove-participant`
- `POST /api/v0/moderation/ban-participant`

All eight approved companion actions remain mapped exactly once across these routes. No route, route heading, source-action mapping, or mockup-file list was added, removed, renamed, or orphaned.

## Rendered Inspection

Rendered `docs/mockup/desktop/moderation/index.html` and `docs/mockup/desktop/moderation/ticket.html` at the assigned 1080-pixel viewport before reviewing payloads. Safe local inspection covered:

- Queue populated, authorized-origin preselection, empty, mixed-authority, denied, held-loading, recoverable failure, successful retry, repeated retry failure, and governed-conversation filter-change states.
- Ticket normal, held-loading, missing, unauthorized, failed, timed-out, retry-recovered, retained-deleted-message, unavailable-source, and absent-related-discussion states.
- Reviewer-note blank validation, pending save, and successful append.
- Delete-message confirmation and applied result.
- Posting-suspension confirmation, creation, shorter-period guard and acknowledgment, and replacement result.
- Remove-participant and ban-participant confirmation and applied results.

The inspection exercised only local mockup behavior and did not call APIs, authentication services, live backends, or third parties.

## Playwright Runner Contract

- `id`: `npm-exec-no-cli`
- `label`: `npm exec --no --package playwright -- playwright`
- `usage`: `npm exec --no --package playwright -- playwright`
- `command`: `npm`
- `baseArgs`: `["exec", "--no", "--package", "playwright", "--", "playwright"]`
- `version`: `1.61.1`
- `testRunnerModule`: `/Users/flackey/.npm/_npx/e41f203b7505f1fb/node_modules/playwright/test.js`
- Final invocation: `npm exec --no --package playwright -- playwright test moderation.spec.cjs --config playwright.config.cjs --workers=1`
- Final result: three Playwright tests passed.

The CommonJS specification imported `test` and `expect` from the exact absolute `testRunnerModule`. No package-name import, alternate route, runner rediscovery, dependency installation, `npx`, or smoke-test command was used.

## Payload Corrections

- Removed `reviewerRole` from governed-conversation choices because the queue does not render it; current owner or administrator authorization remains a server responsibility.
- Removed reviewer-note UIDs and `appendAfterNoteUid` because the page only renders ordered, display-ready note content and has no note-targeted follow-up action.
- Removed the duplicated related-discussion conversation UID because the returned public-safe browser handoff URL already carries the value required by the visible navigation action.
- Removed `confirmed` booleans from delete, suspension-create, removal, and ban requests. The request itself is the action intent after the page completes its visible confirmation; the boolean added no independent server-decision input.
- Kept `shorterPeriodAcknowledged` on suspension replacement because that visible acknowledgment distinguishes intentional shortening of the current durable restriction.
- Simplified deletion, suspension, removal, and ban responses by removing duplicate participant/effect facts that the page already receives as display-ready applied-effect copy and allowed-action affordances.
- Preserved public UIDs only where the current page or a later visible action needs them: selected/source conversations, reported messages, target participants, and the posting suspension needed by the Change continuation.
- Preserved the create/update posting-suspension split. Creation requires no pre-existing suspension UID; update carries the prior public suspension UID and visible current end.

## Request Context And UI Sufficiency

- Every route continues to use the browser-managed identified-session cookie; no cookie value, session identifier, bearer token, credential, secret, hash, database identifier, audit row, or permission internals appear in JSON.
- Queue origin, report number, and source-conversation public UID remain sourced from the page URL or a prior UI-facing response.
- Reported-message, participant, and posting-suspension UIDs remain sourced from the ticket or prior suspension response.
- Reviewer-entered note text and suspension end times remain the only free-form action inputs. The shorter-period acknowledgment remains only for an actual replacement that shortens the current effective period.
- Retrieval responses still contain the complete display-ready queue and ticket evidence, editable suspension state, navigation handoffs, ordered notes, current participant state, applied effects, and allowed visible actions needed by the rendered states.
- Mutation responses still contain the machine result, display-ready applied effect, public continuation values needed by the next visible action, and updated allowed-action affordances.

## Route Authoring Rules Applied

- Preserved all source-action coverage and inspected every source-backed queue, ticket, retry, confirmation, and post-action state.
- Kept create and update lifecycle semantics separate and invocation-feasible.
- Traced every remaining request value to the current URL, a prior UX API response, a user-entered field, or the browser-managed session cookie.
- Kept browser-returned URLs and UIDs public-safe and omitted lower-layer application API, secure API, database, authorization-algorithm, and frontend-business-rule contracts.
- Retained 32-character hyphenless v4 UUID examples and all-caps enum-like values.
- Applied YAGNI by removing only values that the rendered UI and its next visible actions do not consume.

## Validation

- `validate-route-coverage.mjs` passed with eight companion actions, eight mapped actions, and eight routes.
- Every route retains exactly one `### Source Actions`, `### Mockup Files`, `### Route`, `### Request Context`, `### Example Request Payload`, and `### Example Response Payload` subsection.
- All 14 fenced JSON examples parse successfully.
- All 24 UID example values pass the 32-character hyphenless v4 UUID format check.

## Ambiguities

- Ticket status, assignment, notification, closure, suspension lifting, and creation of a related moderation conversation remain unresolved or absent. No payload fields or routes were invented for them.
- The static ticket page always renders fixture report `#1048` even for alternate URL continuation values; the API contract continues to require the production page to render the requested report response.
- The mockup has no initially suspended ticket fixture. Suspension update remains continuable from either a ticket response that contains a current suspension or the create-suspension response.
- Submission-failure presentation for note and moderation mutations is absent from the mockup. No speculative failure payload fields were added.

## Cleanup And Write Confirmation

- Private Playwright directory used: `/Users/flackey/Source/Personal/FredLackeySandbox/spike-alltawk/.solpoc-tmp/draft-routes/moderation/06-route-payload-reviewer/`
- The private directory, including specifications, screenshots, montages, reports, traces, and test output, was removed before this handoff was written.
- No root-level Playwright specification, `test-results/`, `playwright-report/`, screenshot, trace, or temporary configuration was created.
- Changed only `docs/mockup/routes/moderation-routes.md` and `ai-docs/draft-routes/moderation/06-route-payload-reviewer.md`.
- Did not change HTML, CSS, JavaScript, companions, concept documents, schemas, mock data, package files, application code, OpenAPI files, another area's routes, source-action mappings, mockup-file lists, or earlier handoffs.
