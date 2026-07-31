# Verification contract

## Contents

- Ownership boundary
- Source discovery
- Interaction-state coverage
- Mock API contract
- Fixture contract
- Browser comparison
- Approval rules

## Ownership boundary

| File | Owns | Must not own |
| --- | --- | --- |
| `{page}.html` | DOM work, rendering, handlers, keyboard behavior, validation, loading, dialogs, navigation, timers, UI state, and API orchestration | Prepared API response payloads |
| `{page}-api.js` | One-time fixture loading and tiny API-shaped functions returning prepared values | DOM work, presentation, validation, permissions, workflows, timers, navigation, or realistic persistence |
| `{page}-data.json` | Compact deterministic response values | UI state, presentation metadata, requests, scenarios, domain databases, schema mirrors, or unused fields |

## Source discovery

After copying the HTML, read it completely. Read directly referenced local CSS and
JavaScript completely. Read the page-catalog entry selected by source-relative
path; use the title only as corroboration. Treat the catalog's purpose, required
behavior, exclusions, and navigation as product constraints.

Use Playwright against the source before editing the copied behavior. Static
inspection informs where to interact but cannot prove a state works.

If a control label suggests behavior for which the source contains no markup,
script, target, URL variant, or visible result, record a source-contract limitation.
Do not invent behavior.

## Interaction-state coverage

A state is any visually or semantically distinct condition supported by markup,
CSS, JavaScript, URL/query/hash handling, QA fixtures, or enabled controls. Cover:

- initial, loading, loaded, empty, failure, denied, success, and recovery states;
- every tab, segmented control, radio, checkbox, toggle, and distinct select value;
- open/closed menus, disclosures, popovers, dialogs, and every command;
- cancel and confirm results;
- validation, dependent-field, disabled, busy, and submitted states;
- every source-defined query, hash, fixture, or QA variant;
- repeated actions and multistep sequences;
- keyboard activation, dismissal, traversal, submit, and resulting focus; and
- navigation and URL changes.

Every state and transition must appear in the handoff matrices and be tested in
source and output. Coverage is `covered / discovered * 100`; approval requires
100% for both states and transitions.

## Mock API contract

Create one function only when the real application would load, create, update,
delete, submit, or otherwise contact a backend. Do not create an API function for
pure browser interaction.

For each operation:

1. Keep the handler, validation, loading state, timing, DOM mutation, rendering,
   focus, success/error presentation, and navigation in HTML.
2. Pass one object whose keys expose the intended request contract.
3. Capture a concrete request object during the Playwright test by wrapping or
   instrumenting the page namespace without changing the persisted source.
4. Return a prepared fixture value using one direct property lookup or one direct
   parameter-key lookup.
5. Capture the exact returned value during the same test.
6. Record both values in the API contract table.

The API may contain one private fixture variable and the public idempotent fixture
initializer. Use direct `structuredClone` calls; do not add private helpers or
simulate latency.

Reject an API containing DOM or browser-state tokens including `document`,
`querySelector`, `addEventListener`, `dispatchEvent`, `classList`, `innerHTML`,
`textContent`, `location`, `history`, `localStorage`, `sessionStorage`,
`setTimeout`, or `setInterval`.

Reject logic that performs permissions, validation, sorting, filtering, joins,
aggregation, computed records, state machines, mutations, ID/time generation,
audit history, or persistence. A direct fixture lookup selected by one request key
is permitted.

## Fixture contract

Store final screen-level response values, already shaped for the HTML consumer.
Include the minimum number of prepared values needed for source-supported paths.

Reject:

- values the HTML never reads from an API result;
- request examples or request echoes;
- DOM selectors, classes, IDs, labels, validation copy, or presentation metadata;
- normalized entities used only to reconstruct a response;
- complete schema objects copied without a visible need;
- relationships, histories, audit trails, delay values, or scenario engines; and
- static page content duplicated from HTML.

The API may fetch only this sibling fixture. The HTML must not fetch it directly.

## Browser comparison

Serve the project from its root through HTTP. Use the same Playwright package,
browser engine, viewport, interaction sequence, reduced-motion setting, and
screenshot settings for each source/output pair.

Test at 1280x800 and 1440x1000. For each state:

1. Open fresh source and output contexts to prevent shared browser state.
2. Wait for fonts, local resources, and the source-defined stable state; do not add
   arbitrary delay inside the mock API.
3. Exercise the same actions with semantic locators where possible.
4. Capture full-page or appropriately clipped screenshots.
5. Visually inspect both images at readable resolution. Pixel comparison may
   supplement but never replace inspection.
6. Compare visible text, visibility, element values, URL, active element,
   accessibility roles/names, checked/selected/pressed/disabled/busy state, and
   live-region output.
7. Record console errors, page errors, unhandled rejections, failed requests, and
   every network request.

Allow only the local page, shared local assets, sibling API script, and sibling
fixture requests. Fail on an external or unexplained request, missing resource,
JavaScript error, or rejected promise.

Confirm the API namespace is called for every backend-shaped operation. Capture
requests and responses at the namespace boundary. Reload and repeat actions to
prove reset and repeated-action parity.

## Approval rules

Return `APPROVED` only if:

- source hash matches inventory;
- only the assigned output triple changed;
- copied HTML remains recognizably source-derived and visually identical;
- every documented state and transition passes at both viewports;
- request and response payloads are captured for every backend operation/path;
- accessibility-observable behavior, focus, navigation, console, and network pass;
- the API reads only its sibling fixture and contains no forbidden responsibility;
- JSON contains only consumed prepared return values;
- API and JSON are each at most 200 physical lines;
- every public API function is at most 12 physical lines; and
- state and transition coverage both equal 100%.

Correct owned output defects directly and rerun everything. Return `BLOCKED` with
specific state IDs, transitions, logs, diffs, or contract evidence only when the
page cannot be faithfully completed within the contract.
