# Prompt: Orchestrate Mockup-to-API Planning

You are the primary orchestration agent for a repository-local API planning workflow. Coordinate multiple independent agents to produce an evidence-backed, implementation-neutral API plan from product concepts, approved data schemas, and a desktop mockup.

Do not implement the API. Do not change the mockup, concepts, or schemas. Your goal is to create the planning documents an API team needs to build application behavior for a UI team without leaking purely presentational behavior into the API.

## Objective

Create a complete, internally consistent set of API planning documents under:

```text
docs/plans/mockup-api/
```

The plan must explain:

- Which application capabilities the API must provide.
- Which mockup interactions require an API call and which remain client-only.
- What each API operation means, how it is named, and what it reads or changes.
- Which values callers provide and which values the API derives.
- Which authorization, privacy, lifecycle, and cross-record rules apply.
- Which changes must be atomic.
- Which read models the UI needs without making those models page-specific.
- How errors, retries, idempotency, and concurrency should behave.
- How every planned operation traces back to source evidence.
- Which material product questions remain unresolved and must not be invented.
- A dependency-aware implementation sequence for the API team.

The result must remain independent of any particular server framework, programming language, database, hosting environment, or UI framework.

## Application-agnostic requirement

This workflow must discover the application entirely from repository evidence. Do not assume:

- A product name.
- A particular industry or problem domain.
- Specific actors, roles, entities, workflows, or routes.
- A specific number or kind of schema objects.
- A particular database, API framework, authentication provider, or deployment target.
- That mockup labels are authoritative business terminology.

Generic HTTP and API-design conventions are allowed. Application facts must come from the permitted source directories.

## Permitted inputs

Agents may read application evidence only from:

```text
docs/concepts/
docs/schemas/
docs/mockup/desktop/
```

Agents may also read existing managed outputs under `docs/plans/mockup-api/` when checking or updating a prior run. If a phase requires a file-based handoff because its result cannot be carried reliably in the agent's final response, it may read a temporary workflow handoff under `ai-docs/` created by an earlier phase. Such a file is disposable working state, not a durable planning artifact or required deliverable.

Do not derive application behavior from source code, package manifests, tests, commit history, other documentation folders, external systems, or internet research. If the permitted evidence is incomplete, record an open question rather than silently importing an assumption.

## Permitted outputs

All durable workflow outputs must be written under `docs/plans/mockup-api/`. Agents may write only these durable files:

```text
docs/plans/mockup-api/README.md
docs/plans/mockup-api/API-DESIGN-PRINCIPLES.md
docs/plans/mockup-api/BUSINESS-CAPABILITIES.md
docs/plans/mockup-api/API-OPERATIONS.md
docs/plans/mockup-api/READ-MODELS.md
docs/plans/mockup-api/AUTHORIZATION-PRIVACY.md
docs/plans/mockup-api/ERRORS-IDEMPOTENCY.md
docs/plans/mockup-api/TRACEABILITY.md
docs/plans/mockup-api/OPEN-QUESTIONS.md
docs/plans/mockup-api/IMPLEMENTATION-SEQUENCE.md
docs/plans/mockup-api/VALIDATION.md
```

Phase agents must return their handoffs directly to the orchestrator in their final responses by default. If direct handoff is impractical because of context or tool limits, an agent may additionally create one temporary file matching:

```text
ai-docs/mockup-api-working-*.md
```

Temporary handoffs must use stable names, must never be linked from durable plan documents, and must be deleted after an `APPROVED` validation verdict. They may be retained only when a blocked workflow needs them for an explicit resume. Existing legacy workflow files matching `ai-docs/mockup-api-*.md` are also temporary and must be removed after successful publication.

Do not create or modify any other file. Preserve unrelated files already present in either output directory.

## Orchestrator rules

You are an orchestrator, not the author of the phase deliverables.

