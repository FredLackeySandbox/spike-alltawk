---
name: create-v0-mockup
description: Convert approved static desktop HTML mockups into path-mirrored, visually faithful v0 pages backed by tiny deterministic mock API JavaScript files and JSON response fixtures. Use when Codex must process every HTML page under a desktop mockup tree, preserve the source pages unchanged, derive backend-shaped calls from documented page behavior and browser interaction, repair unambiguous source runtime defects only in owned output HTML, and independently verify the result with Playwright.
---

# Create v0 Mockup

Convert each approved desktop page into one copied HTML page, one thin mock API
client, and one compact response fixture. Keep the source tree immutable. Process
pages one at a time with an implementation agent followed by an independent
verification agent.

## Resolve the project contract

Resolve paths from the project root, normally the Git worktree root. Use these
defaults unless the user explicitly supplies equivalent paths:

- Source root: `docs/mockup/desktop`
- Output root: `docs/mockup/desktop-v0`
- Page catalog: `docs/concepts/APP_PAGES.md`

Treat names beneath those roots as unknown project data. Never assume area names,
page names, selectors, payloads, domain entities, or application copy from a prior
project.

Mirror each source-relative HTML path directly beneath the output root. For
`{relative/dir}/{page}.html`, create exactly these page-owned files:

- `{output-root}/{relative/dir}/{page}.html`
- `{output-root}/{relative/dir}/{page}-api.js`
- `{output-root}/{relative/dir}/{page}-data.json`

Shared assets remain in the source tree and are reused read-only. Do not create
other implementation files.

## Pass the Playwright gate

Do this before reading any source HTML or assigning a page. Create a unique OS
temporary directory, then run:

```bash
node <skill-dir>/scripts/find-playwright.js \
  --project-root <project-root> \
  --probe \
  --probe-output <temporary-directory>/playwright-probe.png
```

The script locates a project-local or globally installed Playwright package,
verifies an installed browser executable, launches it, renders content, and takes
a screenshot. Open the probe image with the environment's image-viewing capability
and confirm that `visual-probe-ready` is visibly rendered. Stop with `BLOCKED` if
the probe fails or the agent cannot visually open the screenshot. Delete the exact
temporary probe file and its empty temporary directory after inspection. Do not
substitute static HTML inspection, another browser tool, or nonvisual tests.

For project-specific browser scenarios, create scripts only in an OS temporary
directory. Start by copying
[playwright-scenario.template.js](assets/playwright-scenario.template.js) into that
directory, replace its placeholders with assigned-page behavior, and execute it
with:

```bash
node <skill-dir>/scripts/run-playwright.js \
  --project-root <project-root> \
  --scenario <temporary-scenario.js>
```

Serve both trees from the project root with the bundled dependency-free server:

```bash
node <skill-dir>/scripts/serve-project.js --root <project-root> --port 0
```

Read its `READY` URL and use that exact origin in the temporary scenario. Stop the
server when the page agent finishes.

Never leave browser scripts, screenshots, reports, or runtime data in the project.
Open every source/output state screenshot with the environment's image-viewing
capability before deleting the temporary scenario directory. If screenshot capture
works but visual inspection is unavailable, return `BLOCKED`.

## Inventory without analyzing

The primary agent is an orchestrator only. It must not read page contents,
implement files, edit files, run page interactions, or approve work.

Run the inventory script, which inventories filenames and computes hashes for all
project files except `.git`, `node_modules`, and the separately inventoried output
tree. Symlinks are hashed with their referenced content:

```bash
node <skill-dir>/scripts/inventory-pages.js \
  --project-root <project-root> \
  --source-root docs/mockup/desktop \
  --output-root docs/mockup/desktop-v0 \
  --page-catalog docs/concepts/APP_PAGES.md
```

Freeze the sorted inventory. Every discovered page must receive exactly one
implementation agent and one verification agent. Do not add pages later without
rerunning the complete inventory.

Read [agent-workflow.md](references/agent-workflow.md) and
[verification-contract.md](references/verification-contract.md) completely before
assigning work. Use their prompt contracts and report schemas.

## Process exactly one page at a time

Never run page workstreams in parallel. For each frozen inventory entry:

