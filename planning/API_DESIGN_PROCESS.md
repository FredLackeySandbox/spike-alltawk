# API Design Process

## Purpose

This document defines how to derive Tawk API operations from product requirements without moving presentation-specific behavior into the API. The API should represent a headless application that can support the desktop mockup, a future mobile client, bots, command-line tools, and tests without knowing how any client renders its interface.

The central rule is:

> Design each API operation around a business fact to retrieve or a business outcome to request, never around a page, button, modal, tab, toast, or other presentation event.

An operation belongs in the API when a non-visual client could use it with the same meaning.

## Authoritative inputs

Use the following sources in this order when identifying behavior:

1. `docs/concepts/REQUIREMENTS.md` defines business capabilities, rules, and key user flows.
2. `docs/concepts/USER_TYPES.md` defines actors, roles, and authority.
3. `docs/concepts/APP_STRUCTURE.md` identifies application areas and trust boundaries.
4. `docs/schemas/*.yaml` defines the approved durable object structures.
5. `docs/schemas/DICTIONARY.md` defines relationships, lifecycle rules, and cross-record invariants that individual JSON Schemas cannot express.
6. `docs/mockup/desktop/` demonstrates intended interactions and information needs, but it is not authoritative for business behavior or API naming.

When the mockup and the product documents differ, resolve the product decision before defining the API. Do not make a page's current JavaScript behavior an implicit business rule.

## Boundary between API and UI

### API responsibilities

The API owns:

- Authentication and actor identity.
- Authorization based on membership, role, ownership, and record visibility.
- Durable object creation and mutation.
- IDs, sequential ticket numbers, and persistence timestamps.
- JSON Schema validation.
- Cross-record integrity rules.
- Lifecycle and state-transition validation.
- Atomic changes involving multiple records.
- Privacy rules, including unlisted-conversation and reporter-information protection.
- Business-derived facts such as whether the current actor may post, moderate, leave, archive, or change a note's visibility.
- Stable application read models that can serve more than one type of client.

### UI responsibilities

The client owns:

- Page layout and navigation.
- Modals, drawers, tabs, menus, and expanded or collapsed state.
- Button placement, color, wording, and visibility decisions.
- Loading indicators, spinners, transitions, and animations.
- Toast and confirmation wording.
- Unsaved form state and client-side interaction state.
- Display formatting, including dates, initials, colors, and truncation.
- Choosing how to present API errors and capabilities.

### Boundary examples

These are business facts and may be returned by the API:

```json
{
  "capabilities": {
    "canPost": false,
    "canLeave": true,
    "canModerate": false
  }
}
```

These are presentation instructions and must not be returned by the API:

```json
{
  "showRedBanButton": true,
  "openWarningModal": false,
  "toastText": "Member banned!"
}
```

## Operation discovery process

### 1. Inventory business capabilities

Read the core features and key user flows in `REQUIREMENTS.md`. Extract business statements that begin conceptually with an actor and an outcome, such as:

- An identified user searches for conversations using tags.
- An eligible identity joins a conversation.
- An active member posts a message.
- A participant reports a message.
- A reviewer closes a moderation ticket with a disposition.
- An owner promotes a member.
- An owner or administrator suspends a member's posting ability.
- A note author changes an active note's visibility.

Do not begin by listing screens or controls.

### 2. Classify each capability

Classify every candidate operation as one of the following:

- **Query:** Retrieves business facts without changing durable state.
- **Creation:** Creates a new durable resource.
- **Transition:** Requests a controlled change in lifecycle or business state.
- **Removal:** Removes a resource from ordinary use, whether the underlying implementation hard-deletes or retains it as soft-deleted history.

This classification helps select the HTTP method and determine whether an explicit business command is needed.

### 3. Complete an operation worksheet

Document the following before choosing a URL:

```text
Business intent:
Actor:
Required authority:
Input supplied by the caller:
Values derived by the API:
Preconditions:
Atomic data changes:
Result:
Business failures:
Privacy considerations:
Retry/idempotency behavior:
```

