# Architect Approval: Members and Roles

- **Assigned page:** `docs/mockup/desktop/governance/members.html`
- **Page slug:** `governance-members`
- **Product Owner review:** `docs/mockup/tasks/governance-members-review.md`
- **Review role:** Architect

## Sources and evidence reviewed

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
- `docs/mockup/desktop/governance/members.html`
- `docs/mockup/tasks/governance-members-review.md`

The validated Product Owner review identifies the Playwright route used and records rendered observations from a 1440 by 1000 desktop inspection. Those observations include exercised filtering, promotion, removal, suspension validation, dialog focus behavior, navigation, console state, and network requests. The evidence is sufficient for this architecture review; code inspection was not used as a substitute for rendered inspection.

## Architecture decisions

### PO-001: Load and filter an authoritative role-aware roster

- ***Decision:*** Approved with nuance
- **Approved behavior or rationale:** On page load, an owner or administrator receives a short local loading state followed by an Active roster whose rows and Active/Former counts come from the same fixture-backed state. Selecting either filter changes only the visible subset and pressed state, with an empty result shown by the existing empty-state treatment. A local load failure may offer Retry. An ordinary member must be denied this governance page and directed back to the conversation; the page must not render a reduced governance roster that risks exposing former participants before permission handling completes.
- **State/data effect:** Local loading, loaded, selected-filter, empty, error, and retry states are approved. Filtering does not mutate membership. Successful governance actions must update the single roster state so rows and both counts remain synchronized. Permission denial exposes neither former-member records nor action controls.
- **QA acceptance check:** Under owner and administrator fixtures, verify the default Active count and both filter counts exactly equal their rendered rows before and after local actions. Verify switching filters changes no membership data, empty and retry states remain usable, and an ordinary-member fixture is redirected without former identities or governance controls appearing.
- **Constraints:** The fixture needs only the current actor role and the identity type, membership status, retained or current role context, membership dates, and active suspension state required by this page. Do not add organization-wide users, exhaustive role history, remote loading, or a member-facing variant of the governance page.

### PO-002: Promote permitted roles and recompute ownership safeguards

- ***Decision:*** Approved
- **Approved behavior or rationale:** An active owner may choose promotion of an eligible active member to administrator or owner and confirm the named participant and destination role. Confirm updates the role badge, closes the dialog, reports success, removes actions no longer valid for the target, and recalculates all last-owner labels and protections. Cancel or a stale/unauthorized selection changes nothing. Administrator fixtures must expose no action that creates, removes, or changes an owner. Once another owner exists, the previous sole-owner warning and protection wording must update consistently; its archive alternative may navigate to the existing Tags and Lifecycle page.
- **State/data effect:** The local promotion closes the prior role period and establishes one new current role period while leaving membership active. The fixture must preserve one open role period and prevent duplicate transitions. Owner-continuity state is derived again after every successful role change.
- **QA acceptance check:** As an owner, separately promote an eligible member to administrator and owner, confirming that the row badge, available actions, success feedback, and every ownership-continuity indicator agree. Cancel one promotion and verify no state changes. Under an administrator fixture, verify there is no owner-changing control. Reopen a stale action and verify it is rejected without a second mutation.
- **Constraints:** Only the promotions explicitly supported by the requirements are approved; no generic role editor, permissions matrix, demotion workflow, bulk role change, or real authorization call is introduced. Any action affecting an owner must preserve at least one active owner unless archival occurs on the separate lifecycle page.

### PO-003: Remove a participant while retaining membership history

- ***Decision:*** Approved
- **Approved behavior or rationale:** An owner or administrator may select Remove for an eligible active non-owner participant and confirm the named consequence. Confirmation must explain that active participation ends while membership history and authored content remain retained. On success, the participant appears once in Former as Removed, counts change together, the Former result becomes visible, and success feedback appears. Cancel, permission denial, a stale target, or owner-continuity protection produces no mutation. Administrators may not remove owners, and no action may leave the conversation ownerless.
- **State/data effect:** The local membership changes from active to removed, records an effective end time and actor context, closes the active role period, and retains the identity and prior role context. It does not delete membership, identity, message, or history data.
- **QA acceptance check:** Remove an eligible active member and verify one Removed row appears in Former, Active decreases by one, Former increases by one, and retained role/date context remains visible. Reset or reload the fixture, cancel removal, and verify rows and counts are unchanged. Verify an administrator cannot remove an owner and a sole owner has no removal path. If Active becomes empty, verify the corrected zero count and empty state.
- **Constraints:** The approved mock state must conform to `membership.yaml`: a removed membership has `currentStatus: removed` and no `currentRole`; retained role display may come from the closed role period. Do not expose exhaustive history or implement hard deletion.

