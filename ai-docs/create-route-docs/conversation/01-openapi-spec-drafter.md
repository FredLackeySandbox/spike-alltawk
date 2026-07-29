# Conversation OpenAPI Spec Drafter Handoff

## Markdown-to-OpenAPI Coverage Matrix

| Markdown route | OpenAPI operationId | Coverage |
| --- | --- | --- |
| `GET /api/v0/conversation/retrieve-workspace` | `retrieveConversationWorkspace` | Exact |
| `POST /api/v0/conversation/post-message` | `postMessage` | Exact |
| `POST /api/v0/conversation/add-emoji-reaction` | `addEmojiReaction` | Exact |
| `DELETE /api/v0/conversation/remove-emoji-reaction` | `removeEmojiReaction` | Exact |
| `GET /api/v0/conversation/retrieve-message-note` | `retrieveMessageNote` | Exact |
| `POST /api/v0/conversation/create-message-note` | `createMessageNote` | Exact |
| `PATCH /api/v0/conversation/update-message-note` | `updateMessageNote` | Exact |
| `GET /api/v0/conversation/retrieve-conversation-note` | `retrieveConversationNote` | Exact |
| `POST /api/v0/conversation/create-conversation-note` | `createConversationNote` | Exact |
| `PATCH /api/v0/conversation/update-conversation-note` | `updateConversationNote` | Exact |
| `POST /api/v0/conversation/submit-message-report` | `submitMessageReport` | Exact |
| `DELETE /api/v0/conversation/delete-message` | `deleteMessage` | Exact |
| `DELETE /api/v0/conversation/leave-conversation` | `leaveConversation` | Exact |

The Markdown inventory and OpenAPI inventory both contain 13 operations with exact one-to-one method/path coverage.

## Security Schemes Used

All operations use the shared `sessionCookie` security scheme, modeled as an OpenAPI `apiKey` in the `tawk_session` cookie. No ordinary `Cookie` or `Authorization` header parameter was added, and no private credential value is exposed.

## Request and Response Examples

Every documented JSON request example is preserved exactly in its operation's `application/json` request body. The three documented no-body GET operations omit `requestBody`. Every operation includes its documented success response example with an inline or genuinely shared schema. Both documented response variants are retained for message-note retrieval, conversation-note retrieval, and leaving a conversation. Create operations use `201`; all other documented successes use `200`.

## Validator Results

- `validate-openapi-spec.mjs`: exit `0`, `ok: true`, 13 Markdown routes, 13 OpenAPI operations, no blockers.
- `validate-openapi-projection.mjs`: exit `0`, `ok: true`, package `atk-ux-api-contract`, 13 projected routes, 21 projected inputs, canonical JSON byte length 3884, SHA-256 `9edccc3ff6f51d96edbef2961df6268c394be202ea8cdbf6b18bcc11a7f9e26f`, no blockers.

## Unresolved Ambiguities

None. The finalized Markdown provided sufficient UI-facing route, security, parameter, request, response, and traceability detail for all 13 operations.

## Changed Files Confirmation

Changed only:

- `docs/mockup/routes/conversation-routes.yaml`
- `ai-docs/create-route-docs/conversation/01-openapi-spec-drafter.md`

The finalized Markdown route contract and paired route-review file were not modified.