If the business intent contains words such as `page`, `button`, `modal`, `tab`, `toast`, `form`, or `refresh`, rewrite it in domain language before continuing.

### 4. Choose a resource or command shape

Use ordinary resource operations when the request maps cleanly to creating, reading, updating, or removing a durable resource. Use an explicit business-transition endpoint when an operation:

- Has a meaningful domain name.
- Changes multiple records.
- Has important preconditions or authorization rules.
- Represents a terminal or otherwise constrained lifecycle transition.
- Must create append-only history.
- Cannot safely be represented as an arbitrary field update.

For example, closing a moderation ticket should not be exposed as an unrestricted patch of its `status` field. Closing is terminal, requires a disposition, can affect a message and thread, and can create moderation actions and audit events. A route such as `POST /api/moderation-tickets/{ticketId}/close` exposes that behavior through one controlled application service.

### 5. Define the contract independently of storage

The request and response must describe application concepts, not lowdb collections, JSON file locations, or internal query mechanisms.

The API should normally derive rather than accept:

- The authenticated actor's identity.
- Server-generated IDs.
- Creation and update timestamps.
- Sequential moderation ticket numbers.
- Statuses derived from other records.
- Authorization decisions.
- Audit events required by the requested transition.

Each returned durable object should retain the structure defined by its approved YAML schema. Composite responses may contain several approved objects in a stable envelope without changing those objects.

### 6. Define atomic effects

List every record created or changed by the operation. Apply all effects as a single application-level transaction. No caller should need to coordinate multiple low-level requests to maintain a documented invariant.

For a lowdb implementation, the service should:

1. Serialize mutation operations through one write queue.
2. Clone the current database state.
3. Authorize and validate the operation against the clone.
4. Apply every required record change to the clone.
5. Validate affected documents and cross-record invariants.
6. Replace the in-memory state only after validation succeeds.
7. Persist the complete state with one write.

### 7. Define authorization and privacy explicitly

For every operation, identify:

- Who may invoke it.
- Which conversation-scoped role is required.
- Whether a non-member can learn that the target exists.
- Which fields must be omitted for the current actor.
- Whether forbidden access should be indistinguishable from a missing resource.

For example, unlisted search may return a hidden match count and whether a unique exact match is joinable, but it must not return conversation identity, title, or private tags. Moderation ticket reads must not reveal reporter identities to ordinary participants.

### 8. Define failures consistently

Use standard HTTP status semantics:

- `400 Bad Request`: malformed request syntax or unparsable JSON.
- `401 Unauthorized`: authentication is absent or invalid.
- `403 Forbidden`: the authenticated actor lacks authority, when revealing the resource is safe.
- `404 Not Found`: the resource does not exist or its existence must be concealed.
- `409 Conflict`: the request conflicts with current state, such as leaving as the final owner or modifying a closed ticket.
- `422 Unprocessable Content`: the request is structurally valid but its supplied values violate semantic validation.

Return errors using the `application/problem+json` structure from RFC 9457. Define stable problem `type` values or application error codes so clients do not parse human-readable messages.

Example:

```json
{
  "type": "https://tawk.local/problems/last-owner",
  "title": "The final owner cannot leave",
  "status": 409,
  "detail": "Promote another active member to owner or archive the conversation first.",
  "conversationId": "..."
}
```

### 9. Decide retry and concurrency behavior

Follow HTTP method semantics:

- `GET` retrieves state and must not cause a business mutation.
- `PUT` and `DELETE` should be idempotent.
- `POST` may create a new resource or invoke a transition and is not assumed to be idempotent.

For creation operations that a client may safely retry, support an idempotency key or a caller-generated stable request identifier. Reject stale state transitions with `409 Conflict`; ETags and `If-Match` can be introduced if concurrent editing becomes relevant.

### 10. Define a reusable read model when necessary

A client should not need dozens of calls merely to reconstruct one coherent business context. Composite read models are acceptable when they represent a stable application concept rather than one screen implementation.

Acceptable:

```http
GET /api/conversations/{conversationId}/timeline
```

