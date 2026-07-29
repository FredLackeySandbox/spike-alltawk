# Governance ROUTES-PLAN Exporter Handoff

## OpenAPI-to-ROUTES-PLAN Coverage Matrix

| Reviewed OpenAPI operation | ROUTES-PLAN operationId | Projection result |
| --- | --- | --- |
| `GET /api/v0/governance/retrieve-conversation-governance` | `governance.retrieve-conversation-governance` | Exported |
| `POST /api/v0/governance/promote-participant-role` | `governance.promote-participant-role` | Exported |
| `DELETE /api/v0/governance/remove-participant` | `governance.remove-participant` | Exported |
| `POST /api/v0/governance/ban-identity` | `governance.ban-identity` | Exported |
| `POST /api/v0/governance/restore-banned-participant` | `governance.restore-banned-participant` | Exported |
| `POST /api/v0/governance/create-posting-suspension` | `governance.create-posting-suspension` | Exported |
| `PATCH /api/v0/governance/update-posting-suspension` | `governance.update-posting-suspension` | Exported |
| `DELETE /api/v0/governance/end-posting-suspension` | `governance.end-posting-suspension` | Exported |
| `PATCH /api/v0/governance/update-conversation-tags` | `governance.update-conversation-tags` | Exported |
| `POST /api/v0/governance/archive-conversation` | `governance.archive-conversation` | Exported |

All 10 reviewed OpenAPI operations were projected one-to-one by the bundled deterministic exporter. Route content was not manually interpreted or serialized.

## Source and Output Paths

- Reviewed OpenAPI source: `docs/mockup/routes/governance-routes.yaml`
- Deterministic ROUTES-PLAN output: `docs/mockup/routes/governance-routes.json`
- Phase 2 prerequisite handoff: `ai-docs/create-route-docs/governance/02-openapi-spec-reviewer.md`
- Phase 3 handoff: `ai-docs/create-route-docs/governance/03-routes-plan-exporter.md`

## Package Resolution

The exporter resolved `openApiSchema.package` to `atk-ux-api-contract` from the available UX contract package configuration. No package name was invented or supplied manually.

## Operation Counts

- Reviewed OpenAPI operations: 10
- Exported ROUTES-PLAN routes: 10
- Coverage: 10 of 10 operations

## Validator Result

- `export-routes-plan.mjs`: exit code `0`, `ok: true`, package `atk-ux-api-contract`, route count `10`, output `docs/mockup/routes/governance-routes.json`.
- `validate-routes-plan.mjs`: exit code `0`, `ok: true`, package `atk-ux-api-contract`, route count `10`, blockers `[]`.

## Changed Files Confirmation

Only `docs/mockup/routes/governance-routes.json` and this Phase 3 handoff were changed in Phase 3. The finalized Markdown route contract, paired route-review evidence, reviewed OpenAPI YAML, package plan, and earlier handoffs were not modified.
