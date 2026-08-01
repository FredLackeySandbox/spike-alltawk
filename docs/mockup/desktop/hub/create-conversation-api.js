/**
 * Mock API for conversation creation.
 *
 * Stands in for the endpoints that expose the tag policy, offer existing tags
 * for reuse, validate a tag before it is attached, and create a conversation
 * with the creator recorded as its first owner.
 */
(function (global) {
  'use strict';

  var DATA_URL = 'create-conversation-data.json';
  var SESSION_KEY = 'tawk.createdConversations';
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

  function rememberForSession(conversation) {
    try {
      var stored = JSON.parse(window.sessionStorage.getItem(SESSION_KEY) || '[]');
      stored = stored.filter(function (item) { return item && item.id !== conversation.id; });
      stored.push(conversation);
      window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(stored));
    } catch (error) {
      /* Storage is unavailable; the prototype simply forgets the new conversation. */
    }
  }

  /**
   * Retrieve the identity that will become the conversation's first owner.
   * @returns {Promise<object>} Display name, initials, and identity type.
   */
  async function getSignedInIdentity() {
    var data = await file();
    return copy(data.identity);
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
   * Validate a conversation name against the name policy.
   * @param {string} value - Raw name text as typed.
   * @returns {Promise<object>} Validity, the trimmed name, and a reason when rejected.
   */
  async function validateConversationName(value) {
    var data = await file();
    var policy = data.namePolicy;
    var name = String(value === undefined || value === null ? '' : value).trim();
    if (!name) { return { valid: false, reason: policy.errors.empty }; }
    if (name.length < policy.minLength) { return { valid: false, reason: policy.errors.short }; }
    if (name.length > policy.maxLength) { return { valid: false, reason: policy.errors.long }; }
    return { valid: true, name: name };
  }

  /**
   * Validate an optional conversation topic against the topic policy.
   * @param {string} value - Raw topic text as typed.
   * @returns {Promise<object>} Validity, the trimmed topic, and a reason when rejected.
   */
  async function validateConversationTopic(value) {
    var data = await file();
    var policy = data.topicPolicy;
    var topic = String(value === undefined || value === null ? '' : value).trim();
    if (topic.length > policy.maxLength) { return { valid: false, reason: policy.errors.long }; }
    return { valid: true, topic: topic };
  }

  /**
   * Retrieve the listed and unlisted visibility choices with their explanations.
   * @returns {Promise<Array<object>>} Visibility options in display order.
   */
  async function getVisibilityOptions() {
    var data = await file();
    return copy(data.visibilityOptions);
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
   * Suggest existing tags that other listed conversations already use.
   * @param {string} fragment - Partial tag text the creator has typed.
   * @param {Array<string>} excluded - Tags already attached to the draft.
   * @returns {Promise<Array<object>>} Matching existing tags with their reuse counts.
   */
  async function suggestExistingTags(fragment, excluded) {
    var data = await file();
    var typed = String(fragment || '').trim().toLowerCase();
    var skip = (excluded || []).map(function (tag) { return String(tag).toLowerCase(); });
    if (!typed) { return []; }
    return copy(data.existingTags)
      .filter(function (tag) { return skip.indexOf(tag.value) === -1; })
      .filter(function (tag) { return tag.value.indexOf(typed) !== -1; })
      .slice(0, 6);
  }

  /**
   * Validate one tag against the tag grammar and the draft's current tags.
   * @param {string} value - Raw tag text as typed.
   * @param {Array<string>} currentTags - Tags already attached to the draft.
   * @returns {Promise<object>} Validity, the normalised tag, and a reason when rejected.
   */
  async function validateTag(value, currentTags) {
    var data = await file();
    var policy = data.tagPolicy;
    var existing = currentTags || [];
    var raw = String(value === undefined || value === null ? '' : value).trim();
    var normalised = raw.toLowerCase();

    if (!raw) { return { valid: false, reason: policy.errors.empty }; }
    if (existing.length >= policy.maxTags) { return { valid: false, reason: policy.errors.max }; }
    if (/\s/.test(raw)) { return { valid: false, reason: policy.errors.whitespace }; }
    if (/[^\x00-\x7F]/.test(raw)) { return { valid: false, reason: policy.errors.unicode }; }
    if ((raw.match(/:/g) || []).length > 1) { return { valid: false, reason: policy.errors.colons }; }
    if (/--/.test(raw)) { return { valid: false, reason: policy.errors.doubleHyphen }; }
    if (/(^|:)-|-(:|$)/.test(raw)) { return { valid: false, reason: policy.errors.hyphenEdge }; }
    if (!new RegExp(policy.pattern).test(normalised)) { return { valid: false, reason: policy.errors.shape }; }
    if (existing.map(function (tag) { return String(tag).toLowerCase(); }).indexOf(normalised) !== -1) {
      return { valid: false, reason: policy.errors.duplicate };
    }
    return { valid: true, tag: normalised };
  }

  /**
   * Create a conversation and record the signed-in identity as its first owner.
   * The new conversation is kept in session storage so the rest of the prototype
   * can open it; nothing is written back to the JSON file on disk.
   * @param {object} draft - Draft conversation: name, optional topic, tags array, listed boolean, matching mode.
   * @returns {Promise<object>} Created conversation with its identifier and owner role.
   */
  async function createConversation(draft) {
    var data = await file();
    var policy = data.tagPolicy;
    var tags = (draft && draft.tags ? draft.tags : []).map(function (tag) { return String(tag).toLowerCase(); });

    var nameCheck = await validateConversationName(draft && draft.name);
    if (!nameCheck.valid) {
      return { created: false, field: 'name', reason: nameCheck.reason };
    }
    var topicCheck = await validateConversationTopic(draft && draft.topic);
    if (!topicCheck.valid) {
      return { created: false, field: 'topic', reason: topicCheck.reason };
    }
    if (tags.length < policy.minTags) {
      return { created: false, field: 'tags', reason: 'Add at least ' + policy.minTags + ' tag before creating the conversation.' };
    }
    if (tags.length > policy.maxTags) {
      return { created: false, field: 'tags', reason: policy.errors.max };
    }

    var listed = Boolean(draft && draft.listed);
    var conversation = {
      id: data.nextConversationId,
      name: nameCheck.name,
      topic: topicCheck.topic,
      tags: tags,
      listed: listed,
      matching: listed ? (draft.matching || 'inclusive') : 'all',
      role: 'owner',
      kind: 'conversation',
      memberCount: 1,
      createdBy: copy(data.identity),
      messages: []
    };

    var tmp = copy(data);
    tmp.nextConversationId = 'c-new-' + (Date.now() % 100000);
    save(tmp);
    rememberForSession(conversation);

    return { created: true, conversation: copy(conversation) };
  }

  global.CreateConversationApi = {
    getSignedInIdentity: getSignedInIdentity,
    getTagPolicy: getTagPolicy,
    getNamePolicy: getNamePolicy,
    getTopicPolicy: getTopicPolicy,
    validateConversationName: validateConversationName,
    validateConversationTopic: validateConversationTopic,
    getVisibilityOptions: getVisibilityOptions,
    getMatchingOptions: getMatchingOptions,
    suggestExistingTags: suggestExistingTags,
    validateTag: validateTag,
    createConversation: createConversation
  };
})(window);