```json
{
  "conversation": {},
  "messages": [],
  "threads": [],
  "identities": [],
  "reactions": [],
  "capabilities": {
    "canPost": true,
    "canModerate": false
  }
}
```

Avoid page-specific names such as:

```http
GET /api/load-conversation-page
GET /api/hub-screen-data
POST /api/refresh-moderation-tab
```

### 11. Record the contract in OpenAPI

Every exposed operation should have:

- A path and HTTP method.
- A stable `operationId` expressed as a business action.
- A concise business summary.
- Authentication and authorization requirements.
- Path, query, and request-body schemas.
- Success response schemas and examples.
- Documented failure responses.
- Relevant lifecycle, privacy, and idempotency notes.

Good operation IDs include:

```text
searchConversations
joinConversation
leaveConversation
postMessage
reportMessage
closeModerationTicket
suspendMemberPosting
changeNoteVisibility
```

Avoid names tied to an implementation or UI event:

```text
handleSubmit
loadHub
clickJoin
saveDialog
refreshTicketPage
updateLowdbRecord
```

### 12. Verify against every client interaction

After the business API is defined, walk through each desktop mockup interaction and map it to either:

- A documented API query or command.
- Pure client behavior requiring no API call.
- A missing or unresolved product decision.

Do not add an endpoint solely because a control exists. First prove that the control requests a valid business outcome.

## HTTP and naming conventions

Apply these conventions consistently:

- Start application routes with `/api`.
- Use plural nouns for resource collections: `/conversations`, `/messages`, `/moderation-tickets`.
- Use lowercase kebab-case for multiword path segments.
- Put stable resource identifiers in path segments.
- Use query parameters for filtering, searching, sorting, and pagination.
- Never expose lowdb, filenames, collection implementation details, or mockup page names in routes.
- Prefer `GET` for queries, `POST` for creation and non-idempotent transitions, `PUT` for idempotent replacement or assignment, `PATCH` for safe partial updates, and `DELETE` for removal.
- Use explicit domain-transition verbs when a generic patch would expose invalid states or bypass required side effects.
- Name routes and `operationId` values using the vocabulary in the requirements and data dictionary.

## Initial Tawk operation inventory

The following is a candidate inventory, not a final route contract. Every item must pass through the operation worksheet and product-rule review.

### Current identity

```http
GET   /api/me
PATCH /api/me/profile
```

### Discovery

```http
GET  /api/tags/suggestions?query={query}
GET  /api/conversations/search?tags={commaSeparatedTags}&matchingMode={mode}
POST /api/conversations/join-hidden
```

The hidden-join operation must enforce exact tag-set matching and must not expose hidden conversation data before a unique eligible match is joined.

### Conversations

```http
POST  /api/conversations
GET   /api/conversations/{conversationId}
PATCH /api/conversations/{conversationId}
POST  /api/conversations/{conversationId}/join
POST  /api/conversations/{conversationId}/leave
POST  /api/conversations/{conversationId}/archive
```

### Messages and threads

```http
GET    /api/conversations/{conversationId}/messages
POST   /api/conversations/{conversationId}/messages
POST   /api/threads/{threadId}/messages
DELETE /api/messages/{messageId}
```

### Reactions

```http
PUT    /api/messages/{messageId}/reactions/{emojiId}
DELETE /api/messages/{messageId}/reactions/{emojiId}
```

Using `PUT` and `DELETE` makes adding an already-active reaction or removing an already-removed reaction naturally idempotent.

### Reports and moderation

```http
POST /api/messages/{messageId}/reports
GET  /api/moderation-tickets?conversationId={conversationId}&status={status}
GET  /api/moderation-tickets/{ticketId}
POST /api/moderation-tickets/{ticketId}/start-review
POST /api/moderation-tickets/{ticketId}/mark-reviewed
POST /api/moderation-tickets/{ticketId}/warnings
POST /api/moderation-tickets/{ticketId}/close
```

### Membership administration

```http
GET  /api/conversations/{conversationId}/memberships
POST /api/memberships/{membershipId}/promote
POST /api/memberships/{membershipId}/remove
POST /api/memberships/{membershipId}/ban
POST /api/memberships/{membershipId}/unban
POST /api/memberships/{membershipId}/posting-suspensions
```

