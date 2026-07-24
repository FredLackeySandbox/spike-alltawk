# Product Owner Mockup Review: Tawk Home

- **Assigned page path:** `docs/mockup/desktop/index.html`
- **Page slug:** `index`
- **Review role:** Product Owner

## Source docs reviewed

- `docs/concepts/REQUIREMENTS.md`
- `docs/concepts/APP_PAGES.md`
- `docs/concepts/USER_TYPES.md`
- Assigned page: `docs/mockup/desktop/index.html`
- Directly referenced local assets: `docs/mockup/desktop/assets/styles.css` and `docs/mockup/desktop/assets/app.js`

## Page purpose and user journey

- **Purpose:** Give a first-time visitor a concise explanation of tag-based conversations, distinguish listed discovery from complete-tag access to unlisted conversations, establish that participation is identified, and provide the single handoff into the private product.
- **Target user:** A human visitor who is about to continue as an identified person. Bots are explained here but do not need a browser entry flow because they authenticate non-interactively with tokens.
- **Likely entry path:** Direct arrival at the public product entry point; this is the first mockup page.
- **Likely next action:** Continue to `hub/index.html`, where the prototype treats human identification as already complete and shows the person's conversations.

## Playwright route used for rendered inspection

Rendered inspection was completed at a 1440 by 1000 desktop viewport with this preflight-resolved route:

```json
{"kind":"system-node-package","source":"application:/Applications","nodeExecutable":"/Users/flackey/.nvm/versions/node/v24.15.0/bin/node","packageName":"playwright","packageVersion":"1.57.0","packageDirectory":"/Applications/ChatGPT.app/Contents/Resources/cua_node/lib/node_modules/playwright","browserType":"chromium","launchOptions":{"channel":"chrome","headless":true},"validation":"launched browser and rendered local HTML"}
```

Playwright was loaded with `require(packageDirectory)` and `playwright[browserType].launch(launchOptions)` using the values above. HTTP(S) traffic was blocked during inspection so attempted external dependencies could be recorded without contacting them.

## Current behavior observed

### Rendered Playwright inspection

- The page renders as a sparse public entry experience with a brand header, large primary statement, one prominent continuation link, a two-mode explainer card, an identity strip, and a minimal footer.
- The visible explanation distinguishes listed conversations, where eligible tags can be searched and results joined, from unlisted conversations, where the complete tag combination is required and private tags stay out of suggestions.
- The identity strip visibly states that people use identified access, bots use token credentials, and both use the same conversation roles.
- The primary link is visibly labeled “Continue to conversations,” has a 50-pixel-high hit target, and resolves to the relative destination `hub/index.html`. A prevented test click confirmed that exact navigation attempt without reading the destination page.
- Keyboard traversal reaches the self-linking Tawk brand first and the continuation link second. Both display a visible focus outline. No interactive element is hidden, and all three `aria-labelledby` references resolve to existing headings.
- The page has no forms, buttons, search results, tag suggestions, activity data, dialogs, or authentication controls, which is consistent with its approved sparse scope.
- The 1440 by 1000 render is visually structured across the full viewport with a two-column hero; the document is 1002 pixels tall, producing only a negligible vertical overflow at that viewport.
- The page emitted no JavaScript page errors. It attempted one live request to Google Fonts through the shared stylesheet; the request was blocked for inspection, and the page remained readable with its configured local system-font fallback.

### Code inspection

- The only actionable page links are the brand self-link to `index.html` and the primary continuation link to `hub/index.html`; “How Tawk works” is correctly presented as a status label rather than a misleading control.
- The page contains all required public-entry concepts and does not invent a human identity provider, sign-in form, conversation data, pricing, testimonials, or other marketing sections.
- `assets/app.js` provides generic modal, menu, and toast helpers, but this page has no matching triggers or stateful controls, so it introduces no page-local behavior.
- `assets/styles.css` imports typography from `https://fonts.googleapis.com/...`. That real third-party request is unnecessary for this page and conflicts with the fully local, service-independent mockup standard.

## Recommended user experience and interactions

### PO-001: Understand the conversation model on arrival

- **Scenario:** A visitor needs to understand the product's discovery and privacy model before entering the private experience.
- **Trigger:** The visitor opens or reloads `docs/mockup/desktop/index.html`.
- **Preconditions:** The local mockup files are available; no authenticated application state or conversation data is required.
- **Expected behavior:** The first render presents, without an intermediate prompt, a concise distinction between listed conversations that can be found through eligible tag suggestions and unlisted conversations that require the complete known tag combination while keeping private-only tags out of suggestions. The same view makes clear that every participant is identified, people use identified access, and bots use token credentials under the shared role model.
- **State/data effect:** No user, conversation, or authentication state is created or changed. The page remains a static explainer and does not need mock JSON or data fixtures.
- **Alternate paths:** Reloading produces the same explanation; absence of application data does not create a loading, empty, or error state because none is needed here. The page must not reveal conversation results, private tags, participant activity, or an invented authentication choice.
- **QA acceptance check:** Open the page in a fresh local browser context and verify that listed behavior, complete-tag unlisted behavior, suppression of private tag suggestions, identified human participation, and bot token credentials are all visibly understandable on the initial render, while no discovery results, sign-in fields, or application data appear.

