# Phase 6 Route Payload Reviewer Handoff

## Assignment

- `solutionArtifactRoot`: `/Users/flackey/Source/Personal/FredLackeySandbox/spike-alltawk`
- `repoRelativeBase`: `/Users/flackey/Source/Personal/FredLackeySandbox/spike-alltawk`
- Platform and folder: desktop `conversation`
- Folder slug: `conversation`
- Route file reviewed: `docs/mockup/routes/conversation-routes.md`
- Private Playwright directory: `.solpoc-tmp/draft-routes/conversation/06-route-payload-reviewer/`

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
- `ai-docs/draft-routes/conversation/05-route-rules-tightener.md`

Every companion action under `### Source Actions` was reviewed against its page states, evidence, visible inputs, and required outcomes. Every file under `### Mockup Files` was inspected.

## Playwright Runner Contract

- `id`: `npm-exec-no-cli`
- `label`: `npm exec --no --package playwright -- playwright`
- `usage`: `npm exec --no --package playwright -- playwright`
- `command`: `npm`
- `baseArgs`: `["exec", "--no", "--package", "playwright", "--", "playwright"]`
- `version`: `1.61.1`
- `testRunnerModule`: `/Users/flackey/.npm/_npx/e41f203b7505f1fb/node_modules/playwright/test.js`

The CommonJS inspection specification imported `test` and `expect` from that exact absolute `testRunnerModule` and invoked the supplied command plus `baseArgs` with the `test` subcommand. No package-name import, `npx`, route rediscovery, smoke fixture, dependency installation, live API, authentication service, or third-party system was used.

## Rendered Inspection

`docs/mockup/desktop/conversation/thread.html` was rendered at the discovered 1080-pixel viewport. The final Playwright run passed two tests covering:

- initial loading and the populated workspace;
- people, bot, and former-participant messages;
- active and inactive reaction chips plus a picker-added reaction;
- successful message posting;
- message-note create and update states;
- conversation-note create and update states;
- successful numbered report submission;
- successful own-message deletion;
- no-message thread;
- failed workspace retrieval followed by retry;
- read-only and posting-suspended membership, including the visible suspension end time;
- one-shot message-post failure with retained draft followed by retry;
- stale message-note and stale report targets; and
- last-owner, additional-owner, and ordinary-member leave states.

Two initial inspection assertions were corrected inside the phase-owned test specification: one hard-coded a date even though the mockup computes the suspension date from the current day, and one generic close locator matched both the Close and Cancel controls. The same preflight-selected command and module pair was used for every run, and the final inspection passed without changing mockup source.

The private directory contained only phase-owned specifications, configuration, reports, screenshots, traces, and test output. It was removed after the final rendered inspection and before this handoff was written, and its absence was explicitly confirmed.

## Routes Reviewed

All 13 route sections were reviewed:

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

The route list, route headings, `### Source Actions`, `### Mockup Files`, `### Route`, and `### Request Context` structure remain complete. All 13 approved companion actions remain mapped and invokable from their documented page states.

## Route Authoring Rules Applied

- Preserved source-action coverage for all 13 approved actions.
- Confirmed that each request value comes from a visible field, selected public UID, current page route, prior UX API response, or the browser-managed session cookie.
- Kept new-note creation independent of a pre-existing note UID and retained public note UIDs for later update actions.
- Kept identity, active membership, authorship, note attachment, source conversation, moderator audience, report numbering, role permissions, and owner-continuity decisions behind the UX API boundary.
- Confirmed that workspace, note, reaction, message, report, deletion, and leave responses contain display-ready state and safe public values needed for the next visible action.
- Confirmed that every UID example is a lowercase 32-character v4 UUID without hyphens and lookup-like values use all-caps enums.
- Kept the browser-managed session value in request headers only. No raw credentials, JWTs, provider secrets, hashes, database IDs, audit rows, permission internals, or lower-layer contracts appear in JSON.
- Preserved the documented empty, failed, restricted, stale, duplicate, blocked, left, and successful branches without inventing unresolved ticket states, note visibility, or emoji-multiplicity rules.

