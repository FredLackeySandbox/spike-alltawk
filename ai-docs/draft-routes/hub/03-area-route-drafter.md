# Phase 3 Area Route Drafter Handoff

## Assignment

- `solutionArtifactRoot`: `/Users/flackey/Source/Personal/FredLackeySandbox/spike-alltawk`
- Platform and work unit: `desktop/hub`
- Route file: `docs/mockup/routes/hub-routes.md`
- Page catalog: `docs/concepts/APP_PAGES.md`

All markdown paths in this handoff and in the route file are repository-relative to `solutionArtifactRoot`. Filesystem operations used the corresponding absolute paths under that root.

## Inputs Reviewed

- `docs/concepts/REQUIREMENTS.md`
- `docs/concepts/APP_PAGES.md`
- `docs/mockup/desktop/hub/create.md`
- `docs/mockup/desktop/hub/find.md`
- `docs/mockup/desktop/hub/index.md`
- `ai-docs/draft-routes/hub/01-backend-data-action-analyst.md`
- `ai-docs/draft-routes/hub/02-data-consistency-reviewer.md`

## Complete Approved Action Inventory

- `docs/mockup/desktop/hub/create.md` — `Create Conversation`
- `docs/mockup/desktop/hub/find.md` — `Retrieve Listed Tag Suggestions`
- `docs/mockup/desktop/hub/find.md` — `Search Listed Conversations`
- `docs/mockup/desktop/hub/find.md` — `Join Listed Conversation`
- `docs/mockup/desktop/hub/find.md` — `Evaluate Known Unlisted Conversation Tags`
- `docs/mockup/desktop/hub/find.md` — `Join Unlisted Conversation`
- `docs/mockup/desktop/hub/index.md` — `Retrieve Joined Conversations`
- `docs/mockup/desktop/hub/index.md` — `Resolve Joined Conversation Access`

All eight approved actions remain represented exactly under `### Source Actions`; no unknown action was introduced.

## Action-to-Route Coverage Matrix

| Approved companion action | Route |
| --- | --- |
| `docs/mockup/desktop/hub/create.md` — `Create Conversation` | `POST /api/v0/hub/create-conversation` |
| `docs/mockup/desktop/hub/find.md` — `Retrieve Listed Tag Suggestions` | `GET /api/v0/hub/retrieve-listed-tag-suggestions` |
| `docs/mockup/desktop/hub/find.md` — `Search Listed Conversations` | `GET /api/v0/hub/search-listed-conversations` |
| `docs/mockup/desktop/hub/find.md` — `Join Listed Conversation` | `POST /api/v0/hub/join-listed-conversation` |
| `docs/mockup/desktop/hub/find.md` — `Evaluate Known Unlisted Conversation Tags` | `POST /api/v0/hub/evaluate-known-unlisted-conversation-tags` |
| `docs/mockup/desktop/hub/find.md` — `Join Unlisted Conversation` | `POST /api/v0/hub/join-unlisted-conversation` |
| `docs/mockup/desktop/hub/index.md` — `Retrieve Joined Conversations` | `GET /api/v0/hub/retrieve-joined-conversations` |
| `docs/mockup/desktop/hub/index.md` — `Resolve Joined Conversation Access` | `GET /api/v0/hub/resolve-joined-conversation-access` |

## Consolidation And Lifecycle Decisions

- No approved actions were merged because each has a materially different trigger, privacy boundary, lifecycle effect, or carry-forward requirement. The result remains a coherent eight-route area contract without page-wording duplicates.
- `Create Conversation` remains a true create route. It accepts no pre-existing conversation UID or version and returns the server-issued public identifier needed for workspace continuation.
- Listed tag suggestions and listed conversation search remain separate read routes because they return different UI-ready projections and are triggered by different visible inputs.
- Listed and unlisted joining remain separate. Listed joining begins with a public conversation UID from an identifiable result; unlisted joining begins with a browser-safe opaque continuation from a privacy-preserving evaluation and must not expose hidden identity before membership succeeds.
- Unlisted evaluation uses `POST` because it submits a sensitive tag combination to a privacy-controlled operation and may issue a new opaque continuation for one complete eligible match. The operation does not turn the hidden conversation itself into browser-visible data.
- Joined-list retrieval and selected-conversation access resolution remain separate reads. The first supplies the visible choices; the second rechecks current membership at the Resume trigger before private workspace continuation.
- No update route applies. The assigned create page has no existing-record entry state, and none of the approved hub actions edits an identified existing conversation record.

## Invocation-Feasibility Findings

