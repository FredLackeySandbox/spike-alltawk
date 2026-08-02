# User Abilities Review

## Files Reviewed

- `docs/concepts/REQUIREMENTS.md`
- `docs/schemas/DICTIONARY.md`
- `docs/schemas/*.yaml`
- `docs/concepts/USER_TYPES.md`
- `ai-docs/20260802-1529-user-abilities-draft.md`
- `ai-docs/20260802-1529-user-types-review.md`

No braindump files were needed.

## Ability Decisions

| User type | Ability | Decision | Rationale |
|---|---|---|---|
| Person | Authenticate as an identified person | Kept | Directly reflects verified OIDC or passwordless-email authentication and linked human authentication connections. |
| Person | Present a recognizable profile | Kept | Covers the required display name and supported human profile attributes without implying unsupported profile-management workflows. |
| Bot | Authenticate as an identified bot | Kept | Token authentication under a persistent bot identity is explicit in the requirements and schemas. |
| Bot | Use the shared conversation role model | Changed to **Present a recognizable bot profile** | The former wording duplicated the conversation-role dimension and described a constraint more than an actor ability. The replacement covers the bot's required visible identity while retaining the shared-role boundary. |
| Conversation Owner | Create and configure a conversation | Kept | Covers required title, description, initial tags, visibility, listed matching behavior, later tag management, and owner control of top-level note availability. |
| Conversation Owner | Govern privileged roles and continuity | Kept | Ownership changes and the requirement to preserve at least one active owner distinguish this role. |
| Conversation Owner | Operate and moderate the conversation | Kept | Conservatively groups the participant, moderation, custom-emoji, posting-restriction, and confidential-review authority shared by owners. |
| Conversation Owner | Participate as an active member | Kept | Owners retain baseline participant capabilities; referencing them once avoids copying the Ordinary Member list. |
| Conversation Owner | Archive the conversation | Kept | Archival is an explicit owner-only day-one action and the alternative available to a last owner who cannot leave. |
| Conversation Administrator | Maintain conversation organization | Kept | Tag management and conversation-scoped custom emoji are explicit administrator capabilities. |
| Conversation Administrator | Manage participant access | Kept | Removal, banning, restoration, and time-limited posting restrictions are explicit administrator authority, while ownership remains excluded. |
| Conversation Administrator | Review and resolve reported content | Changed | Replaced vague “other supported actions” wording with the explicit warning targets while retaining confidential review and required closure disposition. |
| Conversation Administrator | Participate as an active member | Kept | Administrators retain baseline participant capabilities; the cross-reference avoids duplication. |
| Ordinary Member | Discover and join conversations | Kept | Covers listed tag discovery and exact complete-tag entry for unlisted conversations as the ordinary transition into membership. |
| Ordinary Member | Manage personal membership | Kept | Voluntary leave and eligible rejoin behavior are explicit, as are ban and archival restrictions. |
| Ordinary Member | Exchange messages and reactions | Kept | Covers reading, posting, threaded replies, own-message deletion, and standard or available custom reactions. |
| Ordinary Member | Keep contextual notes | Kept | Covers note creation and author-controlled visibility within each permitted context. |
| Ordinary Member | Report concerning content | Kept | Covers reporter explanation, one numbered ticket per report, and protection from disclosure of other reporters. |

No abilities were added or removed.

## Coverage Notes

- **Actor classes versus conversation roles:** Person and Bot now contain authentication and visible-identity abilities. Owner, Administrator, and Ordinary Member contain conversation work. A person or bot may hold any of those roles in different conversations, so role abilities are not repeated under both actor classes.
- **Creation, discovery, and membership:** Conversation creation maps to the owner role established at creation. Listed and exact-match unlisted joining map to the ordinary membership path, with bans, archival, leaving, and rejoining covered.
- **Conversation operation:** Owner and Administrator abilities cover tag management, participant access, former or banned member restoration, posting restrictions, custom emoji, and the ownership boundary. Owner additionally covers privileged-role continuity, top-level note availability, and archival.
- **Messaging and context:** Baseline participation covers messages, threads, reactions, own-message deletion, and context-sensitive notes. Owners and administrators inherit that baseline through a concise cross-reference.
- **Moderation:** Reporting, separate numbered tickets, confidential reviewer discussions, warnings, participant actions, posting suspension, and keep-or-remove closure are represented. Message hiding, thread pausing, retention, and audit records remain product rules rather than separate user abilities.

## YAGNI Review

- No anonymous, public-visitor, application-wide administrator, dedicated moderator, reporter, former-member, banned-user, or suspended-user ability set was introduced; the requirements either exclude these actors or define them as roles, activities, or states.
- Bot-specific conversation permissions were not invented. Bots use the same owner, administrator, and member abilities as people.
- Reviewer assignment, notifications, impersonation prevention, reputation scoring, brute-force protection, retention controls, production operations, and unresolved canonical-email behavior remain outside the ability model.
- Implementation and persistence mechanics—including token hashes, soft deletion, temporal role records, audit events, and aggregate ticket-state enforcement—were not promoted into user abilities.

## Remaining Non-Blocking Questions

- The product does not yet define whether bot credential creation, rotation, and revocation are self-service capabilities or externally administered setup. No credential-management ability was added.
- The product does not specify a meaningful unauthenticated surface. If one is introduced later, a public visitor and its abilities should be reconsidered.
- The requirements do not define who may edit conversation titles, descriptions, visibility, or listed matching mode after creation. The owner ability therefore limits ongoing configuration language to tags and top-level note availability.
