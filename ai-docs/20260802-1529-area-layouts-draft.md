# Area Layouts Draft

## Files Reviewed

- `docs/concepts/REQUIREMENTS.md` (complete)
- `docs/concepts/USER_TYPES.md` (complete)
- `docs/concepts/APP_STRUCTURE.md` (complete)
- `ai-docs/20260802-1529-app-structure-review.md`

The allowed concept sources and app-structure review were sufficient. No braindump files were used.

## Area Mapping

| Application area | Access | Layout pattern | Navigation model |
|---|---|---|---|
| Product Home | `Public` | Product landing/home | `No persistent navigation` |
| Conversation Hub | `Private` | Directory and discovery workspace | `Shared app navigation` |
| Conversation Space | `Private` | Conversational workspace | `Area-specific navigation` |
| Conversation Administration | `Private` | Admin operations workspace | `Shared app navigation` |
| Moderation Center | `Private` | Moderation case-management workbench | `Area-specific navigation` |
| Bot Access | `Private` | Machine-to-machine interaction surface | `No persistent navigation` |

Every application area from `APP_STRUCTURE.md` has exactly one matching layout decision, with its area name and access value preserved.

## Navigation Relationships

`Conversation Hub` and `Conversation Administration` share authenticated product navigation because discovery, conversation access, and governance are related human tasks that benefit from consistent orientation. `Conversation Space` uses area-specific navigation centered on an active conversation and its communication context. `Moderation Center` also uses area-specific navigation because confidential case review has a distinct queue, lifecycle, and evidence-oriented work mode. Both focused areas retain a clear path back to the shared authenticated product without adopting its internal navigation structure.

`Product Home` has no persistent navigation because its public day-one role is limited to explanation and authentication entry. `Bot Access` has no persistent navigation because it serves non-human actors programmatically rather than through a visual application shell.

## Rejected Patterns and Models

- A dashboard pattern was rejected for `Product Home`; the public area introduces and routes rather than monitoring ongoing activity.
- A generic SaaS dashboard was rejected for `Conversation Hub`; directory and discovery behavior better reflects tag search, privacy-preserving hidden matches, conversation creation, and return access.
- Shared app navigation was rejected for `Conversation Space`; forcing discovery-oriented navigation into sustained messaging would weaken the active-conversation context.
- A modal or short flow was rejected for `Conversation Administration`; durable membership, role, configuration, and lifecycle work is too broad and consequential for a transient interaction.
- Shared app navigation and a generic administration dashboard were rejected for `Moderation Center`; confidential ticket review is recurring case work with a distinct lifecycle, not general settings management.
- A developer console was rejected for `Bot Access`; the requirements establish token-authenticated bot participation but do not define human token-management or developer-onboarding workflows.

## Ambiguities

- Bot token issuance, rotation, revocation, and human management remain undefined. `Bot Access` is therefore treated only as a headless interaction surface for authenticated bots, without inventing a developer console.
- Reviewer assignment and moderation notifications remain undefined. The case-management pattern does not assume either behavior.
- Archived-conversation presentation is not fully specified beyond exclusion from search and lack of content access. The Conversation Hub layout reserves archived context without prescribing a detailed presentation.

These ambiguities do not block the high-level area layout and navigation decisions. No braindump was needed to resolve prior decisions.
