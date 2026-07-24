# Architect Approval: Your Conversations

- **Assigned page:** `docs/mockup/desktop/hub/index.html`
- **Page slug:** `hub-index`
- **Product Owner review:** `docs/mockup/tasks/hub-index-review.md`
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
- `docs/mockup/desktop/hub/index.html`
- `docs/mockup/tasks/hub-index-review.md`

## Playwright evidence confirmation

The validated Product Owner review records successful rendered inspection at a 1440 by 900 desktop viewport using the `system-node-package` route, Node executable `/Users/flackey/.nvm/versions/node/v24.15.0/bin/node`, Playwright package `/Applications/ChatGPT.app/Contents/Resources/cua_node/lib/node_modules/playwright`, Chromium, and launch options `{"channel":"chrome","headless":true}`. Its rendered observations cover layout, keyboard traversal, click targets, undifferentiated Resume destinations, absent state handling, and live Google Fonts requests. Architecture decisions below therefore use both rendered evidence and source inspection rather than code inspection alone.

## Decisions

### PO-001: Resume the selected conversation

- ***Decision:*** Approved
- **Approved behavior or rationale:** Activating a specific Resume link must open the local conversation workspace for that card's tag combination, role, and recent context, and its accessible name must identify the selected conversation. Navigation is immediate and needs no confirmation. If the selected active membership has become removed or banned in the local fixture, the hub must remain open, explain that access is no longer available, focus that explanation, remove the item from Joined, and update the count. If the local selection cannot be resolved, the hub must preserve the list and offer a local retry rather than opening an unrelated thread.
- **State/data effect:** Pass or retain a stable local conversation key only; successful resume does not mutate conversation or membership records. A locally simulated stale membership changes the visible Joined projection to match its non-active status but does not hard-delete retained membership data.
- **QA acceptance check:** Activate every Resume link by pointer and keyboard and verify the opened workspace matches that card's tags and role; verify each link has a distinguishable assistive name. Mark one fixture membership removed or banned, activate it, and verify no workspace opens, focused inline feedback appears, the card is removed, and the count decreases. Make one conversation key unresolvable and verify Retry is offered while the existing list remains intact.
- **Constraints:** Use only local fixture and in-page state. Joined items require an active Membership with an owner, administrator, or member role and an active Conversation; do not expose raw IDs, add a confirmation, call a backend, or invent conversation titles or descriptions.

### PO-002: Load a truthful joined-conversation list

- ***Decision:*** Approved with nuance
- **Approved behavior or rationale:** On initial load, return, or Retry, the hub must visibly transition from a restrained local loading state to either a newest-first active Joined list, an empty state with Find and Create routes, or a page-local failure state with Retry. The count must always match the rendered cards. Each card uses one to ten visible tags, current role, an optional recent cue, and a clear private treatment for a moderation discussion. A missing recent message uses a neutral no-recent-activity cue. A single controllable delayed and failed local-load behavior is enough; timeout does not need a separate product state if it produces the same failure and Retry experience.
- **State/data effect:** Populate only a local read projection over active conversations and active memberships for the identified identity, with tags, current role, optional recent-message author/excerpt, and recent activity time. Loading, empty, failure, and retry-success are transient mock states and do not create, join, leave, archive, or change roles.
- **QA acceptance check:** Exercise populated, empty, delayed, failed, and retry-success fixtures. Verify loading is replaced by the resolved state, cards are newest first, the count equals visible cards, empty offers Find and Create, failure offers Retry, and retry success replaces the error. Verify left, removed, banned, and archived records do not appear and a missing recent message shows the neutral cue.
- **Constraints:** Archived-conversation presentation remains unresolved and must not become a separate collection; this page's contract is limited to active Joined items. Tags identify conversations without titles or descriptions. Do not add sorting, filtering, pagination, metrics, former memberships, or a generalized data-loading framework.

### PO-003: Keep find and create routes clear and independent

- ***Decision:*** Approved with nuance
- **Approved behavior or rationale:** Activating either the large Find or Create action, or its matching private-navigation link, must open the correct packaged local page with pointer and keyboard. Navigation alone leaves the hub's joined fixture unchanged, and returning to the hub restores or reloads the same truthful projection. A special user-facing simulation for an unavailable packaged destination is not required because these are fixed local mockup pages; missing or broken destinations should fail QA rather than become a new product state.
- **State/data effect:** These actions change only the current local page. Find does not create membership, and Create does not create a conversation until its separate flow completes. The Joined fixture and count remain unchanged by route activation alone.
- **QA acceptance check:** Activate both quick actions and both matching header links with pointer and keyboard. Verify each opens its documented local page, no conversation or membership data changes on navigation alone, and returning to the hub presents the same list and count. Verify every packaged destination resolves locally; any blank, remote, or missing target fails acceptance.
- **Constraints:** Keep Find and Create distinct, keyboard-visible, and available in the empty state. Do not add authentication fallback, remote routing, an unavailable-destination product workflow, or discovery/creation controls to this page.

