/**
 * Mock API for conversation membership and roles.
 *
 * Stands in for the endpoints that read a conversation's membership records and
 * apply role, standing, and posting-restriction changes to them. Mutations
 * update an in-memory working copy for the prototype session only.
 */
(function (global) {
  'use strict';

  var DATA_URL = 'members-data.json';
  var _fileData = null;

  function copy(value) {
    return value === undefined || value === null ? value : JSON.parse(JSON.stringify(value));
  }

  function save(next) {
    _fileData = next;
  }

  async function file() {
    if (!_fileData) {
      var response = await fetch(DATA_URL);
      if (!response.ok) {
        throw new Error('Unable to load ' + DATA_URL + ' (' + response.status + ')');
      }
      _fileData = await response.json();
    }
    return _fileData;
  }

  function find(data, conversationId) {
    return data.conversations.filter(function (item) { return item.id === conversationId; })[0] || null;
  }

  function isModerator(conversation) {
    return conversation.myRole === 'owner' || conversation.myRole === 'administrator';
  }

  function activeOwners(conversation) {
    return conversation.members.filter(function (member) {
      return member.standing === 'active' && member.role === 'owner';
    });
  }

  function ownerGuard(conversation, member) {
    if (conversation.myRole === 'owner') { return null; }
    if (member.role === 'owner') {
      return 'Administrators cannot add, remove, or alter owners.';
    }
    return null;
  }

  /**
   * Retrieve the identity managing the membership list.
   * @returns {Promise<object>} Display name, initials, and identity type.
   */
  async function getSignedInIdentity() {
    var data = await file();
    return copy(data.identity);
  }

  /**
   * Retrieve the conversation whose membership is being managed.
   * @param {string} conversationId - Conversation to read.
   * @returns {Promise<object|null>} Tags, visibility, and the viewer's role, or null.
   */
  async function getConversation(conversationId) {
    var data = await file();
    var conversation = find(data, conversationId);
    if (!conversation) { return null; }
    var summary = copy(conversation);
    delete summary.members;
    summary.activeOwnerCount = activeOwners(conversation).length;
    return summary;
  }

  /**
   * List the conversation's membership records.
   * Former, removed, and banned identities are returned only to owners and
   * administrators; ordinary members receive active memberships alone.
   * @param {string} conversationId - Conversation whose membership is being read.
   * @returns {Promise<object>} Active memberships and, for moderators, inactive ones.
   */
  async function getConversationMembers(conversationId) {
    var data = await file();
    var conversation = find(data, conversationId);
    if (!conversation) { return { active: [], inactive: [] }; }
    var members = copy(conversation.members);
    return {
      active: members.filter(function (member) { return member.standing === 'active'; }),
      inactive: isModerator(conversation)
        ? members.filter(function (member) { return member.standing !== 'active'; })
        : []
    };
  }

  /**
   * Change a member's conversation role.
   * Only an owner may grant or alter the owner role.
   * @param {string} conversationId - Conversation holding the membership.
   * @param {string} identityId - Identity whose role is changing.
   * @param {string} role - New role: owner, administrator, or member.
   * @returns {Promise<object>} Outcome with the updated membership or a refusal reason.
   */
  async function changeMemberRole(conversationId, identityId, role) {
    var data = await file();
    var tmp = copy(data);
    var conversation = find(tmp, conversationId);
    var member = conversation
      ? conversation.members.filter(function (item) { return item.identityId === identityId; })[0]
      : null;
    if (!member) { return { changed: false, reason: 'That membership no longer exists.' }; }

    if (conversation.myRole !== 'owner' && (role === 'owner' || member.role === 'owner')) {
      return { changed: false, reason: 'Administrators cannot add, remove, or alter owners.' };
    }
    if (member.role === 'owner' && role !== 'owner' && activeOwners(conversation).length === 1) {
      return { changed: false, reason: 'A conversation must always keep at least one owner.' };
    }

    member.role = role;
    save(tmp);
    return { changed: true, member: copy(member) };
  }

  /**
   * End a member's active participation without banning the identity.
   * @param {string} conversationId - Conversation holding the membership.
   * @param {string} identityId - Identity being removed.
   * @returns {Promise<object>} Outcome with the updated membership or a refusal reason.
   */
  async function removeMember(conversationId, identityId) {
    var data = await file();
    var tmp = copy(data);
    var conversation = find(tmp, conversationId);
    var member = conversation
      ? conversation.members.filter(function (item) { return item.identityId === identityId; })[0]
      : null;
    if (!member) { return { removed: false, reason: 'That membership no longer exists.' }; }

    var refusal = ownerGuard(conversation, member);
    if (refusal) { return { removed: false, reason: refusal }; }
    if (member.role === 'owner' && activeOwners(conversation).length === 1) {
      return { removed: false, reason: 'A conversation must always keep at least one owner.' };
    }

    member.standing = 'removed';
    member.endedOn = 'Today';
    delete member.postingSuspendedUntil;
    save(tmp);
    return { removed: true, member: copy(member) };
  }

  /**
   * Ban an identity by ending its participation rights while retaining the record.
   * @param {string} conversationId - Conversation holding the membership.
   * @param {string} identityId - Identity being banned.
   * @returns {Promise<object>} Outcome with the updated membership or a refusal reason.
   */
  async function banMember(conversationId, identityId) {
    var data = await file();
    var tmp = copy(data);
    var conversation = find(tmp, conversationId);
    var member = conversation
      ? conversation.members.filter(function (item) { return item.identityId === identityId; })[0]
      : null;
    if (!member) { return { banned: false, reason: 'That membership no longer exists.' }; }

    var refusal = ownerGuard(conversation, member);
    if (refusal) { return { banned: false, reason: refusal }; }
    if (member.role === 'owner' && activeOwners(conversation).length === 1) {
      return { banned: false, reason: 'A conversation must always keep at least one owner.' };
    }

    member.standing = 'banned';
    member.role = 'none';
    member.endedOn = 'Today';
    delete member.postingSuspendedUntil;
    save(tmp);
    return { banned: true, member: copy(member) };
  }

  /**
   * Restore a banned or removed identity to an active role.
   * @param {string} conversationId - Conversation holding the membership.
   * @param {string} identityId - Identity being restored.
   * @param {string} role - Role granted on restoration.
   * @returns {Promise<object>} Outcome with the updated membership or a refusal reason.
   */
  async function restoreMember(conversationId, identityId, role) {
    var data = await file();
    var tmp = copy(data);
    var conversation = find(tmp, conversationId);
    var member = conversation
      ? conversation.members.filter(function (item) { return item.identityId === identityId; })[0]
      : null;
    if (!member) { return { restored: false, reason: 'That membership no longer exists.' }; }
    if (conversation.myRole !== 'owner' && role === 'owner') {
      return { restored: false, reason: 'Administrators cannot add, remove, or alter owners.' };
    }

    member.standing = 'active';
    member.role = role || 'member';
    delete member.endedOn;
    save(tmp);
    return { restored: true, member: copy(member) };
  }

  /**
   * Prevent a member from posting until a stated date while keeping membership.
   * @param {string} conversationId - Conversation holding the membership.
   * @param {string} identityId - Identity being suspended.
   * @param {string} until - Human-readable end of the suspension.
   * @returns {Promise<object>} Outcome with the updated membership or a refusal reason.
   */
  async function suspendMemberPosting(conversationId, identityId, until) {
    var data = await file();
    var tmp = copy(data);
    var conversation = find(tmp, conversationId);
    var member = conversation
      ? conversation.members.filter(function (item) { return item.identityId === identityId; })[0]
      : null;
    if (!member) { return { suspended: false, reason: 'That membership no longer exists.' }; }
    if (!until) { return { suspended: false, reason: 'A posting suspension needs an end date.' }; }

    var refusal = ownerGuard(conversation, member);
    if (refusal) { return { suspended: false, reason: refusal }; }

    member.postingSuspendedUntil = until;
    save(tmp);
    return { suspended: true, member: copy(member) };
  }

  /**
   * Lift an active posting suspension before its stated end date.
   * @param {string} conversationId - Conversation holding the membership.
   * @param {string} identityId - Identity whose suspension is being lifted.
   * @returns {Promise<object>} Outcome with the updated membership or a refusal reason.
   */
  async function liftPostingSuspension(conversationId, identityId) {
    var data = await file();
    var tmp = copy(data);
    var conversation = find(tmp, conversationId);
    var member = conversation
      ? conversation.members.filter(function (item) { return item.identityId === identityId; })[0]
      : null;
    if (!member) { return { lifted: false, reason: 'That membership no longer exists.' }; }

    delete member.postingSuspendedUntil;
    save(tmp);
    return { lifted: true, member: copy(member) };
  }

  global.MembersApi = {
    getSignedInIdentity: getSignedInIdentity,
    getConversation: getConversation,
    getConversationMembers: getConversationMembers,
    changeMemberRole: changeMemberRole,
    removeMember: removeMember,
    banMember: banMember,
    restoreMember: restoreMember,
    suspendMemberPosting: suspendMemberPosting,
    liftPostingSuspension: liftPostingSuspension
  };
})(window);
