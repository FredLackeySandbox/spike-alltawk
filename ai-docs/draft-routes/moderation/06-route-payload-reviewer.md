# Phase 6 Route Payload Reviewer Handoff

## Target And Scope

- `solutionArtifactRoot`: `/Users/flackey/Source/Personal/FredLackeySandbox/spike-alltawk`
- Scenario: `root-artifact-monorepo`
- Work unit: desktop `moderation`
- Reviewed and updated route file: `docs/mockup/routes/moderation-routes.md`
- Requirements and page catalog read: `docs/concepts/REQUIREMENTS.md`, `docs/concepts/APP_PAGES.md`
- Source companions and pages inspected:
  - `docs/mockup/desktop/moderation/index.md`
  - `docs/mockup/desktop/moderation/index.html`
  - `docs/mockup/desktop/moderation/ticket.md`
  - `docs/mockup/desktop/moderation/ticket.html`
- Directly referenced local behavior inspected: `docs/mockup/desktop/assets/app.js`
- Prior handoffs read:
  - `ai-docs/draft-routes/moderation/03-area-route-drafter.md`
  - `ai-docs/draft-routes/moderation/04-route-payload-drafter.md`
  - `ai-docs/draft-routes/moderation/05-route-rules-tightener.md`

All artifact paths in this handoff, `### Source Actions`, and `### Mockup Files` are repository-relative to `solutionArtifactRoot`. All filesystem reads and writes used absolute paths under that root. `projects/**` was not read or changed.

## Routes Reviewed

1. `GET /api/v0/moderation/retrieve-reviewable-reports`
2. `GET /api/v0/moderation/retrieve-moderation-ticket`
3. `POST /api/v0/moderation/create-reviewer-note`
4. `DELETE /api/v0/moderation/delete-reported-message`
5. `POST /api/v0/moderation/create-posting-suspension`
6. `PATCH /api/v0/moderation/update-posting-suspension`
7. `DELETE /api/v0/moderation/remove-participant`
8. `POST /api/v0/moderation/ban-participant`

All eight approved companion actions remain mapped exactly once. No route heading, description, `### Source Actions`, `### Mockup Files`, `### Route`, or `### Request Context` section was added, removed, renamed, or orphaned.

## Rendered Inspection

Playwright rendered the queue and ticket at the assigned 1080-pixel viewport before payload review. Seven tests passed: two initial visual-render tests and five comprehensive state-and-interaction tests.

Covered queue states and behaviors:

- Default loading and populated queue.
- Authorized origin preselection, stale-origin normalization, all-conversations view, and governed-conversation filtering.
- Filtered and whole-scope zero-result states.
- Mixed-authority filtering that excludes member-only report data.
- Denied and held-loading states.
- Recoverable failure, successful retry, and repeated retry failure.

Covered ticket states and behaviors:

- Default loading, normal, retained deletion, unavailable source, no related discussion, held loading, missing, unauthorized, failed, timeout, and retry recovery.
- Blank reviewer-note validation, pending save, and successful ordered append.
- Message-deletion confirmation and retained-evidence result.
- Posting-suspension missing-value validation, creation, Change continuation, shorter-period guard, explicit acknowledgment, and replacement.
- Participant removal and banning, including resulting incompatible-action availability.

Inspection exercised only local fixtures, timers, scenario branches, and in-page state transitions. It called no API, authentication service, live backend, or third party.

## Playwright Runner Contract

- `id`: `local-node-modules-cli`
- `label`: `./node_modules/.bin/playwright`
- `usage`: `./node_modules/.bin/playwright`
- `command`: `/Users/flackey/Source/Personal/FredLackeySandbox/spike-alltawk/node_modules/.bin/playwright`
- `baseArgs`: `[]`
- `version`: `1.62.0`
- `testRunnerModule`: `/Users/flackey/Source/Personal/FredLackeySandbox/spike-alltawk/node_modules/playwright/test.js`

The generated CommonJS specifications imported `test` and `expect` from the exact absolute `testRunnerModule` and were invoked with the supplied command and `test` subcommand. No package-name import, alternate runner, rediscovery, `npx`, dependency installation, or smoke-test command was used.

