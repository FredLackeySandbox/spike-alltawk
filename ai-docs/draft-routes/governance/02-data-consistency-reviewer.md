# Phase 2 Data Consistency Reviewer Handoff

## Target

- Platform: desktop
- Folder: `docs/mockup/desktop/governance/`
- Work-unit slug: `governance`

All markdown path references in this handoff are repository-relative to `solutionArtifactRoot`: `/Users/flackey/Source/Personal/FredLackeySandbox/spike-alltawk`.

## Files Reviewed

- `docs/concepts/REQUIREMENTS.md`
- `docs/concepts/APP_PAGES.md`
- `docs/mockup/desktop/governance/members.html`
- `docs/mockup/desktop/governance/members.md`
- `docs/mockup/desktop/governance/settings.html`
- `docs/mockup/desktop/governance/settings.md`
- `docs/mockup/desktop/assets/app.js`
- `ai-docs/draft-routes/governance/01-backend-data-action-analyst.md`

The requirements and page catalog were read before the companions. Both HTML files and the complete directly referenced local JavaScript were then checked against the Phase 1 evidence.

## Corrections Made

- Expanded `Remove Participant` and `Ban Identity` to cover an eligible non-last owner when the viewer is an owner. The requirements bar administrators from altering owners and protect the last owner, but do not bar an owner from managing another owner when continuity remains intact.
- Renamed `Unban Identity` to `Restore Banned Participant` and aligned its backend need, visible inputs, and required outcomes with the explicit requirements flow: unbanning restores an appropriate active role and retains role history.
- Recorded the conflict between that requirements-backed restoration behavior and the mockup’s eligibility-only Unban result instead of treating the lower-priority mockup behavior as authoritative.
- Confirmed that the settings companion correctly distinguishes retrieval, update of an already identified conversation’s tags, and owner-only archival. No create action belongs on this page, and access or matching-mode editing remains intentionally absent.

## Conflicts Resolved

- `docs/mockup/desktop/governance/members.html` removes all row controls after a participant is promoted to owner and does not provide a second-owner fixture. The requirements and catalog still establish that only administrators are barred from altering owners and that the final owner alone is continuity-protected. The final Remove and Ban actions therefore include the requirements-backed non-last-owner state.
- The same mockup says Unban makes a former participant merely eligible to join again. `docs/concepts/REQUIREMENTS.md` instead says owners or administrators may unban the identity and restore an appropriate active role. The final companion follows the requirements and flags the mockup as inconsistent.
- The ordinary-member fixture leaves the members-page badge reading “You’re an owner,” and the invalid settings fixture may retain a prior role badge. The denied or unavailable page state is authoritative; these stale badges do not create backend actions or broaden permissions.

## Unresolved Ambiguities

- The requirements do not define whether restoring a banned participant always returns the retained prior role or allows an owner to choose another appropriate active role. The current roster visibly retains `Member`, so the companion carries that displayed role without inventing a new selector.
- Tag display casing, the exact multi-hyphen grammar, the effects of changing tags on in-progress unlisted joins, and archived-conversation visibility remain open requirements. No companion resolves them.
- The members mockup does not simulate mutation failures or stale-permission responses for promotion, removal, ban, restoration, or suspension changes. These remain required safe failure outcomes without invented implementation detail.

## Action Coverage Matrix

