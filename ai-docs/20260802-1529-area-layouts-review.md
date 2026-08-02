# Area Layouts Review

## Files Reviewed

- `docs/concepts/REQUIREMENTS.md` (complete)
- `docs/concepts/USER_TYPES.md` (complete)
- `docs/concepts/APP_STRUCTURE.md` (complete)
- `docs/concepts/AREA_LAYOUTS.md` (complete)
- `ai-docs/20260802-1529-area-layouts-draft.md`
- `ai-docs/20260802-1529-app-structure-review.md`

The allowed concept sources and phase reports were sufficient for this validation. No braindump files were used.

## Area Layout Decisions

| App-structure area | Final layout heading and source area | Decision | Access | Layout pattern | Navigation model | Review rationale |
|---|---|---|---|---|---|---|
| Product Home | Product Home | Kept | `Public` | Product landing/home | `No persistent navigation` | The proportional explanation-and-entry surface fits the product's only unauthenticated area. Omitting persistent navigation avoids implying unsupported public destinations. |
| Conversation Hub | Conversation Hub | Kept | `Private` | Directory and discovery workspace | `Shared app navigation` | A directory/discovery pattern fits cross-conversation search, exact-tag joining, creation, and return access. Sharing the authenticated frame with administration preserves orientation across related signed-in work. |
| Conversation Space | Conversation Space | Kept | `Private` | Conversational workspace | `Area-specific navigation` | A conversation-centered pattern fits sustained messaging and participant context. Area-specific navigation keeps the active conversation primary while retaining a clear return to the hub. |
| Conversation Administration | Conversation Administration | Kept | `Private` | Admin operations workspace | `Shared app navigation` | A durable operations pattern fits configuration, membership, roles, and lifecycle controls. Shared authenticated navigation is appropriate because this remains part of the same human-facing product rather than an isolated case workflow. |
| Moderation Center | Moderation Center | Kept | `Private` | Moderation case-management workbench | `Area-specific navigation` | A case-management workbench fits confidential tickets, lifecycle states, evidence context, and terminal dispositions. Its restricted queue-and-case work justifies navigation distinct from discovery and routine governance. |
| Bot Access | Bot Access | Kept | `Private` | Machine-to-machine interaction surface | `No persistent navigation` | The headless interaction pattern fits token-authenticated automated actors without inventing a developer console. Visual navigation is inapplicable because permissions and available actions derive from bot identity, membership, role, and product state. |

No layout was renamed, changed, removed, or added.

## Coverage and Structural Confirmation

`APP_STRUCTURE.md` defines exactly six areas: `Product Home`, `Conversation Hub`, `Conversation Space`, `Conversation Administration`, `Moderation Center`, and `Bot Access`. `AREA_LAYOUTS.md` contains exactly one `###` layout decision for each of those areas, with an exact matching heading and exact matching `Source area` value. It contains no extra layout decisions.

Every copied access value matches `APP_STRUCTURE.md` and is exactly one of the permitted labels: `Product Home` is `Public`; the other five areas are `Private`.

Every layout decision contains the required layout-pattern, area-structure, navigation-model, navigation-rationale, and design-implications fields. No section introduces page inventories, wireframes, component specifications, routes, branding, color systems, implementation architecture, or roadmap commitments.

## Navigation Consistency

`Conversation Hub` and `Conversation Administration` use `Shared app navigation` because cross-conversation orientation and conversation governance are related signed-in human tasks within one product frame. `Conversation Space` uses `Area-specific navigation` to keep sustained participation centered on the active conversation. `Moderation Center` also uses `Area-specific navigation`, but for a different reason: its confidential queue, case lifecycle, evidence, and closure work form a distinct restricted mode. Both focused private areas preserve a path back to the authenticated product without inheriting the hub's internal organization.

`Product Home` uses `No persistent navigation` because its sole day-one job is proportional product explanation and authentication entry. `Bot Access` also uses `No persistent navigation`, because it is a non-human programmatic surface rather than a visual application area. No area needs `Flow navigation` or `Modal or embedded navigation` at the area level.

All navigation models exactly match the allowed values.

## Pattern Fit and Complexity Review

- The public home avoids an inappropriate dashboard pattern and remains proportional to the product's public scope.
- The hub uses a directory/discovery workspace rather than a generic SaaS dashboard, keeping tag search and the unlisted-conversation privacy boundary primary.
- The conversation area remains a dedicated conversational workspace rather than absorbing administration or moderation controls into the ordinary participation context.
- Durable conversation governance and confidential case review remain separate. Combining them would mix routine configuration with restricted, stateful evidence and disposition work; splitting their individual controls into more areas would overcomplicate the MVP.
- Bot access remains explicitly headless. The draft does not speculate about token issuance, developer onboarding, or a human-facing developer console.
- The design implications stay at the required interaction-density, information-hierarchy, and visual-posture level. State distinctions are retained only where they materially affect the area's work mode and requirements alignment.

No generic, trendy, mismatched, overbuilt, or oversimplified pattern required correction.

## Remaining Questions

The following product questions could refine later page or interaction design but do not block these area-layout decisions:

- How should archived conversations be presented in the authenticated hub beyond remaining visible as inaccessible existing conversations and being excluded from search?
- What reviewer-assignment and moderation-notification behaviors should influence the Moderation Center's information hierarchy?
- Who issues, rotates, and revokes bot tokens, and will those activities ever require a separate human-facing management surface?

These questions do not justify changing or adding an area based on the current requirements.
