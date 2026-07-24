---
type: route-review-changes
story: docs/feedback/user-review-tasks/003-moderation-routes-review-story.md
base_name: 003-moderation-routes-review
status: done
---

# Moderation Routes Review Changes

## Story

- Base name: `003-moderation-routes-review`
- Story: `docs/feedback/user-review-tasks/003-moderation-routes-review-story.md`
- Source feedback reviewed: `docs/feedback/user-review/mockup/routes/003-moderation-routes-review.md`
- Target artifact changed: `docs/mockup/routes/moderation-routes.md`

## Implementation Summary

- Preserved the existing no-active-suspension ticket example and labeled it as that response variant.
- Replaced composed source and related-discussion navigation strings in the ticket example with public conversation UIDs.
- Added a concrete existing-suspension response variant with the required participant UID, suspension UID, current suspension end time, source conversation UID, related-discussion conversation UID, availability state, and tags.
- Documented that the page constructs navigation links from the returned public conversation UIDs.
- Documented the exact field lineage from the existing-suspension response into the Update Posting Suspension request.

## Acceptance Criteria Checklist

1. **Implemented** — The Retrieve Moderation Ticket section now includes a fenced existing-suspension response variant containing:
   - `conversation.conversationUid`: `a12bc34d56ef4789a1234567890abcde`
   - `conversation.sourceAvailable`: `true`
   - `participant.participantUid`: `c34de56f78a9412ba34567890abcdef1`
   - `participant.postingSuspension.suspensionUid`: `e56f07819abc434da567890abcdef123`
   - `participant.postingSuspension.endsAt`: `2026-07-29T17:00:00-04:00`
   - `relatedDiscussion.conversationUid`: `f6701892abcd445ea67890abcdef1234`
   - `relatedDiscussion.tags`: `#mod-review` and `#ticket-1048`
2. **Implemented** — The ticket variant and the existing Update Posting Suspension request agree exactly:
   - `participant.participantUid` → `participantUid`: `c34de56f78a9412ba34567890abcdef1`
   - `participant.postingSuspension.suspensionUid` → `suspensionUid`: `e56f07819abc434da567890abcdef123`
   - `participant.postingSuspension.endsAt` → `currentEndsAt`: `2026-07-29T17:00:00-04:00`
3. **Implemented** — Stale composed navigation fields were removed from the relevant example, both response variants return public conversation UIDs, and the route prose assigns navigation-link construction to the page.

## Suggested-Fix Traceability

The complete fenced JSON example from the source feedback is implemented in `docs/mockup/routes/moderation-routes.md` under `Retrieve Moderation Ticket` → `Example Response Payload — Existing Suspension`.

| Suggested-fix content | Implemented target section | Key value checked |
| --- | --- | --- |
| Source conversation identity and availability | `conversation` object in `Example Response Payload — Existing Suspension` | `conversationUid = a12bc34d56ef4789a1234567890abcde`; `sourceAvailable = true` |
| Public participant identity | `participant` object in `Example Response Payload — Existing Suspension` | `participantUid = c34de56f78a9412ba34567890abcdef1` |
| Existing suspension identity | `participant.postingSuspension` object in `Example Response Payload — Existing Suspension` | `suspensionUid = e56f07819abc434da567890abcdef123` |
| Current suspension end time | `participant.postingSuspension` object in `Example Response Payload — Existing Suspension` | `endsAt = 2026-07-29T17:00:00-04:00` |
| Related discussion public identity | `relatedDiscussion` object in `Example Response Payload — Existing Suspension` | `conversationUid = f6701892abcd445ea67890abcdef1234` |
| Related discussion tags | `relatedDiscussion.tags` in `Example Response Payload — Existing Suspension` | `#mod-review`; `#ticket-1048` |
| Carry-forward relationships | Prose immediately after `Example Response Payload — Existing Suspension` and the existing `Update Posting Suspension` example request | Exact participant UID, suspension UID, and end-time/current-end-time values agree |

The example remains a triple-backtick `json` fence; it was not flattened into prose.

## Validation And Consistency Checks

- Read the final Retrieve Moderation Ticket and Update Posting Suspension sections and compared their participant UID, suspension UID, and end-time/current-end-time values.
- Searched the complete target artifact for `sourceConversationUrl`, `relatedDiscussion.conversationUrl`, and `"conversationUrl"`; no stale composed-navigation fields remain.
- Searched for all suspension lineage fields and confirmed the required values are present in the existing-suspension response and Update Posting Suspension request.
- Confirmed the no-active-suspension example still has `postingSuspension: null`, while the separately labeled existing-suspension variant carries the update continuation values.
- Confirmed both relevant response variants expose `relatedDiscussion.conversationUid`, and route prose says the page constructs navigation links.
- Confirmed the edited JSON response examples are syntactically valid.
- No project validators, dependency installation, or browser/visual validation were run because this is a Markdown route-document update.

