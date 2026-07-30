# Phase 3 Area Route Drafter Handoff

## Target

- `solutionArtifactRoot`: `/Users/flackey/Source/Personal/FredLackeySandbox/spike-alltawk`
- Scenario: `root-artifact-monorepo`
- Platform and work unit: `desktop/hub`
- Route namespace: `hub`
- Route file: `docs/mockup/routes/hub-routes.md`

All markdown path references in this handoff are repository-relative to `solutionArtifactRoot`.

## Files Reviewed

- `docs/concepts/REQUIREMENTS.md`
- `docs/concepts/APP_PAGES.md`
- `docs/mockup/desktop/hub/create.md`
- `docs/mockup/desktop/hub/find.md`
- `docs/mockup/desktop/hub/index.md`
- `ai-docs/draft-routes/hub/01-backend-data-action-analyst.md`
- `ai-docs/draft-routes/hub/02-data-consistency-reviewer.md`

## Complete Approved Action Inventory

- `docs/mockup/desktop/hub/create.md`
  - `Create Conversation`
- `docs/mockup/desktop/hub/find.md`
  - `Retrieve Listed Tag Suggestions`
  - `Search Listed Conversations`
  - `Join Listed Conversation`
  - `Evaluate Known Unlisted Conversation Tags`
  - `Join Unlisted Conversation`
- `docs/mockup/desktop/hub/index.md`
  - `Retrieve Joined Conversations`
  - `Resolve Joined Conversation Access`

All eight approved actions remain in scope and are mapped under exactly one route. No unknown, renamed, or orphaned source action was introduced.

## Action-to-Route Coverage Matrix

| Companion action | Route |
| --- | --- |
| `docs/mockup/desktop/hub/create.md` — `Create Conversation` | `POST /api/v0/hub/create-conversation` |
| `docs/mockup/desktop/hub/find.md` — `Retrieve Listed Tag Suggestions` | `GET /api/v0/hub/retrieve-listed-tag-suggestions` |
| `docs/mockup/desktop/hub/find.md` — `Search Listed Conversations` | `GET /api/v0/hub/search-listed-conversations` |
| `docs/mockup/desktop/hub/find.md` — `Join Listed Conversation` | `POST /api/v0/hub/join-listed-conversation` |
| `docs/mockup/desktop/hub/find.md` — `Evaluate Known Unlisted Conversation Tags` | `POST /api/v0/hub/evaluate-known-unlisted-conversation-tags` |
| `docs/mockup/desktop/hub/find.md` — `Join Unlisted Conversation` | `POST /api/v0/hub/join-unlisted-conversation` |
| `docs/mockup/desktop/hub/index.md` — `Retrieve Joined Conversations` | `GET /api/v0/hub/retrieve-joined-conversations` |
| `docs/mockup/desktop/hub/index.md` — `Resolve Joined Conversation Access` | `GET /api/v0/hub/resolve-joined-conversation-access` |

Every operation uses the discovery-provided `hub` namespace, every operation segment is lowercase kebab case, and every namespace-operation identity and method-template pair is unique.

## Consolidation And Page-Specific Actions

No approved actions were merged because each has distinct invocation timing, privacy, mutation, or workflow-continuation semantics:

- Listed tag suggestions and listed conversation search are separate retrieval operations because they consume different visible inputs and produce different UI states.
- Listed search and listed join remain separate because search retrieves selectable public results while join performs an eligibility decision and durable membership change.
- Known-unlisted evaluation and unlisted join remain separate to preserve the pre-membership privacy boundary. Evaluation returns only a public-safe opaque continuation for a complete unique eligible match; join performs the eligibility decision and durable membership change.
- Joined-list retrieval and access resolution remain separate because the first supplies a visible selection list and the second rechecks membership at the moment Resume is invoked.
- Conversation creation remains a page-specific create operation and is not collapsed into any join or update route.

Identified-session derivation and authorization are shared server responsibilities across hub operations, not separate approved page actions, so no unsupported common route was added.

## Invocation-Feasibility Findings

- `Create Conversation` is invokable from the visible form's ordered tags, access choice, and listed-only matching choice. It requires no pre-existing conversation UID or version. Success must issue the public conversation UID needed to continue to the workspace.
- `Retrieve Listed Tag Suggestions` is invokable from the visible partial tag text and selected-tag chips. It is not invoked in known-unlisted mode and must exclude tags eligible only for private discovery.
- `Search Listed Conversations` is invokable from the visible selected tags. Its results must provide public conversation UIDs for subsequent Join choices; fixture-internal keys are not an acceptable browser contract.
- `Join Listed Conversation` is invokable with the public conversation UID returned in the visible listed-search result. The identified actor, membership history, and eligibility are derived and decided server-side.
- `Evaluate Known Unlisted Conversation Tags` is invokable from the complete current set of user-entered tags. A complete unique eligible outcome must provide a public-safe opaque continuation value while omitting the hidden conversation's identity and private tag data.
- `Join Unlisted Conversation` is invokable with the opaque continuation returned by the immediately preceding evaluation and the complete tag set still visible on the page. It must not require the frontend to supply an undisclosed hidden conversation UID or internal workflow state.
- `Retrieve Joined Conversations` is a page-lifecycle retrieval with no visible form input. It relies on browser-managed identified-session context and returns public conversation UIDs for every visible Resume choice.
- `Resolve Joined Conversation Access` is invokable with the public conversation UID returned by the joined-list operation and selected by the visible Resume control. Current membership and authorization are resolved server-side so stale access cannot open a private workspace.

The route descriptions preserve these value sources for later transport and payload phases without drafting payload examples or lower-layer contracts.

## Routes Drafted

- `POST /api/v0/hub/create-conversation`
- `GET /api/v0/hub/retrieve-listed-tag-suggestions`
- `GET /api/v0/hub/search-listed-conversations`
- `POST /api/v0/hub/join-listed-conversation`
- `POST /api/v0/hub/evaluate-known-unlisted-conversation-tags`
- `POST /api/v0/hub/join-unlisted-conversation`
- `GET /api/v0/hub/retrieve-joined-conversations`
- `GET /api/v0/hub/resolve-joined-conversation-access`

## Unresolved Ambiguities

- Extra-tag semantics for listed search and exact-versus-superset semantics for unlisted matching remain unresolved in `docs/concepts/REQUIREMENTS.md`; the route list does not settle either rule.
- Multiple complete hidden matches remain unresolved. The evaluation route preserves the established requirement that Join is unavailable until one complete unique match exists.
- Exact membership-period behavior when a former voluntary member rejoins remains unresolved. Both Join routes therefore describe establishing or resuming active membership without inventing a storage model.
- Human authentication and browser session transport remain unspecified. The routes rely on identified browser context without selecting a provider, cookie name, bearer format, or credential mechanism.
- Tag casing and detailed grammar edge cases remain unresolved.
- The public-safe opaque continuation format and expiration policy for known-unlisted evaluation are intentionally deferred to later route transport documentation; no raw hidden identity is exposed.

## Scope Confirmation

This unique Phase 3 agent was assigned only the `desktop/hub` work unit. It wrote only:

- `docs/mockup/routes/hub-routes.md`
- `ai-docs/draft-routes/hub/03-area-route-drafter.md`

No page companion, HTML, CSS, JavaScript, concept document, schema, mock data, payload example, request-context section, OpenAPI file, backend code, frontend logic, application API contract, secure API contract, package file, neighboring route artifact, or other area route file was changed.
