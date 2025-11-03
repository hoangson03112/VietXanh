/**
 * Contact Service - Handles contact form and messages API calls
 */

import { get, post, put } from "./apiClient";

/**
 * Submit a contact form
 * @param {Object} contactData - Contact form data (name, email, phone, message, etc.)
 */
export const submitContactForm = async (contactData) => {
  return post("/contact", contactData);
};

/**
 * Get all contact messages (Admin only)
 * @param {Object} params - Query parameters (page, limit, status, etc.)
 */
export const getContactMessages = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return get(`/contact${queryString ? `?${queryString}` : ""}`);
};

/**
 * Get a single contact message by ID (Admin only)
 * @param {string} messageId - Message ID
 */
export const getContactMessageById = async (messageId) => {
  return get(`/contact/${messageId}`);
};

/**
 * Update contact message status (Admin only)
 * @param {string} messageId - Message ID
 * @param {Object} updateData - Update data (status, reply, etc.)
 */
export const updateContactMessage = async (messageId, updateData) => {
  return put(`/contact/${messageId}`, updateData);
};




export default {
  submitContactForm,
  getContactMessages,
  getContactMessageById,
  updateContactMessage,

};