## Files Changed

- `docs/mockup/routes/moderation-routes.md`
- `docs/feedback/user-review-tasks/003-moderation-routes-review-changes.md`

## Corrections, Compromises, Blockers, And Residual Risks

- Corrections: removed the two composed navigation-string fields and replaced the related-discussion field with its public conversation UID; added the existing-suspension variant and explicit update-request lineage.
- Compromises: none.
- Blockers: none.
- Residual risks: none identified within the approved route-document scope.

## Scope Confirmation

No out-of-scope file was intentionally modified. The story, source feedback, concept documents, schemas, mockup HTML, application source, package files, generated specifications, and unrelated route files were not edited.

## Peer Documentation Review

### Acceptance Criteria Status

1. **Implemented and peer verified** — `Retrieve Moderation Ticket` includes a triple-backtick `json` existing-suspension response variant with the exact required source conversation UID, `sourceAvailable: true`, participant UID, suspension UID, current end time, related-discussion conversation UID, and related tags.
2. **Implemented and peer verified** — The existing-suspension response carries `participant.participantUid`, `participant.postingSuspension.suspensionUid`, and `participant.postingSuspension.endsAt` into the `Update Posting Suspension` example as `participantUid`, `suspensionUid`, and `currentEndsAt` with exact value equality.
3. **Implemented and peer verified** — The target contains neither `sourceConversationUrl` nor `relatedDiscussion.conversationUrl`; the source and related discussion use public conversation UIDs, and the route prose assigns navigation-link construction to the page.

### Peer-Reviewed Suggested-Fix Traceability

The source feedback contains one required fenced JSON example. The peer review confirmed that it remains a triple-backtick `json` fence under `Retrieve Moderation Ticket` → `Example Response Payload — Existing Suspension` and preserves every required field and representative value:

| Suggested-fix field | Final target section | Peer-verified value |
| --- | --- | --- |
| `conversation.conversationUid` | Existing-suspension response `conversation` object | `a12bc34d56ef4789a1234567890abcde` |
| `conversation.sourceAvailable` | Existing-suspension response `conversation` object | `true` |
| `participant.participantUid` | Existing-suspension response `participant` object | `c34de56f78a9412ba34567890abcdef1` |
| `participant.postingSuspension.suspensionUid` | Existing-suspension response `postingSuspension` object | `e56f07819abc434da567890abcdef123` |
| `participant.postingSuspension.endsAt` | Existing-suspension response `postingSuspension` object | `2026-07-29T17:00:00-04:00` |
| `relatedDiscussion.conversationUid` | Existing-suspension response `relatedDiscussion` object | `f6701892abcd445ea67890abcdef1234` |
| `relatedDiscussion.tags[0]` | Existing-suspension response `relatedDiscussion.tags` | `#mod-review` |
| `relatedDiscussion.tags[1]` | Existing-suspension response `relatedDiscussion.tags` | `#ticket-1048` |
| Carry-forward `participantUid` | `Update Posting Suspension` example request | `c34de56f78a9412ba34567890abcdef1` |
| Carry-forward `suspensionUid` | `Update Posting Suspension` example request | `e56f07819abc434da567890abcdef123` |
| Carry-forward `currentEndsAt` | `Update Posting Suspension` example request | `2026-07-29T17:00:00-04:00` |

### Corrections Made By Peer Reviewer

- None. The implementation already satisfies the binding story and contains no concrete in-scope defect.

### Files Changed Across Both Phases

- `docs/mockup/routes/moderation-routes.md`
- `docs/feedback/user-review-tasks/003-moderation-routes-review-changes.md`

### Peer Consistency Checks

- Read the story, complete source feedback FAIL and suggested-fix block, final route target, and implementation report in full.
- Parsed the existing-suspension JSON example successfully and confirmed the target's Markdown fence markers are balanced.
- Compared the exact participant UID, suspension UID, and current end time in the ticket response with the `Update Posting Suspension` example request.
- Searched the complete target for `sourceConversationUrl`, `relatedDiscussion.conversationUrl`, and `conversationUrl`; no stale navigation field remains.
- Checked the ticket response prose, request context, existing-suspension example, update request prose, and update request example for contradictory ownership or carry-forward language; none was found.
- Confirmed the separate no-active-suspension variant remains coherent with `postingSuspension: null` and does not contradict the newly added existing-suspension variant.

### Scope Drift Check

The final route changes are limited to the story's listed target and directly address the failed ticket response contract. No new route behavior, security redesign, implementation work, schema change, mockup change, or unrelated route-document redesign was introduced. The peer reviewer changed only this allowed changes report.

### Residual Risks

- None identified within the approved Markdown route-document scope.

### Final Status

`done`
