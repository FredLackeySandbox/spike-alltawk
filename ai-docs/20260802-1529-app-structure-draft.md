# App Structure Draft Report

## Files Reviewed

- `docs/concepts/REQUIREMENTS.md` (complete)
- `docs/concepts/USER_TYPES.md` (complete)

The requirements and user-type document were sufficient. No schema files or braindumps were used.

## Access Determination

Tawk is a **mixed-access** product. A small unauthenticated product home explains the product and starts supported human sign-in. Every conversation-discovery, joining, participation, administration, moderation, and bot-operation capability is private because anonymous participation is prohibited and each actor must be an identified person or token-authenticated bot. Conversation roles add narrower authorization boundaries inside those private areas.

## Product Home Decision

A single product-level **Product Home** area is included. The external product needs a proportional surface that explains tag-based listed and unlisted conversations, states the identified-participation boundary, and routes people into OIDC or passwordless-email authentication. Private areas retain their own natural entry states but do not receive duplicate public landing areas.

## Proposed Areas

| Area | Access | Primary users | Supporting abilities or requirements | Separation rationale |
|---|---|---|---|---|
| Product Home | `Public` | Person | Human authentication through OIDC or passwordless email; anonymous participation prohibited | Provides the one unauthenticated explanation and authentication entry boundary without exposing product data. |
| Conversation Hub | `Private` | Person, including human owners, administrators, and members | Discover and join listed or unlisted conversations; create conversations; return to current conversation and moderation-discussion associations | Cross-conversation discovery and creation are materially different from working inside one conversation. |
| Conversation Space | `Private` | Person and Bot in any active conversation role | Messaging, threads, reactions, contextual notes, flagging, leaving, and role-permitted deletion | Keeps the shared participation context focused and separates it from discovery and privileged controls. |
| Conversation Administration | `Private` | Conversation Owner and Conversation Administrator | Tags, members and former members, bans and restoration, privileged roles, suspensions, custom emoji, owner continuity, and archival | Durable configuration and access-changing controls need a clear privileged boundary distinct from ordinary chat and ticket review. |
| Moderation Center | `Private` | Conversation Owner and Conversation Administrator | Numbered ticket lifecycle, confidential discussion, private moderator notes, warnings, content dispositions, and related moderation actions | Ticket work is confidential, case-based, and lifecycle-driven, which warrants separation from general administration. |
| Bot Access API | `Private` | Bot in any conversation role | Token authentication plus bot creation, joining, participation, administration, and moderation under the shared role model | Automated actors need programmatic access and different authentication without gaining a different permission model. |

## YAGNI Merges and Exclusions

- **Separate listed and unlisted discovery areas were merged into Conversation Hub.** They share the same tag-entry job and authenticated audience; the stricter unlisted privacy behavior is a rule within that area rather than a separate application.
- **Conversation discovery, creation, and the user's conversation list were merged into Conversation Hub.** Each is part of choosing or starting the next conversation rather than a distinct day-one work mode.
- **A standalone profile or identity-management area was excluded.** A required display name and imported provider attributes need basic private profile context, but the requirements do not define enough direct account-management work to justify a separate area.
- **A separate developer console or bot-token management area was excluded.** Token-authenticated bot access is required, but issuance, rotation, developer onboarding, and token administration workflows are not defined for the MVP.
- **A separate archival area was excluded.** Archival is an owner action within Conversation Administration, and any required archived-conversation visibility belongs in the Conversation Hub.
- **Separate moderation areas for warnings, suspensions, and bans were excluded.** These are actions within ticket review or conversation administration, not independent products.
- **Per-area or per-conversation landing surfaces were excluded.** The Product Home is the only public landing area; private areas may later have appropriate internal start states without becoming additional public areas.

## Ambiguities

- The requirements require human profiles and linked authentication connections but do not define user-driven profile editing or account-linking workflows. The draft therefore includes only basic signed-in profile context in Conversation Hub and does not invent a separate account area.
- The requirements establish token-authenticated bots but do not define token issuance or lifecycle management. Bot Access API covers bot operations only; no developer console or credential-management workflow was inferred.
- Reviewer assignment and moderation notifications remain undefined in the requirements and are not included in Moderation Center scope.
- Archived conversations remain visible as existing conversations but expose no contents; the precise participant-view behavior is not defined. The structure locates required visibility in Conversation Hub without inventing a deeper archive experience.

No braindumps were used.
