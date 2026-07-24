# Phase 3 Area Route Drafter Handoff

## Target

- Platform: desktop
- Folder: `docs/mockup/desktop/governance/`
- Work-unit slug: `governance`
- Route file: `docs/mockup/routes/governance-routes.md`
- `solutionArtifactRoot`: `/Users/flackey/Source/Personal/FredLackeySandbox/spike-alltawk`

All markdown path references in this handoff are repository-relative to `solutionArtifactRoot`. All filesystem reads and writes used absolute paths beneath that root.

## Inputs Reviewed

- `docs/concepts/REQUIREMENTS.md`
- `docs/concepts/APP_PAGES.md`
- `docs/mockup/desktop/governance/members.md`
- `docs/mockup/desktop/governance/settings.md`
- `ai-docs/draft-routes/governance/01-backend-data-action-analyst.md`
- `ai-docs/draft-routes/governance/02-data-consistency-reviewer.md`

## Complete Approved Action Inventory

### `docs/mockup/desktop/governance/members.md`

1. `Retrieve Conversation Roster`
2. `Promote Participant to Owner`
3. `Promote Participant to Administrator`
4. `Remove Participant`
5. `Ban Identity`
6. `Restore Banned Participant`
7. `Create Posting Suspension`
8. `Update Posting Suspension`
9. `End Posting Suspension`

### `docs/mockup/desktop/governance/settings.md`

1. `Retrieve Conversation Governance Settings`
2. `Update Conversation Tags`
3. `Archive Conversation`

All twelve approved actions remain mapped under `### Source Actions`; no companion action was renamed, omitted, or supplemented with an unknown action.

## Action-to-Route Coverage Matrix

| Companion action | Draft route |
|---|---|
| `docs/mockup/desktop/governance/members.md` — `Retrieve Conversation Roster` | `GET /api/v0/governance/retrieve-conversation-governance` |
| `docs/mockup/desktop/governance/settings.md` — `Retrieve Conversation Governance Settings` | `GET /api/v0/governance/retrieve-conversation-governance` |
| `docs/mockup/desktop/governance/members.md` — `Promote Participant to Owner` | `POST /api/v0/governance/promote-participant-role` |
| `docs/mockup/desktop/governance/members.md` — `Promote Participant to Administrator` | `POST /api/v0/governance/promote-participant-role` |
| `docs/mockup/desktop/governance/members.md` — `Remove Participant` | `DELETE /api/v0/governance/remove-participant` |
| `docs/mockup/desktop/governance/members.md` — `Ban Identity` | `POST /api/v0/governance/ban-identity` |
| `docs/mockup/desktop/governance/members.md` — `Restore Banned Participant` | `POST /api/v0/governance/restore-banned-participant` |
| `docs/mockup/desktop/governance/members.md` — `Create Posting Suspension` | `POST /api/v0/governance/create-posting-suspension` |
| `docs/mockup/desktop/governance/members.md` — `Update Posting Suspension` | `PATCH /api/v0/governance/update-posting-suspension` |
| `docs/mockup/desktop/governance/members.md` — `End Posting Suspension` | `DELETE /api/v0/governance/end-posting-suspension` |
| `docs/mockup/desktop/governance/settings.md` — `Update Conversation Tags` | `PATCH /api/v0/governance/update-conversation-tags` |
| `docs/mockup/desktop/governance/settings.md` — `Archive Conversation` | `POST /api/v0/governance/archive-conversation` |

## Routes Drafted and Consolidation Decisions

- Drafted ten governance routes in `docs/mockup/routes/governance-routes.md`.
- Consolidated the roster and settings initialization actions into one page-selectable governance retrieval route. Its purpose explicitly requires step-complete, page-specific data rather than a lowest-common-denominator summary.
- Consolidated owner and administrator promotion into one non-idempotent role-promotion route because both operate on an existing roster participant at the same visible trigger boundary. The selected target role remains a browser-visible choice, and the distinct companion actions remain individually mapped.
- Preserved participant removal, banning, restoration, conversation archival, and tag editing as separate product actions because their lifecycle effects and visible branches differ.
- Preserved posting-suspension creation, update, and ending as three routes. Creation requires no pre-existing suspension reference and returns one; update and ending require the existing public suspension reference returned by roster retrieval.
- Used `PATCH` only for updates to already identified conversation tags and posting suspension data, `DELETE` for ending an existing membership or suspension, `GET` for UI initialization, and `POST` for consequential role, ban, restoration, suspension-creation, and archival operations.

## Invocation-Feasibility Findings

