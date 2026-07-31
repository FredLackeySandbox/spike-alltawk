(function () {
  "use strict";

  let data;

  async function initConversationThreadApi() {
    const response = await fetch("thread-data.json");
    data = await response.json();
  }

  // A real backend would authorize the viewer and load the conversation.
  async function getConversation({ outcome }) {
    return structuredClone(data.loadResponses[outcome]);
  }

  // A real backend would create the submitted message.
  async function createMessage({ copy, outcome }) {
    return structuredClone(data.createMessageResponses[outcome]);
  }

  // A real backend would persist the viewer's reaction choice.
  async function updateReaction({ messageId, emoji, selected }) {
    return structuredClone(data.actionResponses.reaction);
  }

  // A real backend would save the note against the selected message.
  async function saveMessageNote({ messageId, copy }) {
    return structuredClone(data.actionResponses.messageNote);
  }

  // A real backend would save the note against the conversation.
  async function saveConversationNote({ copy }) {
    return structuredClone(data.actionResponses.conversationNote);
  }

  // A real backend would create a moderation report for the selected message.
  async function submitReport({ messageId, copy }) {
    return structuredClone(data.actionResponses.report);
  }

  // A real backend would soft-delete the selected message.
  async function deleteMessage({ messageId }) {
    return structuredClone(data.actionResponses.deleteMessage);
  }

  // A real backend would end the viewer's active membership.
  async function leaveConversation({ role }) {
    return structuredClone(data.actionResponses.leaveConversation);
  }

  window.ConversationThreadApi = {
    initConversationThreadApi,
    getConversation,
    createMessage,
    updateReaction,
    saveMessageNote,
    saveConversationNote,
    submitReport,
    deleteMessage,
    leaveConversation
  };
})();