| Route | Browser-available request values at invocation | Continuation and branch feasibility |
| --- | --- | --- |
| `POST /api/v0/hub/create-conversation` | Ordered user-entered tags, listed/unlisted choice, listed-only inclusive/exclusive choice, and browser-managed identified-session context | No conversation UID or version exists or is required before creation. Success can return a server-issued public conversation UID and workspace continuation; validation, failure, and timeout can preserve the visible draft. |
| `GET /api/v0/hub/retrieve-listed-tag-suggestions` | Current partial tag text and already selected visible tags | The response can contain only discovery-eligible selectable tag values or an empty list. Known-unlisted mode does not invoke it. |
| `GET /api/v0/hub/search-listed-conversations` | Current validated selected-tag set | Each identifiable result can return a public conversation UID that the visible Join control carries into the next route. Empty and failure branches require no hidden browser context. |
| `POST /api/v0/hub/join-listed-conversation` | Selected public conversation UID from the prior visible search response and browser-managed identified-session context | The route can revalidate eligibility, establish or resume membership, and return workspace continuation. Retry reuses the still-visible selected result; denial need not reveal membership internals. |
| `POST /api/v0/hub/evaluate-known-unlisted-conversation-tags` | Complete current user-entered tag set and browser-managed identified-session context | Partial, ambiguous, and ineligible branches can remain privacy-safe. Only a complete unique eligible result returns an opaque public-safe continuation value for Join. |
| `POST /api/v0/hub/join-unlisted-conversation` | Opaque continuation value from the prior evaluation, the still-visible entered tag set if the tightened contract needs it, and browser-managed identified-session context | The opaque value lets the server continue without a hidden conversation identifier supplied by the frontend. Success may reveal a public conversation UID only after membership is established; denial and retry preserve the privacy boundary. |
| `GET /api/v0/hub/retrieve-joined-conversations` | Browser-managed identified-session context; no JSON body or page-supplied record identifier is needed | Each active item returns a public conversation UID for its visible Resume control. Empty, failure, pending, and unavailable-session branches are feasible without frontend-supplied identity or membership data. |
| `GET /api/v0/hub/resolve-joined-conversation-access` | Selected public conversation UID carried by the visible Resume control from the joined-list response and browser-managed identified-session context | Active access can return workspace continuation; stale membership can identify the selected visible card for removal; transient failure can preserve that selection for retry. |

Every required value comes from a user-entered field, selected public identifier, current visible response, or browser-managed session context. No route assumes a database identifier, raw credential, private hidden-conversation key, undisclosed workflow state, or frontend-derived permission decision.

## Page-Specific Behavior Preserved

- `create.html`: new-record creation, first-owner assignment, pending lock, successful continuation, validation rejection, service failure, timeout, and retryable draft preservation.
- `find.html`: privacy-filtered listed suggestions; listed inclusive/exclusive result evaluation; public result identifiers; listed eligibility and join branches; hidden counts without identity disclosure; complete unique unlisted continuation; and separate unlisted eligibility/join branches.
- `index.html`: active joined standard and private moderation conversations; empty, retryable, pending, and unavailable-session states; and authoritative active/stale/unresolvable checks at Resume time.

## Ambiguities Carried Forward

- Exact listed extra-tag semantics, hidden exact-versus-superset matching, and multiple complete hidden-match behavior remain unresolved in `docs/concepts/REQUIREMENTS.md`. The routes preserve the documented branch boundaries without selecting new rules.
- Human authentication and the concrete session transport remain unresolved. Later transport work must document the chosen browser-sent context source without inventing an identity provider or placing identity, permission, or raw session artifacts in JSON examples.
- The minimum `Join Unlisted Conversation` body can be decided during payload drafting: the opaque prior-response continuation is mandatory, while the visible tag set should be resent only if the UX API cannot safely continue from that value alone.
- Exact tag casing and remaining grammar edge cases remain unresolved and were not settled in the route list.
- Conversation rejoining may establish or resume membership, but the persistence-period behavior remains unspecified and is intentionally not exposed as a frontend decision.

## Scope Confirmation

This unique Phase 3 agent was assigned only the `desktop/hub` area. It wrote only:

- `docs/mockup/routes/hub-routes.md`
- `ai-docs/draft-routes/hub/03-area-route-drafter.md`

No companion, HTML, CSS, JavaScript, concept document, schema, mock data, application source, package file, OpenAPI file, application API contract, secure API contract, backend implementation, authorization algorithm, database design, or frontend business rule was changed.
