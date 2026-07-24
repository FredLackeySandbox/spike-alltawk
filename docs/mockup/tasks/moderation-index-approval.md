# Architect Approval: Reported Messages

- **Assigned page:** `docs/mockup/desktop/moderation/index.html`
- **Page slug:** `moderation-index`
- **Product Owner review:** `docs/mockup/tasks/moderation-index-review.md`
- **Approval role:** Architect

## Review basis

The validated Product Owner review records a rendered Playwright inspection of the assigned page at a 1440 × 1000 desktop viewport. It identifies the exact `system-node-package` route, Node executable, Playwright package directory, Chromium browser type, launch options, local page URL, and rendered observations. The approval decisions below therefore use both rendered evidence and the current page structure rather than code inspection alone.

## Source documents and schemas reviewed

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
- `docs/mockup/desktop/moderation/index.html`
- `docs/mockup/tasks/moderation-index-review.md`

## Recommendation decisions

### PO-001: Enforce the moderator's governed-conversation scope

- ***Decision:*** Approved with nuance
- **Approved behavior or rationale:** Admit only the already identified local identity when it has an active owner or administrator membership for at least one affected conversation, then show only reports from those conversations. A mixed-role fixture must omit every ticket detail from conversations where the identity is only a member or has no active membership. A revoked-role or no-governed-conversation fixture may show a concise, non-disclosing denied or unavailable outcome with a safe route back to the private conversation area. Do not add a sign-in page, provider, or real authorization flow because human authentication is unresolved and this mockup assumes an identified session.
- **State/data effect:** Authorization is derived from local Identity and active Membership fixture records whose `currentRole` is `owner` or `administrator`; historical role periods may explain a stale-role scenario but do not grant current access. Filtering is read-only and must not mutate identities, memberships, conversations, messages, or tickets. Unauthorized report objects must not enter the rendered queue state.
- **QA acceptance check:** Open the page with local owner, administrator, mixed-role, ordinary-member-only, and revoked-role scenarios. Confirm that only currently governed conversations and their reports are present, that protected ticket numbers, reporters, reasons, and tags do not appear in the DOM, and that the no-access outcome exposes no protected conversation identity and provides a working local exit.
- **Constraints:** Keep authorization conversation-scoped and require `Membership.currentStatus: active`; neither a prior role period nor a bot/person identity type changes the role rule. Use only local fixture/session state, and do not invent a human identity provider, organization-wide moderation permission, global report view, or backend permission check.

### PO-002: Make queue loading, empty, failure, and retry states exercisable

- ***Decision:*** Approved
- **Approved behavior or rationale:** The authorized queue must expose deterministic local loading, populated, empty, recoverable-failure, and retry behavior. Loading replaces the case actions until data is ready; populated success shows the table and derived count; empty success shows a clear empty outcome without a misleading table shell; failure shows a concise error and Retry. Retry returns visibly to loading before resolving to the configured local success or empty result.
- **State/data effect:** Read-only local fixture data supplies ticket number, source-conversation tags, reporting identity, reason excerpt, and authorization relationships. Loading and failure flags are transient page state. Retrying clears only the transient error and must not create, change, resolve, or remove a Moderation Ticket.
- **QA acceptance check:** Exercise populated, empty, delayed, failure, repeated-failure, and failure-then-success scenarios. Verify the visible sequence, the absence or disabled state of ticket-opening actions during loading, accurate final counts, persistent Retry after a second failure, no stale or partial rows, and no application, backend, authentication, or third-party request.
- **Constraints:** Keep scenario selection deterministic and local. Do not add refresh dashboards, synchronization concepts, ticket status, assignment, or operational telemetry; malformed fixture input may map to the same load-failure presentation rather than introducing a separate product state.

### PO-003: Filter the queue with a genuine zero-result state

- ***Decision:*** Approved
- **Approved behavior or rationale:** After the authorized queue loads, the existing selector must contain only governed conversations plus All. Selecting a conversation immediately filters rows, updates the live zero/singular/plural count, preserves the active selection for the current page visit, and shows a conversation-specific empty outcome when that authorized conversation has no reports. Selecting All restores all authorized reports. A single governed conversation with no reports is the minimum additional fixture needed to exercise the existing zero-result path.
- **State/data effect:** Only the local selected-conversation value and its derived visible ticket collection change. Ticket, message, membership, and conversation records remain unchanged. If a selected conversation is removed from the current authorized fixture set, the selection safely returns to All and the displayed results and announcement are recalculated.
- **QA acceptance check:** Using pointer and keyboard, choose each populated conversation, the authorized zero-report conversation, and All. Verify the exact rows, `0 reports`, `1 report`, and plural counts; confirm the empty outcome is distinct from a load failure; then simulate a stale selection and rapid selection changes and confirm the last valid selection, rows, and count agree.
- **Constraints:** Tag labels must come from the approved local conversation/tag fixtures, and the filter must never reveal a conversation outside the signed-in identity's active owner/administrator scope. Do not add saved filters, search, sorting, pagination, ticket statuses, or server persistence.

### PO-004: Open the exact selected moderation report

