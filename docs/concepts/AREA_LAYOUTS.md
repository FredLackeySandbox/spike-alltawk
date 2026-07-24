# Area Layouts

## Summary

Tawk uses a lightweight public landing pattern before authentication and a shared private navigation frame for the human conversation journey from discovery into participation. Conversation governance and moderation remain reachable from that private frame but use area-specific navigation because their privileged, operational work is materially different from ordinary participation. Token-authenticated bot activity has no persistent navigation because it is a non-interactive product surface rather than a human workspace.

## Area Layout Decisions

### Product Home

- **Source area:** Product Home
- **Access:** `Public`
- **Layout pattern:** Product landing/home
- **Area structure:** A concise orientation surface establishes the tagged-conversation concept, distinguishes listed from unlisted participation, states the identified-access requirement, and directs people toward human authentication without exposing conversation data.
- **Navigation model:** `No persistent navigation`
- **Navigation rationale:** This is a focused public entry surface rather than a browsable public product. A direct path into authentication is sufficient because all functional areas are private.
- **Design implications:** Keep the information hierarchy simple and explanatory, with the product concept and access boundary more prominent than secondary detail. The visual posture should feel approachable while clearly signaling that conversation discovery begins only after identification.

### Conversation Hub

- **Source area:** Conversation Hub
- **Access:** `Private`
- **Layout pattern:** Directory/detail with creation flow entry
- **Area structure:** A tag-centered discovery surface keeps the evolving search criteria and matching conversation results in a clear relationship, while unlisted-match feedback protects hidden identities. Conversation creation begins as a focused setup path from the same hub because both jobs establish a conversation context through tags.
- **Navigation model:** `Shared app navigation`
- **Navigation rationale:** The hub is the primary private entry point for people and should share navigation with active conversation workspaces so users can move between finding, creating, and revisiting conversations without changing mental models.
- **Design implications:** Prioritize the current tag set, matching behavior, and privacy-safe result states. The area should support deliberate selection and setup rather than dashboard-style metrics or dense operational controls.

### Conversation Workspace

- **Source area:** Conversation Workspace
- **Access:** `Private`
- **Layout pattern:** Conversational/inbox
- **Area structure:** The active conversation is the dominant context, with persistent message history and message-level participation actions supported by concise conversation context. Role-appropriate paths to governance or moderation remain secondary to reading and contributing.
- **Navigation model:** `Shared app navigation`
- **Navigation rationale:** Sharing the private application frame with the Conversation Hub preserves orientation across conversation discovery and participation. Conversation switching can remain part of that common model while privileged work opens in its own structure.
- **Design implications:** Favor chronological readability, clear authorship, and low-friction participation, while keeping reactions, notes, flagging, and permitted deletion subordinate to message content. Former-member treatment and unavailable posting states should remain understandable without overwhelming the conversation.

### Conversation Governance

- **Source area:** Conversation Governance
- **Access:** `Private`
- **Layout pattern:** Admin operations
- **Area structure:** A conversation-scoped operations surface groups durable settings and participant administration by governance concern while keeping current roles, restrictions, and lifecycle state visible enough to support consequential changes.
- **Navigation model:** `Area-specific navigation`
- **Navigation rationale:** Governance contains multiple privileged concerns and benefits from a stable local structure distinct from message participation. It should retain a clear return to the shared conversation context without placing operational navigation in the ordinary member experience.
- **Design implications:** Use a controlled, information-dense posture with explicit scope, current state, and authority boundaries. Ownership continuity, role limitations, bans, suspensions, and archival should read as consequential decisions rather than routine conversational actions.

### Moderation Review

- **Source area:** Moderation Review
- **Access:** `Private`
- **Layout pattern:** Case-management inbox/detail
- **Area structure:** A report-oriented review surface keeps the numbered ticket, reported message, explanation, relevant conversation context, notes, and supported outcomes together as one moderation case. The structure should accommodate a linked private discussion when used without assuming an unresolved ticket workflow.
- **Navigation model:** `Area-specific navigation`
- **Navigation rationale:** Case review requires movement among reports and their evidence, which differs from both conversation participation and settings-oriented governance. A dedicated moderation structure preserves that focus while maintaining a route back to the affected conversation.
- **Design implications:** Emphasize evidence, provenance, reviewer context, and the consequences of each action. The area may be denser than the conversation workspace, but unresolved statuses, assignments, and notifications must not be implied by the layout.

### Bot Participation

- **Source area:** Bot Participation
- **Access:** `Private`
- **Layout pattern:** Non-interactive authenticated service interface
- **Area structure:** A token-authenticated capability surface exposes the same conversation creation, matching, joining, participation, and role-dependent operations available to identified actors, organized around machine actions rather than human browsing or screen-to-screen movement.
- **Navigation model:** `No persistent navigation`
- **Navigation rationale:** Bots operate non-interactively and do not need a visual navigation hierarchy. Conversation scope, token identity, and role determine available actions without introducing a separate developer console or bot permission model.
- **Design implications:** Optimize for explicit context, predictable action boundaries, and machine-readable outcomes rather than visual density or browsing cues. The product model should remain visibly equivalent to human membership and roles without suggesting unsupported integration-management features.
