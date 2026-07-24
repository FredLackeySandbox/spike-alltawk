# Phase 6 Route Payload Reviewer Handoff

## Follow-up Repair

The initial Phase 6 structural gate found that `Retrieve Conversation Governance` used prose plus two separate fenced JSON blocks under one `### Example Response Payload` subsection. The two requirements-backed `MEMBERS` and `SETTINGS` success examples are now represented as elements of one parseable JSON array inside exactly one fenced `json` block. Each element remains a UI-facing response for one selected `view`; the route returns the element matching the requested view, not both branches to the browser. No route, source action, field, branch, or page-state coverage was removed.

All ten route sections were rechecked. Every response subsection now contains exactly one fenced `json` block with parseable JSON, and every request subsection contains either exactly one parseable fenced `json` block or the exact no-body note. All twelve source-action mappings remain present.

## Target

- Platform: desktop
- Work-unit slug: `governance`
- Route file: `docs/mockup/routes/governance-routes.md`
- `solutionArtifactRoot`: `/Users/flackey/Source/Personal/FredLackeySandbox/spike-alltawk`

All markdown path references in this handoff are repository-relative to `solutionArtifactRoot`. Every filesystem read and write used an absolute path beneath that root. `projects/**` was not read or changed.

## Inputs Reviewed

- `docs/concepts/REQUIREMENTS.md`
- `docs/concepts/APP_PAGES.md`
- `docs/mockup/routes/governance-routes.md`
- `docs/mockup/desktop/governance/members.html`
- `docs/mockup/desktop/governance/members.md`
- `docs/mockup/desktop/governance/settings.html`
- `docs/mockup/desktop/governance/settings.md`
- `docs/mockup/desktop/assets/app.js`
- `ai-docs/draft-routes/governance/03-area-route-drafter.md`
- `ai-docs/draft-routes/governance/04-route-payload-drafter.md`
- `ai-docs/draft-routes/governance/05-route-rules-tightener.md`

Every companion action under `### Source Actions`, its page states and required outcomes, and every file under `### Mockup Files` was reviewed. All twelve approved actions remain invocable from their documented page states, so no route-coverage blocker was found.

## Playwright Inspection

The complete preflight-selected runner contract was used without substitution:

- ID: `npm-exec-no-cli`
- Label: `npm exec --no --package playwright -- playwright`
- Usage: `npm exec --no --package playwright -- playwright`
- Command: `npm`
- Base arguments: `["exec", "--no", "--package", "playwright", "--", "playwright"]`
- Version: `1.61.1`
- Test runner module: `/Users/flackey/.npm/_npx/e41f203b7505f1fb/node_modules/playwright/test.js`

The CommonJS specification imported `test` and `expect` from the exact absolute test-runner module, and the supplied command plus base arguments invoked the `test` subcommand. No package-name import, alternate runner, module rediscovery, dependency installation, or smoke-test command was used.

The following local states were rendered and inspected at the assigned 1080-pixel viewport:

- `docs/mockup/desktop/governance/members.html`: owner, administrator, ordinary-member denial, retryable load failure, empty active roster, empty former roster, expired posting suspension, and the former-filter empty result.
- `docs/mockup/desktop/governance/members.html`: owner-promotion confirmation and success, administrator-promotion confirmation and success, participant-removal confirmation and success, identity-ban confirmation and success, unban confirmation and mockup success, create-suspension entry and success, prefilled update-suspension entry, and immediate suspension-end confirmation and success.
- `docs/mockup/desktop/governance/settings.html`: owner, administrator, unlisted, archived, ordinary-member denial, and unavailable states.
- `docs/mockup/desktop/governance/settings.html`: retryable tag-save failure with draft retention, stale permission during tag save, archive confirmation, retryable archive failure, and archive success.

For the structural follow-up, the members owner and ordinary-member-denial states and the settings owner, administrator, and archived states were rendered again at 1080 pixels with the same exact runner contract. Both follow-up tests passed. This reconfirmed that the shared retrieval route must retain distinct `MEMBERS` and `SETTINGS` response semantics.

All interactions remained inside the static mockups. No real API, authentication provider, live backend, or third-party system was contacted. The first two inspection attempts exposed and corrected specification interaction ordering; the exact runner itself remained available, and the final run passed both rendered-inspection tests.

The private inspection directory was `/Users/flackey/Source/Personal/FredLackeySandbox/spike-alltawk/.solpoc-tmp/draft-routes/governance/06-route-payload-reviewer/`. It was removed after the final rendered inspection and before this handoff was written. No private specification, output, screenshot, report, trace, or configuration remains.

## Routes Reviewed

All ten route payload pairs were reviewed:

1. Retrieve Conversation Governance
2. Promote Participant Role
3. Remove Participant
4. Ban Identity
5. Restore Banned Participant
6. Create Posting Suspension
7. Update Posting Suspension
8. End Posting Suspension
9. Update Conversation Tags
10. Archive Conversation

The route inventory, route headings, descriptions, all twelve `### Source Actions` mappings, all `### Mockup Files` lists, all `### Route` request shapes, and all ten `### Request Context` subsections remain present. No route was added, removed, renamed, split, or consolidated.

## Route Authoring Rules Applied

