# Tawk Desktop Mockup Page Plan

This plan is derived from `REQUIREMENTS.md`, `USER_TYPES.md`, and `APP_STRUCTURE.md`. It covers the human-facing desktop product while preserving the separation between conversation discovery, active participation, governance, and case-oriented moderation.

The mockup assumes an already identified human session after the public entry point because the human authentication mechanism is unresolved. Bot participation does not receive a browser page: bots operate non-interactively with tokens, and the source documents explicitly avoid creating a broader developer platform. Bot identities will still appear naturally in conversation and membership examples, under the same role model as people.

## Product Home

### Tawk Home

- **Title:** Tawk Home
- **Relative path:** `index.html`
- **Micro-app/section:** Product Home
- **Primary job:** Explain the tagged-conversation model and route an identified person into the private product.
- **Project-appropriate pattern:** Concise public product entry page with a single primary action.
- **Purpose:** Introduces the difference between listed and unlisted conversations, makes the identified-participation requirement clear, and provides the mockup's entry into the private conversation area. It is the only public page and the first file to open.
- **Required behavior:**
  - Explain listed discovery and complete-tag access for unlisted conversations in plain language.
  - State that every participant is identified and that bots use token credentials.
  - Provide one clear continuation link into the private conversation list, treating authentication as already completed for this mockup.
- **Density budget:** Sparse, because the page only needs enough context to help a visitor understand the model and proceed.
- **Must omit:** Conversation results, tag suggestions, participant activity, invented authentication fields or providers, pricing, testimonials, and broad marketing sections.
- **Navigation:** Arrives directly as the public entry point; continues to `hub/index.html`.

## Conversation Hub

### Your Conversations

- **Title:** Your Conversations
- **Relative path:** `hub/index.html`
- **Micro-app/section:** Conversation Hub
- **Primary job:** Let an identified person resume a conversation they already participate in.
- **Project-appropriate pattern:** Focused recents/list view with clear find and create actions.
- **Purpose:** Provides a stable private starting point for returning participants and makes joined conversations, including any private moderation discussion in which the person participates, available without repeating discovery. It also routes users to the two separate setup jobs: finding and creating conversations.
- **Required behavior:**
  - Show a short, realistic list of active joined conversations identified by their visible tag combinations, role, and a restrained recent-message cue.
  - Open a selected item in the conversation workspace.
  - Offer clear actions to find a conversation or create one.
- **Density budget:** Moderate, because returning users need to scan a small collection but do not need a dashboard of metrics.
- **Must omit:** KPI cards, global activity feeds, public discovery results, former memberships, moderation queues, archived-conversation behavior, and speculative conversation titles or descriptions.
- **Navigation:** Arrives from `index.html` or from the shared private navigation; opens `../conversation/thread.html`, `find.html`, or `create.html`.

### Find a Conversation

- **Title:** Find a Conversation
- **Relative path:** `hub/find.html`
- **Micro-app/section:** Conversation Hub
- **Primary job:** Find and join a listed conversation or a known unlisted conversation by tags.
- **Project-appropriate pattern:** Tag-driven search with an explicit listed/known-unlisted mode switch and progressively updated results.
- **Purpose:** Keeps public discovery and private all-tag entry in one task-focused search surface while making their privacy behavior visibly different. Listed matches are identifiable; hidden matches disclose only a count until one complete, unique match is reached.
- **Required behavior:**
  - Accept one or more validated tags as removable chips and suggest only tags eligible for listed discovery.
  - In listed mode, update a compact list of identifiable matches and allow immediate joining when eligible.
  - In known-unlisted mode, reveal only a hidden-match count until the supplied tags completely identify one conversation, then enable Join without exposing private-only suggestions.
  - Show a concise banned/not-eligible state without revealing additional conversation information.
- **Density budget:** Moderate, because the search query and its changing result state must remain visible together without becoming a data-heavy explorer.
- **Must omit:** Browse-all directories, trending tags, private tag autocomplete, hidden conversation names before a complete unique match, invitation or approval queues, advanced boolean search controls, and invented resolution for extra-tag ambiguity.
- **Navigation:** Arrives from the Conversation Hub at `index.html` or shared private navigation; successful join opens `../conversation/thread.html`; can move to `create.html` or back to `index.html`.

### Create a Conversation

