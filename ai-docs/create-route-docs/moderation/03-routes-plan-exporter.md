# Moderation ROUTES-PLAN Exporter Handoff

## Inputs Read

- `docs/mockup/routes/moderation-routes.yaml`
- `ai-docs/create-route-docs/moderation/02-openapi-spec-reviewer.md`
- `docs/plans/api-stack/PACKAGE-PLAN.json`

The deterministic exporter and validator used the route Markdown and paired review evidence only for their prescribed checks. Neither Markdown file was edited.

## OpenAPI-to-ROUTES-PLAN Coverage Matrix

| OpenAPI operation | ROUTES-PLAN operation | Method and path | Projected inputs |
| --- | --- | --- | --- |
| `retrieveReviewableReports` | `moderation.retrieve-reviewable-reports` | `GET /api/v0/moderation/retrieve-reviewable-reports` | 1 |
| `retrieveModerationTicket` | `moderation.retrieve-moderation-ticket` | `GET /api/v0/moderation/retrieve-moderation-ticket` | 2 |
| `createReviewerNote` | `moderation.create-reviewer-note` | `POST /api/v0/moderation/create-reviewer-note` | 3 |
| `deleteReportedMessage` | `moderation.delete-reported-message` | `DELETE /api/v0/moderation/delete-reported-message` | 3 |
| `createPostingSuspension` | `moderation.create-posting-suspension` | `POST /api/v0/moderation/create-posting-suspension` | 4 |
| `updatePostingSuspension` | `moderation.update-posting-suspension` | `PATCH /api/v0/moderation/update-posting-suspension` | 7 |
| `removeParticipant` | `moderation.remove-participant` | `DELETE /api/v0/moderation/remove-participant` | 3 |
| `banParticipant` | `moderation.ban-participant` | `POST /api/v0/moderation/ban-participant` | 3 |

## Export Result

- Source OpenAPI: `docs/mockup/routes/moderation-routes.yaml`
- Output ROUTES-PLAN: `docs/mockup/routes/moderation-routes.json`
- UX contract package source: `docs/plans/api-stack/PACKAGE-PLAN.json`
- Resolved OpenAPI package: `atk-ux-api-contract`
- Route count: 8
- Projected input count: 26
- Exporter result: exit 0, `ok: true`
- ROUTES-PLAN validator result: exit 0, `ok: true`; no blockers

The JSON was produced only by the bundled deterministic exporter. It contains the canonical `openApiSchema` and `routes` projection and was not manually translated or serialized.

## Files Changed

- `docs/mockup/routes/moderation-routes.json`
- `ai-docs/create-route-docs/moderation/03-routes-plan-exporter.md`

Only the generated ROUTES-PLAN JSON and this exporter handoff were changed. The OpenAPI YAML, route Markdown, route-review Markdown, reviewer handoff, package plan, mockups, and source code were not edited.