- ***Decision:*** Approved with nuance
- **Approved behavior or rationale:** Both the ticket-number link and Review action in a visible row must carry the same distinct local ticket reference to the existing ticket-detail route. Each row must target its own ticket, with no generic or arbitrary default. The queue-side contract is approved here; rendering the selected ticket's evidence and handling unavailable detail state belong to the separately governed `moderation/ticket.html` page and must not cause this queue review to redesign that page.
- **State/data effect:** Navigation records or conveys only the selected local Moderation Ticket reference; it does not alter the ticket, its provisional status, message, conversation, reporting identity, or queue membership. Before offering a row action, the ticket must still belong to a conversation in the current moderator's authorized local scope.
- **QA acceptance check:** Activate every fixture ticket once through its ticket number and once through Review. Confirm both controls for a row produce the same row-specific destination/reference, different rows produce different references, no activation changes the queue's local ticket data, and a stale or unauthorized row is not offered as an actionable report. In coordinated ticket-page QA, confirm a missing reference does not fall back to another ticket.
- **Constraints:** Use a human-readable `ticketNumber` for presentation while keeping any internal record identifier out of the UI. Do not invent ticket statuses, assignments, resolution transitions, or backend lookup behavior. Any matching destination behavior must be coordinated with the validated review for `moderation/ticket.html` rather than implemented as an unreviewed expansion of this page.

### PO-005: Keep entry, breadcrumb, filter, and return context coherent

- ***Decision:*** Approved with nuance
- **Approved behavior or rationale:** A valid conversation-origin entry may preselect that governed conversation and provide breadcrumb and return context for it. Entry from shared Reports navigation starts at All and uses a broader private-area return rather than naming an arbitrary conversation. Changing the filter may update the page's current related-conversation context and return destination so the breadcrumb, selection, and footer do not contradict one another; a stale or unauthorized origin falls back to the safe All context without disclosing the former conversation. Native browser Back remains unchanged.
- **State/data effect:** Local origin and selected-conversation state affect only queue presentation and local navigation destinations. They do not change membership, ticket, conversation, moderation, or message data. Only valid governed conversation references may become visible context.
- **QA acceptance check:** Enter from each governed conversation fixture and from shared Reports navigation. Verify the initial selector, breadcrumb, and return destination; change to every valid filter including the zero-report conversation and confirm all visible context points to the same scope. Exercise a stale or unauthorized origin and verify the All fallback exposes no protected tags, then use Back and confirm no moderation state changed.
- **Constraints:** Keep navigation within the existing hub, conversation, governance, and moderation page plan. Do not add pages, persistent history, a new routing model, or speculative conversation titles; use the approved visible tag combination for conversation context.

### PO-006: Keep page rendering fully local

- ***Decision:*** Approved
- **Approved behavior or rationale:** The assigned page must render readable typography, queue content, and all approved interactions using local or system-provided resources only. The observed Google Fonts requests must be removed from the rendered path. Blocking external network access must not delay, hide, or disable any queue content or control.
- **State/data effect:** The page reads only local assets, local fixtures, and in-page state and performs no remote read or write. A missing optional local visual asset falls back to a readable local/system presentation without changing moderation data.
- **QA acceptance check:** Reload the page with network access blocked, exercise loading, filtering, retry, and ticket navigation, and inspect browser requests. Confirm the page stays readable and functional and makes no `http://` or `https://` request, including to `fonts.googleapis.com` or `fonts.gstatic.com`.
- **Constraints:** No real application API, backend, authentication provider, analytics endpoint, font host, or third-party service may be contacted. Keep any shared-asset adjustment limited to eliminating the external dependency while preserving other approved mockup pages.

## Data and schema feasibility

The approved queue is feasible with the existing schemas. `Moderation Ticket` provides the unique human-readable `ticketNumber`, `conversationId`, `messageId`, `reportingIdentityId`, and required `reason`; the queue does not need to expose its provisional status or assignment fields. `Membership` supplies current conversation authorization and requires both `currentStatus: active` and `currentRole: owner` or `administrator` for queue access. `Identity` supports person and bot reporters with a required display name. `Conversation Tag` and `Tag` provide ordered visible tag context, while `Message.conversationId` and the documented ticket/message invariant keep the ticket tied to its source conversation. Historical Membership Role Period and Membership Event records may support a deterministic stale-role fixture but do not override current Membership authorization.

No approved interaction writes a durable schema object. The queue selects and filters reports; moderation actions, notes, suspensions, resolution behavior, and any linked moderation discussion remain ticket-detail concerns. The schema's provisional ticket status and assignment fields do not justify showing a workflow, status filter, or assignment system on this page.

## Mock data and local fixture feasibility

The existing three tickets are sufficient for populated and cross-conversation selection. Add only the minimum local fixture relationships needed to pair them with conversations, active tags, reporting identities, messages, and the signed-in moderator's active memberships. One additional authorized conversation with no reports makes the zero-result filter testable. Deterministic page scenarios may reuse those fixtures for loading, empty, recoverable failure, mixed permission, no governed conversations, revoked permission, and stale ticket behavior; they need not model durable writes or a full backend response envelope.

## External service and real API avoidance

All authorization, loading, retry, filtering, navigation reference, and failure outcomes must be simulated locally. The page must not contact a real API, backend, authentication provider, production system, Google Fonts, or another third-party service. Human authentication remains unresolved, so the page uses the documented identified-session assumption. Bot token behavior is irrelevant to this human-operated browser queue even though bot reporters can appear through the shared Identity model.

## YAGNI/YACNI risks to avoid

Do not add ticket statuses, assignments, priorities, service-level timers, notifications, dashboards, metrics, bulk actions, moderation decisions, sanctions, reviewer notes, audit timelines, raw identifiers, JSON views, production integrations, saved filters, pagination, or new pages. Do not move ticket-detail evidence and moderation controls into this queue. Keep the page a compact, authorized case-selection surface whose only durable-looking action is navigating to an exact report.

## Mockup change statement

No mockup files were changed. This approval created only `docs/mockup/tasks/moderation-index-approval.md`.
