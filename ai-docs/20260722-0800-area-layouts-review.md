# Area Layouts Review Report

## Files Reviewed

- `docs/concepts/REQUIREMENTS.md`
- `docs/concepts/USER_TYPES.md`
- `docs/concepts/APP_STRUCTURE.md`
- `docs/concepts/AREA_LAYOUTS.md`
- `ai-docs/20260722-0758-area-layouts-draft.md`
- `ai-docs/20260722-0756-app-structure-review.md`

The permitted primary documents and prior phase reports were sufficient for validation. No braindump files were read or used.

## Review Outcome

`AREA_LAYOUTS.md` is approved without changes. It provides exactly one layout decision for each of the six application areas, preserves every source area name and access boundary, uses only allowed navigation models, and keeps its guidance at the area-strategy level. The selected patterns fit the work mode of each area without introducing page inventories, component specifications, routes, implementation mechanics, branding, color choices, or future-roadmap scope.

## Per-Area Decisions

| Area | Decision | Review rationale |
|---|---|---|
| Product Home | Kept | The product landing/home pattern is proportional to Tawk's only unauthenticated surface. No persistent navigation is appropriate because its day-one job is concise product explanation and routing into identified access, not public product browsing. |
| Conversation Hub | Kept | The directory/detail pattern fits tag-driven discovery and privacy-safe result evaluation, while the creation-flow entry acknowledges the related focused setup job without splitting it into a speculative standalone area. Shared app navigation correctly connects discovery and creation with the human conversation journey. |
| Conversation Workspace | Kept | The conversational/inbox pattern matches chronological messaging and participation. Shared app navigation maintains continuity with the hub while keeping privileged governance and moderation secondary and separately structured. |
| Conversation Governance | Kept | The admin-operations pattern fits conversation-scoped settings, membership, roles, restrictions, and lifecycle decisions. Area-specific navigation is justified by the density and consequences of this privileged work while retaining a clear return to the conversation context. |
| Moderation Review | Kept | The case-management inbox/detail pattern appropriately groups numbered reports, evidence, notes, and supported outcomes without inventing unresolved workflow states. Area-specific navigation fits movement among moderation cases and their context. |
| Bot Participation | Kept | A non-interactive authenticated service interface is the appropriate product pattern for token-authenticated machine actors. No persistent navigation avoids incorrectly turning bot participation into a human developer console or visual workspace. |

No area was renamed to match app structure, changed, removed, or added during review.

## Exact Coverage and Access Confirmation

Every application area from `APP_STRUCTURE.md` appears exactly once in `AREA_LAYOUTS.md`, with the exact same source name and matching access value:

| Application area | Layout decision count | App-structure access | Area-layout access |
|---|---:|---|---|
| Product Home | 1 | `Public` | `Public` |
| Conversation Hub | 1 | `Private` | `Private` |
| Conversation Workspace | 1 | `Private` | `Private` |
| Conversation Governance | 1 | `Private` | `Private` |
| Moderation Review | 1 | `Private` | `Private` |
| Bot Participation | 1 | `Private` | `Private` |

All copied access values are exactly `Public` or `Private`. There are no missing, extra, duplicated, or mismatched area decisions.

## Navigation Consistency

Every navigation model uses one of the allowed values. `Conversation Hub` and `Conversation Workspace` use `Shared app navigation` because discovery, creation entry, conversation switching, and participation form a continuous signed-in human journey. `Conversation Governance` and `Moderation Review` use `Area-specific navigation` because their privileged settings-oriented and case-oriented work modes require distinct local organization while remaining connected to the relevant conversation. `Product Home` and `Bot Participation` use `No persistent navigation`: the first is a focused public orientation surface, and the second is non-interactive machine access.

No area needs `Flow navigation` at the area level. The focused creation path is correctly contained within the broader Conversation Hub rather than treated as a separate application area. No area is a modal or embedded product surface, so `Modal or embedded navigation` is also unnecessary.

## Pattern-Fit and Complexity Review

- **Generic-dashboard risk:** Avoided. Neither discovery nor active conversation work is forced into a summary-card or metrics-oriented dashboard pattern.
- **Overcombined human workspace risk:** Avoided. Conversation participation, governance, and case review retain distinct patterns because their information density, authority, and work modes differ materially.
- **Oversplit setup-flow risk:** Avoided. Conversation creation remains a focused entry from the Conversation Hub instead of becoming another application area or public landing surface.
- **Invented moderation workflow risk:** Avoided. The case-management pattern supports evidence and outcomes without implying statuses, assignments, notifications, or closure behavior that the requirements leave unresolved.
- **Bot-console speculation risk:** Avoided. The non-interactive service pattern supports token-authenticated bot actions without inventing token administration, integration management, or a developer platform.
- **Design-detail creep:** Avoided. The document states interaction density, hierarchy, and posture without prescribing pages, components, routes, implementation, brand treatment, colors, or roadmap capabilities.

No edits were required to handle these concerns because the draft already addresses them conservatively.

## Remaining Direct Questions

These questions do not block approval, but their answers would sharpen later page-design work:

1. What human authentication entry should Product Home lead to?
2. What note visibility choices must Conversation Workspace and Moderation Review represent?
3. What minimum ticket states or closure behavior, if any, belong in day-one Moderation Review?
4. How should archived conversations appear, if at all, in Conversation Hub, Conversation Workspace, or governance contexts?
5. Is a linked private moderation conversation optional for the POC or deferred entirely?

## Braindump Use

No braindump files were read or used.
