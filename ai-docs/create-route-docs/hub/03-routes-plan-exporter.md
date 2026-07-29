# Hub ROUTES-PLAN Exporter Handoff

## OpenAPI-to-ROUTES-PLAN Coverage Matrix

| OpenAPI method and path | ROUTES-PLAN operation ID | Projected inputs | Result |
| --- | --- | ---: | --- |
| `POST /api/v0/hub/create-conversation` | `hub.create-conversation` | 3 | Exported |
| `GET /api/v0/hub/retrieve-listed-tag-suggestions` | `hub.retrieve-listed-tag-suggestions` | 2 | Exported |
| `GET /api/v0/hub/search-listed-conversations` | `hub.search-listed-conversations` | 1 | Exported |
| `POST /api/v0/hub/join-listed-conversation` | `hub.join-listed-conversation` | 1 | Exported |
| `POST /api/v0/hub/evaluate-known-unlisted-conversation-tags` | `hub.evaluate-known-unlisted-conversation-tags` | 1 | Exported |
| `POST /api/v0/hub/join-unlisted-conversation` | `hub.join-unlisted-conversation` | 1 | Exported |
| `GET /api/v0/hub/retrieve-joined-conversations` | `hub.retrieve-joined-conversations` | 0 | Exported |
| `GET /api/v0/hub/resolve-joined-conversation-access` | `hub.resolve-joined-conversation-access` | 1 | Exported |

## Source and Output Paths

- Reviewed OpenAPI source: `docs/mockup/routes/hub-routes.yaml`
- Deterministic ROUTES-PLAN output: `docs/mockup/routes/hub-routes.json`
- Phase 2 handoff: `ai-docs/create-route-docs/hub/02-openapi-spec-reviewer.md`

## Package Resolution

- Resolution source: UX-family package with role `contract` in `docs/plans/api-stack/PACKAGE-PLAN.json`.
- Resolved OpenAPI package: `atk-ux-api-contract`

## Operation Counts

- OpenAPI operation count: 8
- Exported route count: 8
- Exported input count: 10

## Validator Result

- `export-routes-plan.mjs`: exit code `0`, `ok: true`; package `atk-ux-api-contract`; route count `8`.
- `validate-routes-plan.mjs`: exit code `0`, `ok: true`; package `atk-ux-api-contract`; route count `8`; blockers `[]`.
- The JSON plan is the canonical deterministic projection of the reviewed YAML and contains only `openApiSchema` and `routes`.

## Changed Files Confirmation

Only `docs/mockup/routes/hub-routes.json` and `ai-docs/create-route-docs/hub/03-routes-plan-exporter.md` were changed during Phase 3. The Markdown route contract, paired route-review evidence, reviewed OpenAPI YAML, earlier handoffs, package plan, and all other project artifacts remained unchanged.
