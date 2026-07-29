# Phase 3 ROUTES-PLAN Exporter Handoff

## OpenAPI-to-ROUTES-PLAN Coverage Matrix

| OpenAPI method and path | ROUTES-PLAN operationId | Projected inputs | Result |
| --- | --- | --- | --- |
| `GET /api/v0/conversation/retrieve-workspace` | `conversation.retrieve-workspace` | `conversationUid: string` | PASS |
| `POST /api/v0/conversation/post-message` | `conversation.post-message` | `conversationUid: string`, `text: string` | PASS |
| `POST /api/v0/conversation/add-emoji-reaction` | `conversation.add-emoji-reaction` | `messageUid: string`, `emoji: string` | PASS |
| `DELETE /api/v0/conversation/remove-emoji-reaction` | `conversation.remove-emoji-reaction` | `messageUid: string`, `emoji: string` | PASS |
| `GET /api/v0/conversation/retrieve-message-note` | `conversation.retrieve-message-note` | `messageUid: string` | PASS |
| `POST /api/v0/conversation/create-message-note` | `conversation.create-message-note` | `messageUid: string`, `text: string` | PASS |
| `PATCH /api/v0/conversation/update-message-note` | `conversation.update-message-note` | `noteUid: string`, `text: string` | PASS |
| `GET /api/v0/conversation/retrieve-conversation-note` | `conversation.retrieve-conversation-note` | `conversationUid: string` | PASS |
| `POST /api/v0/conversation/create-conversation-note` | `conversation.create-conversation-note` | `conversationUid: string`, `text: string` | PASS |
| `PATCH /api/v0/conversation/update-conversation-note` | `conversation.update-conversation-note` | `noteUid: string`, `text: string` | PASS |
| `POST /api/v0/conversation/submit-message-report` | `conversation.submit-message-report` | `messageUid: string`, `explanation: string` | PASS |
| `DELETE /api/v0/conversation/delete-message` | `conversation.delete-message` | `messageUid: string` | PASS |
| `DELETE /api/v0/conversation/leave-conversation` | `conversation.leave-conversation` | `conversationUid: string` | PASS |

All 13 reviewed OpenAPI operations project one-to-one into 13 compact ROUTES-PLAN entries. The projection contains 21 inputs drawn only from query parameters and top-level JSON request properties.

## Source and Output Paths

- Reviewed OpenAPI source: `docs/mockup/routes/conversation-routes.yaml`
- Markdown linkage preserved by the reviewed OpenAPI source: `docs/mockup/routes/conversation-routes.md`
- Deterministic ROUTES-PLAN output: `docs/mockup/routes/conversation-routes.json`
- Phase 2 prerequisite handoff: `ai-docs/create-route-docs/conversation/02-openapi-spec-reviewer.md`
- Phase 3 handoff: `ai-docs/create-route-docs/conversation/03-routes-plan-exporter.md`

## Package Resolution

- Resolved package: `atk-ux-api-contract`
- Resolution source: the package with role `contract` in the UX family of `docs/plans/api-stack/PACKAGE-PLAN.json`
- OpenAPI schema file: `openapi/openapi.yaml`

## Operation Counts

- Reviewed OpenAPI operations: `13`
- ROUTES-PLAN routes: `13`
- Projected inputs: `21`
- Coverage result: exact one-to-one operation coverage

## Validator Result

- Export command: `node /Users/flackey/.codex/skills/solpoc-create-route-docs/scripts/export-routes-plan.mjs --solution-root /Users/flackey/Source/Personal/FredLackeySandbox/spike-alltawk --folder-slug conversation --format json`
- Export exit status: `0`
- Export result: `ok: true`
- Validation command: `node /Users/flackey/.codex/skills/solpoc-create-route-docs/scripts/validate-routes-plan.mjs --solution-root /Users/flackey/Source/Personal/FredLackeySandbox/spike-alltawk --folder-slug conversation --format json`
- Validation exit status: `0`
- Validation result: `ok: true`
- Validator blockers: none

## Changed Files Confirmation

Only these Phase 3 outputs were created or changed:

- `docs/mockup/routes/conversation-routes.json`
- `ai-docs/create-route-docs/conversation/03-routes-plan-exporter.md`

The reviewed OpenAPI YAML, Markdown route contract, paired route-review evidence, previous handoffs, package plan, and all other project artifacts were read-only and unchanged.