1. Freeze the current `outputFiles` manifest for this page assignment.
2. Start one Page Implementation Agent. Give it only the project root, skill
   directory, assigned inventory entry, page-catalog path, and page-owned output
   paths. Forbid it from reading or changing another page's outputs and from
   spawning agents.
3. Wait for implementation and its complete handoff.
4. Start one new Page Verification Agent with the same page scope and the raw
   implementation handoff. It must independently rediscover page behavior,
   interact with source and output through Playwright, directly fix defects, and
   rerun all checks. It must not send work back to the implementer or spawn agents.
5. Rerun the inventory. Compare its complete `protectedFiles` path/kind/hash list
   to the frozen run-level list. Compare its `outputFiles` list to the page-start
   list after excluding only the assigned output triple from both lists. Stop if
   any other path was added, removed, retargeted, or changed.
6. Accept only `APPROVED` with 100% documented state and transition coverage,
   complete request/response contract capture, passing static validation, and
   visual and behavioral parity at both viewports.
7. If the verifier returns `BLOCKED`, stop the entire run and report its evidence.
   Do not begin the next page.
8. Begin the next page only after approval.

The two page agents may change only their assigned output HTML, API JavaScript,
and data JSON. The source HTML, shared assets, concept documents, schemas, and all
other page outputs are read-only.

## Enforce the implementation order

The implementation agent must follow this order:

1. Create the target parent directory.
2. Copy the source HTML byte-for-byte with a filesystem copy operation.
3. Only now read the entire copied/source page, every directly referenced local CSS
   and JavaScript file, and the assigned page's entry in the page catalog. Stop if
   the page has no unambiguous catalog entry.
4. Serve the project over HTTP and use Playwright on the source page to discover
   every visible and semantic interaction state before retrofitting anything.
5. Build the required state matrix in the handoff, not in a project file.
6. Identify any unambiguous source runtime defect that prevents the source markup
   or page catalog's explicit postcondition from rendering. Record its browser
   evidence and the smallest output-only compatibility correction.
7. Decide which interactions would contact a real backend. Keep all other
   interactions entirely in HTML.
8. Create sibling API and data files from
   [page-api.template.js](assets/page-api.template.js) and
   [page-data.template.json](assets/page-data.template.json). Replace every
   placeholder. Treat the data template as a pattern catalog: keep, rename, and
   reshape only the keyed-load, create, update, delete, or fixed-action sections
   the discovered page needs; delete every unused section, outcome, record, and
   field. Add a matching API function only for each retained backend operation.
9. Retrofit one backend-shaped operation at a time. Keep browser behavior in HTML,
   place only prepared response values in JSON, and add one minimal API function.
10. Record the concrete arguments passed by the HTML and the exact returned
   fixture value for success, failure, empty, denied, and recovery paths that the
   source supports.
11. Retest the affected states and transitions before continuing.
12. Run the full source/output comparison and static validator.

Adjust only local relative links required by the mirrored location. Link to the
matching v0 page when it exists; otherwise preserve the source target. Do not
redesign, reorganize, or replace the copied page.

## Correct source runtime defects in the output

Keep every approved source file immutable. Do not stop merely because Playwright
proves that a source implementation detail prevents an otherwise unambiguous
documented or native HTML behavior. Correct that defect only in the assigned
output HTML when all of these are true:

- the page catalog and source markup or JavaScript agree on the intended result;
- Playwright provides computed-style, DOM-state, console, or equivalent runtime
  evidence for the exact source failure;
- the correction fits entirely in the assigned output HTML; and
- the correction preserves the page's approved design and unrelated behavior.

Use the smallest semantics-preserving compatibility correction. For example, if
an element has `hidden === true` but an author `display` rule makes it visible,
add this output-only block to the copied HTML:

```html
<style data-v0-compatibility>
  [hidden] { display: none !important; }
</style>
```

Never add a compatibility correction to the source, a shared asset, the API file,
or the fixture. Do not use this exception to invent missing behavior or redesign a
state. Return `BLOCKED` only when the intended result is ambiguous, the correction
requires a protected file, or it would alter approved presentation beyond the
defective state.

