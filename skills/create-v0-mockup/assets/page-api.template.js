"use strict";

let data;

/**
 * Load the local mock data once.
 * @returns {Promise<void>} Resolves after the mock data is loaded.
 */
async function initMockApi() {
  if (data) return;
  const response = await fetch("__PAGE_BASENAME__-data.json");
  data = await response.json();
}

/**
 * A real backend would authorize the request and fetch the contact's addresses.
 * @param {string} contactId - Contact whose addresses should be returned.
 * @returns {Promise<object>} Prepared contact-address result.
 */
async function fetchContactAddresses(contactId) {
  return structuredClone(data.fetchContactAddresses[contactId]);
}

/**
 * A real backend would validate and create the submitted address.
 * @param {string} contactId - Contact that will own the address.
 * @param {object} address - Address values to create.
 * @returns {Promise<object>} Prepared address-creation result.
 */
async function createContactAddress(contactId, address) {
  return structuredClone(data.createContactAddress[contactId]);
}

/**
 * A real backend would validate and save changes to the address.
 * @param {string} addressId - Address to update.
 * @param {object} address - Replacement address values.
 * @returns {Promise<object>} Prepared address-update result.
 */
async function updateContactAddress(addressId, address) {
  return structuredClone(data.updateContactAddress[addressId]);
}

/**
 * A real backend would authorize and delete the address.
 * @param {string} addressId - Address to delete.
 * @returns {Promise<object>} Prepared address-deletion result.
 */
async function deleteContactAddress(addressId) {
  return structuredClone(data.deleteContactAddress[addressId]);
}
