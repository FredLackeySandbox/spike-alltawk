# Architect Approval: Tawk Home

- **Assigned page path:** `docs/mockup/desktop/index.html`
- **Page slug:** `index`
- **Product Owner review:** `docs/mockup/tasks/index-review.md`
- **Approval role:** Architect

## Evidence and sources reviewed

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
- Assigned page: `docs/mockup/desktop/index.html`
- Validated Product Owner review: `docs/mockup/tasks/index-review.md`

## Playwright evidence confirmation

The Product Owner review records the exact preflight-resolved Playwright route, including the Node executable, package directory, Chromium browser type, and unchanged Chrome headless launch options. It also records rendered observations from a 1440 by 1000 desktop inspection, keyboard traversal and focus behavior, the continuation link's resolved destination, blocked HTTP(S) traffic, the attempted Google Fonts request, and the absence of JavaScript page errors. This is sufficient rendered evidence for architecture review; the decisions below are not based on code inspection alone.

## Recommendation decisions

### PO-001: Understand the conversation model on arrival

- ***Decision:*** Approved with nuance
- **Approved behavior or rationale:** On opening or reloading the public entry page, a visitor must immediately understand that listed conversations are discoverable through eligible tag suggestions, while unlisted conversations require the complete known tag combination and remain unidentified during discovery. The page must also establish that participation is non-anonymous, people enter through identified access, and bots use token credentials under the same conversation role model. The privacy explanation should refer specifically to tags used exclusively by unlisted conversations, because the requirements do not prohibit suggesting a reusable tag that also has an active listed-conversation association.
- **State/data effect:** The page remains a static explainer. It creates or changes no Identity, Bot Credential, Conversation, Tag, Conversation Tag, Membership, or authentication/session state and requires no mock JSON or data fixture.
- **QA acceptance check:** Open the page in a fresh local browser context and verify that the initial render visibly explains listed discovery, complete-tag entry for unlisted conversations, non-disclosure of unlisted conversation identity, exclusion of unlisted-only tags from suggestions, identified human participation, and bot token credentials. Verify that no conversation results, private-product data, sign-in fields, provider choices, loading state, or error state appear.
- **Constraints:** Preserve the sparse public-entry purpose and single handoff defined in `APP_PAGES.md`. Do not expose conversation data, imply that every tag ever used by an unlisted conversation is globally unsuggestible, invent an authentication mechanism, or add search, identity, marketing, or private-product controls.

### PO-002: Continue into the identified conversation hub

- ***Decision:*** Approved
- **Approved behavior or rationale:** When the visitor activates “Continue to conversations” by pointer or keyboard, the page must navigate directly to the local `hub/index.html` destination while clearly retaining the prototype assumption that human identification is already complete. The control must expose a visible keyboard focus state and must not insert a sign-in, identity-provider, invitation, or approval step.
- **State/data effect:** Activation changes only the current local page. It creates no Identity or credential, persists no session from this page, changes no mock application data, and performs no real authentication or backend request.
- **QA acceptance check:** Tab from the top of the page until “Continue to conversations” has a visible focus indicator, activate it with Enter, and verify that the browser resolves to the local `hub/index.html` page without authentication UI or network activity. Return to the home page, activate the same link with a pointer, and verify the same destination and unchanged initial home state on return.
- **Constraints:** Keep this as the sole primary continuation action. The unresolved human-authentication choice must remain unresolved, bot token behavior remains explanatory only, and no OAuth, SSO, authentication service, provider simulation, permission branch, confirmation, or local credential/session fabrication is allowed.

### PO-003: Render without live third-party dependencies

- ***Decision:*** Approved with nuance
- **Approved behavior or rationale:** Opening or reloading the public entry page with external networking blocked must produce the complete readable hierarchy, explanations, focus indicators, and usable local continuation link without attempting Google Fonts or any other remote font, API, analytics, authentication, or third-party service. Typography may use locally available resources or system fallbacks; visual fidelity must not depend on a live service.
- **State/data effect:** No external data is read, no durable schema-backed data is needed, and no local application state changes. If an optional local presentation resource is unavailable, readable fallback typography must preserve the page's meaning and interactions.
- **QA acceptance check:** Load the page in Playwright with HTTP(S) traffic blocked while recording requests, and verify that zero external requests are attempted, all required explanatory content remains visible, both links remain keyboard-focusable with visible focus, and the continuation link still resolves to `hub/index.html`. The test fails if a remote request is merely blocked but still attempted.
- **Constraints:** Apply the local-only outcome without redesigning the page or adding loading, retry, cancellation, degraded-service, or permission UI. Because presentation resources may be shared by other desktop pages, any approved shared-resource change must preserve their existing behavior and be coordinated within the implementation scope; it must not introduce another remote dependency.

## Data and schema feasibility

The approved page behavior requires no durable records. The Identity and Bot Credential schemas support the explanatory distinction between people and token-authenticated bots, while the Conversation, Conversation Tag, and Tag schemas support the listed/unlisted and matching concepts described on the page. In particular, `Conversation.visibility` distinguishes listed from unlisted, `matchingMode: allTags` is required for unlisted conversations, and Tag autocomplete eligibility is derived from active listed Conversation Tag associations. None of those records should be loaded, displayed, created, or mutated by this public page.

## Mock data and local fixture feasibility

No mock data directory is present, and none is needed. Static explanatory examples and in-page link interaction are sufficient for the approved job. Adding conversation fixtures, identity fixtures, authentication state, loading states, hidden-match counts, or search results would expand the page beyond its contract.

## External service and real API avoidance

The existing attempted Google Fonts request conflicts with the local-only mockup standard and is covered by PO-003. No real API, backend, analytics, OAuth, SSO, human authentication, bot-token issuance, or other third-party request is approved. The local link handoff must remain service-independent, and the identified-session assumption must be communicated without simulating a provider or credential exchange.

## YAGNI/YACNI risks to avoid

Do not add sign-in controls, provider selection, token management, conversation search, result data, private-tag suggestions, hidden-match workflows, application navigation, modals, toasts, marketing sections, pricing, testimonials, analytics, or new page states. Do not resolve open requirements such as human authentication, tag casing, extra-tag semantics, conversation metadata, or archived-conversation behavior on this entry page.

## Mockup change statement

**No mockup files were changed.** This approval created only `docs/mockup/tasks/index-approval.md`.
