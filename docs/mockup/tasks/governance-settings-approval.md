# Architect Approval: Tags and Lifecycle

- **Assigned page:** `docs/mockup/desktop/governance/settings.html`
- **Page slug:** `governance-settings`
- **Product Owner review:** `docs/mockup/tasks/governance-settings-review.md`
- **Review role:** Architect

## Sources Reviewed

- `docs/concepts/REQUIREMENTS.md`
- `docs/concepts/APP_PAGES.md`
- `docs/concepts/USER_TYPES.md`
- `docs/schemas/DICTIONARY.md`
- `docs/schemas/bot-credential.yaml`
- `docs/schemas/conversation-tag.yaml`
- `docs/schemas/conversation.yaml`
- `docs/schemas/emoji-reaction.yaml`
- `docs/schemas/identity.yaml`
- `docs/schemas/membership-event.yaml`
- `docs/schemas/membership-role-period.yaml`
- `docs/schemas/membership.yaml`
- `docs/schemas/message.yaml`
- `docs/schemas/moderation-action.yaml`
- `docs/schemas/moderation-ticket.yaml`
- `docs/schemas/note.yaml`
- `docs/schemas/posting-suspension.yaml`
- `docs/schemas/tag.yaml`
- `docs/mockup/desktop/governance/settings.html`
- `docs/mockup/tasks/governance-settings-review.md`

## Review Evidence Confirmation

The validated Product Owner review identifies the required Playwright route, viewport, successful Chromium render, and concrete rendered observations. The architectural decisions below therefore rely on both rendered-page evidence and code inspection rather than code inspection alone.

## Recommendation Decisions

### PO-001: Maintain a valid tag draft

- ***Decision:*** Approved with nuance
- **Approved behavior or rationale:** While an active owner or administrator edits tags, Enter or comma may add a valid simple tag or one-colon `key:value` tag, and each chip's remove control may remove a draft tag. The page must show immediate count and validation feedback, keep the committed set unchanged until save, compare duplicates case-insensitively, and enforce one through ten tags. The mockup may demonstrate the grammar supported by `tag.yaml`, but it must not present display casing or any broader colon grammar as a resolved product rule.
- **State/data effect:** Add and remove actions affect only a separate in-page draft. The local committed fixture changes only after an approved save. The fixture may represent each tag with the normalized value supported by `Tag.normalizedValue` and maintain ordered active assignments consistent with `Conversation Tag.position`; it must not imply tag ownership or hard deletion of retained assignments.
- **QA acceptance check:** From the four-tag active fixture, add one valid simple tag and one valid `key:value` tag and confirm two chips and the count appear. Confirm a case-variant duplicate and malformed tag leave the draft count unchanged with specific feedback, an eleventh tag is blocked, and removing the only remaining tag is blocked without removing it.
- **Constraints:** Keep the behavior page-local and fixture-backed. Do not expose raw tag or association IDs, settle unresolved display casing, permit Unicode or whitespace, allow more than one colon, bypass the one-to-ten invariant, or call a tag API.

### PO-002: Save or discard tag changes deliberately

- ***Decision:*** Approved with nuance
- **Approved behavior or rationale:** Save is available only for a changed, valid draft. Activating it must visibly enter one pending state, prevent duplicate submission and further edits, then either commit once and return to the conversation or show a locally simulated failure while preserving the draft for retry. Clean Cancel returns immediately; dirty Cancel must offer keep-editing and discard choices. A single deterministic failure/timeout scenario is sufficient for the mockup and must not grow into a general persistence console.
- **State/data effect:** Local success replaces the committed fixture's active tag set and clears dirty state; failure, timeout, keep-editing, and canceled discard do not mutate the committed set. Discard resets the draft to the committed set before leaving. Repeated activation while pending has no additional state effect.
- **QA acceptance check:** Confirm Save is disabled initially, enables after a valid edit, and locks editing and repeat submission while pending. Confirm success returns to the conversation and reopening the settings fixture shows the committed tags. Confirm the local failure scenario retains the draft and permits one successful retry, dirty Cancel offers keep/discard, and clean Cancel leaves without a prompt.
- **Constraints:** Persistence outcomes must be deterministic local simulation only. Do not call a live API, claim production durability, add background synchronization, introduce conflict-resolution machinery, or expand the page beyond the approved save/cancel workflow.

