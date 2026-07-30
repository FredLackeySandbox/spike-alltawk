# Phase 5 Route Rules Tightener Handoff

## Target And Scope

- `solutionArtifactRoot`: `/Users/flackey/Source/Personal/FredLackeySandbox/spike-alltawk`
- Scenario: `root-artifact-monorepo`
- Work unit: desktop `moderation`
- Discovery-provided route namespace: `moderation`
- Route file tightened: `docs/mockup/routes/moderation-routes.md`
- Requirements and page catalog read: `docs/concepts/REQUIREMENTS.md`, `docs/concepts/APP_PAGES.md`
- Prior handoffs read: `ai-docs/draft-routes/moderation/03-area-route-drafter.md`, `ai-docs/draft-routes/moderation/04-route-payload-drafter.md`
- Mockup files inspected:
  - `docs/mockup/desktop/moderation/index.html`
  - `docs/mockup/desktop/moderation/index.md`
  - `docs/mockup/desktop/moderation/ticket.html`
  - `docs/mockup/desktop/moderation/ticket.md`
- Directly referenced supporting behavior inspected: `docs/mockup/desktop/assets/app.js`

All markdown path references are repository-relative to `solutionArtifactRoot`. Every filesystem read and write used the assigned absolute path beneath that root; `projects/**` was not read or changed.

## Routes Tightened

The fixed eight-route inventory, route headings, descriptions, source-action mappings, mockup-file lists, and one-operation-per-action boundary were preserved:

1. `GET /api/v0/moderation/retrieve-reviewable-reports`
2. `GET /api/v0/moderation/retrieve-moderation-ticket`
3. `POST /api/v0/moderation/create-reviewer-note`
4. `DELETE /api/v0/moderation/delete-reported-message`
5. `POST /api/v0/moderation/create-posting-suspension`
6. `PATCH /api/v0/moderation/update-posting-suspension`
7. `DELETE /api/v0/moderation/remove-participant`
8. `POST /api/v0/moderation/ban-participant`

Every route section now contains exactly one `### Route` subsection with one fenced `http` request shape and exactly one `### Request Context` subsection. All eight method/path lines preserve the `moderation` namespace, use unique lowercase-kebab operation identities, and reproduce their heading operation. No polling, retry, cancellation, or branch-only operation was added.

## Rendered Inspection

Playwright rendered every referenced HTML page and safely reachable source-action state at viewport width `1080`.

- Queue states: populated, authorized-origin preselection, stale-origin reset, held loading, authorized empty, mixed-authority, denied, recoverable failure, persistent failure, retry success, and retry failure.
- Ticket entry states: normal, held loading, missing, unauthorized, failed, timeout, retry recovery, retained-deleted message, unavailable source conversation, and absent related discussion.
- Reviewer-note states: blank validation, pending save, duplicate-submit prevention, and successful append.
- Mutation states: message-deletion confirmation/success, participant-removal confirmation/success, participant-ban confirmation/success, suspension validation, pending creation, created Change state, shorter replacement guard, explicit acknowledgment, and successful replacement.
- Representative screenshots were visually inspected before the private temporary directory was removed.

All five CommonJS Playwright inspection tests passed.

## Playwright Runner Contract

- `id`: `local-node-modules-cli`
- `label`: `./node_modules/.bin/playwright`
- `usage`: `./node_modules/.bin/playwright`
- `command`: `/Users/flackey/Source/Personal/FredLackeySandbox/spike-alltawk/node_modules/.bin/playwright`
- `baseArgs`: `[]`
- `version`: `1.62.0`
- `testRunnerModule`: `/Users/flackey/Source/Personal/FredLackeySandbox/spike-alltawk/node_modules/playwright/test.js`

The inspection specification imported `test` and `expect` from the exact absolute `testRunnerModule` and invoked the supplied command with the `test` subcommand. Specifications, configuration, screenshots, reports, and test output were confined to `/Users/flackey/Source/Personal/FredLackeySandbox/spike-alltawk/.solpoc-tmp/draft-routes/moderation/05-route-rules-tightener/`.

