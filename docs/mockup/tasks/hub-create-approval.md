# Architect Approval: Create a Conversation

- **Assigned page:** `docs/mockup/desktop/hub/create.html`
- **Page slug:** `hub-create`
- **Product Owner review:** `docs/mockup/tasks/hub-create-review.md`
- **Approval role:** Architect

## Sources reviewed

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
- `docs/mockup/desktop/hub/create.html`
- `docs/mockup/tasks/hub-create-review.md`

## Rendered-inspection evidence confirmed

The validated Product Owner review records a Playwright-rendered desktop inspection at 1440 by 900 and identifies the exact reusable route: Node `/Users/flackey/.nvm/versions/node/v24.15.0/bin/node`, Playwright package directory `/Applications/ChatGPT.app/Contents/Resources/cua_node/lib/node_modules/playwright`, Chromium with Chrome channel, and headless launch. Its rendered observations cover tag entry and correction, the ten-tag boundary, access-control linkage, submission behavior, navigation, layout, and the observed Google Fonts network requests. This approval relies on that rendered evidence together with the allowed code and product documents; no code-only substitution was used.

## Recommendation decisions

### PO-001: Build and validate the tag set

- ***Decision:*** Approved with nuance
- **Approved behavior or rationale:** Approve committing a typed tag through Enter, comma, blur, or submission; immediately showing a removable chip and updated count for a valid value; and leaving rejected input editable with specific adjacent feedback. Comparison must be case-insensitive, and the visible behavior must enforce one to ten tags. The current documented/schema-supported shape permits Latin letters and numbers, hyphens only between nonempty segments, and at most one colon separating nonempty key and value components. The mockup may normalize comparison values to lowercase but must not imply that the unresolved long-term display-casing policy has been settled. Removing a chip after a maximum-limit error restores capacity and returns attention to the still-uncommitted value without adding it automatically.
- **State/data effect:** Additions and removals affect only the local ordered draft tag set. Each accepted value corresponds to a reusable normalized Tag and an ordered Conversation Tag association in a successful fixture; duplicate, invalid, empty, and over-limit attempts leave the committed set unchanged. No remote tag catalog or autocomplete state is approved.
- **QA acceptance check:** Starting with the page fixture, add a valid simple tag and key/value tag and verify chips and count update; try whitespace, malformed separators, and a differently cased duplicate and verify the committed set does not change and specific feedback remains visible. At ten tags, an eleventh must remain uncommitted; after removing one tag, explicitly recommitting that value must return the count to ten. Removing all tags and submitting must retain the page, show the minimum error, and focus the tag input.
- **Constraints:** Preserve the sparse page purpose and the schema pattern in `tag.yaml`; do not invent tag ownership, suggestions, Unicode support, additional grammar, or a final display-casing rule. Active Conversation Tag positions must stay unique and within one through ten.

### PO-002: Keep access and matching choices logically linked

- ***Decision:*** Approved
- **Approved behavior or rationale:** Selecting Listed or Unlisted must always produce one coherent access state. Listed reveals the optional require-every-tag choice and supports inclusive matching when unchecked or exclusive matching when checked. Unlisted hides that choice, clears any checked value, and communicates that all tags are required. Returning to Listed reveals the option unchecked so hidden state cannot alter the result.
- **State/data effect:** The local draft maps Listed plus unchecked to `visibility: listed` and `matchingMode: inclusive`, Listed plus checked to `visibility: listed` and `matchingMode: exclusive`, and Unlisted to `visibility: unlisted` and `matchingMode: allTags`. No other combination is valid or retained.
- **QA acceptance check:** Check the listed-only option, switch to Unlisted, and verify the option disappears and its value clears; switch back to Listed and verify it returns unchecked. Capture each supported variant in separate creation attempts and verify the local result contains only the schema-valid visibility and matching-mode pairing.
- **Constraints:** Do not add an unlisted-exclusive control, invitation or approval flow, permissions workflow, or post-creation visibility editor. The user is already identified for this page, and the creation flow does not resolve the open human-authentication mechanism.

### PO-003: Create from a stable draft with recoverable local outcomes

- ***Decision:*** Approved with nuance
- **Approved behavior or rationale:** Approve visibly committing any valid waiting tag, validating the complete draft, capturing one stable submission snapshot, and disabling editable controls plus competing navigation while one short creation attempt is pending. The local success path must show progress and completion, then open the existing conversation workspace as the current identity's first-owner experience while carrying forward the submitted tags and valid access/matching choice. Deterministic local failure and timeout outcomes must preserve the draft, restore the controls, show a form-level recovery state, and permit one retry. Keep the handoff focused on demonstrating the newly created conversation; it need not expand the workspace into a new page design or durable application-wide data layer.
- **State/data effect:** A successful local outcome represents one active standard Conversation, one to ten ordered active Conversation Tag associations to normalized Tags, one active Membership with `currentRole: owner`, and one open owner Membership Role Period for Rowan Ellis. These records must be treated as one indivisible local result, matching the dictionary's creation invariant. Failure or timeout creates none of them; repeated activation while pending is ignored; a successful retry yields exactly one result from the captured snapshot.
- **QA acceptance check:** Submit a valid listed draft and verify all editable controls and conflicting navigation are unavailable during the announced pending state, then verify the workspace opens as Rowan Ellis's owner view with the submitted tags and listed matching mode represented. Exercise deterministic failure and timeout outcomes and verify there is no navigation or created result, the entire draft remains available, controls recover, and retry is offered. Retry successfully and verify exactly one result. Repeat with Unlisted and verify the result uses `allTags` with no retained listed-exclusive flag.
- **Constraints:** Creation must be entirely fixture-backed or in-page state and must not call authentication, application, database, analytics, or third-party services. Use only the minimum identity, conversation, tag-association, membership, and owner-role-period evidence needed for this page. Do not add titles, descriptions, invitations, advanced settings, cancellation during the short accepted pending state, or implementation architecture.

