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

Distinguish missing or ambiguous behavior from a runtime defect. A runtime defect
is output-correctable when the catalog and source markup or JavaScript establish
the same postcondition, but browser evidence proves that a specific implementation
detail prevents it. Preserve the source and apply the smallest correction only to
the assigned output HTML. For example, `hidden === true` plus Playwright-visible
geometry caused by an author `display` declaration justifies an output-only
`[hidden] { display: none !important; }` compatibility rule.

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
2. Pass semantic positional arguments, or pass one object whose semantic fields
   are destructured in the function signature. Never pass an opaque request object.
3. Capture the concrete arguments and payload during the Playwright test by
   temporarily wrapping the named function without changing the persisted source.
4. Return a prepared fixture value using one direct property lookup or one direct
   parameter-key lookup.
5. Capture the exact returned value during the same test.
6. Record both values in the API contract table.

The API may contain one script-scoped fixture variable and the directly callable
idempotent fixture initializer. Use direct `structuredClone` calls; do not add
helpers or simulate latency. Require an immediately preceding JSDoc block on every
function, with `@param` documentation for every argument or destructured property
and `@returns` documentation.

Reject an API containing DOM or browser-state tokens including `document`,
`querySelector`, `addEventListener`, `dispatchEvent`, `classList`, `innerHTML`,
`textContent`, `location`, `history`, `localStorage`, `sessionStorage`,
`setTimeout`, or `setInterval`.

Reject logic that performs permissions, validation, sorting, filtering, joins,
aggregation, computed records, state machines, mutations, ID/time generation,
audit history, or persistence. A direct fixture lookup may use one meaningful
request value such as `contactId` or `addressId`.

Reject generic parameter names such as `request`, `options`, `params`,
`parameters`, `args`, `payload`, or `input`. Reject `fixtureKey` in any form.

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

For a proven output-correctable source defect, compare the pages through the last
functioning precondition. Capture and inspect the defective source state as
evidence. Then verify the output postcondition against the catalog, the source's
expressed DOM/JavaScript intent, and the unaffected approved presentation. Record
the exception and correction in the handoff; do not require the output to
reproduce the source defect.

Allow only the local page, shared local assets, sibling API script, and sibling
fixture requests. Fail on an external or unexplained request, missing resource,
JavaScript error, or rejected promise.

Confirm the corresponding named function is called for every backend-shaped
operation. Capture requests and responses at the function boundary. Reload and
repeat actions to prove reset and repeated-action parity.

## Approval rules

Return `APPROVED` only if:

- source hash matches inventory;
- only the assigned output triple changed;
- copied HTML remains recognizably source-derived;
- every functioning source state remains visually identical, and every corrected
  source-defect state preserves the approved design while meeting its explicit
  postcondition;
- every documented state and transition passes at both viewports;
- request and response payloads are captured for every backend operation/path;
- accessibility-observable behavior, focus, navigation, console, and network pass;
- the API reads only its sibling fixture and contains no forbidden responsibility;
- JSON contains only consumed prepared return values;
- API and JSON are each at most 200 physical lines;
- every public API function is at most 12 physical lines; and
- state and transition coverage both equal 100%.

Correct owned output defects and unambiguous output-correctable source runtime
defects directly, then rerun everything. Return `BLOCKED` with specific state IDs,
transitions, logs, diffs, or contract evidence only when the page cannot be
faithfully completed within the contract.
