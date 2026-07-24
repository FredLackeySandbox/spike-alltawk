# Product Owner UX Review: Reported Messages

- **Assigned page:** `docs/mockup/desktop/moderation/index.html`
- **Page slug:** `moderation-index`
- **Review role:** Product Owner

## Source documents reviewed

- `docs/concepts/REQUIREMENTS.md`
- `docs/concepts/APP_PAGES.md`
- `docs/concepts/USER_TYPES.md`
- `docs/mockup/desktop/moderation/index.html`
- Directly referenced local assets `docs/mockup/desktop/assets/styles.css` and `docs/mockup/desktop/assets/app.js`

## Page purpose and user journey

The page is a focused selection queue for an identified person who is an owner or administrator in one or more conversations. Its primary job is to let that moderator compare the small set of numbered reports they are permitted to review, narrow the queue by governed conversation, and open the correct report for evidence and action review. A bot may hold the same moderation role, but this desktop page is the human-operated surface.

The likely entry paths are the source conversation, its Members or Tags & lifecycle governance view, or the shared private Reports navigation. The natural next action is to open one report in `moderation/ticket.html`; a moderator may instead return to the relevant conversation or move through the existing private and governance navigation. The queue must remain a case-selection page and must not acquire ticket statuses, assignments, bulk actions, analytics, or moderation controls that belong on the ticket detail page.

## Playwright route used

Rendered inspection used the required preflight route without rediscovery:

- **Kind:** `system-node-package`
- **Node executable:** `/Users/flackey/.nvm/versions/node/v24.15.0/bin/node`
- **Package directory:** `/Applications/ChatGPT.app/Contents/Resources/cua_node/lib/node_modules/playwright`
- **Browser type:** `chromium`
- **Launch options:** `{"channel":"chrome","headless":true}`
- **Page URL:** `file:///Users/flackey/Source/Personal/FredLackeySandbox/spike-alltawk/docs/mockup/desktop/moderation/index.html`
- **Desktop viewport:** 1440 × 1000

## Rendered Playwright observations

- The page rendered at 1440 × 1000 without horizontal or vertical overflow. The heading, moderate-density table, filter, three report rows, and footer action were all visible in one desktop viewport.
- The initial queue showed reports `#1048`, `#1046`, and `#1042`, each with conversation tags, a reporter identity, a concise reason, and a Review action. A person and a bot reporter were represented without changing the membership model.
- Selecting each of the three governed conversations reduced the visible table to the matching report and changed the live count from `3 reports` to `1 report`. Returning the filter to All restored all three rows and the plural count.
- The existing empty row never became visible because every selectable conversation has one report; therefore the page's empty behavior is present in markup but cannot be exercised through the rendered controls.
- The report number and Review action are keyboard-reachable links, but all six report-opening links resolve to the same undifferentiated `moderation/ticket.html` URL. The selected ticket is not carried to the detail experience.
- The breadcrumb and Return to conversation link always point to the `#product-design · #accessibility · #research` conversation even after filtering to the gardening or transit conversation.
- The rendered page identifies Rowan Ellis and states that only owner- or administrator-governed conversations appear, but no visible local state demonstrates ordinary-member denial, lost permission, or a user with no governed conversations.
- Playwright recorded live requests to Google Fonts CSS and font files through `fonts.googleapis.com` and `fonts.gstatic.com`. No application API, backend, real authentication, or other service call was observed.

## Code observations

- The three reports and filter options are embedded directly in the page; the inline script only toggles row visibility and updates the count.
- The markup contains an empty row and an `aria-live` count, but no loading, load-failure, retry, permission-denied, or stale-report state.
- The shared script provides generic modal, dropdown, and toast helpers, but this queue does not use them. No modal or confirmation is needed for the page's selection-only job.
- The shared stylesheet imports Google-hosted fonts. That external dependency conflicts with a fully local mockup that must not contact third-party services.

## Recommended user experience and interactions

### PO-001: Enforce the moderator's governed-conversation scope

- **Scenario:** An identified person opens the report queue and must see only reports they are authorized to review as an owner or administrator for the affected conversation.
- **Trigger:** The user follows Reports from private navigation or opens the queue from a conversation or governance page.
- **Preconditions:** Local mock session data identifies the signed-in person and their role in each fixture conversation.
- **Expected behavior:** The page admits an owner or administrator and lists only their governed conversations and associated reports. It must not reveal a ticket number, reporter, reason, or private conversation tags from a conversation where that identity is only a member or has no active role. The page gives a concise, non-disclosing access outcome when the signed-in identity governs no conversations.
- **State/data effect:** Authorization filtering reads local fixture membership state and does not mutate tickets, conversations, or roles. Unauthorized report data is absent from the visible queue state.
- **Alternate paths:** A person who is an administrator in one conversation but an ordinary member in another sees only the administrator-scoped conversation. A stale or revoked role produces a permission-denied outcome and a safe route back to the private conversation area without exposing the requested report. A locally modeled signed-out state must not invent an authentication provider; it should return to the existing identified-session handoff.
- **QA acceptance check:** Load the queue under local owner, administrator, mixed-role, and no-governed-conversation fixtures. Verify that authorized conversations and reports appear, unauthorized ticket details never appear in the DOM or visible controls, and the denied state provides a working safe exit without naming protected conversations.

