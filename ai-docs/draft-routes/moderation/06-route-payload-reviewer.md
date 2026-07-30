# Phase 6 Route Payload Reviewer Handoff

## Target And Scope

- `solutionArtifactRoot`: `/Users/flackey/Source/Personal/FredLackeySandbox/spike-alltawk`
- Scenario: `root-artifact-monorepo`
- Work unit: desktop `moderation`
- Discovery-provided route namespace: `moderation`
- Route file reviewed: `docs/mockup/routes/moderation-routes.md`
- Requirements and page catalog read: `docs/concepts/REQUIREMENTS.md`, `docs/concepts/APP_PAGES.md`
- Prior handoffs read:
  - `ai-docs/draft-routes/moderation/03-area-route-drafter.md`
  - `ai-docs/draft-routes/moderation/04-route-payload-drafter.md`
  - `ai-docs/draft-routes/moderation/05-route-rules-tightener.md`
- Mockup files inspected:
  - `docs/mockup/desktop/moderation/index.html`
  - `docs/mockup/desktop/moderation/index.md`
  - `docs/mockup/desktop/moderation/ticket.html`
  - `docs/mockup/desktop/moderation/ticket.md`
- Directly referenced local support inspected: `docs/mockup/desktop/assets/app.js`

All markdown path references are repository-relative to `solutionArtifactRoot`. Every filesystem read and write used the assigned absolute path beneath that root; `projects/**` was not read or changed.

## Routes Reviewed

The fixed eight-route scope and operation identities were preserved:

1. `GET /api/v0/moderation/retrieve-reviewable-reports`
2. `GET /api/v0/moderation/retrieve-moderation-ticket`
3. `POST /api/v0/moderation/create-reviewer-note`
4. `DELETE /api/v0/moderation/delete-reported-message`
5. `POST /api/v0/moderation/create-posting-suspension`
6. `PATCH /api/v0/moderation/update-posting-suspension`
7. `DELETE /api/v0/moderation/remove-participant`
8. `POST /api/v0/moderation/ban-participant`

Route headings, descriptions, `### Source Actions`, `### Mockup Files`, `### Route`, and `### Request Context` content remained in place. No route was added, removed, renamed, merged, or broadened.

## Rendered Inspection

Playwright rendered every referenced HTML page and safely reachable source-action state at viewport width `1080`.

- Queue states: populated, authorized-origin preselection, conversation filtering, selected and full-scope empty results, stale-origin reset, held loading, mixed authority, denied access, retry success, and retry failure.
- Ticket entry states: ready evidence, held loading, missing report, revoked authority, failed load, timeout, retry recovery, retained deleted-message evidence, unavailable source conversation, and absent related discussion.
- Reviewer-note states: blank validation, pending save, duplicate-submit prevention, successful append, returned author, timestamp, and text.
- Moderation actions: message soft deletion, participant removal, participant ban, suspension validation, first suspension creation, Change continuation, shorter-replacement guard, explicit replacement acknowledgment, and successful replacement.
- Representative queue, ticket-ready, and suspended-ticket screenshots were visually inspected before cleanup.

The first inspection run incorrectly assumed the suspension date-time field was blank even though the mockup supplies a visible default. That inspection-only assertion was corrected, the exact locked runner was rerun, and all six tests passed.

## Playwright Runner Contract

- `id`: `local-node-modules-cli`
- `label`: `./node_modules/.bin/playwright`
- `usage`: `./node_modules/.bin/playwright`
- `command`: `/Users/flackey/Source/Personal/FredLackeySandbox/spike-alltawk/node_modules/.bin/playwright`
- `baseArgs`: `[]`
- `version`: `1.62.0`
- `testRunnerModule`: `/Users/flackey/Source/Personal/FredLackeySandbox/spike-alltawk/node_modules/playwright/test.js`

The CommonJS specification imported `test` and `expect` from the exact absolute `testRunnerModule` and invoked the supplied command with the `test` subcommand. Specifications, configuration, screenshots, reports, traces, and test output were confined to `/Users/flackey/Source/Personal/FredLackeySandbox/spike-alltawk/.solpoc-tmp/draft-routes/moderation/06-route-payload-reviewer/`.

The private temporary directory was removed before this handoff was written. The scoped cleanup validator passed with no remaining entries.

## Route Authoring Rules Applied