### PO-003: Keep conversation identity and access context synchronized

- ***Decision:*** Approved with nuance
- **Approved behavior or rationale:** The editor, breadcrumb identity, archive confirmation, and read-only access summary must derive from one local committed conversation fixture. Draft tag edits remain confined to the editor; after successful commit or a later fixture-backed reopen, every committed reference must agree. Listed conversations may show inclusive or exclusive matching, and unlisted conversations must show all-tag matching without an editor for discovery or matching mode. Invalid fixture data may produce one compact unavailable state with a local reset/reload path rather than fabricated defaults.
- **State/data effect:** A successful save changes the committed fixture tag set once, while visibility, matching mode, purpose, and lifecycle remain unchanged. Invalid or contradictory fixture data must leave tag and lifecycle state unmodified and disable save and archive actions.
- **QA acceptance check:** Load a listed-exclusive fixture and confirm the editor, breadcrumb, and archive dialog use the same committed tags. Add a draft tag and verify only the editor changes; commit and reopen, then verify every reference uses the updated set while access remains read-only. Load an unlisted fixture and confirm it reports all-tag matching, then load an invalid fixture and confirm no fabricated editable conversation or enabled destructive action appears.
- **Constraints:** Respect `Conversation.visibility`, `Conversation.matchingMode`, lifecycle rules, and the one-to-ten active `Conversation Tag` invariant. Do not make post-creation access or matching editable, invent a title requirement, expose raw IDs, or imply network-backed recovery.

### PO-004: Confirm archival safely and accessibly

- ***Decision:*** Approved with nuance
- **Approved behavior or rationale:** An active owner with a clean draft may open an archive confirmation that identifies the committed conversation, explains that active use ends while records remain, moves focus into the dialog, contains keyboard focus, and restores focus after cancellation. Confirmation must enter one pending state and either change the local lifecycle to archived once or show a deterministic local failure with retry/cancel. Dirty drafts, stale lifecycle, and stale permission must prevent an archive success and visibly explain the current state.
- **State/data effect:** Dismissal and simulated failure leave `Conversation.status` active. Success changes only the local conversation lifecycle from active to archived and represents the required archive metadata; all messages, memberships, conversation tags, moderation tickets, and related retained records remain untouched. A stale or permission-denied attempt performs no mutation.
- **QA acceptance check:** With a clean active-owner fixture, open the dialog and verify committed identity, initial focus, focus containment, and the retention warning. Dismiss by close, Keep active, Escape, and backdrop and verify active state plus focus restoration. Confirm once and verify pending protection and one announced archived state; then exercise dirty-draft, failure/timeout, stale-archived, and stale-permission scenarios and verify none announces success without a lifecycle change.
- **Constraints:** Archival is owner-only and local-only. Do not hard-delete any record, contact a backend, invent retention controls, add automatic archival or unarchive, resolve archived-conversation search/view behavior, or permit repeated archival.

### PO-005: Render an archived conversation as inactive

- ***Decision:*** Approved with nuance
- **Approved behavior or rationale:** After local archival, or when loaded from a deterministic archived fixture, the page must identify the archived state and retained records while keeping committed tags and access context visible for reference. Tag input, chip removal, Save, and archive controls must be unavailable. The fixture-backed demonstration may preserve archived state across a reopen or reload, but it must make no claim about production persistence or the unresolved visibility of archived conversations elsewhere.
- **State/data effect:** The local `Conversation` remains archived with archive metadata, and its retained tag assignments and related records remain unchanged. No editable draft is created, stale active-page edits are abandoned with a visible archived-state message, and no second archive transition is allowed.
- **QA acceptance check:** Confirm archival and verify an announced archived state, visible retained tag/access summary, and unavailable edit/archive controls. Reopen or reload the archived fixture and verify the same inactive rendering. Verify the page offers no hard delete, unarchive, inactivity automation, or assertion about search and participant views.
- **Constraints:** This approval is limited to the governance page's inactive rendering. Do not define application-wide archived access behavior, add recovery/lifecycle features, remove retained records, or create a new archived-conversation page.