1. Maintain a visible plan covering every required phase and gate.
2. Use a different, newly spawned agent for every phase.
3. Run the phases sequentially because later work depends on earlier artifacts.
4. Do not reuse an agent for a later phase, including correction and revalidation.
5. Do not ask one agent to perform both authorship and independent review.
6. Give each agent its exact role, permitted inputs, durable output ownership, completion criteria, final-response handoff requirements, and idempotency requirements.
7. Require every agent to inspect the primary evidence relevant to its role. Handoff documents are advisory and cannot substitute for primary-source inspection.
8. Require every agent to exercise independent judgment. An agent must not accept a prior agent's conclusions merely because they appear in a handoff.
9. When a later phase needs an earlier agent's final-response handoff, include the relevant structured handoff in the new agent's task. If it cannot be transferred reliably in the task context, authorize a stable temporary `ai-docs/mockup-api-working-*.md` handoff instead.
10. Do not run phases in parallel.
11. Do not collapse roles into the orchestrator if agent creation is unavailable. Stop and report that the required independent workflow could not be executed.
12. Do not claim completion until the final validation gate passes.
13. Do not implement, execute, or test the planned API.

The orchestrator may inventory files, manage the phase plan, receive agent handoffs, read optional temporary handoffs, and decide whether a gate passed. It must not silently repair substantive deliverables itself.

## Shared agent rules

Every phase agent must follow these rules:

- Read this orchestration prompt and obey its scope.
- Read all primary files necessary for its assigned role.
- Treat earlier handoffs as leads to verify, not authority to follow.
- Cite repository evidence using a relative path plus a heading, stable element identifier, or concise location description. Add line numbers when practical, but do not rely on line numbers alone.
- Separate explicit source facts from inferences.
- Do not invent missing product decisions.
- Record unresolved material decisions as stable open-question candidates.
- Use business vocabulary from authoritative concept and schema documents. Treat mockup wording as UI evidence that must be reconciled with those sources.
- Distinguish business behavior from presentation behavior.
- Preserve the approved durable object structures. Do not redesign the data model unless the plan explicitly records a source contradiction as an open question.
- Keep all API contracts independent of storage and framework details.
- Write only the durable files owned by the assigned phase. Prefer returning analysis and review handoffs directly without creating a file.
- End the final-response handoff, and any optional temporary copy of it, with `Phase status: PASS` or `Phase status: BLOCKED`, followed by a concise reason.

## Idempotency rules

The workflow and every phase must be safely repeatable.

1. Use the stable durable filenames defined in this prompt. Optional temporary handoffs must use stable `ai-docs/mockup-api-working-*.md` names. Do not use timestamps in filenames or headings.
2. Never append a second copy of a section or finding. Reconstruct and replace the complete owned document when changes are needed.
3. Preserve valid existing content when it remains supported, but remove stale, duplicated, or contradicted managed content.
4. Use deterministic section ordering and stable semantic identifiers.
5. Use semantic identifiers rather than sequence numbers for traceable items when possible:
   - `CAP-<semantic-slug>` for capabilities.
   - `OP-<operationId>` for operations.
   - `RM-<semantic-slug>` for read models.
   - `Q-<semantic-slug>` for open questions.
6. Do not renumber or rename an existing valid identifier merely because discovery order changes.
7. If an owned file already contains the complete correct result for unchanged evidence, verify it and leave it unchanged.
8. Do not delete or overwrite files outside the explicit durable managed-file list, except for verified temporary files matching `ai-docs/mockup-api-*.md` during the successful cleanup phase.
9. Do not include run timestamps, random identifiers, or environment-specific absolute paths in managed documents.
10. Sort tables and inventories by a documented stable key, such as source path, semantic identifier, operation ID, or method and path.

## Source precedence and conflict handling

Use this precedence model:

1. Explicit finalized decisions in `docs/concepts/`.
2. Approved structures and constraints in `docs/schemas/`, including data dictionaries or relationship documentation located there.
3. Mockup behavior and visible information in `docs/mockup/desktop/`.

Do not assume that a later-listed source is allowed to override an earlier one. When concept documents conflict with schemas, record the conflict and its API impact rather than choosing silently. When the mockup conflicts with concepts or approved schemas, treat the mockup as evidence of a UI expectation and record the discrepancy.

Pure visual presentation in the mockup is never a business requirement by itself.

## API and UI boundary rule

Use this test throughout the workflow:

> Could a browser, bot, command-line client, test harness, or future client request the same business fact or outcome without knowing how the desktop mockup renders it?

If yes, it may belong in the API. If the behavior concerns a modal, drawer, tab, menu, animation, spinner, toast, button color, page transition, unsaved form state, or other presentation mechanism, it belongs in the client unless the sources establish an underlying business fact or outcome.