### PO-004: Ban and restore an identity without automatic rejoining

- ***Decision:*** Approved with nuance
- **Approved behavior or rationale:** An owner or administrator may confirm Ban for an eligible active or already-removed non-owner identity. The result is a retained Banned former record and a local rejoin-eligibility denial; only banning an active participant changes the filter counts. Unban restores eligibility to join in the future but does not silently create active membership or place the identity in Active. Cancel, duplicate/stale actions, permission denial, and simulated local failure leave the latest valid state unchanged. Administrators must never ban, unban, or otherwise alter an owner.
- **State/data effect:** Ban ends active participation when needed and represents the retained membership as banned with role `none`. Unban ends the ban and leaves the participant in a non-active retained state without `currentRole`; any local membership event used to demonstrate the transition must preserve the schema-required role context without treating that history field as a new active membership. All identity, membership, role-period, and message history remains retained.
- **QA acceptance check:** Ban one active eligible member and one removed former member; verify both appear once as Banned, the counts change only for the previously active member, and a local eligibility check denies rejoining. Unban a banned identity and verify it remains Former, is eligible for a future join, and is absent from Active. Cancel Ban and Unban and verify no state changes; under an administrator fixture, verify owner targets have neither action.
- **Constraints:** `membership.yaml` reserves `currentRole: none` for `currentStatus: banned`; removed/left states cannot carry `currentRole`. `membership-event.yaml` requires role context for ban and unban events, so the fixture must not invent a contradictory current role. No automatic rejoin, invitation workflow, real join service, or broader ban-management surface is approved.

### PO-005: Apply, change, and end a time-bounded posting suspension

- ***Decision:*** Approved
- **Approved behavior or rationale:** An owner or administrator may suspend posting for an eligible active non-owner, change an existing suspension, or end it early. The form names the participant, explains that reading and membership remain available, uses the displayed timezone, and requires a complete end date/time later than the current local time. Apply briefly prevents repeated submission and then updates the access badge, exact end time, action label, and success feedback together. Change preloads the participant's current suspension. Early end or fixture time advancing past the end restores full posting state. Cancel and invalid, stale, unauthorized, or simulated-failure paths preserve the previous value.
- **State/data effect:** Apply creates or replaces only a local bounded posting-suspension interval while membership and role remain active. Ending early records the local equivalent of lift time and moderator context; natural expiry is derived from the interval and clears the visible restriction. No membership transition occurs.
- **QA acceptance check:** Apply a future ET suspension and verify the row and feedback show the same end time. Reopen Change, confirm the stored value is prefilled, modify it, and verify one updated restriction. Submit blank and past values and confirm the form stays open, focuses the first invalid field, and makes no mutation. End the suspension and exercise an expired fixture; both must show active/full participation.
- **Constraints:** The interval must respect `posting-suspension.yaml` and the dictionary invariant that `endsAt` is later than `startsAt`; an early lift requires both lift time and lifting actor context. The page does not add indefinite suspension, notifications, a ticket requirement, or a real moderation service.

### PO-006: Complete or cancel governance dialogs safely

