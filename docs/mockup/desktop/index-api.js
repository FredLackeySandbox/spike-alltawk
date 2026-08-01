/**
 * Mock API for the public Tawk home page.
 *
 * Stands in for the small public content endpoint that serves the
 * unauthenticated landing surface. Loads its companion JSON database once and
 * returns copies so callers cannot mutate the working data.
 */
(function (global) {
  'use strict';

  var DATA_URL = 'index-data.json';
  var _fileData = null;

  function copy(value) {
    return value === undefined || value === null ? value : JSON.parse(JSON.stringify(value));
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

  /**
   * Retrieve the public product summary shown above the fold.
   * @returns {Promise<object>} Product name, tagline, and summary paragraph.
   */
  async function getProductSummary() {
    var data = await file();
    return copy(data.product);
  }

  /**
   * Retrieve the listed and unlisted conversation models with their examples.
   * @returns {Promise<Array<object>>} Conversation model descriptions in display order.
   */
  async function getConversationModels() {
    var data = await file();
    return copy(data.conversationModels);
  }

  /**
   * Retrieve the public explanation of tag syntax and its constraints.
   * @returns {Promise<object>} Tag examples and the rules that govern them.
   */
  async function getTagRules() {
    var data = await file();
    return copy(data.tagRules);
  }

  /**
   * Retrieve the statement of the identified-participation requirement.
   * @returns {Promise<object>} Title and body copy for the identity section.
   */
  async function getIdentityNote() {
    var data = await file();
    return copy(data.identityNote);
  }

  /**
   * Retrieve the available entry points into the private application.
   * @returns {Promise<Array<object>>} Entry point labels, descriptions, and destinations.
   */
  async function getEntryPoints() {
    var data = await file();
    return copy(data.entryPoints);
  }

  global.HomeApi = {
    getProductSummary: getProductSummary,
    getConversationModels: getConversationModels,
    getTagRules: getTagRules,
    getIdentityNote: getIdentityNote,
    getEntryPoints: getEntryPoints
  };
})(window);
