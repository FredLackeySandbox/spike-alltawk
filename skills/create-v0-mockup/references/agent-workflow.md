# Agent workflow

## Contents

- Orchestrator rules
- Implementation-agent prompt
- Verification-agent prompt
- Handoff schema

## Orchestrator rules

The orchestrator may inventory paths and hashes, assign one page at a time, relay
raw handoffs, enforce scope, and summarize final results. It must not inspect page
contents, edit implementation files, execute page interactions, resolve a page
agent's design decisions, or approve its own work.

Use exactly two agents for each page. Finish the implementation agent before
starting the verification agent. Finish and approve both before assigning another
page. Agents must not spawn subagents.

## Implementation-agent prompt

Substitute every bracketed value. Do not add product-specific hints.

```text
Act as the Page Implementation Agent for exactly one v0 mockup page.

Read and follow the create-v0-mockup skill at [SKILL_DIR]/SKILL.md, including its
verification contract. Project root: [PROJECT_ROOT]. Assigned inventory entry:
[INVENTORY_ENTRY_JSON]. Page catalog: [PAGE_CATALOG]. You own only these output
files: [OUTPUT_HTML], [OUTPUT_API], [OUTPUT_DATA]. Do not inspect or change another
page's outputs. Do not modify the source page, shared assets, concepts, schemas, or
other files. Do not spawn agents.

Follow the required copy-before-analysis sequence. Use the skill's Playwright
locator and runner. Interact with the source through Playwright before designing
API calls. Create the complete interaction-state matrix, capture each actual
request object and returned fixture value, retrofit the copied page, and compare
source/output at both required viewports. Fix and retest until all checks pass.

Return the required raw handoff. Do not claim approval; independent verification
follows.
```

## Verification-agent prompt

Substitute every bracketed value and append the raw implementation handoff without
editing it.

```text
Act as the independent Page Verification Agent for exactly one v0 mockup page.

Read and follow the create-v0-mockup skill at [SKILL_DIR]/SKILL.md, including its
verification contract. Project root: [PROJECT_ROOT]. Assigned inventory entry:
[INVENTORY_ENTRY_JSON]. Page catalog: [PAGE_CATALOG]. You own only these output
files: [OUTPUT_HTML], [OUTPUT_API], [OUTPUT_DATA]. The source and all other files
are read-only. Do not inspect or change another page's outputs. Do not spawn agents.

Independently read the complete assigned source, directly referenced local assets,
and matching catalog entry. Independently rediscover the state matrix with
Playwright; do not treat the implementer's matrix as ground truth. Exercise the
source and output at both required viewports and visually inspect paired
screenshots for every state. Inspect separation, request objects, fixture returns,
console/network behavior, line limits, source hash, and output scope.

Directly correct defects in the three owned output files, then rerun the complete
verification. Delete or simplify excess API/fixture code. Never send corrections
back to the implementer.

Return APPROVED only with 100% state and transition coverage and every required
check passing. Otherwise return BLOCKED with exact evidence.

Raw implementation handoff follows:
[IMPLEMENTATION_HANDOFF]
```

## Handoff schema

Both agents must return all sections below. Never save the handoff as a project
file.

```markdown
STATUS: IMPLEMENTED | APPROVED | BLOCKED

Paths
- Source:
- Output HTML:
- Output API:
- Output data:
- Source SHA-256 expected/actual:

Page contract
- Catalog title/purpose:
- Required behaviors:
- Source-contract limitations:

API contract
| Operation | Namespace.function | Trigger | Concrete request object | Response fixture key | Concrete returned value | Paths tested |
| --- | --- | --- | --- | --- | --- | --- |

Interaction-state matrix
| State ID | Entry action or URL | Source evidence | Expected visible/accessibility result | Exit or recovery | Source 1280 tested | Output 1280 tested | Source 1440 tested | Output 1440 tested | Both screenshot pairs inspected |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

Transitions
| From | Action | To | Source result | Output result | Tested at both viewports |
| --- | --- | --- | --- | --- | --- |

Coverage
- Discovered states:
- Covered source states:
- Covered output states:
- Covered source/output states at 1280x800:
- Covered source/output states at 1440x1000:
- Discovered transitions:
- Covered transitions:
- State coverage percentage:
- Transition coverage percentage:

Checks
- Visual parity:
- Visible/semantic parity:
- Keyboard and focus parity:
- Validation/recovery/repeated-action parity:
- URL/query/hash/fixture variants:
- API interception/request capture:
- Response fixture capture:
- Reload reset:
- Console/unhandled rejection errors:
- Unexpected/external network requests:
- Static validator:
- API/JSON physical line counts:
- Protected-file manifest unchanged:
- Nonassigned output manifest unchanged:
```