- ***Decision:*** Approved
- **Approved behavior or rationale:** Opening any promotion, remove, ban, unban, or suspension dialog moves focus into it, keeps focus within it, and prevents background operation. Cancel, close control, Escape, and backdrop all close without firing the action and return focus to the originating row control. Confirmation applies at most one local transition while repeat activation is disabled. If success removes the originating row from the current view, focus moves to the selected filter or another stable roster control.
- **State/data effect:** The dialog holds only temporary target/action/form state until cancellation or one confirmed local result. Cancellation clears that temporary state without touching the roster; confirmation commits at most one approved mutation and then clears it.
- **QA acceptance check:** Use only the keyboard to open each dialog, verify focus enters and cannot escape to the page behind it, then close via Cancel, close control, Escape, and backdrop and verify focus restoration with no roster mutation. Confirm one action and verify repeat activation cannot produce a second state transition; when its row disappears, verify focus lands on a stable visible roster control.
- **Constraints:** This is page-local interaction quality, not a request for a new component system or visual redesign. Dialog semantics must not weaken role checks, stale-state checks, owner continuity, or the non-destructive cancel contract.

### PO-007: Keep the page functional without third-party services

- ***Decision:*** Approved with nuance
- **Approved behavior or rationale:** The page must remain legible and fully interactive when HTTP and HTTPS access is blocked. Typography may use local assets already in scope or system fallbacks instead of Google Fonts. Filtering, governance mutations, busy feedback, success, deliberate local failure, permission denial, retry, cancellation, and reset-to-baseline behavior must be fixture-backed or in-page. No page-purpose action may contact a real API, backend, authentication flow, moderation service, or third party. Reloading the page may serve as the reset mechanism; a visible fixture/debug panel is not required.
- **State/data effect:** All exercises change only resettable local mock state. Neither page load nor an action creates a remote record or transmits identity, membership, or moderation data. Reset returns to the known five-active/two-former fixture baseline.
- **QA acceptance check:** Block all HTTP and HTTPS traffic, load the local page, and exercise filtering, promotion, removal, ban, unban, suspension, cancellation, local failure, and retry. Verify the page remains usable, browser request records contain no external request, and reload or the approved reset path restores the five-active/two-former baseline.
- **Constraints:** Do not add or install a service, package, authentication provider, analytics endpoint, notification integration, or remote font dependency. Failure scenarios must be explicit local fixtures and must never fall through to a live endpoint. Keep test-state selection out of the user-facing product surface unless an existing local mechanism already provides it.

## Data and schema feasibility

The approved page behavior fits the existing storage model. `identity.yaml` distinguishes people and bots while keeping both in one role model. `membership.yaml` supplies active, removed, left, and banned states; `membership-role-period.yaml` retains owner, administrator, member, and `none` periods; and `membership-event.yaml` represents role changes, removal, banning, and unbanning. The dictionary's cross-record ownership invariant supports the required sole-owner protection and atomic role transitions. `posting-suspension.yaml` directly supports bounded posting restrictions and early lift while membership remains active.

The UI should use schema concepts selectively. Stable IDs, append-only event details, raw timestamps, actor IDs, ticket links, and complete role history are feasible backing data but remain intentionally hidden because the page contract calls for a participant-comparison surface rather than an audit console.

## Mock data and local fixture feasibility

The current seven-participant example is sufficient as the baseline fixture: five active and two former identities spanning person and bot types, owner/administrator/member roles, removed and banned states, and one active posting suspension. Small resettable fixture variants may cover owner, administrator, denied ordinary member, empty filter, load failure/retry, stale action, local action failure, and expired suspension. These variants are approved only to make the specified page states QA-verifiable; they do not justify a fixture administration UI, server, or additional product data.

## Service and API avoidance

The Product Owner observed no application API, backend, authentication, or moderation request, but did observe Google Fonts over HTTPS. The approved mockup must replace that runtime dependency with local typography or a system fallback. Governance success, failure, retry, permission denial, stale state, and time progression must all be simulated locally. No real authentication, authorization, production service, notification, or third-party call is permitted.

## YAGNI and YACNI constraints

Do not add bulk actions, invitations, organization-wide administration, a permissions matrix, demotion workflows, exhaustive role-period or audit views, raw identifiers, message activity metrics, notification delivery, hard deletion, an automatic rejoin flow, or new pages. Do not resolve unrelated open questions about authentication, ticket workflow, archived-conversation visibility, or profile naming through this page. The approved work is limited to making the existing roster, filters, contextual actions, safeguards, dialogs, local states, and offline behavior complete and internally consistent.

## Mockup change statement

No mockup files were changed. This architecture phase created only `docs/mockup/tasks/governance-members-approval.md`.