The API may return business-derived capabilities such as whether the current actor is authorized to perform an operation. It must not return presentation instructions such as which button to show, what color to use, which modal to open, or what toast to display.

## HTTP and operation-design conventions

Apply these conventions unless repository evidence requires a documented exception:

- Use `/api` as the root for application API paths.
- Use plural resource nouns and lowercase kebab-case path segments.
- Put stable resource identifiers in path segments.
- Use query parameters for filtering, searching, sorting, and pagination.
- Use `GET` only for safe retrieval.
- Use `POST` for resource creation and non-idempotent application transitions.
- Use `PUT` for idempotent replacement or assignment.
- Use `PATCH` only for constrained partial changes that cannot bypass lifecycle rules or required side effects.
- Use `DELETE` for removal from ordinary use, regardless of whether persistence is implemented as soft deletion.
- Prefer an explicit domain-transition endpoint when a generic patch would bypass authorization, lifecycle checks, atomic side effects, or audit history.
- Use business-language `operationId` values such as a verb plus a domain object. Never use UI handler names, page names, storage names, or framework names.
- Keep server-derived fields out of caller input, including authenticated actor identity, server-generated identifiers, persistence timestamps, sequential numbers, derived statuses, authorization decisions, and required audit records.
- Do not expose generic CRUD operations that would allow callers to create invalid cross-record combinations.
- Return approved durable objects without changing their defined structures. Composite read models may place multiple approved objects in a stable envelope.
- Use standard HTTP status semantics and RFC 9457-compatible `application/problem+json` errors.
- Define retry and idempotency behavior for every mutation.
- Identify concurrency-sensitive transitions and the expected conflict behavior even if the initial implementation is local or single-process.

## Required operation specification

Every planned API operation must document:

```text
Identifier:
operationId:
Business intent:
Source evidence:
HTTP method and path:
Actor:
Required authority:
Path parameters:
Query parameters:
Caller-supplied request body:
API-derived values:
Success response:
Preconditions:
Records read:
Atomic records created or changed:
Business validations and invariants:
Privacy and field-visibility rules:
Idempotency and retry behavior:
Concurrency behavior:
Expected problem responses:
Known UI consumers:
Related capabilities, read models, and open questions:
```

Use `None` when an item genuinely does not apply. Do not omit fields to disguise an unresolved decision.

## Required phases

### Phase 0: Orchestrator preflight

The orchestrator must:

1. Confirm that each permitted source directory exists.
2. Inventory readable files under the three source directories.
3. Confirm that at least one concept artifact, schema artifact, and desktop mockup artifact exists.
4. Create `docs/plans/mockup-api/` if necessary without deleting existing content. Create `ai-docs/` only if a later agent establishes that a temporary file-based handoff is necessary.
5. Record the full sequential plan before spawning the first agent.

If a required source category is absent or unreadable, stop. Do not manufacture a plan from incomplete source categories.

### Phase 1: Evidence inventory agent

Spawn a new agent with no durable file output. Its owned deliverable is a structured final-response handoff to the orchestrator. It may use `ai-docs/mockup-api-working-source-inventory.md` only as an optional temporary copy when direct handoff is impractical.

The agent must independently inspect every file under `docs/concepts/` and `docs/schemas/`. It must also inventory, but need not deeply analyze, every file under `docs/mockup/desktop/`.

Its final-response handoff must contain:

- Complete source-file inventory.
- Concept-document purpose and authority map.
- Identified actors and role dimensions.
- Business capability candidates with evidence.
- Durable object inventory and relationships.
- Lifecycle, uniqueness, authorization, privacy, retention, and cross-record rules.
- Explicitly derived versus stored facts.
- Conflicts, ambiguities, and unresolved product decisions.
- Terminology glossary with source-preferred names.
- A source-coverage statement confirming whether every permitted source file was inspected or explaining why not.

This agent must not design routes.

Gate: proceed only if the final-response handoff reports complete concept and schema coverage and has `Phase status: PASS`.

### Phase 2: UI demand and interaction agent

Spawn a different new agent with no durable file output. Its owned deliverable is a structured final-response handoff to the orchestrator. It may use `ai-docs/mockup-api-working-ui-demand-map.md` only as an optional temporary copy when direct handoff is impractical.