The private temporary directory was removed before this handoff was written. The scoped cleanup validator passed and reported no remaining entries.

## Route Authoring Rules Applied

- Preserved all eight approved companion actions and their exact `### Source Actions` mappings.
- Preserved the create/update split for posting suspensions and kept every request invocable from a current page route, a prior UX response, or a visible user control.
- Added concrete session cookie, browser `Origin`, `Accept`, and applicable `Content-Type` transport details without exposing cookie values, credentials, or internal workflow state in JSON.
- Traced queue `conversationUid` to the public-safe origin navigation value and ticket `reportUid`/`conversationUid` to the selected queue response and current page URL. The static aliases are explicitly distinguished from production public UIDs.
- Kept reviewer identity, role, permissions, report relationships, target membership state, authorization, time validation, idempotency decisions, and moderation effects behind the UX API boundary.
- Documented non-disclosing queue denial, empty queues, retryable load failure, missing ticket, revoked ticket access, deleted retained evidence, unavailable source conversation, and absent related discussion.
- Documented stale/already-applied mutation handling so the page reloads or uses returned UI-safe current state rather than assuming success or duplicating an action.
- Removed `currentEndsAt` from the posting-suspension update request because the UX API can derive the authoritative current end from `suspensionUid` and `version`. The visible current end still informs whether the browser shows the shorter-period acknowledgment.
- Preserved UI-ready public UIDs, allowed actions, navigation URLs, and suspension continuation fields. No database identifiers, audit records, permission internals, raw credentials, tokens, lower-layer API contracts, or frontend business rules were added.

## Request Context And Route Shapes

- Retrieval routes use the authenticated HttpOnly session cookie, `Accept: application/json`, and public query values from current page navigation.
- Mutation routes use the authenticated HttpOnly session cookie, the browser-managed same-origin header, JSON content type, and visible or carry-forward public values.
- Each public UID, confirmation flag, reviewer-entered note, suspension end time, version, and shorter-replacement acknowledgment has a named source.
- Server-side responsibilities are stated at the UX boundary: authenticate, authorize current authority, validate report/object relationships, recheck current state, and return only UI-safe branch data.

## Response Branches Clarified

- Queue: authorized ready/empty, non-disclosing denied, and retryable failure without partial report leakage.
- Ticket: ready, not found, access denied, retryable failure, retained deletion, source unavailable, and no related discussion.
- Mutations: successful effect, already-applied current state, revoked access without evidence, and stale/conflicting state that requires ticket refresh.
- Suspension create/update: active-member eligibility, duplicate-restriction conflict, authoritative version conflict, future-time validation, and shorter-period acknowledgment.

## Unresolved Ambiguities

- The static queue uses `origin` while the static ticket links use `conversation`, and both use fixture aliases rather than UIDs. The route contract normalizes production transport to public `conversationUid` while retaining the mockup inconsistency as evidence.
- The ticket fixture does not bind rendered evidence to its `ticket` and `conversation` URL values. The route contract therefore relies on the public UIDs returned by the queue, as required by the corrected companion and Phase 3 feasibility findings.
- The mockup has no initial already-suspended entry scenario; ticket retrieval nevertheless retains the Phase 4 public suspension UID, version, and current end-time continuation required by the rendered post-create Change state.
- Ticket assignment, lifecycle status, notification, closure, note visibility, suspension cancellation, and related-discussion creation remain unresolved and were not added to the route list or payloads.

## Validation And Scope Confirmation

- `validate-route-coverage.mjs` passed with eight approved actions, eight mapped actions, eight routes, and eight operations.
- Confirmed exactly eight `### Route` subsections and eight `### Request Context` subsections.
- Confirmed all eight HTTP method/path lines use `/api/v0/moderation/{lowercase-kebab-operation}` and are unique.
- Modified only `docs/mockup/routes/moderation-routes.md` and `ai-docs/draft-routes/moderation/05-route-rules-tightener.md`.
- Did not edit HTML, CSS, JavaScript, companions, concept docs, schemas, mock data, application code, package files, OpenAPI files, application API contracts, secure API contracts, backend implementation, frontend business logic, or another phase handoff.
