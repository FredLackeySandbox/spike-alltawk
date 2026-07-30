# Phase 3 Area Route Drafter Handoff

## Target

- Platform: desktop
- Assigned area: `docs/mockup/desktop/governance/`
- Work-unit slug: `governance`
- Route namespace: `governance`
- Route file: `docs/mockup/routes/governance-routes.md`
- `solutionArtifactRoot`: `/Users/flackey/Source/Personal/FredLackeySandbox/spike-alltawk`

All markdown path references in this handoff are repository-relative to `solutionArtifactRoot`.

## Files Reviewed

- `docs/concepts/REQUIREMENTS.md`
- `docs/concepts/APP_PAGES.md`
- `docs/mockup/desktop/governance/members.md`
- `docs/mockup/desktop/governance/settings.md`
- `ai-docs/draft-routes/governance/01-backend-data-action-analyst.md`
- `ai-docs/draft-routes/governance/02-data-consistency-reviewer.md`

## Approved Action Inventory

### `docs/mockup/desktop/governance/members.md`

- `Retrieve Conversation Roster`
- `Promote Participant to Owner`
- `Promote Participant to Administrator`
- `Remove Participant`
- `Ban Identity`
- `Restore Banned Participant`
- `Create Posting Suspension`
- `Update Posting Suspension`
- `End Posting Suspension`

### `docs/mockup/desktop/governance/settings.md`

- `Retrieve Conversation Governance Settings`
- `Update Conversation Tags`
- `Archive Conversation`

All 12 approved companion actions are represented under `### Source Actions` in the route file.

## Action-to-Route Coverage Matrix

| Companion action | Route operation | Coverage decision |
|---|---|---|
| `docs/mockup/desktop/governance/members.md` — `Retrieve Conversation Roster` | `GET /api/v0/governance/retrieve-conversation-roster` | Page-specific load remains separate because it returns membership, restriction, role-authority, and ownership-continuity state. |
| `docs/mockup/desktop/governance/members.md` — `Promote Participant to Owner` | `PATCH /api/v0/governance/update-participant-role` | Consolidated with administrator promotion as an existing membership-role update; the target role and distinct authority outcome remain explicit visible action intent. |
| `docs/mockup/desktop/governance/members.md` — `Promote Participant to Administrator` | `PATCH /api/v0/governance/update-participant-role` | Consolidated with owner promotion as the same identified membership-role lifecycle update without losing its owner-only eligibility rules. |
| `docs/mockup/desktop/governance/members.md` — `Remove Participant` | `DELETE /api/v0/governance/remove-participant` | Kept separate because it ends active membership but preserves retained history and later rejoin eligibility. |
| `docs/mockup/desktop/governance/members.md` — `Ban Identity` | `POST /api/v0/governance/ban-identity` | Kept separate as a privileged action that may affect an active or former identity and prevents rejoin. |
| `docs/mockup/desktop/governance/members.md` — `Restore Banned Participant` | `POST /api/v0/governance/restore-banned-participant` | Kept separate because it ends a ban and restores active membership rather than merely updating a displayed role. |
| `docs/mockup/desktop/governance/members.md` — `Create Posting Suspension` | `POST /api/v0/governance/create-posting-suspension` | Separate create lifecycle; it does not require a pre-existing suspension UID. |
| `docs/mockup/desktop/governance/members.md` — `Update Posting Suspension` | `PATCH /api/v0/governance/update-posting-suspension` | Separate update lifecycle; it requires the existing public suspension reference returned by roster retrieval. |
| `docs/mockup/desktop/governance/members.md` — `End Posting Suspension` | `DELETE /api/v0/governance/end-posting-suspension` | Separate end lifecycle; it identifies the existing suspension and restores posting access while retaining history. |
| `docs/mockup/desktop/governance/settings.md` — `Retrieve Conversation Governance Settings` | `GET /api/v0/governance/retrieve-conversation-governance-settings` | Page-specific load remains separate because it returns editable tags, fixed access/matching summaries, lifecycle state, and allowed governance actions. |
| `docs/mockup/desktop/governance/settings.md` — `Update Conversation Tags` | `PATCH /api/v0/governance/update-conversation-tags` | Existing conversation update with the complete visible tag set. |
| `docs/mockup/desktop/governance/settings.md` — `Archive Conversation` | `POST /api/v0/governance/archive-conversation` | Separate owner-only, non-idempotent lifecycle invocation that ends active use without hard deletion. |

## Consolidation and Lifecycle Decisions

- The two promotion actions share `PATCH /api/v0/governance/update-participant-role` because both update the role of an existing, roster-selected membership. The later request contract must preserve the visible target-role intent and the different eligibility and outcome rules for owner versus administrator promotion.
- Roster loading and governance-settings loading remain separate. Combining them would return unrelated page data and weaken page-state-specific authorization and failure handling.
- Remove, ban, and restore remain distinct because removal permits later rejoin, banning prevents rejoin, and restoration ends a ban while reactivating an appropriate retained role.
- Posting suspension create, update, and end remain distinct. Creation cannot require a suspension UID; update and end must identify the existing public suspension reference returned by the roster load.
- Updating conversation tags is an update of an already identified conversation, not creation. Archival is an explicit owner-only invocation, not hard deletion.

