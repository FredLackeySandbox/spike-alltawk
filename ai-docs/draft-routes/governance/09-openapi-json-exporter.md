# Phase 9 OpenAPI JSON Exporter Handoff

## Target

- Work-unit slug: `governance`
- `solutionArtifactRoot`: `/Users/flackey/Source/Personal/FredLackeySandbox/spike-alltawk`
- Scenario: `root-artifact-monorepo`
- Reviewed YAML source: `docs/mockup/routes/governance-routes.yaml`
- Final JSON definition: `docs/mockup/routes/governance-routes.json`
- Phase 8 handoff: `ai-docs/draft-routes/governance/08-openapi-spec-reviewer.md`

All artifact path references in this handoff are repository-relative to
`solutionArtifactRoot`. Filesystem reads and writes used absolute paths beneath
that root. `projects/**` was not read or changed.

## Export Result

The installed deterministic exporter completed with `ok: true`:

`node /Users/flackey/.codex/skills/solpoc-draft-routes/scripts/export-openapi-json.mjs --solution-root /Users/flackey/Source/Personal/FredLackeySandbox/spike-alltawk --folder-slug governance --format json`

- OpenAPI version: `3.1.0`
- YAML operation count: 10
- JSON operation count: 10
- Source Markdown link:
  `docs/mockup/routes/governance-routes.md`
- Exact reviewed-YAML SHA-256:
  `eb230a771462c9eea7b95606d9cbec273f0da71b1ca76d570d9a71f6695626a5`
- Export-only provenance field:
  `x-solpoc-source-yaml-sha256`
- JSON formatting: two-space indentation with exactly one trailing newline

The complete YAML document was preserved semantically. Removing only
`x-solpoc-source-yaml-sha256` from the JSON yields a document equal to the
losslessly parsed reviewed YAML.

## YAML-to-JSON Coverage Matrix

| YAML method and path | YAML `operationId` | JSON `operationId` | Result |
|---|---|---|---|
| `GET /api/v0/governance/retrieve-conversation-governance` | `retrieveConversationGovernance` | `retrieveConversationGovernance` | Exact match |
| `POST /api/v0/governance/promote-participant-role` | `promoteParticipantRole` | `promoteParticipantRole` | Exact match |
| `DELETE /api/v0/governance/remove-participant` | `removeParticipant` | `removeParticipant` | Exact match |
| `POST /api/v0/governance/ban-identity` | `banIdentity` | `banIdentity` | Exact match |
| `POST /api/v0/governance/restore-banned-participant` | `restoreBannedParticipant` | `restoreBannedParticipant` | Exact match |
| `POST /api/v0/governance/create-posting-suspension` | `createPostingSuspension` | `createPostingSuspension` | Exact match |
| `PATCH /api/v0/governance/update-posting-suspension` | `updatePostingSuspension` | `updatePostingSuspension` | Exact match |
| `DELETE /api/v0/governance/end-posting-suspension` | `endPostingSuspension` | `endPostingSuspension` | Exact match |
| `PATCH /api/v0/governance/update-conversation-tags` | `updateConversationTags` | `updateConversationTags` | Exact match |
| `POST /api/v0/governance/archive-conversation` | `archiveConversation` | `archiveConversation` | Exact match |

Every YAML method/path pair and `operationId` appears once in JSON, and JSON
contains no extra operation.

## Validation

The scoped command

`node /Users/flackey/.codex/skills/solpoc-draft-routes/scripts/validate-openapi-json.mjs --solution-root /Users/flackey/Source/Personal/FredLackeySandbox/spike-alltawk --folder-slug governance --format json`

passed with `ok: true`, 10 Markdown routes, 10 YAML operations, 10 JSON
operations, and no blockers. Independent checks also confirmed parseable JSON,
OpenAPI `3.1.0`, exact source-link preservation, exact YAML-byte digest
provenance, semantic equality apart from the permitted digest field, and
strict formatting.

## Blockers

None. The reviewed YAML exported without ambiguity.

## Scope Confirmation

- Wrote `docs/mockup/routes/governance-routes.json`.
- Wrote
  `ai-docs/draft-routes/governance/09-openapi-json-exporter.md`.
- Did not modify the reviewed Markdown or YAML sources.
- Only the assigned JSON definition and this Phase 9 handoff were changed by
  this exporter phase.
- No HTML, CSS, JavaScript, concept, schema, mock-data, package, application
  source, neighboring route, or review file was changed.