## Payload Corrections

- Expanded the workspace example's visible participant list to include the owner, administrator, member, and bot shown in the referenced mockup.
- Made the workspace example demonstrate the posting-suspension branch with `canPost: false` and display-ready restriction copy, while preserving active membership and message actions.
- Simplified message-note retrieval by removing message-author, timestamp, and message-text data already supplied by the loaded workspace; retained only the selected public message UID, availability, editable note, and allowed save actions.
- Removed redundant selected-message UIDs from message-note create and update responses.
- Removed redundant `messageUid` from the message-note update request because the public `noteUid` identifies the existing note and the UX API resolves and verifies its attachment server-side.
- Removed repeated conversation display data from conversation-note retrieval.
- Removed redundant conversation UIDs from conversation-note create/update responses.
- Removed redundant `conversationUid` from the conversation-note update request because the public `noteUid` identifies the existing note and its attached conversation.
- Removed redundant `conversationUid` from message-report submission because the UX API resolves the source conversation from the selected public message UID.
- Removed `confirmDelete` and `confirmLeave` booleans. Invoking each DELETE route after the visible modal confirmation already expresses action intent, so the browser sends only the selected public UID.
- Updated the affected route descriptions and request-context prose only where those payload simplifications exposed a direct inconsistency.

All request examples remain either parseable fenced JSON or the exact no-body statement. All response examples remain parseable fenced JSON.

## Request Context Review

- `conversationUid` comes from the incoming conversation page route for workspace retrieval and genuinely conversation-scoped actions.
- `messageUid` comes from the selected message in the Retrieve Conversation Workspace response.
- `noteUid` comes from the applicable note-retrieval response and is sufficient for note updates.
- Message text, note text, report explanation, and emoji come from visible user controls.
- The secure browser-managed `tawk_session` cookie identifies the session without exposing its value in JSON.
- Report submission derives the source conversation from the selected message server-side.
- Delete and leave intent is expressed by invoking the corresponding DELETE route after visible confirmation rather than by sending a redundant boolean.

## Validation

- `validate-route-coverage.mjs` passed with 13 companion actions, 13 mapped actions, 13 routes, and no blockers.
- Structural inspection confirmed exactly one `### Source Actions`, `### Mockup Files`, `### Route`, `### Request Context`, `### Example Request Payload`, and `### Example Response Payload` subsection per route.
- All 23 fenced JSON examples parse successfully; the other three request examples use the exact no-body statement.
- Every UID-valued example passed the required 32-character v4 UUID check.
- The private Playwright directory `.solpoc-tmp/draft-routes/conversation/06-route-payload-reviewer/` was removed before this handoff.

## Unresolved Ambiguities

- Human authentication remains unresolved in `docs/concepts/REQUIREMENTS.md`; the route contract continues to use a browser-managed session cookie without selecting an identity provider.
- The static mockup URL does not carry a concrete conversation public UID; the contract preserves the intended incoming-page-route source and uses `{conversationUid}` in route shapes.
- Note visibility, ticket workflow, and emoji multiplicity remain unresolved and are not settled by these examples.
- The mockup's CSS/`hidden` presentation inconsistency for empty/deleted-message and alternate leave states remains a mockup issue; the payload contract follows the requirements-backed state transitions.

## Change Boundary Confirmation

- Written: `docs/mockup/routes/conversation-routes.md`
- Written: `ai-docs/draft-routes/conversation/06-route-payload-reviewer.md`
- No HTML, CSS, JavaScript, concept, companion, schema, mock-data, package, OpenAPI, backend, frontend-business-logic, lower-layer API, other area's route, or other phase handoff file was changed by this phase.
- No shared scratch file, alternate route file, project dependency, or file outside `solutionArtifactRoot` was created.
