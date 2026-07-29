# Conversation Routes Review

Review target: `docs/mockup/routes/conversation-routes.md`
Reviewer: Route File Reviewer

## Summary

- Routes reviewed: 13
- Decisions: 13 PASS, 0 FAIL

## Route Findings

## Retrieve Conversation Workspace : (`GET /api/v0/conversation/retrieve-workspace`)

**Decision:** PASS

Operations reviewed: `GET /api/v0/conversation/retrieve-workspace?conversationUid={conversationUid}`

The incoming page route and documented session cookie fully form the request; the response supplies the display-ready workspace, server-derived permissions, posting and leave state, and explicit current-participant flags needed for “You” and own-message treatment without exposing private identifiers or frontend-owned authorization decisions.

## Post Message : (`POST /api/v0/conversation/post-message`)

**Decision:** PASS

Operations reviewed: `POST /api/v0/conversation/post-message`

The current page route supplies `conversationUid`, the composer supplies `text`, and the documented cookie supplies identity; the response returns the complete attributed message for immediate insertion without exposing private identifiers or permission inputs.

## Add Emoji Reaction : (`POST /api/v0/conversation/add-emoji-reaction`)

**Decision:** PASS

Operations reviewed: `POST /api/v0/conversation/add-emoji-reaction`

The selected workspace message supplies its public UID and the visible control supplies the emoji; the response provides the exact updated aggregate while identity and reaction rules remain server-owned.

## Remove Emoji Reaction : (`DELETE /api/v0/conversation/remove-emoji-reaction`)

**Decision:** PASS

Operations reviewed: `DELETE /api/v0/conversation/remove-emoji-reaction`

The active reaction control already contains both required request values, and the response directly supplies the remaining aggregate without exposing another participant's reaction identity or internal state.

## Retrieve Message Note : (`GET /api/v0/conversation/retrieve-message-note`)

**Decision:** PASS

Operations reviewed: `GET /api/v0/conversation/retrieve-message-note?messageUid={messageUid}`

The selected workspace message supplies `messageUid`; the concrete create and update responses provide the availability, editable text, permissions, and public `noteUid` needed for the form and its next save operation while note access remains server-derived.

## Create Message Note : (`POST /api/v0/conversation/create-message-note`)

**Decision:** PASS

Operations reviewed: `POST /api/v0/conversation/create-message-note`

The initialized form has the selected public message UID and entered text, and the response returns the server-issued note UID and display indicator needed to update the thread without exposing unresolved visibility policy.

## Update Message Note : (`PATCH /api/v0/conversation/update-message-note`)

**Decision:** PASS

Operations reviewed: `PATCH /api/v0/conversation/update-message-note`

The note-retrieval response supplies the public `noteUid` and the form supplies replacement text; the update response confirms the noted state while attachment resolution and access stay behind the UX API.

## Retrieve Conversation Note : (`GET /api/v0/conversation/retrieve-conversation-note`)

**Decision:** PASS

Operations reviewed: `GET /api/v0/conversation/retrieve-conversation-note?conversationUid={conversationUid}`

The current page route supplies the public conversation UID, and the concrete create and update states give the form the editable content and public note identity it needs without exposing the unresolved visibility model.

## Create Conversation Note : (`POST /api/v0/conversation/create-conversation-note`)

**Decision:** PASS

Operations reviewed: `POST /api/v0/conversation/create-conversation-note`

The page route and visible form supply the conversation UID and text, and the response returns a server-issued public note UID plus confirmation while authorship and access remain server-derived.

## Update Conversation Note : (`PATCH /api/v0/conversation/update-conversation-note`)

**Decision:** PASS

Operations reviewed: `PATCH /api/v0/conversation/update-conversation-note`

The prior retrieval supplies the public `noteUid` and the form supplies replacement text; the response is sufficient to close and confirm the form without exposing attachment or authorization internals.

## Submit Message Report : (`POST /api/v0/conversation/submit-message-report`)

**Decision:** PASS

Operations reviewed: `POST /api/v0/conversation/submit-message-report`

The selected message and report form supply the public message UID and explanation, and the response provides the server-assigned ticket number and display indicator while reporter identity, conversation resolution, and moderator access remain server-owned.

## Delete Message : (`DELETE /api/v0/conversation/delete-message`)

**Decision:** PASS

Operations reviewed: `DELETE /api/v0/conversation/delete-message`

The selected visible message supplies its public UID and modal confirmation supplies intent; the response names the message to remove while authorization and retained soft-deletion metadata remain behind the UX API.

## Leave Conversation : (`DELETE /api/v0/conversation/leave-conversation`)

**Decision:** PASS

Operations reviewed: `DELETE /api/v0/conversation/leave-conversation`

The current page route and documented cookie fully form the request, and the concrete `BLOCKED` and `LEFT` responses support continuity guidance or departure while membership, role, and owner-count decisions remain server-derived.
