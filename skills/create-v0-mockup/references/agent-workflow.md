# Agent workflow

## Contents

- Orchestrator rules
- Implementation-agent prompt
- Verification-agent prompt
- Handoff schema

## Orchestrator rules

The orchestrator may initialize the complete output copy, inventory paths and
hashes, assign one page at a time, relay raw handoffs, enforce scope, and summarize
final results. It must not inspect page contents, edit implementation files,
execute page interactions, resolve a page agent's design decisions, or approve its
own work.

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
page's outputs. The complete output tree has already been recursively copied. Do
not copy the page again. Do not modify the source tree, copied shared assets,
concepts, schemas, or other files. Never create a runtime reference from the
output tree to the source tree. Do not spawn agents.

Begin with the assigned copied output page and its copied local dependencies. Use
the skill's Playwright locator and runner. Serve the source and output roots
independently. Interact with the source through Playwright before designing API
calls. Create the complete interaction-state matrix, capture each function's
concrete arguments and returned fixture value, retrofit the copied page, and
compare source/output at both required viewports. Run both validators, prove the
output page has no dependency outside the output root, and fix and retest until
all checks pass.

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

Independently read the complete assigned source, assigned copied output, their
directly referenced local assets, and the matching catalog entry. Serve the source
and output as independent roots. Independently rediscover the state matrix with
Playwright; do not treat the implementer's matrix as ground truth. Exercise the
source and output at both required viewports and visually inspect paired
screenshots for every state. Inspect separation, concrete function arguments,
fixture returns, console/network behavior, line limits, source hash, output scope,
and standalone output-tree validation. Reject any output dependency on the source
tree.

When runtime evidence proves an unambiguous source defect, preserve the source and
verify or add the smallest correction in the assigned output HTML under the
skill's output-only compatibility rules. Do not demand defect-for-defect parity.

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

Output-only compatibility corrections
| Defective state/transition | Catalog and source-intent evidence | Source runtime evidence | Output HTML correction | Both viewports verified |
| --- | --- | --- | --- | --- |

API contract
| Operation | Function | Trigger | Concrete arguments and payload | Response fixture key | Concrete returned value | Paths tested |
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
- Recursive output initialization:
- Visual parity:
- Approved-design fidelity for corrected source defects:
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
- Standalone-tree validator:
- Output served from isolated root:
- Output-to-source runtime references:
- API/JSON physical line counts:
- Protected-file manifest unchanged:
- Nonassigned output manifest unchanged:
```