### Notes

```http
POST   /api/notes
PATCH  /api/notes/{noteId}/visibility
DELETE /api/notes/{noteId}
```

## Worked example: report a message

### Operation worksheet

```text
Business intent: Report a message for moderation.
Actor: Authenticated active conversation member.
Required authority: Active membership in the message's active conversation.
Input supplied by the caller: messageId and reason.
Values derived by the API: reporter identity, ticket ID, ticket number,
  discussion conversation ID, statuses, and timestamps.
Preconditions: The message exists, the actor may view it, and the source
  conversation is active.
Atomic data changes: Create a ModerationTicket; create its confidential
  discussion Conversation; hide the non-deleted Message; pause its thread
  when applicable; create required AuditEvent records.
Result: The created ModerationTicket.
Business failures: Message unavailable, actor not eligible, conversation
  archived, or invalid reason.
Privacy considerations: Do not reveal other reports or reporters.
Retry/idempotency behavior: A repeated POST normally creates a distinct report;
  an idempotency key may prevent accidental duplicate submission.
```

### Route

```http
POST /api/messages/{messageId}/reports
```

```json
{
  "reason": "This message contains personal information."
}
```

The UI does not send `reportedById`, ticket status, ticket number, timestamps, message status, or discussion-conversation properties.

## Worked example: close a moderation ticket

### Operation worksheet

```text
Business intent: Close a moderation ticket with a terminal disposition.
Actor: Current owner or administrator of the source conversation.
Required authority: Current reviewer authority in the source conversation.
Input supplied by the caller: ticketId and disposition.
Values derived by the API: actor identity, closure timestamp, message and thread
  state after considering every ticket for the message, moderation actions, and
  audit events.
Preconditions: Ticket exists, is visible to the actor, and is not already closed.
Atomic data changes: Close the ticket; record keepMessage or removeMessage;
  create a delete action when required; recompute message visibility and thread
  pause state; create required audit history.
Result: The closed ticket and affected business state.
Business failures: Actor lacks reviewer authority, ticket already closed, or
  required linked records are inconsistent.
Privacy considerations: Response is restricted to authorized reviewers.
Retry/idempotency behavior: Repeating the command after closure returns a
  conflict unless a future contract explicitly supports idempotency keys.
```

### Route

```http
POST /api/moderation-tickets/{ticketId}/close
```

```json
{
  "disposition": "keepMessage"
}
```

This controlled operation is preferable to accepting an arbitrary patch such as `{ "status": "closed" }`, which could bypass the required disposition and linked state changes.

## Review checklist

Before approving an API operation, confirm:

- [ ] The operation originates from a documented business capability or resolved product decision.
- [ ] Its name uses domain vocabulary rather than mockup or storage terminology.
- [ ] A browser, bot, CLI, or future mobile client could use it with the same meaning.
- [ ] The actor and required conversation-scoped authority are explicit.
- [ ] Caller-supplied fields are separated from API-derived fields.
- [ ] Preconditions and state transitions are documented.
- [ ] Every durable side effect is listed and committed atomically.
- [ ] A generic patch cannot bypass required lifecycle rules or history.
- [ ] Privacy and information-disclosure behavior are explicit.
- [ ] Success and failure responses use appropriate HTTP semantics.
- [ ] Retry and idempotency behavior are defined.
- [ ] Returned durable objects preserve the approved YAML schema structures.
- [ ] Composite responses represent reusable business contexts rather than pages.
- [ ] The operation has a stable OpenAPI `operationId` and examples.
- [ ] Every related mockup interaction maps to the operation or remains entirely client-side.

## Standards references

- HTTP Semantics, RFC 9110: <https://www.rfc-editor.org/rfc/rfc9110.html>
- Problem Details for HTTP APIs, RFC 9457: <https://www.rfc-editor.org/rfc/rfc9457.html>
- OpenAPI Specification: <https://spec.openapis.org/oas/latest.html>
