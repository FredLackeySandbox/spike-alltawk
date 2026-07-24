# Phase 5 Route Rules Tightener Handoff

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

Every companion action under `### Source Actions`, every companion page state and required outcome, and every referenced mockup file was reviewed. No source action was missing or infeasible, so the route list did not need to return to Phase 3.

## Playwright Inspection

The complete preflight-selected runner contract was used without substitution:

- ID: `npm-exec-no-cli`
- Label: `npm exec --no --package playwright -- playwright`
- Usage: `npm exec --no --package playwright -- playwright`
- Command: `npm`
- Base arguments: `["exec", "--no", "--package", "playwright", "--", "playwright"]`
- Version: `1.61.1`
- Test runner module: `/Users/flackey/.npm/_npx/e41f203b7505f1fb/node_modules/playwright/test.js`

CommonJS specifications imported `test` and `expect` from that exact absolute module, and the supplied command and base arguments invoked the `test` subcommand. No package-name import, alternate route, module rediscovery, dependency installation, or smoke-test command was used.

The following local states were rendered and visually inspected at the assigned 1080-pixel viewport:

- `docs/mockup/desktop/governance/members.html`: owner roster, administrator roster, ordinary-member denial, retryable load failure, empty active roster, empty former roster, and expired posting suspension.
- `docs/mockup/desktop/governance/members.html`: administrator-promotion confirmation, create-suspension form, suspension success, and prefilled update-suspension form.
- `docs/mockup/desktop/governance/settings.html`: owner listed/exclusive, administrator listed/inclusive, owner unlisted/all-tags, archived, ordinary-member denial, and unavailable data.
- `docs/mockup/desktop/governance/settings.html`: retryable tag-save failure, stale permission during tag save, archive confirmation, and retryable archive failure.

All interactions stayed inside the static mockups. No real API, authentication service, backend, or third-party system was contacted.

The private inspection directory was `/Users/flackey/Source/Personal/FredLackeySandbox/spike-alltawk/.solpoc-tmp/draft-routes/governance/05-route-rules-tightener/`. It was removed after the final rendered inspection and before this handoff was written. No private Playwright specification, output, screenshot, report, trace, or temporary configuration remains.

## Routes Tightened

Exactly one `### Route` subsection with a fenced `http` request shape and exactly one `### Request Context` subsection now appear in each of the ten existing routes:

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

The route inventory, headings, descriptions, all twelve approved source-action mappings, and all `### Mockup Files` lists were preserved. No route was added, removed, renamed, split, or consolidated.

## Route Authoring Rules Applied

- Preserved all source-action coverage and the page states identified by the corrected companions.
- Added concrete browser request shapes with the existing methods and paths, the retrieval query parameters, browser-managed session-cookie transport, `Content-Type` for JSON-bearing mutations, and placeholders instead of UID-looking or secret-looking transport values.
- Documented the exact source of every query and JSON value: current page route, selected page, prior `MEMBERS` governance response, visible row, visible confirmation dialog, visible tag editor, or visible suspension date/time fields.
- Documented missing/expired-session rejection and the UX API's server-side responsibility for identity, conversation access, role authority, owner continuity, lifecycle state, current restriction state, validation, and retained history.
- Kept the shared retrieval route step-complete. The `MEMBERS` branch supplies roster rows, editable suspension values, public participant/suspension UIDs, counts, ownership continuity, and allowed actions; the `SETTINGS` branch supplies editable tags, tag count, read-only discovery/matching displays, lifecycle, viewer role, and settings actions.
- Kept posting-suspension creation separate from update and end. Creation requires no suspension UID and returns a public UID; update and end carry that public UID from roster retrieval.
- Removed `retainedRole` from the restore request. The browser displays retained role information, but the UX API derives the appropriate restored role from authoritative membership history instead of accepting a browser-supplied role decision.
- Clarified validation, protected-owner, denied, stale-permission, missing/already-completed, lifecycle-locked, retryable-failure, and success branches. Non-success branches preserve or reconcile visible state instead of assuming optimistic frontend decisions.
- Kept responses UI-facing and retained the existing public UID, editable value, allowed-action, count, lifecycle, and visible navigation data needed by the next interaction.
- Preserved the exact no-body statement on the retrieval route and preserved parseable JSON examples on all mutation routes.
- Kept raw session values, credentials, database identifiers, internal workflow state, permission internals, application API contracts, secure API contracts, schemas, and backend implementation details out of JSON.

## Request Context and Route Shapes

- All routes use `Cookie: tawk_session={opaqueSessionRef}` as the UX API's browser-managed session transport. The requirements' human identity provider remains unresolved; this cookie contract does not choose an identity provider.
- `conversationUid` always comes from the current conversation page route.
- The retrieval `view` query comes from the governance page being opened and is `MEMBERS` or `SETTINGS`.
- `participantUid` and `suspensionUid` come from public-safe fields returned by the prior `MEMBERS` retrieval.
- Promotion `targetRole` comes from the selected row's offered allowed action.
- Suspension `endsAt` comes from the visible date/time fields converted to a UTC instant; `displayTimeZone` comes from the form's displayed time-zone context.
- Tag updates send the complete visible edited tag set, not an incremental or hidden patch.
- Confirmation flags come only from the visible consequential-action dialogs.
- Unsaved tag drafts remain browser-local and block archive invocation; they are never sent to the archive route.

## Response Branches Clarified

- Governance retrieval distinguishes members/settings success data and unavailable, denied, empty, archived, and retryable-failure results.
- Role, removal, ban, and restoration routes distinguish success from protected, stale-permission, already-applied, and retryable-failure results.
- Suspension routes distinguish field validation, stale or missing restriction, stale permission, already-applied state, retryable failure, and success with authoritative editable end data.
- Tag updates distinguish field validation, stale permission, lifecycle lock, retryable failure with draft retention, and committed success.
- Archival distinguishes administrator block, stale permission, already archived, retryable unchanged failure, and retained-record success.

## Validation

- `validate-route-coverage.mjs` passed with twelve companion actions mapped across ten routes.
- All ten route sections contain exactly one `### Source Actions`, `### Mockup Files`, `### Route`, `### Request Context`, `### Example Request Payload`, and `### Example Response Payload` subsection.
- All ten `### Route` sections contain fenced `http` blocks.
- All nineteen JSON examples parse successfully; the retrieval route retains the exact no-body statement.
- Every public UID example remains a 32-character, hyphen-free version-4 UUID value.

## Ambiguities

- The human identity provider remains unresolved. The route file now fixes only browser-to-UX-API session-cookie transport; it does not choose sign-in credentials, an external provider, or a lower-layer authentication contract.
- Requirements do not decide whether restoration always reuses the prior retained role. The browser now sends only the selected participant UID and confirmation, leaving the appropriate restored role authoritative on the server.
- Tag display casing, exact multi-hyphen grammar, archived-conversation visibility, and in-progress unlisted-join behavior after tag changes remain unresolved. The routes return display-ready authoritative results without settling those product questions.
- The static unban mockup makes a banned identity merely eligible to rejoin, while the requirements-backed companion requires active role restoration. The route continues to follow the higher-priority requirements and returns an active restored roster entry.

No ambiguity blocks Phase 5 completion.

## Scope Confirmation

- Written route file: `docs/mockup/routes/governance-routes.md`
- Written handoff: `ai-docs/draft-routes/governance/05-route-rules-tightener.md`
- Only those two assigned markdown files were changed by this phase.
- No HTML, CSS, JavaScript, concept, schema, mock-data, package, OpenAPI, application source, backend implementation, frontend business logic, application API contract, secure API contract, companion, neighboring route, or review file was changed.
