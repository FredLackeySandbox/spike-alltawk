# Phase 5 Route Rules Tightener Handoff

## Assignment

- `solutionArtifactRoot`: `/Users/flackey/Source/Personal/FredLackeySandbox/spike-alltawk`
- `repoRelativeBase`: `/Users/flackey/Source/Personal/FredLackeySandbox/spike-alltawk`
- Platform and folder: desktop `conversation`
- Folder slug: `conversation`
- Route file tightened: `docs/mockup/routes/conversation-routes.md`
- Private Playwright directory: `.solpoc-tmp/draft-routes/conversation/05-route-rules-tightener/`

All markdown path references in this handoff and the route file are repository-relative to `solutionArtifactRoot`. Filesystem reads and writes used absolute paths under that root. `projects/**` was out of scope and was not read or changed.

## Inputs Reviewed

- `docs/concepts/REQUIREMENTS.md`
- `docs/concepts/APP_PAGES.md`
- `docs/mockup/routes/conversation-routes.md`
- `docs/mockup/desktop/conversation/thread.md`
- `docs/mockup/desktop/conversation/thread.html`
- `docs/mockup/desktop/assets/app.js`
- `ai-docs/draft-routes/conversation/03-area-route-drafter.md`
- `ai-docs/draft-routes/conversation/04-route-payload-drafter.md`

Every companion action under `### Source Actions` was checked against its page states, evidence, visible inputs, and required outcomes. Every file under `### Mockup Files` was reviewed before route tightening.

## Playwright Runner Contract

- `id`: `npm-exec-no-cli`
- `label`: `npm exec --no --package playwright -- playwright`
- `usage`: `npm exec --no --package playwright -- playwright`
- `command`: `npm`
- `baseArgs`: `["exec", "--no", "--package", "playwright", "--", "playwright"]`
- `version`: `1.61.1`
- `testRunnerModule`: `/Users/flackey/.npm/_npx/e41f203b7505f1fb/node_modules/playwright/test.js`

The CommonJS inspection specification imported `test` and `expect` from that exact absolute `testRunnerModule` and invoked the supplied `command` plus `baseArgs` with the `test` subcommand. No package-name import, runner rediscovery, `npx`, smoke fixture, dependency installation, live API, authentication service, or third-party system was used.

## Rendered Inspection

`docs/mockup/desktop/conversation/thread.html` was rendered at the discovered 1080-pixel viewport. The final Playwright run passed two tests covering:

- initial loading and the populated workspace;
- the no-message thread;
- failed workspace retrieval followed by retry;
- read-only and posting-suspended membership, including the visible suspension end time;
- last-owner, additional-owner, and ordinary-member leave states;
- existing inactive and active reaction chips plus the emoji picker;
- successful message posting and one-shot posting failure with the retained draft;
- message-note create and update states;
- conversation-note create and update states;
- successful numbered report submission;
- successful own-message deletion; and
- stale message-note and stale message-report targets.

An initial inspection run exposed an ambiguous test-harness close-button selector; the phase-owned specification was corrected and rerun with the same preflight-selected command/module pair. The final run passed without changing mockup source.

## Routes Tightened

Exactly one `### Route` subsection with a fenced `http` block and exactly one `### Request Context` subsection now appear in each of the 13 existing route sections:

1. Retrieve Conversation Workspace
2. Post Message
3. Add Emoji Reaction
4. Remove Emoji Reaction
5. Retrieve Message Note
6. Create Message Note
7. Update Message Note
8. Retrieve Conversation Note
9. Create Conversation Note
10. Update Conversation Note
11. Submit Message Report
12. Delete Message
13. Leave Conversation

The route list, headings, descriptions, `### Source Actions` mappings, `### Mockup Files` lists, and Phase 4 payload examples remain present. No route was added, removed, merged, or renamed.

## Browser Transport And Request Context

