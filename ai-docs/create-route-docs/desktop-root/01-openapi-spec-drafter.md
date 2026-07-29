# Phase 1 OpenAPI Spec Drafter Handoff — desktop-root

## Markdown-to-OpenAPI Coverage Matrix

| Markdown route inventory | OpenAPI coverage |
| --- | --- |
| The contract explicitly defines no backend action routes. | `paths: {}`; zero operations. |

Source contract: `docs/mockup/routes/desktop-root-routes.md`

Generated specification: `docs/mockup/routes/desktop-root-routes.yaml`

The Markdown and OpenAPI inventories both contain zero routes, so coverage is one-to-one and complete.

## Security Schemes Used

None. The Markdown contract defines no operations and therefore documents no route authentication requirements.

## Request and Response Examples

None. With no documented backend action routes, there are no request bodies, parameters, responses, or examples to translate.

## Validator Results

- `validate-openapi-spec.mjs`: exit code `0`, `ok: true`, Markdown route count `0`, OpenAPI operation count `0`, blockers `[]`.
- `validate-openapi-projection.mjs`: exit code `0`, `ok: true`, package `atk-ux-api-contract`, projected route count `0`, projected input count `0`, canonical JSON byte length `217`, canonical JSON SHA-256 `5e39086e7e944969d9a846ec8cfef7d27acb78bf85432f6a388f05d69b76707a`, blockers `[]`.

## Unresolved Ambiguities

None.

## Changed Files Confirmation

Only these Phase 1 outputs were changed:

- `docs/mockup/routes/desktop-root-routes.yaml`
- `ai-docs/create-route-docs/desktop-root/01-openapi-spec-drafter.md`

The Markdown route contract and its review evidence were not changed.