### PO-002: Continue into the identified conversation hub

- **Scenario:** A visitor who understands the model wants to enter the private product as the already identified prototype user.
- **Trigger:** The visitor clicks the sole primary continuation link or focuses it with the keyboard and activates it.
- **Preconditions:** The public home page is rendered and the local `hub/index.html` mockup route is available; the prototype's identified-session assumption is already satisfied.
- **Expected behavior:** The action clearly communicates that identification is treated as complete for the prototype, accepts both pointer and keyboard activation, and navigates directly to `hub/index.html` without an invented sign-in, provider-selection, invitation, or approval step. The link retains a visible keyboard focus state before activation.
- **State/data effect:** Navigation changes only the current local page. It does not create credentials, call an authentication service, mutate mock data, or persist a session from this public page.
- **Alternate paths:** If the visitor does not activate the link, the explainer remains unchanged. Returning to the home page restores the same initial view. There is no loading, retry, cancellation, permission-denied, or validation branch to simulate because the handoff is a direct local link and the unresolved authentication mechanism must not be fabricated.
- **QA acceptance check:** Tab from the top of the document until “Continue to conversations” has a visible focus indicator, activate it with Enter, and verify that the browser resolves the local destination to `hub/index.html` with no authentication UI or network call. Repeat with a pointer click and confirm the same destination.

### PO-003: Render without live third-party dependencies

- **Scenario:** A reviewer opens the mockup locally or offline and needs the public entry page to remain complete and usable without external services.
- **Trigger:** The visitor opens or reloads the page while external network access is unavailable or blocked.
- **Preconditions:** The assigned HTML and its permitted local assets are present.
- **Expected behavior:** The complete visual hierarchy, explanatory content, focus indicators, and continuation link render from local resources or system-provided fallbacks. The page makes no request to Google Fonts or any other remote font, API, authentication, analytics, or third-party service, and it does not display a spinner or degraded-service warning for content that is inherently local.
- **State/data effect:** No external data is read and no local application state changes. A locally available font or system fallback may determine typography without changing the page's meaning or interaction behavior.
- **Alternate paths:** If an optional local presentation asset is unavailable, readable system typography remains in place and the continuation link remains usable. There is no retry control, cancellation flow, or permission prompt because the page requires no service call.
- **QA acceptance check:** Load the page in Playwright with all HTTP(S) requests blocked, record network activity, and verify that the page issues no external request, all required explanation remains visible, the two interactive links remain focusable, and the continuation link still resolves to `hub/index.html`.

## Dynamic data, local fixtures, and state expectations

No mock JSON or content fixture is warranted. This page's approved job is fulfilled by static explanatory content and a local navigation target. The only in-page states worth preserving are normal, hover, active, and visible keyboard-focus states for the two links. Loading, empty, stale-selection, no-result, retry, cancellation, and disabled states would add behavior unrelated to this page's purpose.

## External services, APIs, and authentication

- A real Google Fonts stylesheet request was observed from the shared local stylesheet. Replace that dependency for this mockup with local or system-provided typography so the page can be inspected with zero external traffic.
- No real application API, backend call, analytics request, OAuth flow, SSO flow, or human authentication request was observed in the assigned page.
- Do not add a mocked provider picker or sign-in form. The source contract explicitly treats identification as complete after this entry point because the human authentication mechanism is unresolved.
- Bot token credentials are explanatory content only on this human-facing page; token issuance or management controls are not needed.

## Validation expectations

There are no fields to validate. QA should validate semantic completeness of the listed, unlisted, and identity explanations; keyboard access and visible focus for both links; the exact local continuation destination; absence of hidden or dead controls; and absence of external network requests.

## Modal, confirmation, and linked-control expectations

No modal, confirmation, toast, menu, or linked-control coordination is justified. Entering the hub is a low-risk direct navigation and should not require confirmation. The brand link may continue to reload or restore the public home page, while the sole primary action continues to the hub.

## Button and link purposes

- **Tawk brand link:** Return to or restore this public home page; it should remain visibly focusable but visually subordinate to the main action.
- **Continue to conversations:** The single primary action; enter `hub/index.html` under the prototype's already-identified-session assumption.
- **How Tawk works:** Remain a non-interactive page-context label. Turning it into a second navigation action would weaken the one-action entry pattern without adding an approved destination.

## Explicitly out of scope

- A sign-in page, identity-provider choice, credentials form, OAuth or SSO simulation, or bot token-management UI.
- Search fields, tag autocomplete, listed results, hidden-result counts, conversation previews, joined-conversation data, participant activity, or other private-product state.
- Additional pages, navigation menus, pricing, testimonials, feature grids, marketing metrics, or calls to action.
- Resolution of open questions about tag casing, extra-tag search semantics, hidden-match ambiguity, conversation metadata, or archived-conversation visibility.
- Mobile redesign or a broad responsive-layout rewrite as part of this desktop page review.

## Mockup change statement

**No mockup files were changed.** This review created only `docs/mockup/tasks/index-review.md`.