- Preserved complete coverage of all eight approved companion actions and every source-action mapping.
- Confirmed create and update posting-suspension actions remain separate and invocable from visible values plus public continuation values from prior UX responses.
- Confirmed request JSON includes only public report, message, participant, or suspension UIDs, visible user-entered values, visible confirmation intent, and the public suspension version needed for safe replacement.
- Confirmed session identity, reviewer role, permission scope, report relationships, target eligibility, current authoritative state, timestamps, validation decisions, and moderation business rules remain server-derived.
- Confirmed retrieval payloads provide queue filters, visible evidence, editable note context, public action identifiers, safe navigation URLs, and server-decided allowed actions needed by the rendered states.
- Confirmed browser-returned UIDs and URLs are public-safe. No cookie values, credentials, JWTs, provider secrets, database identifiers, audit rows, permission internals, or lower-layer contracts appear in JSON.
- Confirmed every UID example is a valid 32-character hyphenless v4 UUID string and every state, identity type, and action lookup is an all-caps enum value.

## Payload Corrections

- Added `authorInitials` to both adjacent-message examples returned by `Retrieve Moderation Ticket`, because the rendered evidence list displays those avatars and cannot derive the initials reliably from display names.
- Replaced redundant unchanged participant and posting fields in the delete-message response with `allowedActions`, allowing the page to disable deletion while preserving the still-authorized note, suspension, removal, and ban affordances.
- Simplified posting-suspension create and update responses by removing repeated target-participant and boolean permission fields. The public suspension UID, version, end time, display-ready effect, and returned `allowedActions` are sufficient for the visible Change continuation.
- Corrected the participant-removal response to return all still-available actions: reviewer note creation, reported-message deletion, and participant banning. The previous example listed only banning even though the rendered ticket keeps notes and message deletion available.
- Corrected the participant-ban response to return reviewer note creation and reported-message deletion instead of an empty action list. The rendered ticket disables only participant-state actions after a ban.
- Removed duplicate retention and participation booleans where the authoritative state enum plus display-ready `appliedEffect` already supplies the UI-visible outcome.

## Request Context Sources Checked

- The queue request uses the browser-managed session cookie and an optional public governed-conversation UID from the current navigation state.
- Ticket retrieval uses the public report and conversation UIDs returned by the selected queue row and carried in the page URL.
- Note creation uses visible note text and the current public report UID.
- Message deletion uses the public report and message UIDs from ticket retrieval plus visible confirmation intent.
- Suspension creation uses the public report and participant UIDs, visible future end time, and confirmation intent.
- Suspension replacement uses the public report and suspension UIDs, the prior public version, visible replacement end time, and the visible shorter-period acknowledgment when applicable.
- Removal and banning use the public report and participant UIDs plus visible confirmation intent.

No request requires hidden frontend state, an internal identifier, or a client-supplied authorization decision.

## Unresolved Ambiguities

- The static queue uses `origin` and ticket links use `conversation`, while production route examples normalize both to public `conversationUid`. This remains a documented mockup transport inconsistency and does not block invocation.
- The static ticket displays fixture report `#1048` rather than binding its evidence to the URL values. The UX contract correctly relies on public UIDs from the selected queue response.
- The mockup has no initially loaded active-suspension fixture; the rendered post-create Change state demonstrates the continuation that requires `suspensionUid`, `version`, and `endsAt`.
- Ticket status, assignment, notification, closure, note visibility, suspension cancellation, and related-discussion creation remain unresolved. No payload invents those contracts.

No source action was missing or infeasible, and no route-action-coverage blocker was found.

## Validation And Scope Confirmation

- All six rendered-inspection tests passed with the locked Playwright runner.
- `validate-route-coverage.mjs` passed with eight companion actions, eight mapped actions, eight routes, and eight operations.
- Confirmed every route has exactly one `### Source Actions`, `### Mockup Files`, `### Route`, `### Request Context`, `### Example Request Payload`, and `### Example Response Payload`.
- Parsed all fourteen JSON examples successfully.
- Confirmed all UID examples use the required 32-character hyphenless v4 format.
- `validate-temp-cleanup.mjs` passed for `moderation` Phase 6 with no remaining temporary entries.
- Modified only `docs/mockup/routes/moderation-routes.md` and `ai-docs/draft-routes/moderation/06-route-payload-reviewer.md`.
- Did not edit HTML, CSS, JavaScript, companions, concept docs, schemas, mock data, application code, package files, OpenAPI files, application API contracts, secure API contracts, backend implementation, frontend business logic, or another phase handoff.
