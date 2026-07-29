# Governance OpenAPI Spec Reviewer Handoff

## Spec Coverage Matrix

| Markdown operation | OpenAPI operationId | Review result | Request, response, and traceability coverage |
| --- | --- | --- | --- |
| `GET /api/v0/governance/retrieve-conversation-governance` | `retrieveConversationGovernance` | Corrected | Exact GET path; required `conversationUid` and `view` query parameters; `tawk_session` cookie security; separate `MEMBERS` and `SETTINGS` success examples; both source actions and all four mockup files. Response enums now cover the documented lifecycle, viewer-role, participant-role, former-membership, discovery, and matching variants. |
| `POST /api/v0/governance/promote-participant-role` | `promoteParticipantRole` | Corrected | Exact POST path; required JSON `conversationUid`, `participantUid`, and `targetRole`; cookie security; authoritative participant and owner-continuity response; both promotion actions and both member mockup files. Response enums now cover both target roles and the active or posting-suspended access states supported by the roster. |
| `DELETE /api/v0/governance/remove-participant` | `removeParticipant` | Corrected | Exact DELETE path; required JSON public conversation and participant UIDs; cookie security; retained former-participant result and roster counts; exact source action and mockup files. The retained-role enum now covers owner, administrator, and member targets documented by the governance rules. |
| `POST /api/v0/governance/ban-identity` | `banIdentity` | Corrected | Exact POST path; required JSON public conversation and participant UIDs; cookie security; banned former-row state, rejoin result, and roster counts; exact source action and mockup files. The retained-role enum now covers owner, administrator, and member targets. |
| `POST /api/v0/governance/restore-banned-participant` | `restoreBannedParticipant` | Corrected | Exact POST path; required JSON public conversation and participant UIDs; cookie security; restored active roster entry and counts; exact source action and mockup files. Identity and restored-role enums now cover the requirements-backed person/bot and owner/administrator/member branches. |
| `POST /api/v0/governance/create-posting-suspension` | `createPostingSuspension` | No correction | Exact POST path; required JSON conversation UID, participant UID, UTC end, and display time zone; cookie security; public suspension UID, effective end, access state, and allowed actions; exact source action and mockup files. |
| `PATCH /api/v0/governance/update-posting-suspension` | `updatePostingSuspension` | No correction | Exact PATCH path; required JSON conversation UID, public suspension UID, revised UTC end, and display time zone; cookie security; same suspension UID and revised authoritative state; exact source action and mockup files. |
| `DELETE /api/v0/governance/end-posting-suspension` | `endPostingSuspension` | No correction | Exact DELETE path; required JSON conversation and suspension UIDs; cookie security; nullable suspension, restored access, effective end, and allowed actions; exact source action and mockup files. |
| `PATCH /api/v0/governance/update-conversation-tags` | `updateConversationTags` | No correction | Exact PATCH path; required JSON conversation UID and complete ordered tag set with the one-to-ten boundary; cookie security; committed tags, count, lifecycle, and actions; exact source action and mockup files. |
| `POST /api/v0/governance/archive-conversation` | `archiveConversation` | No correction | Exact POST path; required JSON conversation UID; cookie security; archived lifecycle, effective timestamp, retention confirmation, and empty allowed actions; exact source action and mockup files. |

The finalized Markdown and reviewed OpenAPI specification each contain exactly 10 method/path pairs with one-to-one coverage.

## Corrections Made

- Expanded the retrieval response enums to cover the documented `ACTIVE` and `ARCHIVED` lifecycle states; `OWNER`, `ADMINISTRATOR`, and `MEMBER` viewer roles; owner, administrator, and member participant roles; active, removed, and banned membership states; listed and unlisted discovery; and exclusive, inclusive, and all-tags matching.
- Expanded the promotion response role enum to `OWNER` and `ADMINISTRATOR`, matching the route's documented `targetRole` values.
- Expanded the promotion response access-state enum to `ACTIVE` and `POSTING_SUSPENDED`, matching eligible active roster rows and their retained posting-restriction branch.
- Expanded the removal and ban response retained-role enums to `OWNER`, `ADMINISTRATOR`, and `MEMBER`, matching the documented authority and eligible-target branches without exposing internal role history.
- Expanded the restoration response identity-type enum to `PERSON` and `BOT` and its active-role enum to `OWNER`, `ADMINISTRATOR`, and `MEMBER`, matching the shared identity and requirements-backed active-role model.
- No route, parameter, request field, response field, response status, example, traceability reference, security declaration, or Markdown file was added, removed, or redesigned.

## Checks Requiring No Correction

- The exact source link remains `docs/mockup/routes/governance-routes.md`.
- Every operation uses the `governance` tag, a unique lower-camel-case `operationId`, operation-level `sessionCookie` security, and exact repository-relative source-action and mockup-file references.
- `sessionCookie` correctly models the browser-managed `tawk_session` cookie; no session value is exposed as a normal parameter or JSON field.
- The retrieval operation has no request body and preserves the two separately labeled, single-object response examples that remediate the paired review file's earlier combined-response finding.
- Each mutation preserves the exact documented JSON request and success-response examples, including public UIDs, arrays, booleans, timestamps, and the nullable `postingSuspension`.
- Requiredness and placement are correct: retrieval inputs are required query parameters, mutation inputs are required JSON properties, and no authorization header or server-owned context is projected as a browser input.
- Timestamp-like scalars are quoted, preserving string types across YAML-to-JSON conversion.
- The specification contains public-safe opaque UIDs only; it adds no database identifiers, credentials, private permission state, provider secrets, hashes, audit rows, lower-layer contracts, or implementation algorithms.
- The Markdown describes several failure branches without concrete HTTP statuses or complete payload examples. The specification correctly avoids inventing unsupported non-success responses.

## Unresolved Blockers

None. The finalized Markdown provides separate `MEMBERS` and `SETTINGS` single-object examples, and the paired route-review file contains ten complete `PASS` decisions with no failing route. No correction to the Markdown route contract is required.

## Validator Results

- `validate-openapi-spec.mjs`: exit code `0`, `ok: true`, Markdown route count `10`, OpenAPI operation count `10`, blockers `[]`.
- `validate-openapi-projection.mjs`: exit code `0`, `ok: true`, projected route count `10`, projected input count `24`, OpenAPI package `atk-ux-api-contract`, canonical JSON byte length `3354`, canonical JSON SHA-256 `ad183dde05964bd03e897805ae2d3af80ef4e2248c4fece629824c45404aa3b0`, blockers `[]`.

## Changed Files Confirmation

Only `docs/mockup/routes/governance-routes.yaml` and this Phase 2 handoff were changed for this review. The finalized Markdown route contract, paired route-review evidence, requirements, page sources, shared assets, and Phase 1 handoff remained unchanged.
