---
paired_html: docs/mockup/desktop/governance/members.html
description: "Review active and former participants, change permitted roles, and manage conversation-specific access restrictions."
---

# Backend Data Actions

## Retrieve Conversation Roster

### Page States

- Initial loading, active and former filters, empty-filter results, owner and administrator views, permission-denied ordinary-member entry, expired posting suspensions, and retryable load failure.

### Evidence

- `docs/mockup/desktop/governance/members.html` — the rendered page begins with “Loading conversation roster…”, then shows active and retained former people and bots, roles, restriction state, owner-continuity protection, empty results, a retry branch, and role-limited entry fixtures driven by `?fixture=`.
- `docs/concepts/REQUIREMENTS.md` — owners and administrators may review active and former membership, ordinary members may not see former members, and the last active owner must remain protected.
- `docs/concepts/APP_PAGES.md` — the page catalog requires a role-aware active/former roster and retained inactive or banned states.

### Backend Need

Retrieve the authoritative conversation membership, viewer authority, current and retained roles, posting restrictions, rejoin eligibility, and ownership-continuity state needed to render the roster. The result must support loading, empty, denied, failed, active, former, suspended, and expired-suspension outcomes without exposing former membership to an ordinary member.

### Visible Inputs

- Current conversation identifier from the page route.
- Selected active or former roster filter when refreshing the visible collection.

### Required Outcomes

- Show the current roster with people and bots, role, access state, effective restriction details, and retained former status.
- Show only actions permitted to the viewer, protect the last owner, and omit former membership for an ordinary member.
- Resolve an expired posting suspension to active participation.
- Show loading, empty, permission-denied, and retryable failure states.

## Promote Participant to Owner

### Page States

- Owner view with an eligible active administrator or member selected from the roster and the promotion confirmation open.

### Evidence

- `docs/mockup/desktop/governance/members.html` — eligible rows expose “Promote to owner,” the confirmation describes conversation owner permissions, and success changes the row role to Owner and clears the last-owner warning when another owner exists.
- `docs/concepts/REQUIREMENTS.md` — owners may promote a member to owner, administrators cannot alter owners, and a conversation must retain at least one owner.

### Backend Need

Persist the selected active participant’s owner role with the appropriate effective history and recompute conversation ownership continuity. The operation must be restricted to a current owner and return the updated role and owner-protection state.

### Visible Inputs

- Selected participant identifier from the roster row.
- Explicit confirmation to grant the owner role.

### Required Outcomes

- Confirm the consequential role change before submission.
- Show the participant as an owner and update the last-owner protection notice on success.
- Preserve the prior roster state and show a blocked, stale-permission, or failed outcome when the promotion cannot be applied.

## Promote Participant to Administrator

### Page States

- Owner view with an eligible active member selected from the roster and the administrator-promotion confirmation open.

### Evidence

- `docs/mockup/desktop/governance/members.html` — eligible member rows expose “Promote to administrator,” while administrator entry removes owner-promotion controls and owner rows remain protected.
- `docs/concepts/REQUIREMENTS.md` — owners may promote members to administrator, and administrators cannot add, remove, or otherwise alter owners.

### Backend Need

Persist the selected active participant’s administrator role and its effective role history after verifying that the current viewer remains authorized. Return the updated role and allowed row actions.

### Visible Inputs

- Selected participant identifier from the roster row.
- Explicit confirmation to grant the administrator role.

### Required Outcomes

- Confirm the role change before submission.
- Show the participant as an administrator with the correct permitted actions on success.
- Preserve the prior role and show a blocked, stale-permission, or failed outcome when the promotion cannot be applied.

## Remove Participant

### Page States

- Owner or administrator view with an eligible active participant selected and the removal confirmation open.
- Owner view with an eligible owner selected when another active owner preserves ownership continuity; administrators cannot alter owners, and the last active owner remains protected.

### Evidence

- `docs/mockup/desktop/governance/members.html` — “Remove…” opens a confirmation explaining that active participation ends while membership and authored content remain retained; success moves the row to Former with a removal date and changes the counts.
- `docs/concepts/REQUIREMENTS.md` — owners and administrators may remove participants, removal ends rather than deletes membership, administrators may not alter owners, and the conversation must retain at least one owner.

### Backend Need

End the selected participant’s active membership without hard deletion while retaining authored content and membership history. Enforce role authority and owner continuity before returning the updated former-membership state.

### Visible Inputs

- Selected participant identifier from the roster row.
- Explicit removal confirmation.

### Required Outcomes

- Show the retention consequence before confirmation.
- Move the participant to the former roster, update active/former counts, and keep the identity eligible for a later ban or permitted rejoin.
- Leave membership unchanged and explain any protected-owner, stale-permission, or failed outcome.

## Ban Identity

### Page States

- Owner or administrator view with an eligible active or former identity selected and the ban confirmation open.
- Owner view with an eligible owner selected when another active owner preserves ownership continuity; administrators cannot alter owners, and the last active owner remains protected.