### PO-002: Make queue loading, empty, failure, and retry states exercisable

- **Scenario:** A moderator needs a dependable queue whether local fixture data is available, empty, delayed, or failed.
- **Trigger:** The authorized user opens the page or activates Retry after a simulated load failure.
- **Preconditions:** A local queue scenario is selected with reports, no reports, delayed completion, or a recoverable failure; no live backend is required.
- **Expected behavior:** The page first shows a restrained loading state and prevents report-opening actions until the queue is ready. Success replaces it with the report table and accurate count. A queue with no reports shows a clear empty outcome without an empty table shell. A simulated failure shows a concise error and a Retry action; retry visibly returns to loading and then renders the configured success or empty outcome.
- **State/data effect:** Local read-only fixture data supplies ticket number, source-conversation tags, reporter identity/type, reason excerpt, and authorization scope. Loading and error flags are transient in-page state; retry clears the prior error but does not create, resolve, or modify any moderation ticket.
- **Alternate paths:** A delayed load must not briefly show stale rows or `0 reports`. A second simulated failure leaves the error visible and Retry available. Malformed or unavailable fixture data must produce the failure state rather than partially exposing inconsistent rows. Offline use must behave the same because the queue is local.
- **QA acceptance check:** Exercise the populated, empty, delayed, failure, and failure-then-success local scenarios. Confirm the visible state sequence, disabled or absent report actions while loading, accurate final count, functioning Retry action, and zero application/backend/third-party requests.

### PO-003: Filter the queue with a genuine zero-result state

- **Scenario:** A moderator narrows their authorized queue to one governed conversation and needs the rows, count, and empty result to stay synchronized.
- **Trigger:** The user chooses All governed conversations or one conversation from the existing select control.
- **Preconditions:** The queue has loaded and the select contains only conversations the user governs, including at least one local fixture conversation with no reports so the zero-result behavior is testable.
- **Expected behavior:** The page immediately shows only reports for the selected conversation, updates the live count with correct singular or plural wording, and preserves the selected option while the user remains on the queue. A selection with no reports displays a conversation-specific empty outcome and no report rows. Returning to All restores every authorized report.
- **State/data effect:** Only the local filter selection and derived visible collection change. Ticket records and moderation state remain unchanged.
- **Alternate paths:** If the selected conversation disappears from the authorized fixture set because permission becomes stale, the filter safely resets to All and announces the updated result. A no-result filter must not be treated as a load failure. Rapid selection changes must settle on the last selection without stale rows or counts.
- **QA acceptance check:** Select each populated conversation, the zero-report conversation, and All using both pointer and keyboard. Verify the exact visible tickets, `0`, `1`, and plural counts, the empty outcome, the retained selected option, and the absence of rows from any other conversation.

### PO-004: Open the exact selected moderation report

- **Scenario:** A moderator chooses a ticket from the queue and expects the detail page to represent that ticket rather than a generic example.
- **Trigger:** The user activates either the ticket-number link or the Review action on a report row.
- **Preconditions:** The selected local ticket is visible and remains authorized for the signed-in moderator.
- **Expected behavior:** Both controls for a row open the same ticket detail experience, and that experience visibly matches the selected ticket number, source conversation, reporter, and reason. Activating `#1048`, `#1046`, or `#1042` must never silently open another report.
- **State/data effect:** The selected local ticket reference is carried into the detail experience; opening it does not change the ticket or remove it from the queue.
- **Alternate paths:** If the ticket becomes unavailable or authorization is lost between selection and opening, the user sees a non-disclosing unavailable or permission outcome with a working return to the queue. A missing ticket reference must not fall back to an arbitrary default report. Repeated activation must not duplicate or mutate a ticket.
- **QA acceptance check:** Open every fixture ticket once through its number and once through its Review action. Verify that each destination shows the matching ticket context and that stale, missing, and unauthorized references never show another ticket's evidence.

### PO-005: Keep entry, breadcrumb, filter, and return context coherent