- Preserved complete source-action and page-state coverage.
- Kept the shared governance retrieval route step-complete without overfetching: the response examples now show both its `MEMBERS` and `SETTINGS` success branches. The settings branch supplies editable tags, tag count, read-only discovery and matching display values, lifecycle state, viewer role, and allowed actions.
- Consolidated the shared retrieval route's two branch examples into one parseable JSON array under one fenced block to satisfy the Phase 6 structural contract while preserving both view-specific UI payloads.
- Added the missing `result` discriminator to the members retrieval success example so the UI can distinguish it from denied, unavailable, empty, archived, or retryable-failure results described by the route.
- Removed request `confirmed` booleans from promotion, removal, ban, restoration, suspension-end, and archive examples. Invocation after the visible confirmation already expresses action intent; a duplicate browser boolean does not make the operation safer or more authoritative.
- Updated those routes' request-context prose to name the visible confirmation as the invocation gate without implying that the UX API trusts a redundant confirmation field.
- Removed `participantUid` from update- and end-suspension requests because the public `suspensionUid` already identifies the selected restriction; the UX API resolves the participant authoritatively. Responses retain `participantUid` because the page uses it to reconcile the affected roster row.
- Removed the tag-update response's `nextPage` field. Returning to the conversation is fixed page behavior after a successful save and does not require a server-selected navigation value.
- Preserved creation versus update semantics for posting suspensions. Creation accepts no pre-existing suspension UID and returns one; update and end carry the public suspension UID returned by roster retrieval.
- Preserved UI-ready participant state, counts, suspension values, allowed actions, owner-continuity data, committed tags, lifecycle data, and archival confirmation needed for the next visible page state.
- Kept raw cookie values, credentials, bearer tokens, JWTs, provider secrets, hashes, database identifiers, audit records, permission internals, private workflow state, and lower-layer API contracts out of JSON.
- Confirmed every public UID example is a 32-character, hyphen-free version-4 UUID string and every selectable lookup value is an all-caps enum.

## Payload Corrections

| Route | Correction |
|---|---|
| Retrieve Conversation Governance | Added a `result` field to the members success example and added a concrete settings success example with editable and read-only display data. |
| Retrieve Conversation Governance follow-up | Replaced prose plus two JSON fences with one parseable JSON array containing the unchanged `MEMBERS` and `SETTINGS` branch payloads. |
| Promote Participant Role | Removed redundant `confirmed`; retained conversation, selected participant, and selected target role. |
| Remove Participant | Removed redundant `confirmed`; retained conversation and selected participant. |
| Ban Identity | Removed redundant `confirmed`; retained conversation and selected participant. |
| Restore Banned Participant | Removed redundant `confirmed`; retained conversation and selected participant while leaving restored-role choice server-authoritative. |
| Create Posting Suspension | No payload correction required. |
| Update Posting Suspension | Removed redundant `participantUid`; retained conversation, public suspension UID, revised end, and displayed time zone. |
| End Posting Suspension | Removed redundant `participantUid` and `confirmed`; retained conversation and public suspension UID. |
| Update Conversation Tags | Removed server-selected `nextPage`; retained committed UI-ready tags, count, lifecycle, and allowed actions. |
| Archive Conversation | Removed redundant `confirmed`; retained the current conversation UID and UI-ready archived result. |

## Request-Context Sources Checked

- The browser-managed `tawk_session` cookie supplies the opaque authenticated session context without exposing its value in JSON.
- `conversationUid` comes from the current conversation page route.
- The retrieval `view` comes from the selected governance page and is `MEMBERS` or `SETTINGS`.
- Public `participantUid` and `suspensionUid` values come from the prior members retrieval response and selected roster row.
- Promotion `targetRole` comes from the selected row's offered action.
- Suspension `endsAt` and `displayTimeZone` come from the visible date/time form and displayed time-zone context.
- Updated tags are the complete ordered chip set visible in the editor.
- Consequential mutation routes are invoked only after their visible confirmation dialogs; no duplicate confirmation field is sent.
- Unsaved tag drafts remain browser-local and block archive invocation.

## Unresolved Ambiguities

- The human identity provider remains unresolved. The route file documents only the browser-to-UX-API session cookie and does not choose a sign-in provider or lower-layer authentication contract.
- Requirements do not decide whether restoration always reuses the retained role. The request therefore omits role choice and leaves the appropriate restored role authoritative on the server.
- The static unban mockup makes an identity only eligible to rejoin, while the requirements-backed companion requires active restoration. The response continues to follow the higher-priority requirements and returns an active roster entry.
- Tag display casing, exact multi-hyphen grammar, archived-conversation visibility, and in-progress unlisted-join behavior after tag changes remain unresolved. The examples do not settle those product decisions.

No ambiguity blocks Phase 6 completion.

## Validation and Scope Confirmation

- Every route section retains exactly one `### Source Actions`, `### Mockup Files`, `### Route`, `### Request Context`, `### Example Request Payload`, and `### Example Response Payload` subsection.
- Every `### Route` subsection retains a fenced `http` block.
- Every request example is either the exact no-body statement or parseable JSON.
- Every response example is parseable JSON.
- Written route file: `docs/mockup/routes/governance-routes.md`
- Written handoff: `ai-docs/draft-routes/governance/06-route-payload-reviewer.md`
- Only those two assigned markdown files were changed by this phase.
- No HTML, CSS, JavaScript, concept, schema, mock-data, package, OpenAPI, application source, backend implementation, frontend business logic, application API contract, secure API contract, companion, neighboring route, or review file was changed.