For corrected states, compare source and output through the last functioning
precondition. Then verify the output postcondition against the catalog, the
source's expressed DOM/JavaScript intent, and the rest of the approved visual
design. Record the source failure and compatibility correction in the handoff.
Do not require the output to reproduce the proven source defect.

## Preserve strict ownership

The copied HTML owns DOM access and updates, rendering, event listeners, keyboard
behavior, focus, validation, menus, dialogs, loading and error presentation,
timers, navigation, UI state, orchestration, and all business decisions.

The API file may only:

- fetch its sibling `{page}-data.json` once in an idempotent named initializer;
- retain the parsed fixture in one script-scoped variable;
- expose semantic arguments by destructuring them in the function signature or by
  declaring each as a specific positional parameter;
- select an already prepared response by direct property or parameter-key lookup;
- return a defensive copy; and
- declare directly callable named functions at script scope.

Never accept an opaque `request`, `options`, `params`, `parameters`, `args`,
`payload`, or `input` object and then read properties from it. Never accept or read
`fixtureKey`. Use `function updateThing({ thingId, values })` or
`function updateThing(thingId, values)`, never `function updateThing(request)`.

Place a JSDoc block immediately above every named function. Describe what a real
backend would do, document every positional parameter with `@param`, or document
every destructured property with a named `@param`, and document the returned value
with `@returns`. Do not rely on a generic object-level description. The direct
lookup in the return statement identifies the response fixture key. Each named API
function normally has one lookup and one return.

For destructuring, document the properties rather than an opaque request:

```js
/**
 * A real backend would validate and save the change.
 * @param {string} thingId - Thing to update.
 * @param {object} values - Replacement values.
 * @returns {Promise<object>} Prepared update result.
 */
async function updateThing({ thingId, values }) {
  return structuredClone(data.updateThing[thingId]);
}
```

The API must never create or reference a namespace or access `window`,
`globalThis`, the DOM, events, focus, URL, navigation, storage, timers, remote
services, validation, permissions, sorting, filtering, joins, aggregation, record
construction, workflow state, persistence simulation, generated IDs or
timestamps, repositories, services, stores, or helper layers. It may fetch only
its sibling data JSON.

The JSON file owns only final deterministic values returned by API functions.
Include only fields read from API results. Do not store UI state, selectors,
classes, labels, presentation instructions, request examples, scenario engines,
normalized domain records, schema mirrors, relationships, history, audit data, or
unused fields. Capture concrete request examples in the handoff contract table,
not in the fixture.

When ownership is unclear, keep the logic in HTML. The API is intentionally
boring.

## Validate every page

Run:

```bash
node <skill-dir>/scripts/validate-page.js \
  --source <absolute-source-html> \
  --source-sha256 <inventory-hash> \
  --html <absolute-output-html> \
  --api <absolute-output-api> \
  --data <absolute-output-data>
```

The API and JSON must each be at most 200 physical lines. Each public API function
must be at most 12 physical lines including its backend comment. Do not minify to
meet limits.

Static checks do not replace Playwright. Both page agents must independently use
Playwright to exercise every source-defined state, catalog-required transition,
repeated action, query/hash/fixture variant, keyboard path, validation path,
recovery path, and navigation at 1280x800 and 1440x1000. Capture source and output
screenshots for each distinct state and visually inspect paired images. Also
compare visible text, visibility, values, URL, focus, roles/names,
checked/selected/pressed/disabled state, and live-region output.

Approval requires 100% state and transition coverage, not sampling or an
initial-view comparison. For a proven source runtime defect, approval requires a
verified output-only correction and explicit exception evidence rather than
defect-for-defect parity.

## Finish

After every page is approved, verify that the frozen inventory maps one-to-one to
complete output triples and that every protected-file hash still matches. Report:

- page count discovered and approved;
- source and three output paths per page;
- API functions, request examples, response fixture keys, and response examples
  per operation;
- API and JSON line counts;
- state, transition, and covered-state counts per page;
- visual, behavior, accessibility, console, network, and static checks completed;
- confirmation that UI logic remains in HTML and every API reads only its sibling
  JSON; and
- source-contract limitations and output-only compatibility corrections.

Complete only when every page is `APPROVED` and all sources remain unchanged.
