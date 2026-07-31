(function () {
  "use strict";

  let data;

  async function initGovernanceSettingsApi() {
    const response = await fetch("settings-data.json");
    data = await response.json();
  }

  // A real backend would authorize the viewer and load conversation governance.
  async function getGovernance({ scenario }) {
    return structuredClone(data.governanceByScenario[scenario]);
  }

  // A real backend would validate and persist the submitted conversation tags.
  async function updateTags({ tags, outcome }) {
    return structuredClone(data.updateTagsByOutcome[outcome]);
  }

  // A real backend would authorize the owner and archive the conversation.
  async function archiveConversation({ outcome }) {
    return structuredClone(data.archiveByOutcome[outcome]);
  }

  window.GovernanceSettingsApi = {
    initGovernanceSettingsApi,
    getGovernance,
    updateTags,
    archiveConversation
  };
})();
