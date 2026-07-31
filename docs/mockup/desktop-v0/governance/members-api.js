(function () {
  'use strict';

  var fixture;

  function copy(value) {
    return structuredClone(value);
  }

  /**
   * Fetch the deterministic screen fixture once for this client session.
   */
  async function initMembersApi() {
    if (fixture) return;
    var response = await fetch('members-data.json');
    fixture = await response.json();
  }

  /**
   * Real backend responsibility: return the conversation's governance roster.
   * @param {Object} request Requested conversation context.
   * @param {string} request.conversationId Conversation identifier.
   */
  async function getConversationRoster(request) {
    return copy(fixture.roster);
  }

  /**
   * Real backend responsibility: authorize and persist a participant role change.
   * @param {Object} request Requested participant and role.
   * @param {string} request.participantId Participant identifier.
   * @param {string} request.role Requested role.
   */
  async function updateMemberRole(request) {
    return copy(fixture.acceptedMutation);
  }

  /**
   * Real backend responsibility: authorize and persist an access-state change.
   * @param {Object} request Requested participant, action, and optional suspension end.
   * @param {string} request.participantId Participant identifier.
   * @param {string} request.action Requested access action.
   * @param {string} [request.suspendUntil] Requested suspension end.
   */
  async function updateMemberAccess(request) {
    return copy(fixture.acceptedMutation);
  }

  window.MembersApi = {
    initMembersApi: initMembersApi,
    getConversationRoster: getConversationRoster,
    updateMemberRole: updateMemberRole,
    updateMemberAccess: updateMemberAccess
  };
})();
