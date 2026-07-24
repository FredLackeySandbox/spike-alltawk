# Phase 4 Route Payload Drafter Handoff

## Assignment

- `solutionArtifactRoot`: `/Users/flackey/Source/Personal/FredLackeySandbox/spike-alltawk`
- Platform and folder: desktop `conversation`
- Folder slug: `conversation`
- Route file updated: `docs/mockup/routes/conversation-routes.md`
- Private Playwright directory: `.solpoc-tmp/draft-routes/conversation/04-route-payload-drafter/`

All markdown path references in this handoff and the route file are repository-relative to `solutionArtifactRoot`. Filesystem reads and writes used absolute paths under that root. `projects/**` was out of scope and was not read or changed.

## Inputs Reviewed

- `docs/concepts/REQUIREMENTS.md`
- `docs/concepts/APP_PAGES.md`
- `docs/mockup/routes/conversation-routes.md`
- `docs/mockup/desktop/conversation/thread.md`
- `docs/mockup/desktop/conversation/thread.html`
- `docs/mockup/desktop/assets/app.js`
- `ai-docs/draft-routes/conversation/03-area-route-drafter.md`

Every `### Source Actions` entry was traced through its companion page states, evidence, visible inputs, and required outcomes before payload drafting. Every file listed under each route's `### Mockup Files` was inspected.

## Playwright Runner Contract

- `id`: `npm-exec-no-cli`
- `label`: `npm exec --no --package playwright -- playwright`
- `usage`: `npm exec --no --package playwright -- playwright`
- `command`: `npm`
- `baseArgs`: `["exec", "--no", "--package", "playwright", "--", "playwright"]`
- `version`: `1.61.1`
- `testRunnerModule`: `/Users/flackey/.npm/_npx/e41f203b7505f1fb/node_modules/playwright/test.js`

The CommonJS inspection specification imported `test` and `expect` from that exact absolute `testRunnerModule` and invoked the supplied command and base arguments with the `test` subcommand. No package-name import, `npx`, runner rediscovery, smoke fixture, package installation, live API, authentication service, or third-party system was used.

## Rendered Inspection

`docs/mockup/desktop/conversation/thread.html` was rendered at the discovered 1080-pixel viewport. Three Playwright tests passed while covering:

- default loading and populated workspace states;
- populated-message reactions through an existing active or inactive chip and the emoji picker;
- successful message posting, message-note create and update, conversation-note create and update, report submission, and message deletion;
- empty conversation;
- failed workspace retrieval followed by retry;
- read-only membership and posting suspension, including the displayed suspension end time;
- one-shot message-post failure with retained draft followed by successful retry;
- stale message-note and stale report targets;
- last-owner, additional-owner, and ordinary-member leave states.

The private directory contained only phase-owned specifications, configuration, screenshots, reports, and test output. It was removed after the final rendered inspection and before this handoff was written. Its absence was explicitly confirmed.

## Routes Updated

Exactly one `### Example Request Payload` and one `### Example Response Payload` were added to each of the 13 existing route sections:

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

GET initializers use the exact no-body statement. Mutation requests contain only visible text, explicit confirmation intent, a selected public message UID, the current page's public conversation UID, or a public note UID carried forward from note retrieval. Responses provide display-ready outcomes, public continuation UIDs, editable note values, message and reaction aggregates, moderation ticket display values, allowed actions, confirmation copy, or safe browser navigation paths required by the page.

All JSON examples are parseable. Thirty-two public UID values were checked as lowercase 32-character v4 UUID strings without hyphens. Lookup-like values use all-caps enum strings. No raw cookie, bearer token, session identifier, credential, provider secret, database identifier, audit record, permission rule, internal workflow state, application API contract, or secure API contract appears in the JSON examples.

## Request Context And Provenance

Each route now has one `### Request Context` subsection because every route depends on the identified participant's browser-managed session and at least one current-route, selected-record, or prior-response value.

- The participant session is described only as a secure browser-managed cookie. The UX API derives identity, membership, roles, ownership, permission, moderation audience, and access decisions server-side.
- `conversationUid` comes from the current conversation page route.
- `messageUid` comes from the selected message in the Retrieve Conversation Workspace response.
- Message-note and conversation-note `noteUid` values come from their respective retrieval responses and are sent only by update actions.
- Emoji values come from the visible reaction chip or picker.
- Report explanation, note text, message text, and confirmation intent come from visible user input.

## Route Authoring Rules Applied

- Preserved every Phase 3 route heading, description, `### Source Actions` mapping, and `### Mockup Files` list.
- Preserved complete coverage of all 13 approved companion actions.
- Kept message-note and conversation-note create requests independent of any pre-existing note UID; update requests carry the public note UID returned by retrieval.
- Made note retrieval responses edit-ready by returning current text and a public note UID for the update state.
- Kept participant identity, current membership, ownership continuity, authorization, report numbering, and note visibility decisions behind the UX API boundary.
- Returned only display-ready workspace, message, reaction, note, report, deletion, and leave data needed for rendered states and visible next actions.
- Classified all browser-returned identifiers as safe public UIDs and all browser paths as safe UI navigation targets.
- Avoided inventing the unresolved note-visibility model, human authentication mechanism, ticket workflow, emoji multiplicity rules, or lower-layer service contracts.

## Ambiguities And Mockup Inconsistencies

- The human authentication mechanism remains unresolved. Payloads therefore name a browser-managed identified-participant session without selecting a provider, exposing a cookie value, or putting identity in JSON.
- Note visibility and emoji multiplicity remain unresolved and are absent from the contracts.
- One example response can demonstrate only one concrete branch. The workspace example uses a populated, unrestricted owner state; note initializers use the update state; and the leave example uses the default last-owner blocked branch. The route descriptions and companion actions remain the authority for the documented empty, restricted, create, allowed-leave, stale, unauthorized, and failure branches that later tightening and review must make concrete.
- The page's source sets the `hidden` attribute on messages in the empty state, on a successfully deleted message, and on alternate leave-modal sections. Rendered inspection showed that page CSS keeps some of those elements visually rendered. This is a presentation inconsistency, not a change to the authoritative required outcomes; payloads still return explicit empty, removal, and owner-continuity data.
- The mockup does not carry a concrete public conversation UID in its static URL. Examples use a valid public UID and document the intended current-page-route source without inventing internal context.

## Validation

- All 13 route sections have exactly one request-payload subsection and exactly one response-payload subsection.
- Every response example is fenced parseable JSON.
- Every request example is either fenced parseable JSON or the exact no-body statement.
- `validate-route-coverage.mjs` passed with 13 companion actions, 13 mapped actions, 13 routes, and no blockers.
- The private Playwright phase directory was removed before handoff.

## Change Boundary Confirmation

- Written: `docs/mockup/routes/conversation-routes.md`
- Written: `ai-docs/draft-routes/conversation/04-route-payload-drafter.md`
- No HTML, CSS, JavaScript, concept, companion, schema, mock-data, package, OpenAPI, backend, frontend-business-logic, lower-layer API, other area's route, or other phase handoff file was changed by this phase.
- No shared scratch file, alternate route file, project dependency, or path outside `solutionArtifactRoot` was created.