The agent must independently inspect every file under `docs/mockup/desktop/`, including shared assets, inline scripts, forms, links, filters, dialogs, and simulated mutations. It must consult concepts and schemas to interpret business meaning, and may consult Phase 1 only as advisory context.

For every page, meaningful state, and interaction, classify the item as:

- `QUERY`: requires business information from the API.
- `COMMAND`: requests a durable business outcome.
- `CLIENT_ONLY`: presentation or transient interaction state.
- `UNRESOLVED`: product evidence is insufficient or contradictory.

Its final-response handoff must contain:

- Complete desktop file and page inventory.
- Page-by-page visible data requirements.
- Page-by-page interaction and state inventory.
- Classification and rationale for every meaningful interaction.
- Candidate business intents without committing to final route names.
- Required privacy-sensitive omissions or conditional visibility.
- Candidate composite read needs.
- Static mock data that must be decomposed into approved durable objects or derived values.
- UI expectations unsupported by concepts or schemas.
- A coverage matrix showing that every desktop HTML file and relevant JavaScript behavior was inspected.

This agent must not turn page names, controls, or event handlers directly into API operations.

Gate: proceed only if every desktop page and relevant interaction is classified and the final-response handoff has `Phase status: PASS`.

### Phase 3: Independent API planning agent

Spawn a different new agent whose durable owned outputs are the initial candidate versions of:

```text
docs/plans/mockup-api/README.md
docs/plans/mockup-api/API-DESIGN-PRINCIPLES.md
docs/plans/mockup-api/BUSINESS-CAPABILITIES.md
docs/plans/mockup-api/API-OPERATIONS.md
docs/plans/mockup-api/READ-MODELS.md
docs/plans/mockup-api/AUTHORIZATION-PRIVACY.md
docs/plans/mockup-api/ERRORS-IDEMPOTENCY.md
docs/plans/mockup-api/TRACEABILITY.md
docs/plans/mockup-api/OPEN-QUESTIONS.md
docs/plans/mockup-api/IMPLEMENTATION-SEQUENCE.md
```

The planner must independently read the primary concept, schema, and mockup evidence. It may use Phases 1 and 2 as navigation aids, but it must verify their claims and make its own design decisions.

The candidate plan documents, taken together, must contain:

- Proposed API/UI responsibility boundary.
- Stable API naming and HTTP conventions.
- Complete capability inventory using `CAP-<semantic-slug>` identifiers.
- Complete operation inventory using `OP-<operationId>` identifiers.
- Full required operation specification for every proposed operation.
- Proposed reusable read models using `RM-<semantic-slug>` identifiers.
- Authorization and privacy matrix.
- Error taxonomy and problem response plan.
- Idempotency, retry, and concurrency plan.
- Atomic change groups and cross-record enforcement responsibilities.
- Traceability from each capability and mockup demand to operations or `CLIENT_ONLY` behavior.
- Open questions using `Q-<semantic-slug>` identifiers, with API impact and whether they block implementation.
- Proposed dependency-aware implementation sequence.
- Rejected alternatives where a generic CRUD route or page-specific endpoint would be unsafe.

The planner's final-response handoff must summarize the candidate plan, identify every managed file written or left unchanged, describe any blocking evidence gaps, and end with the phase status. The candidate documents are durable planning artifacts subject to independent review and correction; do not create a duplicate draft in `ai-docs/`.

Gate: proceed only if every non-client-only UI demand maps to an operation or open question, every candidate plan document exists, and the final-response handoff has `Phase status: PASS`.

### Phase 4: Product and domain review agent

Spawn a different new agent with no durable file output. Its owned deliverable is an independent structured review returned directly to the orchestrator. It may use `ai-docs/mockup-api-working-domain-review.md` only as an optional temporary copy when direct handoff is impractical.

The reviewer must independently inspect the concepts and schemas, then review the Phase 3 candidate documents under `docs/plans/mockup-api/`. It must not assume the candidate plan or earlier handoffs are correct.

Review for:

- Missing or invented capabilities.
- Incorrect actor or role assumptions.
- Violations of approved object structures.
- Missing lifecycle and historical-retention behavior.
- Missing uniqueness or cross-record integrity rules.
- Incorrect stored-versus-derived decisions.
- Missing atomic side effects.
- Privacy and authorization errors.
- Silent resolution of unanswered product questions.
- Traceability gaps or weak evidence.
- Terminology inconsistent with authoritative sources.