### PO-004: Preserve hub navigation and identified context

- ***Decision:*** Approved with nuance
- **Approved behavior or rationale:** Conversations must remain the visibly current private section; Find and Create must perform the same local jobs as their quick actions; and the Tawk brand must return to the public product home. Rowan Ellis remains a non-interactive identified-session indicator and must not imply an unsupported profile menu. If the local identified-session fixture is absent, the private page must not reveal Joined data and may show only a concise unavailable-session state with a route to public home. Returning to public home is navigation only and must not be presented as sign-out or as changing authentication state.
- **State/data effect:** Ordinary navigation does not change identity, membership, role, or conversation data. The optional missing-session fixture suppresses private joined content locally; it does not create an anonymous identity or model a real authentication transition.
- **QA acceptance check:** Verify Conversations has current-page indication and all navigation targets have visible keyboard focus and open their documented local pages. Verify the identity indicator has no false menu affordance. Remove the local identified-session fixture and verify no joined cards render, only the unavailable-session recovery to public home is offered, and no sign-in, sign-out, or provider flow is implied.
- **Constraints:** Human authentication remains unresolved, and the mockup assumes an already identified person. Do not add credentials, provider selection, profile editing, sign-out behavior, bot-token controls, anonymous participation, or a claim that visiting public home ends the session.

### PO-005: Render without third-party network access

- ***Decision:*** Approved
- **Approved behavior or rationale:** Loading the packaged hub while external requests are blocked must still render all content, local state variants, and interactive routes promptly and coherently. Typography and optional visual resources must use local or system fallbacks so the observed Google Fonts dependency is removed and no third-party request is attempted.
- **State/data effect:** Network availability has no effect on the identified-session fixture, Joined projection, selected conversation, or local loading/error simulations.
- **QA acceptance check:** Block every `http` and `https` request in Playwright, reload the page, and verify no third-party request is attempted, no console error occurs, all expected content remains visible, and every control remains keyboard reachable and functional against local fixtures.
- **Constraints:** Do not contact real APIs, backends, authentication providers, analytics services, font hosts, or other third parties. Retry belongs only to deliberate local fixture failure, not to a hidden live dependency.

## Data and schema feasibility

The approved hub projection is feasible without extending the durable model. `Identity` provides the identified person's display name; `Membership` supplies active status and current owner, administrator, or member role; `Conversation` supplies active status and distinguishes standard from moderation-discussion conversations; `Conversation Tag` and `Tag` provide an ordered one-to-ten visible tag combination; and `Message` plus its author `Identity` can provide the optional recent cue. Retained membership states support stale removed and banned scenarios without hard deletion. The approval does not require title, description, unread, notification, archive-view, or dashboard-metric fields.

## Mock data and local fixture feasibility

A minimal local fixture can contain one identified-person session and three active joined projections matching the current examples, each with a stable local conversation key, tags, role, conversation purpose, optional recent cue, and sortable recent-activity time. Controlled fixture variants may cover loading, empty, failure/retry, missing recent activity, removed or banned membership, missing session, and unresolvable selection. These are presentation fixtures only; no production-shaped API response, former-member collection, or broad activity data is justified.

## External service and real API avoidance

All session, list, resume, stale-access, loading, and retry behavior must be local or deliberately simulated. The shared remote font request observed during rendered inspection must be eliminated in favor of local or system resources. No OAuth, SSO, payment, map, notification, upload, AI, live authentication, backend, analytics, or other third-party behavior is needed for this page.

## YAGNI/YACNI constraints

Do not add conversation titles or descriptions, archived or former-membership collections, search/sort/filter controls, refresh controls, pagination, unread or notification systems, pinning, favorites, folders, activity feeds, metrics, moderation actions, profile/session management, confirmations, or generic API abstractions. The page remains a focused active Joined list with Resume, Find, Create, established navigation, and only the local states necessary to demonstrate those jobs.

## Change statement

No mockup files were changed. This approval created only `docs/mockup/tasks/hub-index-approval.md`.
