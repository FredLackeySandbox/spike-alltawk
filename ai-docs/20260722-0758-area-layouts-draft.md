# Area Layouts Draft Report

## Files Reviewed

- `docs/concepts/REQUIREMENTS.md`
- `docs/concepts/USER_TYPES.md`
- `docs/concepts/APP_STRUCTURE.md`
- `ai-docs/20260722-0756-app-structure-review.md`

`docs/concepts/AREA_LAYOUTS.md` did not previously exist. The permitted primary documents were sufficient, so no braindump files were read or used.

## Area Mapping

| Application area | Access | Layout pattern | Navigation model |
|---|---|---|---|
| Product Home | `Public` | Product landing/home | `No persistent navigation` |
| Conversation Hub | `Private` | Directory/detail with creation flow entry | `Shared app navigation` |
| Conversation Workspace | `Private` | Conversational/inbox | `Shared app navigation` |
| Conversation Governance | `Private` | Admin operations | `Area-specific navigation` |
| Moderation Review | `Private` | Case-management inbox/detail | `Area-specific navigation` |
| Bot Participation | `Private` | Non-interactive authenticated service interface | `No persistent navigation` |

Every application area from `APP_STRUCTURE.md` has exactly one corresponding layout decision with the same name and access value.

## Navigation Sharing and Distinctness

The Conversation Hub and Conversation Workspace share the private human application navigation because finding, creating, revisiting, and participating in conversations form one continuous member journey. Conversation Governance and Moderation Review remain reachable from the relevant conversation context but use area-specific navigation: governance organizes privileged settings and membership concerns, while moderation organizes case evidence and outcomes. Product Home has no persistent navigation because it is a concise public entry surface, and Bot Participation has none because bots operate through a non-interactive authenticated interface.

## Rejected Poor-Fit Choices

- A generic dashboard was rejected for the Conversation Hub because its primary job is tag-driven discovery and setup, not metric monitoring.
- A dashboard was rejected for the Conversation Workspace because chronological conversation activity, not summary cards, is the dominant work mode.
- Shared member navigation as the only structure for Conversation Governance and Moderation Review was rejected because each contains privileged work that needs a stable local organization and a clearer operational boundary.
- Flow navigation for all conversation creation and unlisted joining was rejected at the area level because those tasks begin within the broader hub; only the focused creation path behaves like a setup flow.
- A developer-console layout was rejected for Bot Participation because the requirements define token-authenticated bot participation, not token administration, integration management, or a broader developer platform.

## Ambiguities

- Human authentication remains unspecified, so Product Home identifies the entry destination without defining its flow.
- Listed-search behavior with extra tags and hidden-result handling for multiple matches remain unresolved, so the Conversation Hub layout preserves room for privacy-safe result states without choosing interaction semantics.
- Note visibility remains unresolved, so Conversation Workspace and Moderation Review acknowledge notes without implying a visibility control model.
- Moderation ticket statuses, assignment, notification, and closure behavior remain unresolved, so Moderation Review uses a case-oriented structure without inventing workflow stages.
- Archived-conversation visibility remains unresolved, so no archive-specific navigation or area was added.

## Braindump Use

No braindump files were read or used.