## Invocation-Feasibility Findings

| Route operation | Browser-available values at invocation |
|---|---|
| `GET /api/v0/governance/retrieve-conversation-roster` | The current conversation public UID comes from the page route. The active/former filter is already-loaded presentation state unless a refresh request deliberately sends that visible selection. Session and viewer authority are browser/server request context, not JSON business inputs. |
| `PATCH /api/v0/governance/update-participant-role` | The conversation public UID comes from the page route, the participant public UID comes from the selected roster row, the target role comes from the visible promotion action, and explicit confirmation supplies action intent. |
| `DELETE /api/v0/governance/remove-participant` | The conversation public UID comes from the page route, the participant public UID comes from the selected roster row, and the open confirmation supplies removal intent. Owner continuity and viewer authority are rechecked server-side. |
| `POST /api/v0/governance/ban-identity` | The conversation public UID comes from the page route, the identity or participant public UID comes from the selected active or former roster row, and explicit confirmation supplies ban intent. |
| `POST /api/v0/governance/restore-banned-participant` | The conversation public UID and selected participant public UID are available from the route and banned roster row. The retained displayed role is available from the roster load; requirements do not establish a separate role picker. |
| `POST /api/v0/governance/create-posting-suspension` | The conversation and participant public UIDs come from the route and selected roster row. The visible form supplies end date, end time, and displayed time-zone context. No suspension UID exists or may be required. |
| `PATCH /api/v0/governance/update-posting-suspension` | The roster load must return a public suspension UID plus editable current end values. The selected row carries that UID forward, and the visible form supplies the revised end date, time, and time-zone context. |
| `DELETE /api/v0/governance/end-posting-suspension` | The selected suspended row carries the public suspension UID returned by roster retrieval, and explicit confirmation supplies immediate-end intent. |
| `GET /api/v0/governance/retrieve-conversation-governance-settings` | The current conversation public UID comes from the page route. Viewer role, membership, authorization, lifecycle, and allowed actions are derived and decided server-side. |
| `PATCH /api/v0/governance/update-conversation-tags` | The conversation public UID comes from the page route and the editor supplies the complete visible revised tag set. Any later concurrency field must first be returned by the settings load rather than invented by the frontend. |
| `POST /api/v0/governance/archive-conversation` | The conversation public UID comes from the page route and explicit confirmation supplies archive intent. The server rechecks owner authority, active lifecycle, and unchanged actionable state; no hidden frontend authorization inputs are required. |

Every required browser-supplied identifier is therefore available from the current page route, a selected public roster record, or a prior visible UX API response. Authentication/session context and authorization decisions remain behind the UI-facing API boundary.

## Routes Drafted

- `GET /api/v0/governance/retrieve-conversation-roster`
- `PATCH /api/v0/governance/update-participant-role`
- `DELETE /api/v0/governance/remove-participant`
- `POST /api/v0/governance/ban-identity`
- `POST /api/v0/governance/restore-banned-participant`
- `POST /api/v0/governance/create-posting-suspension`
- `PATCH /api/v0/governance/update-posting-suspension`
- `DELETE /api/v0/governance/end-posting-suspension`
- `GET /api/v0/governance/retrieve-conversation-governance-settings`
- `PATCH /api/v0/governance/update-conversation-tags`
- `POST /api/v0/governance/archive-conversation`

All operations use the discovery-provided `governance` namespace, unique lowercase-kebab operation segments, and unique method-plus-route templates.

## Unresolved Ambiguities

- Requirements do not settle whether restoring a banned participant always restores the retained prior role or permits an owner to choose another appropriate active role. The current page exposes no role picker, so later payload work should carry the retained displayed role from the roster result without inventing a new choice.
- The mockup's local Unban outcome makes the identity merely eligible to rejoin, while requirements explicitly restore an appropriate active role. The route follows the requirements-backed restoration action and should preserve this inconsistency for later review.
- Tag display casing, exact multi-hyphen grammar, effects of tag changes on in-progress unlisted joins, and archived-conversation visibility remain unresolved. They do not change this route inventory.
- The mockups do not simulate stale or retryable outcomes for every member mutation. Later payloads should support the companions' required safe outcomes without adding new operations.

No ambiguity blocks invocation of the drafted operations.

## Scope Confirmation

- This agent was assigned only the desktop `governance` work unit.
- This agent wrote only `docs/mockup/routes/governance-routes.md` and `ai-docs/draft-routes/governance/03-area-route-drafter.md`.
- The only route file written was `docs/mockup/routes/governance-routes.md`.
- No companion, HTML, CSS, JavaScript, concept, schema, mock-data, package, OpenAPI, application source, backend implementation, application API contract, secure API contract, or frontend-business-rule file was changed.