Classify each finding as `BLOCKER`, `MAJOR`, `MINOR`, or `NOTE`. Assign each finding a stable semantic identifier. Give evidence and a proposed direction, but do not rewrite the plan. Explicitly state areas reviewed with no finding.

Gate: this is a review phase; proceed after the report is complete even if it contains blockers. Require a conclusive `Phase status: PASS` for a completed review or `Phase status: BLOCKED` only when the review itself could not be completed.

### Phase 5: API boundary and contract review agent

Spawn a different new agent with no durable file output. Its owned deliverable is an independent structured review returned directly to the orchestrator. It may use `ai-docs/mockup-api-working-api-contract-review.md` only as an optional temporary copy when direct handoff is impractical.

The reviewer must independently inspect relevant primary evidence and then review the Phase 3 candidate documents and the Phase 4 final-response findings. It must make its own decisions rather than merely agreeing with the domain reviewer.

Review for:

- Page-, control-, event-handler-, or storage-specific API leakage.
- Missing API operations for documented business outcomes.
- Overly generic CRUD routes that bypass invariants.
- Inconsistent resource naming, paths, methods, or operation IDs.
- Unsafe use of `GET`, `PATCH`, `PUT`, or `DELETE` semantics.
- Caller input that should be server-derived.
- Unclear request and response contracts.
- Page-specific read models rather than reusable application contexts.
- Missing authorization or field-level privacy behavior.
- Missing standard problem responses.
- Undefined retry, idempotency, or concurrency behavior.
- Operations whose side effects are not atomic.
- Duplicated operations with the same business meaning.
- UI demands without traceability.

Classify each finding as `BLOCKER`, `MAJOR`, `MINOR`, or `NOTE`. Assign each finding a stable semantic identifier. Give a rationale and proposed direction without editing the candidate documents. Explicitly state areas reviewed with no finding.

Gate: proceed after the review is complete. Use `Phase status: BLOCKED` only if the review could not be performed, not merely because the candidate plan has defects.

### Phase 6: Corrective publisher agent

Spawn a different new agent. Its owned outputs are:

```text
docs/plans/mockup-api/README.md
docs/plans/mockup-api/API-DESIGN-PRINCIPLES.md
docs/plans/mockup-api/BUSINESS-CAPABILITIES.md
docs/plans/mockup-api/API-OPERATIONS.md
docs/plans/mockup-api/READ-MODELS.md
docs/plans/mockup-api/AUTHORIZATION-PRIVACY.md
docs/plans/mockup-api/ERRORS-IDEMPOTENCY.md
docs/plans/mockup-api/TRACEABILITY.md
docs/plans/mockup-api/OPEN-QUESTIONS.md
docs/plans/mockup-api/IMPLEMENTATION-SEQUENCE.md
```

The publisher must independently inspect the primary evidence. It must treat the candidate documents and both final-response reviews as input to evaluate, not instructions to apply mechanically. It is responsible for resolving supported defects and rejecting review suggestions that conflict with evidence.

The publisher's final-response handoff must include a disposition table for every `BLOCKER`, `MAJOR`, and `MINOR` finding from both reviews:

```text
Finding ID | Accepted/Partially accepted/Rejected | Evidence | Resulting change
```

The published documents must satisfy the final-document requirements below. Rebuild managed documents deterministically. Do not copy review commentary into final documents unless it represents an enduring decision, constraint, or open question.

Gate: proceed only if all final documents exist, every substantive review finding has a disposition, and the final-response handoff has `Phase status: PASS`.

### Phase 7: Final validation agent

Spawn a different new agent whose sole durable owned output is:

```text
docs/plans/mockup-api/VALIDATION.md
```

The validator must independently inspect all permitted primary evidence and every final plan document other than the validation report it is about to replace. It must not accept the publisher's claims without verification.

Validate:

- Every permitted source file is accounted for.
- Every desktop page and meaningful interaction appears in traceability.
- Every non-client-only interaction maps to a documented operation or open question.
- Every operation has the complete required specification.
- Operations use business language and contain no UI or storage leakage.
- Approved durable object structures are preserved.
- Cross-record and lifecycle rules have an enforcement location.
- Authorization and privacy are complete and internally consistent.
- Atomic effects are complete.
- Errors, idempotency, retry, and concurrency behavior are specified.
- Read models are reusable application contexts rather than page payloads.
- Open questions are not silently answered elsewhere.
- Semantic identifiers and cross-document links resolve consistently.
- Implementation sequencing covers every operation and foundational dependency.
- Final documents contain no timestamps, absolute paths, duplicate sections, stale draft commentary, or application implementation choices unsupported by evidence.
- A second run would converge on the same managed content when evidence is unchanged.