| Route | Browser-held values at invocation | Feasibility and required continuation |
|---|---|---|
| Retrieve Conversation Governance | Current conversation public identifier from the page route; selected members/settings view from the current page | Feasible for first entry without hidden workflow state. The response must supply page-specific current state, allowed actions, editable values, public participant identifiers, and public suspension references required by later visible actions. |
| Promote Participant Role | Conversation public identifier from the page route; participant public identifier from the roster row; visible target role; explicit confirmation | Feasible for owner and administrator target states. Current viewer authority and owner-continuity decisions remain server-derived. |
| Remove Participant | Conversation public identifier from the page route; participant public identifier from the roster row; explicit confirmation | Feasible for active participants and a requirements-backed eligible non-final owner. The server determines whether the target is protected and returns retained former state and updated counts. |
| Ban Identity | Conversation public identifier from the page route; participant public identifier from an active or former roster row; explicit confirmation | Feasible for active, removed, and eligible non-final-owner states. Current authority, active-state ending, and rejoin prevention are server-owned decisions. |
| Restore Banned Participant | Conversation public identifier from the page route; banned participant public identifier and displayed retained role from the roster; explicit confirmation | Feasible without inventing a role picker. The requirements-backed restoration behavior takes priority over the mockup's eligibility-only outcome; the response must return the active restored entry. |
| Create Posting Suspension | Conversation and participant public identifiers from page route and roster; visible end date/time and displayed time-zone context | Feasible before any suspension exists. It must not require a suspension UID or version and must return a public suspension reference for later update/end actions. |
| Update Posting Suspension | Conversation and participant public identifiers plus existing suspension public reference and editable current end from roster retrieval; visible revised date/time and time-zone context | Feasible only when the load response carries the public suspension reference and current editable end. A missing or stale suspension receives a concrete non-success branch. |
| End Posting Suspension | Conversation and participant public identifiers plus existing suspension public reference from roster retrieval; explicit confirmation | Feasible for a current suspension without hidden lookup context. A missing or stale suspension receives a concrete non-success branch. |
| Update Conversation Tags | Conversation public identifier from the page route; complete visible edited tag set | Feasible for an existing conversation only. The browser does not supply permission, lifecycle, normalization policy, or other backend decisions; the response returns committed display tags or actionable validation/stale/failure state. |
| Archive Conversation | Conversation public identifier from the page route; explicit owner confirmation | Feasible with no hidden object identifier. The dirty-draft block is visible client state, while current owner authority and conversation lifecycle are rechecked by the UX API. |

Every required browser-supplied value is available from user input, the current page route, the selected roster row, or the prior governance retrieval response. No route assumes a pre-existing UID for a new suspension, a hidden frontend authorization decision, an internal session identifier in JSON, or lower-layer application data.

## Page-State and Rule Coverage

- The shared retrieval route covers owner, administrator, ordinary-member denied, active/former, empty, failed/retry, suspended, expired-suspension, listed/unlisted, archived, and unavailable page-entry states with page-specific UI-ready data.
- Editable existing values are explicitly required from the retrieval response: current tags for settings and current suspension end plus a public suspension reference for roster edits.
- Consequential mutation routes preserve pending, success, validation, protected-owner, stale-permission, missing-record, lifecycle-locked, and retryable-failure branches named by the companion actions.
- Browser-returned continuation values are limited to public-safe identifiers needed for later visible actions. Raw credentials, database identifiers, private workflow state, permission internals, and lower-layer contracts are excluded.
- The route list does not create settings for post-creation visibility or matching changes, because both the requirements and page catalog keep those values read-only.

## Ambiguities

- Requirements do not decide whether restoring a banned participant always restores the retained prior role or permits choosing another appropriate role. The current route uses the retained role already displayed by the roster and does not invent a new selector.
- Tag display casing, exact multi-hyphen grammar, archived-conversation visibility, and post-tag-change effects on in-progress unlisted joins remain unresolved. The route purposes preserve actionable validation and display-ready results without settling those product questions.
- The members mockup omits simulated mutation failure branches and a second-owner fixture. Requirements-backed protected/non-final-owner and stale/failure outcomes remain part of the route purposes.

No ambiguity blocks Phase 3 route drafting.

## Scope Confirmation

- This agent was assigned only the desktop `governance` area.
- Written route file: `docs/mockup/routes/governance-routes.md`
- Written handoff: `ai-docs/draft-routes/governance/03-area-route-drafter.md`
- Only those two assigned markdown files were created.
- No companion, HTML, CSS, JavaScript, concept, schema, mock-data, package, OpenAPI, application source, backend implementation, frontend business logic, application API contract, secure API contract, or neighboring route/review file was changed.