- **Scenario:** A moderator arrives from a particular conversation or from shared private navigation and needs to understand the queue scope and return to the right place.
- **Trigger:** The user opens Reports from a conversation or governance view, opens it from shared navigation, changes the governed-conversation filter, or activates the footer return action.
- **Preconditions:** Local navigation state identifies an originating conversation when one exists; the origin is within the user's authorized fixture scope.
- **Expected behavior:** Entry from a conversation or its governance pages starts with that governed conversation selected, shows matching breadcrumb context, and returns to that conversation. Entry from shared navigation starts in the All view and uses a broader private-area return rather than implying one arbitrary conversation. When the selected filter changes, the visible context and return destination must not contradict the queue scope.
- **State/data effect:** The local origin and selected-conversation state control presentation and navigation only; they do not alter membership, tickets, or conversation data.
- **Alternate paths:** A stale or unauthorized origin falls back to the safe All scope without exposing the former conversation. Selecting a zero-report conversation still provides a valid return to that conversation. Browser Back returns to the actual prior local page without applying moderation changes.
- **QA acceptance check:** Enter from each of the three governed conversation fixtures and from shared Reports navigation. Verify the initial filter, breadcrumb/context treatment, and footer destination; then change filters and confirm that no displayed conversation context or return link points to an unrelated conversation.

### PO-006: Keep page rendering fully local

- **Scenario:** A reviewer opens the mockup in a local or offline environment and expects the same usable moderation queue without external services.
- **Trigger:** The browser loads or reloads the assigned page with external network access available or blocked.
- **Preconditions:** The HTML and approved local mockup assets are available.
- **Expected behavior:** The page renders its structure, readable typography, queue states, and interactions without requesting Google Fonts or any other third-party, live API, backend, authentication, or service endpoint. If a preferred local visual asset is unavailable, a readable local fallback is used without delaying or breaking the page.
- **State/data effect:** No remote state is read or written. The page uses only local assets, local fixtures, and in-page state.
- **Alternate paths:** Offline loading must not show a font-related error, invisible text, layout-blocking wait, or degraded controls. A missing optional local font asset falls back cleanly while preserving content and interaction behavior.
- **QA acceptance check:** Reload the page with network access disabled and inspect browser requests. Confirm that the queue remains visually readable and fully interactive and that no `http://` or `https://` request is made, including requests to `fonts.googleapis.com` or `fonts.gstatic.com`.

## Dynamic data, local fixtures, and state expectations

Use the minimum local evidence needed to exercise the approved page contract: signed-in identity, per-conversation owner/administrator/member role, governed conversation tags, ticket number, reporter display identity and person/bot type, concise report reason, and the relationship between each ticket and its source conversation. The current three tickets are sufficient for populated comparisons; add one authorized conversation with no reports only to make the existing zero-result behavior testable. Provide deterministic local scenarios for populated, empty, delayed, recoverable failure, mixed permission, no governed conversations, stale permission, and stale ticket. Do not add ticket status, assignment, priority, SLA, notification, or resolution data.

## External services and real API avoidance

No application API, backend, real authentication, or moderation-service request was observed. The Google Fonts stylesheet and font-file requests are real third-party calls and must be replaced by local or system-provided rendering behavior. All queue, permission, loading, retry, filtering, and selected-ticket behavior must remain fixture-backed or in-page. Authentication should stay an already identified local session because the human provider is unresolved.

## Validation expectations

- Authorization is validated before report metadata is exposed, using the local role fixture.
- The selected filter must be one of the currently authorized governed conversations or All; a stale selection resets safely.
- A selected ticket must exist in the local fixture and remain authorized before its detail is shown; missing or stale identifiers never fall back to another ticket.
- Counts are derived from the visible authorized set and use correct zero, singular, and plural forms.
- Loading, empty, load-failure, permission-denied, and stale-ticket outcomes are distinct and QA-exercisable.

## Modal, confirmation, and linked-control expectations

No modal or confirmation should be added to this read-only selection queue. The filter, count, visible rows, breadcrumb context, and return destination are linked controls and must remain synchronized. The ticket number and Review action in the same row must target the same selected ticket. Destructive confirmations and moderation outcome feedback belong on the ticket detail page, not here.

## Buttons and links to retain or clarify

- Retain both the ticket-number link and Review action because they provide clear, accessible ways to open a case; make each pair target the exact row ticket.
- Retain private navigation and the conversation governance subnavigation for authorized users.
- Clarify the footer return behavior through context: return to the originating or selected conversation when one is established, otherwise return to the broader private conversation area.
- Provide Retry only in the recoverable queue-failure state. Do not add refresh, bulk action, assignment, resolve, or sanction controls to this page.

## Explicitly out of scope

- Ticket statuses, resolution pipelines, assignees, priorities, service-level timers, notifications, dashboards, metrics, and bulk moderation.
- Moderation decisions, sanctions, reviewer notes, evidence expansion, or confirmations on the queue; those belong on `moderation/ticket.html`.
- Global or unauthorized reports, raw database identifiers, JSON views, audit timelines, hard deletion, or production-service integration.
- New pages, a redesigned information architecture, a bot-facing browser workflow, or a real human authentication flow.
- Exact final copy, CSS prescriptions, or implementation architecture.

## Mockup change statement

No mockup files were changed. This review created only `docs/mockup/tasks/moderation-index-review.md`.
