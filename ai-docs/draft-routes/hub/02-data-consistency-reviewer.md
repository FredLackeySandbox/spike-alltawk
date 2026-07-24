# Phase 2 Data Consistency Reviewer Handoff

## Target

- `solutionArtifactRoot`: `/Users/flackey/Source/Personal/FredLackeySandbox/spike-alltawk`
- Platform and work unit: `desktop/hub`
- Page catalog: `docs/concepts/APP_PAGES.md`
- Requirements: `docs/concepts/REQUIREMENTS.md`

All markdown path references in this handoff are repository-relative to `solutionArtifactRoot`.

## Files Reviewed

- `docs/concepts/REQUIREMENTS.md`
- `docs/concepts/APP_PAGES.md`
- `docs/mockup/desktop/hub/create.md`
- `docs/mockup/desktop/hub/create.html`
- `docs/mockup/desktop/hub/find.md`
- `docs/mockup/desktop/hub/find.html`
- `docs/mockup/desktop/hub/index.md`
- `docs/mockup/desktop/hub/index.html`
- `docs/mockup/desktop/assets/app.js`
- `ai-docs/draft-routes/hub/01-backend-data-action-analyst.md`

The complete assigned HTML and page-local JavaScript were checked against the companion evidence. The directly referenced shared JavaScript was also reviewed; it supplies generic modal, menu, and toast behavior and does not add a missing hub backend action.

## Corrections Made

- Updated `docs/mockup/desktop/hub/find.md` to clarify that `Retrieve Listed Tag Suggestions` is invoked only in listed mode. Known-unlisted mode suppresses suggestion retrieval entirely, while the listed suggestion source must exclude private-only tags.
- No other companion correction was required. The approved action set already covers the requirements-backed retrieval, creation, membership, discovery, privacy, retry, and continuation behavior evidenced by the three pages.

## Conflicts Resolved

- The prior suggestions wording could be read as requiring a suggestion call during known-unlisted search. The source instead removes the suggestion region and performs no suggestion retrieval in that mode; the companion now states that behavior without weakening the requirement that private-only tags never appear in listed suggestions.
- Fixture arrays, timers, `sessionStorage` writes, generated conversation data, stale evaluation tokens, and explicit pending/success/failure/banned branches were retained as evidence of intended authoritative retrieval, durable persistence, and server-controlled eligibility decisions.
- The create page has only a new-record entry state. `Create Conversation` correctly requires no pre-existing conversation identifier, and no unsupported `Update Conversation` action was added.
- The search page may reactivate a prior membership, but the requirements leave the exact rejoining record semantics unresolved. The final Join actions therefore describe establishing or resuming active membership without inventing a new membership-period rule.

## Lifecycle Review

- `create.html` supports new conversation creation only; it has no edit URL, existing-record initialization, or update handler.
- `find.html` separates privacy-safe evaluation from durable membership establishment for both listed and unlisted conversations. This keeps search/evaluation retries distinct from join retries and preserves banned-result behavior.
- `index.html` separates loading the active joined projection from resolving current access at Resume time. This covers first load, returning users, stale membership, unavailable session, empty results, and transient access resolution.
- Tag-chip add/remove, mode switching, and navigation links are presentation or query-construction behavior. Server enforcement of submitted tag and access constraints remains covered by the relevant create, search, evaluation, or join action rather than by invented UI-control actions.

## Action Coverage Matrix

