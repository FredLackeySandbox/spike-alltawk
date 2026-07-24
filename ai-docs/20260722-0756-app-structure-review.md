# App Structure Review Report

## Files Reviewed

- `docs/concepts/REQUIREMENTS.md`
- `docs/concepts/USER_TYPES.md`
- `docs/concepts/APP_STRUCTURE.md`
- `ai-docs/20260722-0754-app-structure-draft.md`

The requirements and current user model were sufficient for validation. Schema files and braindumps were not needed.

## Review Outcome

The app structure is approved without changes. Its six areas cover the day-one product without turning supporting capabilities into standalone micro-apps. The structure keeps the public/private boundary explicit, separates materially different human work modes, and gives token-authenticated bots a distinct non-interactive area without inventing a developer platform or bot-specific permission system.

## Per-Area Decisions

| Area | Decision | Review rationale |
|---|---|---|
| Product Home | Kept | Tawk needs one proportional unauthenticated surface to explain tagged conversations, state the identified-participation boundary, and route people into authentication. It exposes no conversation discovery or activity. |
| Conversation Hub | Kept | Listed discovery, privacy-preserving unlisted entry, joining, and conversation creation are closely related entry/setup jobs. Keeping them together avoids artificial splits while preserving their shared tag-based context. |
| Conversation Workspace | Kept | Messaging, reactions, notes, flagging, and self-managed participation form the common real-time collaboration mode for signed-in people across conversation roles. Privileged governance and ticket review remain appropriately outside it. |
| Conversation Governance | Kept | Tag, membership, role, restriction, ownership-continuity, and archival controls share a privileged conversation-operations boundary. Owner-only limits are stated without creating a redundant owner area. |
| Moderation Review | Kept | Numbered reports are a case-oriented review job with evidence, notes, and supported outcomes. This is materially different from general conversation settings and membership maintenance, even though both areas serve owners and administrators. |
| Bot Participation | Kept | Token-authenticated, non-interactive operation is a distinct product interface from human application areas. The scope correctly reuses the shared membership and role model and does not speculate about token issuance, integrations, or a developer console. |

No area was renamed, changed, merged, removed, or added during review.

## Product Home and Access Boundary

`Product Home` correctly serves as the single product-level public landing/home area. It explains the listed/unlisted conversation concept and routes prospective human participants to the unresolved authentication entry without exposing listed results, unlisted identities, private-only tags, or activity. No private micro-app has been mislabeled as another landing area.

All functional conversation activity remains behind authentication. The separate `Bot Participation` area accounts for token-authenticated bot access without suggesting that bots use the public human entry surface.

## Access-Field Normalization

Every application area uses exactly one allowed access value:

- `Product Home`: `Public`
- `Conversation Hub`: `Private`
- `Conversation Workspace`: `Private`
- `Conversation Governance`: `Private`
- `Moderation Review`: `Private`
- `Bot Participation`: `Private`

No hybrid, role-flavored, workflow-based, or contradictory access labels were present, so normalization edits were unnecessary.

## YAGNI Review

The draft appropriately avoids standalone areas for identity/profile maintenance, tag administration, conversation creation, listed versus unlisted discovery, notes, archives, and moderation discussions. These are either supporting capabilities, related portions of a larger day-one job, or unresolved behaviors. It also avoids unsupported product-wide administration, bot management, integration management, and developer-console areas.

`Moderation Review` is not premature despite unresolved ticket statuses: explicit requirements require owners and administrators to review numbered reports and take moderation action. Its day-one scope deliberately omits assignment, notification, and status workflows.

## Complexity Review

The structure is neither over-split nor over-combined:

- Discovery, hidden-conversation entry, joining, and creation remain together because they all establish a conversation context through tags.
- Live participation remains separate from privileged operations so ordinary members are not burdened with governance or moderation structures.
- Governance and moderation review remain separate because one is settings- and membership-oriented while the other is case-oriented; combining them would make two materially different operator jobs less clear.
- Owner and administrator differences remain within shared privileged areas because their capabilities overlap substantially and are already bounded in the scope text.
- Bot activity remains separate because its token-authenticated, non-interactive work mode requires a different product surface, while its permissions are intentionally not duplicated.

## User and Ability Coverage

- **Identified Person:** Covered by public orientation, private discovery and creation, joining, and the human conversation workspace.
- **Bot Participant:** Covered by private token-authenticated creation, discovery/joining, participation, and role-dependent operations in `Bot Participation`.
- **Conversation Owner:** Covered by participation, tag and member governance, role and ownership continuity, moderation review, and archival.
- **Conversation Administrator:** Covered by participation, permitted governance, former-member visibility, restrictions, and moderation review while explicitly excluding owner alteration and archival.
- **Ordinary Member:** Covered by messaging, own-message deletion, reactions, notes, flagging, and leaving without exposure to privileged management areas.

The structure also retains the key product behaviors: listed and unlisted tag matching, privacy-preserving hidden-result handling, shared human/bot membership roles, retained history, reporting, suspension, banning and restoration, and owner continuity.

## Remaining Direct Questions

These questions do not block the app structure, but answers would sharpen later area and page design:

1. What human authentication entry should `Product Home` route to?
2. What note visibility choices must the conversation workspace and moderation review support?
3. What minimum ticket states or closure behavior, if any, belong in day-one moderation review?
4. How should archived conversations appear, if at all, in participant and operator views?
5. Is a linked private moderation conversation optional for the POC or deferred entirely?

## Braindump Use

No braindump files were read or used.