## Route Authoring Rules Applied

- Preserved complete source-action coverage and reviewed every source-backed queue, ticket, retry, confirmation, and post-action state.
- Kept posting-suspension creation and update separate and invocable from the values visible at each lifecycle state.
- Traced every request value to the current page URL, a prior UX API response, reviewer input, or the browser-managed session cookie.
- Confirmed requests omit reviewer identity, organization, authorization decisions, server time, data joins, retained evidence, permission internals, and other values the UX API derives.
- Confirmed retrieval responses supply UI-ready queue rows, ticket evidence, ordered notes, editable/current suspension values, public navigation UIDs, public action-continuation UIDs, participant state, and backend-decided action affordances.
- Confirmed mutation responses supply the machine result, display-ready effect or validation guidance, public continuation values needed by the next visible action, and updated action availability.
- Confirmed opaque browser-returned values are public-safe and that no raw cookie, session identifier, bearer token, credential, JWT, provider secret, hash, database ID, audit row, or internal permission state appears in JSON.
- Confirmed all UID examples are 32-character hyphenless v4 UUID strings and lookup/state values use all-caps enum strings where applicable.
- Applied YAGNI: no route, lower-layer contract, schema, ticket workflow, status model, or unrelated response field was invented.

## Payload Corrections

- Added `reporter.membershipLabel` to the reviewable-reports response. The queue visibly renders the reporter's membership label, and returning it as display-ready text avoids asking the frontend to infer a membership label from identity type.
- Clarified the active-suspension ticket branch: `participant.canPost` becomes `false`, while `participant.canRead` and `participant.canRejoin` remain `true`. This makes the response sufficient to render the time-bounded restriction without moving permission decisions into the frontend.
- Preserved the existing minimal request bodies, public continuation UIDs, route shapes, request-context provenance, create/update split, display-ready effects, action affordances, and concrete alternate-branch guidance.

## Request Context Review

- `originConversationUid` comes from the queue URL or a prior public conversation response; the UX API still validates it against current governed scope.
- `reportNumber` and `conversationUid` come from the selected queue result and current ticket URL.
- `reportedMessageUid` and `participantUid` come from the moderation-ticket response.
- `suspensionUid` and `currentEndsAt` come from the ticket or create-suspension response; `replacementEndsAt` and `shorterPeriodAcknowledged` come from the visible Change flow.
- `noteText` and suspension end values are reviewer-entered.
- Every route uses the browser-managed `tawk_session` cookie outside JSON. Authentication, identity, organization scope, owner/administrator authority, record binding, validation, ordering, and stale-state checks remain server responsibilities.

## Ambiguities

- The mockup uses `origin` for queue entry and `conversation` for ticket return links; the route contract retains the normalized `originConversationUid`.
- The ticket mockup accepts URL values but always renders fixture report `#1048`; production must render the requested report response.
- No initially suspended fixture exists, but the reachable post-create Change flow establishes the update contract and its continuation values.
- Ticket status, assignment, notification, closure, suspension lifting, reviewer-note visibility, and related-discussion creation remain unresolved or absent. No fields or routes were invented for them.
- Durable submission-failure presentation for note and moderation mutations is not implemented by the mockup. Existing display-ready rejection, unavailable, stale, and reload guidance was preserved without adding speculative workflow state.

## Cleanup And Write Confirmation

- Private Playwright directory used: `/Users/flackey/Source/Personal/FredLackeySandbox/spike-alltawk/.solpoc-tmp/draft-routes/moderation/06-route-payload-reviewer/`
- The private directory, including specifications, configuration, screenshots, reports, traces, and test output, was removed before this handoff was written.
- No root-level Playwright specification, `test-results/`, `playwright-report/`, screenshot, trace, or temporary configuration was created.
- Changed only `docs/mockup/routes/moderation-routes.md` and `ai-docs/draft-routes/moderation/06-route-payload-reviewer.md`.
- Did not change HTML, CSS, JavaScript, companions, concept documents, schemas, mock data, package files, application code, OpenAPI files, another area's routes, neighboring review files, or earlier handoffs.