### PO-004: Cancel without producing hidden state

- ***Decision:*** Approved
- **Approved behavior or rationale:** Before submission, Cancel may return directly to `hub/index.html` and discard the short, non-persisted draft without a confirmation dialog. Once creation is pending, Cancel and other competing navigation must not start a second transition.
- **State/data effect:** Cancel discards only the page-local draft and creates no Conversation, Conversation Tag, Membership, Membership Role Period, or related fixture. Reopening the page starts from its defined static example rather than restoring canceled edits.
- **QA acceptance check:** Modify tags and access, activate Cancel by pointer and keyboard in separate runs, and verify the conversation list opens without a new conversation. Reopen Create and verify the canceled changes are absent. During a pending creation attempt, verify Cancel cannot cause competing navigation.
- **Constraints:** Do not add autosave, cross-device recovery, a discard-confirmation modal, or new draft storage. Direct cancellation applies only before the creation attempt is accepted.

### PO-005: Keep the mockup fully local and network-independent

- ***Decision:*** Approved
- **Approved behavior or rationale:** The page must render and complete all approved creation, validation, cancellation, failure, timeout, retry, and success behavior with local assets and local state when internet access is unavailable. The observed Google Fonts requests are not appropriate for this execution contract and must not be required for appearance or behavior.
- **State/data effect:** Identity, draft values, validation results, simulated service outcomes, and the created-conversation result stay entirely local. Blocking network access must not change the page's functional state or disclose any user or conversation data.
- **QA acceptance check:** Block all HTTP and HTTPS traffic, reload the page, and exercise every approved interaction and outcome. The page must remain usable, all local transitions must complete, and Playwright must record no remote font, API, authentication, analytics, or other third-party requests.
- **Constraints:** No live service may be used to produce a loading, failure, timeout, permission, or success state. Network independence does not authorize new product controls, visible developer switches, service integrations, or a broad visual redesign.

## Data and schema feasibility

The approved creation result is directly supported by `conversation.yaml`, `tag.yaml`, `conversation-tag.yaml`, `identity.yaml`, `membership.yaml`, and `membership-role-period.yaml`. A standard active Conversation can represent listed/inclusive, listed/exclusive, or unlisted/all-tags behavior. Tag normalization and the one-colon grammar are represented by Tag, while Conversation Tag supplies one-to-ten ordered associations. Rowan Ellis can be represented by an active person Identity; creation establishes an active owner Membership and a current owner role period. The data dictionary requires conversation, initial tag associations, first-owner membership, and role period to succeed or fail together, which supports the approved stable-snapshot and no-partial-result behavior.

No creation-page behavior requires messaging, reaction, moderation, note, suspension, bot-credential, or membership-history fixture expansion. A minimal joined event could be consistent with the broader model, but it is not necessary to prove this page's visible contract and is not required here.

## Local fixture feasibility

A minimal fixture can use the existing identified Rowan Ellis example, a page-local draft, deterministic local outcome selection, and one compact success result containing the conversation configuration, ordered normalized tags, and first-owner relationship. The failure and timeout cases need only model user-visible outcome states and prove that no partial result survives. No separate mock-data asset exists, and its absence is not a blocker because the approved behavior can remain local to the mockup.

## External service and real API constraints

No real API, backend, database, identity provider, font host, analytics service, or third-party system is permitted in the approved page flow. The Product Owner observed only remote Google Fonts requests, not application API or authentication calls. Those font requests must be removed from the required runtime path. Authentication is represented solely by the existing identified-session fixture; bot-token creation and real human sign-in remain out of scope.

## YAGNI/YACNI boundaries

Do not add titles, descriptions, invitations, participant limits, role configuration beyond the creator's first-owner result, retention or billing settings, tag suggestions, private-tag discovery, autosaved drafts, background synchronization, audit displays, durable mock databases, visible test controls, new pages, or real service integrations. Keep the existing short single-column page and its established destinations. The approval does not settle open decisions about human authentication, long-term tag display casing, broader tag grammar, or conversation metadata.

## Mockup change statement

No mockup HTML, CSS, JavaScript, concept document, schema document, application source, or supporting asset was changed during this architecture review. The only created artifact is `docs/mockup/tasks/hub-create-approval.md`.
