/**
 * Mock API for conversation name, topic, tags, matching mode, and archival.
 *
 * Stands in for the endpoints that rename a conversation, set its topic,
 * maintain its tag set within the one-to-ten limit, adjust how a listed
 * conversation is matched in search, and archive it without deleting anything it
 * holds. Renaming is deliberately independent of the tag set: it changes what a
 * conversation is called, never who can reach it. Mutations update an in-memory
 * working copy for the prototype session only.
 */
(function (global) {
  'use strict';

  var DATA_URL = 'settings-data.json';
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

  /**
   * Retrieve the identity editing the conversation.
   * @returns {Promise<object>} Display name, initials, and identity type.
   */
  async function getSignedInIdentity() {
    var data = await file();
    return copy(data.identity);
  }

  /**
   * Retrieve a conversation's current settings.
   * @param {string} conversationId - Conversation to read.
   * @returns {Promise<object|null>} Tags, visibility, matching mode, archive state, and viewer role.
   */
  async function getConversation(conversationId) {
    var data = await file();
    return copy(find(data, conversationId));
  }

  /**
   * Retrieve the tag count limits, grammar, and rejection messages.
   * @returns {Promise<object>} Tag policy applied to every conversation.
   */
  async function getTagPolicy() {
    var data = await file();
    return copy(data.tagPolicy);
  }

  /**
   * Retrieve the matching choices available to a listed conversation.
   * @returns {Promise<Array<object>>} Matching options in display order.
   */
  async function getMatchingOptions() {
    var data = await file();
    return copy(data.matchingOptions);
  }

  /**
   * Retrieve the length limits and rejection messages for a conversation name.
   * @returns {Promise<object>} Name policy applied to every conversation.
   */
  async function getNamePolicy() {
    var data = await file();
    return copy(data.namePolicy);
  }

  /**
   * Retrieve the length limit and rejection message for a conversation topic.
   * @returns {Promise<object>} Topic policy applied to every conversation.
   */
  async function getTopicPolicy() {
    var data = await file();
    return copy(data.topicPolicy);
  }

  /**
   * Rename a conversation. The tag set is untouched, so renaming never changes
   * who can find or join it.
   * @param {string} conversationId - Conversation being renamed.
   * @param {string} name - Replacement name as typed.
   * @returns {Promise<object>} Outcome with the stored name or a rejection reason.
   */
  async function renameConversation(conversationId, name) {
    var data = await file();
    var policy = data.namePolicy;
    var tmp = copy(data);
    var conversation = find(tmp, conversationId);
    if (!conversation) { return { renamed: false, reason: 'That conversation is no longer available.' }; }

    var value = String(name === undefined || name === null ? '' : name).trim();
    if (!value) { return { renamed: false, reason: policy.errors.empty }; }
    if (value.length < policy.minLength) { return { renamed: false, reason: policy.errors.short }; }
    if (value.length > policy.maxLength) { return { renamed: false, reason: policy.errors.long }; }

    conversation.name = value;
    save(tmp);
    return { renamed: true, name: value };
  }

  /**
   * Set or clear a conversation's topic.
   * @param {string} conversationId - Conversation being described.
   * @param {string} topic - Replacement topic as typed; an empty value clears it.
   * @returns {Promise<object>} Outcome with the stored topic or a rejection reason.
   */
  async function updateConversationTopic(conversationId, topic) {
    var data = await file();
    var policy = data.topicPolicy;
    var tmp = copy(data);
    var conversation = find(tmp, conversationId);
    if (!conversation) { return { updated: false, reason: 'That conversation is no longer available.' }; }

    var value = String(topic === undefined || topic === null ? '' : topic).trim();
    if (value.length > policy.maxLength) { return { updated: false, reason: policy.errors.long }; }

    conversation.topic = value;
    save(tmp);
    return { updated: true, topic: value };
  }

  /**
   * Attach a tag to a conversation after validating it against the tag policy.
   * @param {string} conversationId - Conversation receiving the tag.
   * @param {string} tagValue - Raw tag text as typed.
   * @returns {Promise<object>} Outcome with the updated tag list or a rejection reason.
   */
  async function addConversationTag(conversationId, tagValue) {
    var data = await file();
    var policy = data.tagPolicy;
    var tmp = copy(data);
    var conversation = find(tmp, conversationId);
    if (!conversation) { return { added: false, reason: 'That conversation is no longer available.' }; }

    var raw = String(tagValue === undefined || tagValue === null ? '' : tagValue).trim();
    var normalised = raw.toLowerCase();

    if (!raw) { return { added: false, reason: policy.errors.empty }; }
    if (conversation.tags.length >= policy.maxTags) { return { added: false, reason: policy.errors.max }; }
    if (/\s/.test(raw)) { return { added: false, reason: policy.errors.whitespace }; }
    if (/[^\x00-\x7F]/.test(raw)) { return { added: false, reason: policy.errors.unicode }; }
    if ((raw.match(/:/g) || []).length > 1) { return { added: false, reason: policy.errors.colons }; }
    if (/--/.test(raw)) { return { added: false, reason: policy.errors.doubleHyphen }; }
    if (/(^|:)-|-(:|$)/.test(raw)) { return { added: false, reason: policy.errors.hyphenEdge }; }
    if (!new RegExp(policy.pattern).test(normalised)) { return { added: false, reason: policy.errors.shape }; }
    if (conversation.tags.indexOf(normalised) !== -1) { return { added: false, reason: policy.errors.duplicate }; }

    conversation.tags.push(normalised);
    save(tmp);
    return { added: true, tags: copy(conversation.tags) };
  }

  /**
   * Detach a tag from a conversation, keeping it above the minimum tag count.
   * @param {string} conversationId - Conversation losing the tag.
   * @param {string} tagValue - Tag being removed.
   * @returns {Promise<object>} Outcome with the updated tag list or a refusal reason.
   */
  async function removeConversationTag(conversationId, tagValue) {
    var data = await file();
    var policy = data.tagPolicy;
    var tmp = copy(data);
    var conversation = find(tmp, conversationId);
    if (!conversation) { return { removed: false, reason: 'That conversation is no longer available.' }; }
    if (conversation.tags.length <= policy.minTags) { return { removed: false, reason: policy.errors.min }; }

    conversation.tags = conversation.tags.filter(function (tag) { return tag !== tagValue; });
    save(tmp);
    return { removed: true, tags: copy(conversation.tags) };
  }

  /**
   * Change how a listed conversation is matched by tag search.
   * Unlisted conversations always require all of their tags and cannot be changed.
   * @param {string} conversationId - Conversation being reconfigured.
   * @param {string} matching - Matching mode: inclusive or exclusive.
   * @returns {Promise<object>} Outcome with the stored matching mode or a refusal reason.
   */
  async function updateMatchingMode(conversationId, matching) {
    var data = await file();
    var tmp = copy(data);
    var conversation = find(tmp, conversationId);
    if (!conversation) { return { updated: false, reason: 'That conversation is no longer available.' }; }
    if (!conversation.listed) {
      return { updated: false, reason: 'An unlisted conversation always requires all of its tags.' };
    }
    conversation.matching = matching;
    save(tmp);
    return { updated: true, matching: matching };
  }

  /**
   * Archive a conversation, ending its active use while retaining all of its records.
   * Owner-only; administrators cannot archive a conversation.
   * @param {string} conversationId - Conversation being archived.
   * @returns {Promise<object>} Outcome with the archived state or a refusal reason.
   */
  async function archiveConversation(conversationId) {
    var data = await file();
    var tmp = copy(data);
    var conversation = find(tmp, conversationId);
    if (!conversation) { return { archived: false, reason: 'That conversation is no longer available.' }; }
    if (conversation.myRole !== 'owner') {
      return { archived: false, reason: 'Only an owner can archive a conversation.' };
    }
    conversation.archived = true;
    save(tmp);
    return { archived: true, conversationId: conversationId };
  }

  global.SettingsApi = {
    getSignedInIdentity: getSignedInIdentity,
    getConversation: getConversation,
    getTagPolicy: getTagPolicy,
    getNamePolicy: getNamePolicy,
    getTopicPolicy: getTopicPolicy,
    getMatchingOptions: getMatchingOptions,
    renameConversation: renameConversation,
    updateConversationTopic: updateConversationTopic,
    addConversationTag: addConversationTag,
    removeConversationTag: removeConversationTag,
    updateMatchingMode: updateMatchingMode,
    archiveConversation: archiveConversation
  };
})(window);