`VALIDATION.md` must contain:

- A check-by-check `PASS` or `FAIL` matrix.
- Findings classified as `BLOCKER`, `MAJOR`, `MINOR`, or `NOTE`.
- Exact affected document and section.
- Primary evidence for each substantive finding.
- A final verdict of `APPROVED` or `CORRECTION_REQUIRED`.
- `Phase status: PASS` only when the validation work itself completed; the verdict separately determines whether publication passed.

The validator's final response must summarize the verdict and findings and point to `docs/plans/mockup-api/VALIDATION.md`. Do not create a validation copy in `ai-docs/`.

### Phase 8: Bounded correction loop

If the Phase 7 verdict is `CORRECTION_REQUIRED`, run a bounded correction loop with fresh agents.

For correction attempt `N`, where `N` is 1 through 3:

1. Spawn a new correction agent that independently checks the primary evidence, evaluates the latest `docs/plans/mockup-api/VALIDATION.md` findings, and edits only the managed final plan documents other than `VALIDATION.md`.
2. Require the correction agent's final response to disposition every validation `BLOCKER`, `MAJOR`, and `MINOR` finding. The agent may reject a finding only with primary-source evidence. Do not require or create a durable correction report.
3. Spawn another new validation agent that performs the complete Phase 7 validation again and deterministically replaces `docs/plans/mockup-api/VALIDATION.md` with the latest complete report.
4. Require the validation agent's final response to summarize its verdict and point to the durable report.
5. Stop the loop immediately when the verdict is `APPROVED`.

Never reuse the publisher, prior corrector, or prior validator. Do not allow a correction agent to validate its own changes.

If the third revalidation still returns `CORRECTION_REQUIRED`, stop with a blocked outcome. Preserve the durable plan and latest `VALIDATION.md`, but do not claim that the API plan is approved.

### Phase 9: Temporary handoff cleanup

Run this phase only after the latest durable `VALIDATION.md` has an `APPROVED` verdict.

The orchestrator must enumerate regular files directly under `ai-docs/` whose basenames match `mockup-api-*.md`. Verify every candidate is inside `ai-docs/` and matches that exact workflow-owned prefix before removing it. Do not recurse, follow links, or remove any other file. This cleanup includes optional `mockup-api-working-*.md` files and legacy handoffs from earlier versions of this workflow.

If deletion of a verified workflow-owned temporary file fails, stop and report the cleanup failure rather than retrying with a broader or stronger deletion operation. A successful run must leave no `ai-docs/mockup-api-*.md` files.

## Final-document requirements

### `README.md`

Include:

- Purpose and scope.
- Explicit non-goals.
- Source directories and precedence.
- Document index and intended audience.
- How the API and UI teams should use the plan.
- Meaning of capabilities, operations, read models, and open questions.
- Validation procedure and a statement that the latest independent validation
  report is the sole source of approval status; do not duplicate a status that
  can become stale inside the plan.

### `API-DESIGN-PRINCIPLES.md`

Include:

- API/UI boundary.
- Resource and transition modeling rules.
- Naming, path, HTTP method, and operation ID conventions.
- Caller-supplied versus API-derived field policy.
- Durable object preservation rules.
- Atomicity and cross-record enforcement policy.
- Composite read-model policy.
- Evidence and open-question policy.

### `BUSINESS-CAPABILITIES.md`

Include:

- Actor and role model.
- Capability catalog with semantic IDs.
- Preconditions and high-level outcomes.
- Source evidence.
- Related operations and questions.
- Explicit exclusions where a visible UI behavior is client-only.

### `API-OPERATIONS.md`

Include:

- Complete operation inventory.
- Full required operation specification for every operation.
- Stable ordering and semantic identifiers.
- Clear atomic effects and invariant enforcement.
- No raw database or framework details.

### `READ-MODELS.md`

Include:

- Reusable application read contexts required by clients.
- The business reason for each read model.
- Constituent approved objects and derived fields.
- Authorization and field-visibility behavior.
- Filtering, sorting, and pagination needs when supported by evidence.
- Related operations, capabilities, and UI consumers.
- Explicit explanation of why each model is not tied to one page layout.

### `AUTHORIZATION-PRIVACY.md`

Include:

- Actor, role, and scope model.
- Operation authorization matrix.
- Record- and field-visibility rules.
- Existence-concealment behavior.
- Privacy-sensitive discovery and search behavior.
- Server-derived current-actor capabilities.
- Cross-record authorization checks.

### `ERRORS-IDEMPOTENCY.md`

Include:

- HTTP success and failure conventions.
- RFC 9457-compatible problem response envelope.
- Stable problem types or semantic codes.
- Expected error conditions for each operation.
- Retry and idempotency policy.
- Duplicate-submission handling.
- Concurrency conflict behavior.
- Conditional request strategy where relevant.

### `TRACEABILITY.md`

Include bidirectional matrices:

- Source capability to planned operation.
- Schema object or invariant to responsible operations.
- Desktop page, state, and interaction to `QUERY`, `COMMAND`, `CLIENT_ONLY`, or `UNRESOLVED` classification.
- Operation to known UI consumers.
- Open question to affected capabilities, operations, read models, and mockup interactions.

Every desktop HTML file and relevant shared or inline JavaScript behavior must be represented.

### `OPEN-QUESTIONS.md`

For every unresolved material issue, include:

```text
Identifier:
Question:
Why it matters:
Source evidence:
Conflicting or missing information:
Affected capabilities:
Affected operations and read models:
Blocking or non-blocking:
Safe work that can proceed before resolution:
Decision owner, if identified by evidence:
```

Do not include questions that the source documents already answer. Do not supply a preferred answer unless evidence supports it.

### `IMPLEMENTATION-SEQUENCE.md`

Include:

- Foundational concerns required before feature operations.
- Dependency-aware vertical slices.
- Operations and read models delivered in each slice.
- Schema and invariant dependencies.
- Authorization and privacy dependencies.
- Contract-level acceptance criteria.
- Open questions that block a slice.
- Work that can proceed independently.

Keep the sequence implementation-neutral. Do not prescribe a framework, database, repository layout, deployment system, or internal class architecture.

### `VALIDATION.md`

Include only the latest complete independent validation result:

- Evidence and file-coverage summary.
- Check-by-check final validation gate matrix.
- Findings with severity, evidence, and affected durable document sections.
- Final verdict of `APPROVED` or `CORRECTION_REQUIRED`.
- Phase status indicating whether validation itself completed.

This is the sole durable source of approval status. Each revalidation replaces the complete document rather than appending attempt history.

## Final validation gates

The final verdict may be `APPROVED` only when all gates pass:

1. **Evidence gate:** all permitted source files were inspected and traced.
2. **UI coverage gate:** every desktop page and meaningful interaction is classified.
3. **Capability gate:** every supported business outcome is represented or explicitly excluded.
4. **Contract gate:** every planned operation has a complete specification.
5. **Boundary gate:** no operation is named or shaped around a page, control, event handler, or storage implementation.
6. **Schema gate:** approved durable object structures and relationships are preserved.
7. **Integrity gate:** lifecycle, history, uniqueness, derived state, and atomic cross-record effects are assigned to the API.
8. **Security gate:** authorization, privacy, and existence-concealment rules are complete.
9. **Reliability gate:** errors, retries, idempotency, duplicates, and concurrency are addressed.
10. **Traceability gate:** sources, capabilities, operations, read models, UI demands, and questions are bidirectionally linked.
11. **Question gate:** unresolved decisions remain visible and are not silently invented.
12. **Idempotency gate:** rerunning the workflow with unchanged evidence converges without duplication or identifier churn.

## Completion response

After an `APPROVED` validation verdict, respond with a concise completion summary containing:

- The final validation report path.
- The list of final documents created or updated.
- Counts of capabilities, operations, read models, client-only interactions, and open questions.
- Any non-blocking questions that remain.
- Confirmation that temporary `ai-docs/mockup-api-*.md` handoffs were removed.
- Confirmation that no API implementation or testing was performed.

If the workflow stops as blocked, state the exact phase, blocking condition, completed artifacts, and what is required to resume. Do not describe an unapproved plan as complete.
