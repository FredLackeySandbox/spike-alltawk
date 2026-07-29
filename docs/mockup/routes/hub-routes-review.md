# Hub Routes Review

Review target: `docs/mockup/routes/hub-routes.md`
Reviewer: Route File Reviewer

## Summary

- Routes reviewed: 8
- Decisions: 8 PASS, 0 FAIL

## Route Findings

## Create Conversation : (`POST /api/v0/hub/create-conversation`)

**Decision:** PASS

Operations reviewed: `POST /api/v0/hub/create-conversation`

The page supplies the visible tags, visibility, and listed-only matching choice while the documented cookie and CSRF bootstrap supply identified request context. The concrete response returns the new public UID, owner state, and workspace continuation needed by the success flow without exposing storage identifiers or accepting ownership decisions from the browser.

## Retrieve Listed Tag Suggestions : (`GET /api/v0/hub/retrieve-listed-tag-suggestions`)

**Decision:** PASS

Operations reviewed: `GET /api/v0/hub/retrieve-listed-tag-suggestions?partialTag={partialTag}&selectedTag={selectedTag}`

The current input and selected chips supply every query value, with the documented session cookie supplying private access context. The response echoes the active partial value and returns only discovery-eligible suggestion strings, including a documented empty-array outcome, so the listed UI can render safely without exposing unlisted-only tags or backend details.

## Search Listed Conversations : (`GET /api/v0/hub/search-listed-conversations`)

**Decision:** PASS

Operations reviewed: `GET /api/v0/hub/search-listed-conversations?selectedTag={selectedTag}`

The page invokes this route only when its visible validated chips provide the repeated query value, and the session transport is explicit. The concrete response echoes the evaluated tags and supplies safe public conversation UIDs, visible tags, participation and activity cues, and matching state needed for rendering and the later Join action without leaking unlisted or storage data.

## Join Listed Conversation : (`POST /api/v0/hub/join-listed-conversation`)

**Decision:** PASS

Operations reviewed: `POST /api/v0/hub/join-listed-conversation`

The public conversation UID is concretely carried forward from the listed-search response, while the documented cookie and CSRF value provide identified request context. The route keeps eligibility and membership decisions server-side and returns an adequate public UID and workspace continuation on success, with privacy-safe denial and retry contracts.

## Evaluate Known Unlisted Conversation Tags : (`POST /api/v0/hub/evaluate-known-unlisted-conversation-tags`)

**Decision:** PASS

Operations reviewed: `POST /api/v0/hub/evaluate-known-unlisted-conversation-tags`

The visible validated chips provide the complete request body and the documented cookie and CSRF transport provide identified context. The response gives the page privacy-safe state, hidden count, and join flag, and its concrete eligible example includes the exact session-bound `unlistedJoinChallengeUid` required by the next operation without revealing a hidden conversation identifier or tags.

## Join Unlisted Conversation : (`POST /api/v0/hub/join-unlisted-conversation`)

**Decision:** PASS

Operations reviewed: `POST /api/v0/hub/join-unlisted-conversation`

The request uses the exact challenge UID concretely returned by the immediately preceding eligible evaluation, with the same documented session and CSRF context. The UX API recovers and revalidates the hidden match server-side; its concrete success response and documented denial, expiry, and retry outcomes provide the visible result and safe workspace handoff without exposing hidden identity or permission decisions.

## Retrieve Joined Conversations : (`GET /api/v0/hub/retrieve-joined-conversations`)

**Decision:** PASS

Operations reviewed: `GET /api/v0/hub/retrieve-joined-conversations`

This page-lifecycle request needs no browser value beyond the explicitly documented session cookie. Its concrete projection supplies the public UID, kind, visible tags, role, and recent-activity fields required by each joined card and Resume control, while empty, retry, and session-required outcomes avoid returning former memberships or private list data.

## Resolve Joined Conversation Access : (`GET /api/v0/hub/resolve-joined-conversation-access`)

**Decision:** PASS

Operations reviewed: `GET /api/v0/hub/resolve-joined-conversation-access?conversationUid={conversationUid}`

The selected card receives its public conversation UID from the joined-list response, and the route explicitly derives identity from the session cookie rather than trusting browser role or membership state. The concrete active-access response provides the authorized workspace continuation, while the documented alternate outcomes define the exact stale-removal and retry signals the page needs without disclosing private workspace or storage details.