- Every route shape shows its method and exact `/api/v0/conversation/...` path.
- Workspace and note-retrieval routes place the selected public UID in an explicit query parameter.
- Every route shape sends `Accept: application/json` and the browser-managed `Cookie: tawk_session={opaqueSessionRef}` placeholder.
- Routes with a JSON body also show `Content-Type: application/json`.
- Every request-context section names the source of each query or body value: current page route, prior Retrieve Conversation Workspace response, prior note-retrieval response, visible reaction control, visible form field, or confirmation modal.
- Every section states the UX API responsibility to validate the identified session, derive identity and membership server-side, authorize the selected conversation/message/note, and make the applicable role, posting, ownership-continuity, moderation, or note-access decision.
- Every section documents the missing or invalid cookie outcome without placing a raw cookie value, session identifier, authorization decision, or private workflow state in JSON.

## Route Authoring Rules Applied

- Preserved complete coverage of all 13 approved companion actions.
- Kept message-note and conversation-note create flows independent of any pre-existing note UID; update flows carry forward the public `noteUid` returned by retrieval.
- Traced every browser-supplied value to a visible or browser-managed source.
- Kept human identity, active membership, authorship, permission, note access, report numbering, and owner-continuity decisions behind the UX API boundary.
- Clarified empty, failed, restricted, unavailable, stale, duplicate, blocked, left, and successful response behavior where the UI needs different next actions or field presence.
- Kept opaque session values in request headers only and used parameterized placeholders rather than UID-looking or secret-looking values in route shapes.
- Preserved the UI-facing payload boundary and did not add application API, secure API, database, authorization-algorithm, validation-algorithm, or frontend-business-rule contracts.

## Payload And Branch Review

The Phase 4 JSON examples already supplied the UI-ready fields required by the rendered mockup states, including editable note values, public note and message UIDs, reaction aggregates, report ticket display data, message removal identity, and owner-continuity actions. No JSON example needed expansion during Phase 5. Request-context prose now makes alternate response branches concrete:

- note retrieval distinguishes `CREATE`, `UPDATE`, and unavailable-target forms;
- posting failures retain the draft and omit a created message;
- stale or unauthorized mutations preserve the current rendered or durable state;
- report rejection creates no ticket;
- workspace retrieval distinguishes empty, populated, restricted, and failed results; and
- leave distinguishes `BLOCKED`, `LEFT`, and recoverable failure outcomes.

All request examples remain either parseable fenced JSON or the exact no-body statement. All response examples remain parseable fenced JSON.

## Validation And Cleanup

- `validate-route-coverage.mjs` passed with 13 companion actions, 13 mapped actions, 13 routes, and no blockers.
- Structural inspection confirmed exactly one `### Source Actions`, `### Mockup Files`, `### Route`, `### Request Context`, `### Example Request Payload`, and `### Example Response Payload` subsection per route.
- Every `### Route` subsection contains one fenced `http` block.
- Every request and response JSON example parses.
- The private Playwright directory `.solpoc-tmp/draft-routes/conversation/05-route-rules-tightener/` was deleted after rendered inspection and before this handoff was written.
- Phase-scoped `validate-temp-cleanup.mjs` passed with no entries or blockers.

## Unresolved Ambiguities

- Human authentication remains unresolved in `docs/concepts/REQUIREMENTS.md`. The tightened transport uses a secure browser-managed session-cookie shape for this UX API contract without selecting an identity provider, exposing a raw value, or adding identity to JSON.
- The static mockup URL does not carry a concrete conversation public UID. The contract records the intended source as the incoming conversation page route and uses `{conversationUid}` in route shapes.
- Note visibility and emoji multiplicity remain unresolved and are not settled by these routes.
- The mockup's CSS/`hidden` presentation inconsistency for the empty/deleted-message and alternate leave states remains a mockup issue; the route contract follows the requirements-backed state transitions.

## Change Boundary Confirmation

- Written: `docs/mockup/routes/conversation-routes.md`
- Written: `ai-docs/draft-routes/conversation/05-route-rules-tightener.md`
- No HTML, CSS, JavaScript, concept, companion, schema, mock-data, package, OpenAPI, backend, frontend-business-logic, lower-layer API, other area's route, or other phase handoff file was changed by this phase.
- No shared scratch file, alternate route file, project dependency, or file outside `solutionArtifactRoot` was created.