| Requirements-backed capability or discovered state | Final companion action or no-backend rationale |
| --- | --- |
| Create a conversation from one to ten valid tags, choose listed or unlisted access, allow exclusive matching only for listed access, and assign the identified creator as first owner | `docs/mockup/desktop/hub/create.md` — `Create Conversation` |
| Creation pending state, stable submitted snapshot, duplicate-activation prevention, success continuation, failure, timeout, retry, and draft preservation | `docs/mockup/desktop/hub/create.md` — `Create Conversation` |
| Invalid, duplicate, missing, and maximum-tag feedback before submission | `docs/mockup/desktop/hub/create.md` — `Create Conversation` covers backend enforcement and visible validation failure; chip editing itself is local form behavior and does not require a separate backend action |
| New versus existing record lifecycle on the create page | `docs/mockup/desktop/hub/create.md` — `Create Conversation`; no update action applies because neither requirements, catalog, nor source exposes an existing-conversation entry state |
| Retrieve case-insensitive discovery-eligible tag suggestions while excluding tags known only to unlisted conversations | `docs/mockup/desktop/hub/find.md` — `Retrieve Listed Tag Suggestions` |
| Listed suggestion prefix ordering, no-match state, selected-tag exclusion, and switching to known-unlisted mode with suggestions suppressed | `docs/mockup/desktop/hub/find.md` — `Retrieve Listed Tag Suggestions`; input validation and mode presentation remain local behavior |
| Evaluate listed conversations using each conversation's inclusive or exclusive matching mode and return identifiable, display-ready listed results only | `docs/mockup/desktop/hub/find.md` — `Search Listed Conversations` |
| Listed search loading, populated, empty, failed, retried, and stale-response-superseded states | `docs/mockup/desktop/hub/find.md` — `Search Listed Conversations` |
| Join an eligible listed match immediately, verify the identified person is not banned, record active membership, and continue to the workspace | `docs/mockup/desktop/hub/find.md` — `Join Listed Conversation` |
| Listed join pending, banned/not-eligible, transient failure, retry, stale-query suppression, and success states | `docs/mockup/desktop/hub/find.md` — `Join Listed Conversation` |
| Evaluate user-supplied tags against unlisted conversations without exposing identities or private-only tag suggestions | `docs/mockup/desktop/hub/find.md` — `Evaluate Known Unlisted Conversation Tags` |
| Known-unlisted empty, partial, nonmatching, ambiguous, complete unique eligible, complete banned, loading, failed, retried, and stale-response states | `docs/mockup/desktop/hub/find.md` — `Evaluate Known Unlisted Conversation Tags` |
| Join one complete unique eligible unlisted match, revalidate eligibility, record active membership, and continue without pre-join identity disclosure | `docs/mockup/desktop/hub/find.md` — `Join Unlisted Conversation` |
| Unlisted join pending, banned/not-eligible, transient failure, retry, stale-evaluation suppression, and success states | `docs/mockup/desktop/hub/find.md` — `Join Unlisted Conversation` |
| Load the identified person's active joined conversations with tag combinations, current role, recent activity, and normal private moderation conversations | `docs/mockup/desktop/hub/index.md` — `Retrieve Joined Conversations` |
| Joined-list loading, populated newest-first, empty, persistent failure, flaky retry success, indefinitely pending, and unavailable-session states | `docs/mockup/desktop/hub/index.md` — `Retrieve Joined Conversations` |
| Open a selected joined conversation only after resolving current authoritative active membership | `docs/mockup/desktop/hub/index.md` — `Resolve Joined Conversation Access` |
| Resume success, stale removed/banned membership removal, count refresh, unresolvable selection, list preservation, and retry | `docs/mockup/desktop/hub/index.md` — `Resolve Joined Conversation Access` |
| Find/Create/Back/Cancel links and search-mode/chip controls that only navigate or manipulate already-present form state | No separate backend action; their backend-relevant consequences are covered by the destination page lifecycle and the create/search/evaluate/join actions above |

## Unresolved Ambiguities

- Extra-tag semantics and the behavior of multiple complete hidden matches remain unresolved in `docs/concepts/REQUIREMENTS.md`; the companions preserve the privacy boundary without selecting a new rule.
- Exact rejoining membership-period behavior remains unresolved; Join may establish or resume active membership without documenting an unsupported persistence model.
- Human authentication remains unspecified. The hub's unavailable-session state is covered without inventing an authentication provider or credential flow.
- The mockup uses fixture-internal listed identifiers and raw hidden tag combinations. Later route work must replace these with public-safe conversation UIDs or opaque continuation values and must not expose hidden conversation identity before successful membership establishment.
- Exact tag casing and grammar edge cases remain unresolved. The companions require documented constraint enforcement without settling those open questions.

## Scope Confirmation

This phase changed only:

- `docs/mockup/desktop/hub/find.md`
- `ai-docs/draft-routes/hub/02-data-consistency-reviewer.md`

`docs/mockup/desktop/hub/create.md` and `docs/mockup/desktop/hub/index.md` were reviewed and required no edits. No HTML, CSS, JavaScript, concept document, schema, mock data, route file, backend design, frontend business logic, application source, package file, OpenAPI file, or downstream phase handoff was changed.
