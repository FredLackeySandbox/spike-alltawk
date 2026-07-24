# App Structure Draft Report

## Files Reviewed

- `docs/concepts/REQUIREMENTS.md`
- `docs/concepts/USER_TYPES.md`

The schemas were not needed because the requirements and validated user types were sufficient to identify actors, access boundaries, and day-one product jobs. No existing `docs/concepts/APP_STRUCTURE.md` was present to reconcile.

## Access Determination

Tawk is a mixed-access product. A proportional public product home is appropriate for explaining the tagged-conversation concept and routing a person into identified access. Every functional conversation area is private: the requirements prohibit anonymous participation, require human identification or bot-token authentication, and describe discovery, joining, participation, governance, and moderation as actions of identified actors.

## Product Home Decision

An overall `Product Home` area was included as Tawk's sole unauthenticated explanation and entry surface. It introduces the product and routes people toward the still-to-be-selected human authentication mechanism without exposing listed results, unlisted identities, private-only tags, or conversation activity. No separate landing area was created for any private micro-app.

## Proposed Application Areas

| Area | Access | Primary users | Supporting requirements or abilities | Separation rationale |
|---|---|---|---|---|
| Product Home | Public | Identified Person | Tawk needs an entry into identified human access; anonymous participation is prohibited | Provides one product-level explanation and routing surface without exposing private product functions |
| Conversation Hub | Private | Identified Person; owners, administrators, and members as people | Discover and join listed conversations; join known unlisted conversations; create tagged conversations | Search, privacy-preserving entry, and setup are materially different from ongoing message participation |
| Conversation Workspace | Private | Identified Person acting as Conversation Owner, Conversation Administrator, or Ordinary Member | Messaging, reactions, contextual notes, flagging, own-message deletion, and leaving | Keeps the human collaborative work mode focused and accessible across conversation roles |
| Conversation Governance | Private | Conversation Owner, Conversation Administrator | Tag management, membership history, roles, bans, restoration, suspension, ownership continuity, and archival | Privileged changes to authority and lifecycle need a clear boundary from ordinary participation |
| Moderation Review | Private | Conversation Owner, Conversation Administrator | Numbered report review, notes or linked discussion, message deletion, suspension, removal, and banning | Case-oriented report handling is distinct from general settings and membership administration |
| Bot Participation | Private | Bot Participant in any supported conversation role | Token authentication; bot creation, joining, participation, and shared human/bot role model | Automated operation requires a distinct authenticated product surface but not a separate permission model |

## Merged or Excluded Candidates

- **Identity and profile area:** Excluded as a separate area. The display-name requirement and authentication entry are supporting capabilities rather than a materially distinct day-one product job.
- **Conversation creation area:** Merged into `Conversation Hub`. Creation is a focused way to enter a new conversation, not a durable micro-app needing its own area.
- **Listed discovery and unlisted joining areas:** Merged into `Conversation Hub`. Their privacy and matching rules differ, but both serve the same user job of locating or entering a conversation through tags.
- **Tag administration area:** Merged into `Conversation Governance`. Tags are conversation settings, and there is no product-wide tag ownership or administration requirement.
- **Membership, roles, and archival areas:** Merged into `Conversation Governance`. They share the same conversation-level operational boundary and primary users.
- **Separate owner and administrator areas:** Excluded. The roles have different authority limits but substantially share governance and moderation jobs.
- **Notes area:** Excluded as a standalone area. Notes support conversation participation or moderation context, and their visibility model remains unresolved.
- **Moderation discussion area:** Excluded as a standalone area. A linked moderation conversation behaves as a normal conversation and remains optional or unresolved.
- **Bot administration or developer console:** Excluded. The POC requires token-authenticated bot participation but does not require token issuance, integration management, or a broader developer platform.
- **Archived conversation area:** Excluded because the user-facing behavior of archived conversations is unresolved; archival itself remains an owner action in governance.

## Ambiguities

- The human authentication mechanism is unresolved. The public home therefore routes to an authentication entry without prescribing how authentication works.
- Whether listed conversations can be searched before sign-in is not stated. The requirements explicitly describe an identified user performing search and prohibit anonymous participation, so discovery remains private.
- Moderation ticket statuses, assignment, notification, and closure behavior are unresolved. `Moderation Review` includes only the explicit review context and supported actions.
- Notes visibility and whether linked moderation conversations are required are unresolved. The areas acknowledge these capabilities without selecting a visibility or workflow model.
- Archived-conversation visibility is unresolved. The structure includes the archival action but does not invent a separate archive experience.

## Braindump Use

No braindump files were read or used. The requirements and user-types document were sufficient for all app-structure decisions.
