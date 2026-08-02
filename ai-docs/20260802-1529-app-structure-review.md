# App Structure Review

## Files Reviewed

- `docs/concepts/REQUIREMENTS.md` (complete)
- `docs/concepts/USER_TYPES.md` (complete)
- `docs/concepts/APP_STRUCTURE.md`
- `ai-docs/20260802-1529-app-structure-draft.md`

The requirements, user model, current app-structure draft, and draft report were sufficient for this review. No schema files or braindumps were used.

## Area Decisions

| Draft area | Final area | Decision | Review rationale |
|---|---|---|---|
| Product Home | Product Home | Changed | Kept the single proportional public explanation and authentication-entry surface, and clarified that its primary user is a Person before authentication. |
| Conversation Hub | Conversation Hub | Changed | Kept discovery, exact-tag unlisted joining, creation, and conversation access together. Clarified that eligible moderation discussions appear here only as conversation-list entry points; the confidential review work remains in Moderation Center. |
| Conversation Space | Conversation Space | Kept | Messaging, threads, reactions, notes, flagging, and leaving form one coherent conversation-scoped participation area for people and bots in any active role. |
| Conversation Administration | Conversation Administration | Changed | Kept privileged configuration and membership controls together and clarified that enabling top-level conversation notes is owner-controlled. |
| Moderation Center | Moderation Center | Changed | Kept confidential ticket work separate from general administration and clarified that suspensions and participant actions listed here are actions taken during ticket review. |
| Bot Access API | Bot Access | Renamed | Preserved the distinct token-authenticated non-human boundary while removing `API` from the area name so the product structure does not depend on an implementation mechanism. The scope still supports bots under the same conversation roles and rules as people. |

No drafted area was merged or removed, and no new area was added. Each final area serves a materially distinct day-one job or access boundary.

## Product Home Coverage

Tawk has a meaningful public/private boundary because people need a clear introduction and supported authentication entry before any conversation discovery, joining, creation, or participation. `Product Home` remains the sole product-level public area. It explains listed and unlisted conversations proportionally, states the identified-participation requirement, and routes people into authentication. No private micro-app has been promoted into a duplicate public landing area.

## Access Normalization

Every final application area uses exactly one permitted access value:

| Area | Access | Basis |
|---|---|---|
| Product Home | `Public` | Reachable before authentication for product explanation and authentication entry. |
| Conversation Hub | `Private` | Requires an identified human session before discovery, joining, creation, or conversation access. |
| Conversation Space | `Private` | Requires authenticated identity plus active conversation membership and applicable role state. |
| Conversation Administration | `Private` | Requires authenticated identity plus owner or administrator authorization in the conversation. |
| Moderation Center | `Private` | Requires authenticated identity plus current owner or administrator authorization for the source conversation. |
| Bot Access | `Private` | Requires a token-authenticated bot identity and applicable conversation membership or role. |

No hybrid, audience-flavored, role-flavored, or contradictory access labels were present. Conversation-specific authorization nuances remain in primary users, purpose, rationale, or day-one scope rather than in the `Access` field.

## YAGNI Review

- Kept listed and unlisted discovery together in `Conversation Hub`; their matching and privacy rules differ, but they serve the same cross-conversation discovery and joining job.
- Kept conversation creation and the signed-in conversation list in `Conversation Hub`; neither warrants a standalone day-one product area.
- Did not add a profile or account-management area because the MVP requires identity and profile context but does not define a substantial user-managed account workflow.
- Did not add a developer console or token-management area because token issuance, rotation, and developer onboarding are not defined.
- Did not add separate archive, custom-emoji, warning, suspension, membership-history, or role-management areas; these remain capabilities of the areas that already own their day-one jobs.
- Kept `Bot Access` because token-authenticated bots are a first-class actor with a materially different interaction boundary, but removed the implementation-specific `API` label.

## Complexity Review

The six-area structure is proportional to the MVP. Combining `Conversation Administration` and `Moderation Center` would mix durable configuration and membership governance with confidential, stateful case review. Combining either with `Conversation Space` would overload the ordinary participation context with privileged controls. Conversely, splitting individual controls or discovery modes into more areas would fragment closely related work without a day-one benefit.

The only cross-area overlap retained intentionally is entry-point visibility: eligible moderation discussions may appear in the signed-in conversation list, while their actual confidential ticket work belongs to `Moderation Center`. Bot capabilities mirror human capabilities by requirement, but `Bot Access` remains distinct because its actor and authentication boundary are non-human.

## Coverage

- **Person:** Public product entry and authentication routing are covered by `Product Home`; signed-in discovery, joining, creation, conversation access, and profile context are covered by `Conversation Hub`.
- **Bot:** Token-authenticated discovery, joining, creation, participation, and permitted privileged work are covered by `Bot Access` under the shared role model.
- **Ordinary Member:** Messaging, threads, reactions, contextual notes, reporting, membership exit, and eligible rejoining are covered by `Conversation Space` and `Conversation Hub`.
- **Conversation Owner:** Conversation creation, role continuity, member governance, configuration, custom emoji, top-level note availability, moderation, participation, and archival are covered across `Conversation Hub`, `Conversation Administration`, `Moderation Center`, and `Conversation Space`.
- **Conversation Administrator:** Tag and participant management, posting restrictions, custom emoji, confidential ticket resolution, and ordinary participation are covered by `Conversation Administration`, `Moderation Center`, and `Conversation Space`, without granting ownership control.
- **Privacy and retention rules:** Unlisted-discovery secrecy is located in `Conversation Hub`; ticket confidentiality and reporter separation are located in `Moderation Center`; membership, suspension, ban, deletion, ticket-hold, and archival effects are reflected in the relevant private areas without creating standalone products.

## Remaining Questions

The following unresolved product questions are non-blocking for app structure:

- What user-managed profile or linked-authentication actions, if any, should be available beyond displaying imported identity context?
- How are bot tokens issued, rotated, and revoked, and who is allowed to manage them?
- How should archived conversations be presented to former participants beyond remaining visible as inaccessible existing conversations?
- What reviewer-assignment and moderation-notification behavior should the ticket workflow use?

None of these questions requires an additional day-one application area based on the current requirements.
