# Phase 9 OpenAPI JSON Exporter Handoff

## Target And Scope

- `solutionArtifactRoot`: `/Users/flackey/Source/Personal/FredLackeySandbox/spike-alltawk`
- Scenario: `root-artifact-monorepo`
- Work unit: desktop `moderation`
- Reviewed YAML source: `docs/mockup/routes/moderation-routes.yaml`
- Final JSON output: `docs/mockup/routes/moderation-routes.json`
- OpenAPI version: `3.1.0`
- Exact Markdown source link preserved: `docs/mockup/routes/moderation-routes.md`
- Reviewed YAML SHA-256: `4d40b682d40f5abc14c1630e0883f0b6afe88297d527f70e5fe307d32691fdfa`
- Export provenance field: `x-solpoc-source-yaml-sha256`

All artifact references in this handoff and in the exported OpenAPI document
are repository-relative to `solutionArtifactRoot`. All filesystem reads and
writes used absolute paths under that root. `projects/**` was not read or
changed.

## YAML-to-JSON Coverage Matrix

| YAML method and path | YAML operationId | JSON operationId | Result |
| --- | --- | --- | --- |
| `GET /api/v0/moderation/retrieve-reviewable-reports` | `retrieveReviewableReports` | `retrieveReviewableReports` | Exact match |
| `GET /api/v0/moderation/retrieve-moderation-ticket` | `retrieveModerationTicket` | `retrieveModerationTicket` | Exact match |
| `POST /api/v0/moderation/create-reviewer-note` | `createReviewerNote` | `createReviewerNote` | Exact match |
| `DELETE /api/v0/moderation/delete-reported-message` | `deleteReportedMessage` | `deleteReportedMessage` | Exact match |
| `POST /api/v0/moderation/create-posting-suspension` | `createPostingSuspension` | `createPostingSuspension` | Exact match |
| `PATCH /api/v0/moderation/update-posting-suspension` | `updatePostingSuspension` | `updatePostingSuspension` | Exact match |
| `DELETE /api/v0/moderation/remove-participant` | `removeParticipant` | `removeParticipant` | Exact match |
| `POST /api/v0/moderation/ban-participant` | `banParticipant` | `banParticipant` | Exact match |

The reviewed YAML and final JSON each contain exactly eight operations.
Method/path ordering and every `operationId` match exactly. After removing the
single permitted export-only provenance field from the JSON document, the
complete parsed JSON document is semantically equal to the parsed reviewed
YAML document.

## Export And Validation Results

- Python 3 with PyYAML was available; detected PyYAML version `6.0.3`.
- The bundled deterministic exporter completed with `ok: true`.
- The JSON declares OpenAPI `3.1.0`.
- `x-solpoc-route-markdown` remains exactly
  `docs/mockup/routes/moderation-routes.md`.
- `x-solpoc-source-yaml-sha256` exactly matches the SHA-256 digest of the
  reviewed YAML file's bytes.
- The output uses strict JSON, two-space indentation, and exactly one trailing
  newline.
- `validate-openapi-json.mjs` completed with `ok: true`, reporting eight
  Markdown routes, eight YAML operations, eight JSON operations, and no
  blockers.

## Unresolved Blockers

None.

## Allowed-Write Confirmation

- Kept `docs/mockup/routes/moderation-routes.md` and
  `docs/mockup/routes/moderation-routes.yaml` read-only.
- Changed only `docs/mockup/routes/moderation-routes.json` and
  `ai-docs/draft-routes/moderation/09-openapi-json-exporter.md`.
- Did not create or modify companions, HTML, CSS, JavaScript, concept
  documents, schema documents, source code, package files, another area's
  routes, neighboring review files, or earlier handoffs.