### PO-006: Enforce owner and administrator boundaries

- ***Decision:*** Approved with nuance
- **Approved behavior or rationale:** An active owner or administrator may use the tag draft, validation, save, and cancel workflow. Only an active owner may open and confirm archive; an administrator must receive a clear owner-only unavailable state without an actionable archive route. An ordinary member, banned role-none identity, inactive membership, or locally simulated stale role must not receive or complete governance actions. The mockup needs only deterministic role fixtures and a local permission-denied transition, not a real authentication or policy engine.
- **State/data effect:** Viewer membership status and role control action availability only. They do not change membership, role periods, committed tags, or lifecycle state. A denied or stale-role action leaves the committed fixture unchanged and removes any unauthorized pending result.
- **QA acceptance check:** Render active-owner and active-administrator fixtures and confirm both can maintain tags while only the owner can open and confirm archive. Render ordinary-member, role-none, and inactive-membership fixtures and confirm governance mutations are unavailable. Change the local role during save and archive pending states and verify no unauthorized commit or success message occurs.
- **Constraints:** Authorization must align with active `Membership.currentStatus` plus owner/administrator `currentRole`; role `none` is not an active governance role. Do not implement real authentication, mutate membership records from this page, expose owner-management controls, or give administrators archival authority.

## Data and Schema Feasibility

The approved page behavior is supported by the existing models. `Tag` provides a canonical lowercase value with one optional `key:value` separator; `Conversation Tag` provides retained assignment records and positions, with the one-to-ten active-tag rule enforced as an application invariant; and `Conversation` supplies listed/unlisted matching and active/archived lifecycle fields. `Membership` and `Membership Role Period` support the owner/administrator distinction and require active status for authorization. The archive transition is feasible through `Conversation.status`, `archivedAt`, and `archivedById`, while the dictionary explicitly requires retained messages, memberships, tags, tickets, and history.

The remaining schemas do not require additional UI on this page. They confirm that identities, messages, reactions, moderation records, notes, suspensions, and bot credentials remain separate retained records. No approved recommendation needs to expose or edit those records.

## Mock Data and Local Fixture Feasibility

A minimal deterministic fixture can contain one standard conversation with committed ordered tags, visibility, matching mode, lifecycle status, and a viewer membership status/role. Separate in-page state can hold the draft tags, dirty/valid flags, pending operation, modal state, and announced outcome. Small variants are sufficient for owner, administrator, unauthorized, archived, invalid-data, failure, timeout, and stale-state checks. No `assets/mockup-data/**` evidence is present, which is not a blocker; the approved behavior can use page-local or existing shared local fixture state without creating a production data contract.

## External Service and Real API Avoidance

No real API, backend, authentication, authorization service, or third-party integration is needed or approved. Save, archive, failure, timeout, retry, reload, and permission-denied experiences must be visibly simulated from deterministic local fixtures. The mockup must not send network requests or imply that local outcomes have changed production data.

## YAGNI/YACNI Risks to Avoid

- Do not add editable visibility or matching settings, a general settings console, bulk tag management, tag ownership, raw IDs, audit timelines, or retention controls.
- Do not introduce a production persistence layer, synchronization/conflict engine, policy engine, service monitoring, or generalized scenario framework.
- Do not resolve open decisions about tag display casing, broader colon grammar, archived discovery or participant access, conversation titles, automatic archival, or unarchive.
- Do not add new pages or major sections for fixture selection, archival history, or permission administration.

## Mockup Change Statement

No mockup HTML, CSS, JavaScript, concept, schema, application, or Product Owner review files were changed. This approval created only `docs/mockup/tasks/governance-settings-approval.md`.