### Evidence

- `docs/mockup/desktop/governance/members.html` — both active and removed rows can invoke Ban; success marks the identity Banned, moves active identities to Former, records a visible effective date, and makes the local rejoin check return false.
- `docs/concepts/REQUIREMENTS.md` — owners and administrators may ban participants, banning retains membership with no participation rights, administrators may not alter owners, and a conversation cannot be left without an owner.

### Backend Need

Persist the selected identity’s banned conversation-membership state and end any active participation without deleting retained history. The operation must prevent future rejoin attempts and respect owner and administrator authority boundaries.

### Visible Inputs

- Selected participant identifier from the active or former roster row.
- Explicit ban confirmation.

### Required Outcomes

- Explain that banning is stronger than removal before confirmation.
- Show the identity as banned in the former roster, update counts when needed, and offer Unban to an authorized viewer.
- Preserve prior state and show a protected, stale-permission, or failed outcome when the ban cannot be applied.

## Restore Banned Participant

### Page States

- Owner or administrator view with a banned former participant selected and the restoration confirmation open.

### Evidence

- `docs/mockup/desktop/governance/members.html` — a banned former row exposes Unban, but its success branch changes the access state only to Eligible and explicitly does not reactivate membership.
- `docs/concepts/REQUIREMENTS.md` — owners and administrators may unban an identity and restore an appropriate active role; the retained membership role history records that transition.

### Backend Need

End the selected participant’s banned state and restore an appropriate active conversation role while retaining prior membership and ban history. The current mockup’s eligibility-only outcome is inconsistent with the explicit restoration flow in the requirements.

### Visible Inputs

- Selected banned participant identifier from the former roster row.
- Displayed role to restore from the retained roster entry.
- Explicit restoration confirmation.

### Required Outcomes

- Explain that restoration ends the ban and reactivates participation with the appropriate role.
- Show the participant as active with the restored role and update active/former counts.
- Preserve the ban and show a stale-permission or failed outcome when restoration cannot be applied.

## Create Posting Suspension

### Page States

- Owner or administrator view with an active, currently unsuspended participant selected and the suspension form open.

### Evidence

- `docs/mockup/desktop/governance/members.html` — “Suspend posting…” requests an end date and time, validates missing or past values, shows a pending state, and then renders “Posting suspended” with the effective end.
- `docs/concepts/REQUIREMENTS.md` — owners and administrators may suspend posting until a specified date or time while membership and reading access remain active.

### Backend Need

Create a time-bounded posting suspension for the selected active participant while leaving conversation membership and reading access intact. Return the authoritative effective end and updated allowed actions.

### Visible Inputs

- Selected participant identifier from the roster row.
- Suspension end date.
- Suspension end time and displayed time zone context.

### Required Outcomes

- Reject missing, invalid, or non-future end values without changing the participant.
- Show a pending state, then show the participant as posting-suspended with the authoritative end date and time on success.
- Preserve active posting and show a stale-permission or failed outcome when the suspension cannot be created.

## Update Posting Suspension

### Page States

- Owner or administrator view with an already suspended participant selected and the “Change suspension” form prefilled with the current end.

### Evidence

- `docs/mockup/desktop/governance/members.html` — suspended rows expose “Change suspension…”, prefill the stored end date and time, and replace the visible restriction end after confirmation.
- `docs/concepts/REQUIREMENTS.md` — posting suspensions are time-bounded retained restrictions managed by owners and administrators.

### Backend Need

Update the identified participant’s existing posting suspension to a new future end while preserving the continuing membership and restriction history. Return the revised effective end and current access state.

### Visible Inputs

- Selected participant identifier from the roster row.
- Existing suspension identifier or carry-forward public reference from the roster result.
- Revised suspension end date.
- Revised suspension end time and displayed time zone context.

### Required Outcomes

- Prefill the current end and reject missing, invalid, or non-future revisions.
- Show a pending state and the revised posting-suspension end on success.
- Keep the current suspension unchanged and show a stale, missing, or failed outcome when the update cannot be applied.

## End Posting Suspension

### Page States

- Owner or administrator view with a currently suspended participant selected and the immediate-end confirmation open.

### Evidence

- `docs/mockup/desktop/governance/members.html` — “End suspension now” opens a confirmation and success changes the participant to Active, restores full participation, and removes the immediate-end action.
- `docs/concepts/REQUIREMENTS.md` — owners and administrators may lift a time-bounded posting suspension while the participant remains a member.

### Backend Need

End the selected participant’s current posting suspension immediately and return the restored posting-access state while retaining restriction history.

### Visible Inputs

- Selected participant identifier from the roster row.
- Existing suspension identifier or carry-forward public reference from the roster result.
- Explicit confirmation to restore posting access now.

### Required Outcomes

- Explain that membership and reading were not interrupted before confirmation.
- Show Active with full participation and remove suspension-ending controls on success.
- Keep the suspension in force and show a stale, missing, or failed outcome when it cannot be ended.