- **Title:** Create a Conversation
- **Relative path:** `hub/create.html`
- **Micro-app/section:** Conversation Hub
- **Primary job:** Create a tagged listed or unlisted conversation.
- **Project-appropriate pattern:** Short, single-column setup form with inline tag validation and conditional options.
- **Purpose:** Captures only the decisions required to create a conversation: one to ten valid tags, listed or unlisted access, and the listed-only matching choice. Creation makes the current identity the first owner and proceeds directly to the new workspace.
- **Required behavior:**
  - Add and remove validated tag chips while showing the one-to-ten limit and tag-format guidance.
  - Choose listed or unlisted access; show exclusive matching only when listed is selected.
  - Demonstrate invalid, duplicate, and maximum-tag feedback inline.
  - Create the static example and continue to the conversation workspace as owner.
- **Density budget:** Sparse, because creation has only a few required choices and should feel quick.
- **Must omit:** Title and description fields, invitations, participant caps, note visibility, retention settings, billing, advanced permissions, API configuration, and unlisted exclusive-matching controls.
- **Navigation:** Arrives from `hub/index.html` or `find.html`; cancel returns to `index.html`; successful creation opens `../conversation/thread.html`.

## Conversation Workspace

### Conversation

- **Title:** Conversation
- **Relative path:** `conversation/thread.html`
- **Micro-app/section:** Conversation Workspace
- **Primary job:** Read and participate in one active conversation.
- **Project-appropriate pattern:** Message thread with a persistent composer and message-level action menus.
- **Purpose:** Presents the core collaborative workspace for an active member. It keeps messaging central while allowing lightweight reactions, notes, reporting, permitted deletion, and leaving without pulling privileged management into the thread.
- **Required behavior:**
  - Show realistic messages from people and bots, including reactions and a visually de-emphasized former participant.
  - Post a message through a simulated composer and add or remove an emoji reaction.
  - Offer contextual actions to add a note, flag a message with an explanation, and delete the current participant's own message; a deleted message disappears rather than leaving a placeholder.
  - Allow leaving when permitted and show the ownership-continuity warning when the current identity is the last owner.
- **Density budget:** Moderate, because conversational history benefits from continuity but secondary controls should stay quiet until invoked.
- **Must omit:** Moderation queues, member-history tables, raw message IDs, audit history, deleted-message placeholders, visible soft-deletion metadata, unrelated metrics, and unresolved note-visibility choices.
- **Navigation:** Arrives from `../hub/index.html`, `../hub/find.html`, or conversation-related links; returns to `../hub/index.html`; authorized users can open `../governance/settings.html`, `../governance/members.html`, or `../moderation/index.html`.

## Conversation Governance

### Tags and Lifecycle

- **Title:** Tags and Lifecycle
- **Relative path:** `governance/settings.html`
- **Micro-app/section:** Conversation Governance
- **Primary job:** Maintain a conversation's tags and owner-controlled lifecycle.
- **Project-appropriate pattern:** Restrained settings form with a separate destructive-action area.
- **Purpose:** Gives owners and administrators the documented tag-maintenance controls while making archival a clearly separated owner-only action. The current listed/unlisted and matching state may be summarized, but it is not made editable because post-creation changes are not specified.
- **Required behavior:**
  - Add and remove validated tags while enforcing the one-to-ten boundary.
  - Summarize the current access and matching mode without inventing unsupported edit behavior.
  - Let an owner open and confirm archival; show that administrators cannot archive.
- **Density budget:** Sparse, because the task is a small settings change rather than a system configuration console.
- **Must omit:** Hard delete, automatic archival, retention configuration, visibility/matching-mode editing, raw identifiers, audit timelines, API options, and unrelated workspace controls.
- **Navigation:** Arrives from `../conversation/thread.html` or governance navigation; moves to `members.html`; returns to the conversation workspace after saving or canceling.

### Members and Roles

- **Title:** Members and Roles
- **Relative path:** `governance/members.html`
- **Micro-app/section:** Conversation Governance
- **Primary job:** Review and change participant access for one conversation.
- **Project-appropriate pattern:** Role-aware membership roster with row actions and an active/former filter.
- **Purpose:** Centralizes the privileged membership job: seeing current and retained former participants, promoting permitted roles, removing or banning identities, restoring banned identities, and applying time-bounded posting suspensions. A collection view is justified because reviewers must compare participants and states before acting.
- **Required behavior:**
  - Show active and former people and bots with their current role or retained inactive/banned state.
  - Offer only role-appropriate actions: owners may promote to owner or administrator, while administrators cannot alter owners.
  - Simulate remove, ban, unban, and posting-suspension actions with confirmation and an end date/time where required.
  - Prevent removal or departure of the last owner and explain the transfer-or-archive requirement.
