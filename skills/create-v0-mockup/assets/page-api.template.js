(function () {
  "use strict";

  let data;

  async function init__PAGE_NAMESPACE__Api() {
    if (data) return;
    const response = await fetch("__PAGE_BASENAME__-data.json");
    data = await response.json();
  }

  // A real backend would authorize the viewer and fetch the contact's addresses.
  async function fetchContactAddresses({ contactId }) {
    return structuredClone(data.fetchContactAddresses[contactId]);
  }

  // A real backend would validate and create the submitted address.
  async function createContactAddress({ contactId, address }) {
    return structuredClone(data.createContactAddress[contactId]);
  }

  // A real backend would validate and save changes to the address.
  async function updateContactAddress({ addressId, address }) {
    return structuredClone(data.updateContactAddress[addressId]);
  }

  // A real backend would authorize and delete the address.
  async function deleteContactAddress({ addressId }) {
    return structuredClone(data.deleteContactAddress[addressId]);
  }

  window.__PAGE_NAMESPACE__Api = {
    init__PAGE_NAMESPACE__Api,
    fetchContactAddresses,
    createContactAddress,
    updateContactAddress,
    deleteContactAddress
  };
})();