| Requirements-backed capability or backend-relevant state | Final companion coverage |
|---|---|
| Load active people and bots with roles and access state | `docs/mockup/desktop/governance/members.md` — `Retrieve Conversation Roster` |
| Load retained former, removed, and banned membership for owners and administrators | `docs/mockup/desktop/governance/members.md` — `Retrieve Conversation Roster` |
| Deny ordinary-member access to former membership and governance controls | `docs/mockup/desktop/governance/members.md` — `Retrieve Conversation Roster` |
| Render owner versus administrator authority and allowed row actions | `docs/mockup/desktop/governance/members.md` — `Retrieve Conversation Roster` |
| Protect the final active owner and expose transfer-or-archive guidance | `docs/mockup/desktop/governance/members.md` — `Retrieve Conversation Roster`; the warning is retrieved state, while leaving is navigation/workspace behavior and has no invocation control on this page |
| Loading, empty-active, empty-former, denied, failed/retry, suspended, and expired-suspension roster states | `docs/mockup/desktop/governance/members.md` — `Retrieve Conversation Roster` |
| Promote an eligible active participant to owner | `docs/mockup/desktop/governance/members.md` — `Promote Participant to Owner` |
| Promote an eligible active member to administrator | `docs/mockup/desktop/governance/members.md` — `Promote Participant to Administrator` |
| End active membership without hard deletion and retain authored content/history | `docs/mockup/desktop/governance/members.md` — `Remove Participant` |
| Remove an eligible non-last owner when performed by an owner; block administrators and protect the last owner | `docs/mockup/desktop/governance/members.md` — `Remove Participant` |
| Ban an active or former identity, retain history, and prevent rejoin | `docs/mockup/desktop/governance/members.md` — `Ban Identity` |
| Ban an eligible non-last owner when performed by an owner; block administrators and protect the last owner | `docs/mockup/desktop/governance/members.md` — `Ban Identity` |
| Unban a participant and restore an appropriate active role | `docs/mockup/desktop/governance/members.md` — `Restore Banned Participant`; the mockup’s eligibility-only outcome is recorded as inconsistent |
| Create a future-ended posting suspension while membership and reading remain active | `docs/mockup/desktop/governance/members.md` — `Create Posting Suspension` |
| Edit the end of an existing posting suspension | `docs/mockup/desktop/governance/members.md` — `Update Posting Suspension` |
| End a posting suspension immediately and restore posting access | `docs/mockup/desktop/governance/members.md` — `End Posting Suspension` |
| Filter an already loaded roster between active and former participants | No separate backend action: `Retrieve Conversation Roster` loads the authorized collection, and the HTML filters it in memory |
| Open confirmations, menus, governance subnavigation, moderation navigation, and Retry navigation | No separate backend action: these are presentation or navigation triggers; their destination/continuation states are covered by the relevant load or mutation action |
| Load tags, fixed listed/unlisted setting, fixed matching mode, lifecycle state, viewer role, and allowed governance actions | `docs/mockup/desktop/governance/settings.md` — `Retrieve Conversation Governance Settings` |
| Owner, administrator, ordinary-member denied, listed-inclusive, listed-exclusive, unlisted/all-tags, archived, and unavailable settings entry states | `docs/mockup/desktop/governance/settings.md` — `Retrieve Conversation Governance Settings` |
| Add/remove tags on an existing conversation with one-to-ten and grammar constraints | `docs/mockup/desktop/governance/settings.md` — `Update Conversation Tags` |
| Save pending, success, retryable failure with retained draft, and stale-permission outcomes | `docs/mockup/desktop/governance/settings.md` — `Update Conversation Tags` |
| Create a conversation and its initial tags | No action on this work unit: the settings page operates on an already identified existing conversation; creation belongs to `docs/mockup/desktop/hub/create.html` |
| Edit listed/unlisted or matching mode after creation | No action: both requirements and `docs/concepts/APP_PAGES.md` leave post-creation editing unspecified and require these values to remain read-only here |
| Discard a local unsaved tag draft or keep editing | No backend action: the committed tags remain unchanged and the HTML only discards or retains in-memory draft state |
| Archive an active conversation as an owner while retaining records | `docs/mockup/desktop/governance/settings.md` — `Archive Conversation` |
| Block archive for administrators, stale owner permission, unsaved tag changes, or retryable failure | `docs/mockup/desktop/governance/settings.md` — `Archive Conversation` |
| Render archived state with tag editing and further archive actions disabled | `docs/mockup/desktop/governance/settings.md` — `Retrieve Conversation Governance Settings` and `Archive Conversation` |
| Hard delete or automatically archive a conversation | No action: both behaviors are explicitly excluded by the requirements |

## Final Action Inventory

### `docs/mockup/desktop/governance/members.md`

- Retrieve Conversation Roster
- Promote Participant to Owner
- Promote Participant to Administrator
- Remove Participant
- Ban Identity
- Restore Banned Participant
- Create Posting Suspension
- Update Posting Suspension
- End Posting Suspension

### `docs/mockup/desktop/governance/settings.md`

- Retrieve Conversation Governance Settings
- Update Conversation Tags
- Archive Conversation

## Scope Confirmation

- Only `docs/mockup/desktop/governance/members.md` and this handoff were changed in Phase 2.
- `docs/mockup/desktop/governance/settings.md` was reviewed and did not require correction.
- No HTML, CSS, JavaScript, concept, schema, mock-data, route, downstream handoff, application source, package, OpenAPI, backend, or frontend-business-rule file was changed.
