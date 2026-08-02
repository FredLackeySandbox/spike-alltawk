# Area Layouts

## Summary

Tawk uses a lightweight public landing pattern before authentication, a shared authenticated navigation frame for cross-conversation discovery and conversation governance, and distinct work modes for live conversation and confidential moderation. The Conversation Hub and Conversation Administration share product-level navigation so people retain orientation across related signed-in tasks, while Conversation Space and Moderation Center use area-specific navigation suited to sustained conversational and case-review work. Bot Access is a non-human interaction surface and therefore has no persistent visual navigation.

## Area Layout Decisions

### Product Home

- **Source area:** Product Home
- **Access:** `Public`
- **Layout pattern:** Product landing/home
- **Area structure:** A concise introduction establishes the tag-based conversation model, the difference between listed and unlisted participation, and the requirement for an identified account before directing a person into supported authentication.
- **Navigation model:** `No persistent navigation`
- **Navigation rationale:** This area has one proportional explanation-and-entry job, so persistent product navigation would imply public destinations that the MVP does not provide. Authentication entry supplies the clear transition into the private product.
- **Design implications:** Favor a low-density, highly legible hierarchy with a direct value statement, restrained supporting explanation, and prominent entry action. The posture should build confidence about identity and conversation privacy without resembling the denser signed-in work areas.

### Conversation Hub

- **Source area:** Conversation Hub
- **Access:** `Private`
- **Layout pattern:** Directory and discovery workspace
- **Area structure:** A cross-conversation workspace centers tag-driven discovery and exact-tag joining while keeping conversation creation, current conversation access, eligible moderation-discussion entry, archived-conversation context, and signed-in identity orientation available as related hub functions.
- **Navigation model:** `Shared app navigation`
- **Navigation rationale:** The hub is the primary orientation point for authenticated people and should share the product-level frame used by Conversation Administration. It also provides clear transitions into the more focused Conversation Space and Moderation Center work modes.
- **Design implications:** Use moderate information density with search intent and privacy state as the strongest hierarchy, clearly distinguishing identifiable listed results from non-identifying hidden-match feedback. Secondary creation, history, and identity context should remain available without competing with discovery.

### Conversation Space

- **Source area:** Conversation Space
- **Access:** `Private`
- **Layout pattern:** Conversational workspace
- **Area structure:** An immersive, conversation-scoped work area keeps retained messages and threads central while placing participant context, reactions, notes, reporting, membership state, and role-permitted actions around that shared communication stream.
- **Navigation model:** `Area-specific navigation`
- **Navigation rationale:** Live participation benefits from navigation organized around the active conversation and its communication context rather than the hub's discovery structure. A clear return to the Conversation Hub preserves product orientation without forcing the hub navigation model into the conversational work mode.
- **Design implications:** Favor a message-first hierarchy, high interaction continuity, and clear distinctions among active, hidden, unavailable, deleted, suspended, former-member, and archived states. Frequent participant actions should feel immediate, while reporting and role-sensitive actions should remain deliberate and contextually bounded.

### Conversation Administration

- **Source area:** Conversation Administration
- **Access:** `Private`
- **Layout pattern:** Admin operations workspace
- **Area structure:** A conversation-scoped governance area groups durable configuration, membership and role oversight, access restrictions, custom emoji administration, note availability, and archival according to the authority of the current owner or administrator.
- **Navigation model:** `Shared app navigation`
- **Navigation rationale:** Administration is a protected extension of the same authenticated conversation product and should retain the shared frame used by the Conversation Hub. Conversation context and role boundaries provide local orientation without isolating governance in a separate navigation system.
- **Design implications:** Use a structured, moderately dense posture that separates routine maintenance from consequential access, ownership, and archival actions. Current versus former membership, permitted versus unavailable controls, and owner-only boundaries must be easy to scan before a user commits a change.

### Moderation Center

- **Source area:** Moderation Center
- **Access:** `Private`
- **Layout pattern:** Moderation case-management workbench
- **Area structure:** A confidential review environment organizes numbered tickets as independent cases, keeping each reported message, hold state, restricted discussion, moderator notes, lifecycle status, related actions, and terminal disposition within its source-conversation context.
- **Navigation model:** `Area-specific navigation`
- **Navigation rationale:** Ticket review is sustained, restricted case work with its own queue and lifecycle, materially different from discovery or general conversation governance. Its navigation should support movement among eligible cases while preserving a clear path back to the broader authenticated product.
- **Design implications:** Favor high information clarity and controlled density, with case status, confidentiality, evidence context, unresolved dependencies, and irreversible closure decisions visually dominant. Simultaneous tickets for one message must remain distinct, and reporter privacy must not be weakened by comparative or cross-case presentation.

### Bot Access

- **Source area:** Bot Access
- **Access:** `Private`
- **Layout pattern:** Machine-to-machine interaction surface
- **Area structure:** A non-human access boundary organizes bot identity and conversation-scoped actions around the same discovery, membership, participation, administration, moderation, and archival rules that govern people, without introducing a separate bot permission model.
- **Navigation model:** `No persistent navigation`
- **Navigation rationale:** Token-authenticated bots act programmatically and do not need a visual navigation shell. Their available actions are determined by identity, conversation membership, role, and current product state rather than by movement through human-facing areas.
- **Design implications:** Human page composition and visual density do not apply to this area; later interaction design should instead preserve predictable action grouping, explicit state and permission boundaries, and clear distinction between authentication, authorization, and conversation-rule failures. A developer console or token-management interface should not be inferred from this layout decision.