- **Density budget:** Dense, because comparing membership, role, activity, and restriction state is the page's primary job; actions still remain contextual rather than permanently expanded.
- **Must omit:** Ordinary-member access to former participants, exhaustive role-period history, unrelated message activity, organization-wide user administration, bulk actions, permissions matrices, and hard deletion.
- **Navigation:** Arrives from `../conversation/thread.html` or `settings.html`; moves to `settings.html` or `../moderation/index.html`; returns to the conversation workspace.

## Moderation Review

### Reported Messages

- **Title:** Reported Messages
- **Relative path:** `moderation/index.html`
- **Micro-app/section:** Moderation Review
- **Primary job:** Choose a reported message that needs review for a governed conversation.
- **Project-appropriate pattern:** Compact case queue grouped by conversation, using a table only for the small set of comparable report attributes.
- **Purpose:** Gives owners and administrators a focused entry into numbered moderation reports without mixing cases into the conversation thread or general membership management. It presents enough report context to choose a case without inventing a formal status workflow.
- **Required behavior:**
  - Show realistic ticket numbers, conversation tag context, reporter, and a concise reason excerpt.
  - Filter the static queue by governed conversation without introducing unresolved ticket states.
  - Open a selected report for evidence and action review.
- **Density budget:** Moderate, because reviewers need to scan comparable cases but the POC does not justify a high-volume operations dashboard.
- **Must omit:** KPI cards, assignment systems, service-level timers, notifications, global reports across unauthorized conversations, invented status pipelines, bulk resolution, and raw database identifiers.
- **Navigation:** Arrives from `../conversation/thread.html`, `../governance/members.html`, or private navigation for an authorized role; opens `ticket.html`; returns to the related conversation workspace.

### Moderation Ticket

- **Title:** Moderation Ticket
- **Relative path:** `moderation/ticket.html`
- **Micro-app/section:** Moderation Review
- **Primary job:** Review one flagged message and take a supported moderation action.
- **Project-appropriate pattern:** Case detail with evidence first, a reviewer-note area, and deliberate action controls.
- **Purpose:** Places the reported message, surrounding conversation context, reporting identity, explanation, and reviewer notes together so an owner or administrator can make one coherent moderation decision. Supported outcomes remain explicit without inventing a full ticket lifecycle.
- **Required behavior:**
  - Show the numbered report, flagged message, limited surrounding context, reporter, and explanation.
  - Add a reviewer note without exposing an unresolved visibility selector.
  - Simulate message deletion, a time-bounded posting suspension, participant removal, or banning with confirmation and outcome feedback.
  - Offer an optional link to a related private moderation conversation when one exists, using the normal conversation workspace pattern.
- **Density budget:** Moderate, because evidence and decision controls must coexist, but technical history and broad participant data are unnecessary.
- **Must omit:** Invented ticket statuses or assignments, exhaustive audit logs, raw IDs or JSON, hard deletion, automatic sanctions, owner-changing controls, and a mandatory related discussion.
- **Navigation:** Arrives from `index.html`; returns to the report queue; links to `../conversation/thread.html` for the source or an existing related moderation conversation and to `../governance/members.html` when participant context is needed.

## Scope Boundaries and Open Design Risks

- No separate sign-in page is planned because the human authentication mechanism is unresolved. The mockup uses a clearly stated identified-session handoff from the public home.
- No bot-facing HTML page is planned because bots operate non-interactively with tokens and the POC does not define token issuance, bot administration, or a developer platform. Human-facing examples should include bot identities to demonstrate the shared membership model.
- Conversation names and descriptions are unresolved. Joined lists, search results, headers, and navigation should identify examples with visible tag combinations rather than inventing a required title field.
- Note visibility, ticket status values, archived-conversation visibility, exact extra-tag search semantics, and exact emoji multiplicity are unresolved. The mockup should demonstrate the established action without presenting those open choices as settled product behavior.
- The planned collection/table treatments are limited to membership comparison and moderation case selection, where scanning rows is the user's primary job. No metrics dashboard is justified.
