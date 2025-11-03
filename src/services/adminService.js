/**
 * Admin Service - API calls for admin panel
 */

import { get, post, put, del } from "./apiClient";

// ==================== PRODUCTS ====================

/**
 * Get all products including inactive ones (admin only)
 * No filters - returns all products from database
 */
export const getAdminProducts = async () => {
  return get(`/products/admin/all`);
};

/**
 * Get product by ID (admin)
 */
export const getAdminProductById = async (productId) => {
  return get(`/products/${productId}`);
};

/**
 * Create new product (admin)
 * @param {Object} productData - Product information
 * @param {File[]} imageFiles - Array of image files to upload
 */
export const createProduct = async (productData, imageFiles = []) => {
  const formData = new FormData();
  
  // Append product data
  formData.append("name", productData.name);
  formData.append("description", productData.description);
  formData.append("price", productData.price);
  
  // Append image files
  imageFiles.forEach((file) => {
    formData.append("images", file);
  });
  
  return post("/products", formData);
};

/**
 * Update product (admin)
 * @param {string} productId - Product ID
 * @param {Object} productData - Product information
 * @param {File[]} newImageFiles - Array of new image files to upload
 * @param {string[]} existingImages - Array of existing image URLs to keep
 */
export const updateProduct = async (productId, productData, newImageFiles = [], existingImages = []) => {
  const formData = new FormData();
  
  // Append product data
  formData.append("name", productData.name);
  formData.append("description", productData.description);
  formData.append("price", productData.price);
  
  // Append existing image URLs (as JSON string)
  if (existingImages.length > 0) {
    formData.append("existingImages", JSON.stringify(existingImages));
  }
  
  // Append new image files
  newImageFiles.forEach((file) => {
    formData.append("images", file);
  });
  
  return put(`/products/${productId}`, formData);
};

/**
 * Delete product (admin)
 */
export const deleteProduct = async (productId) => {
  return del(`/products/${productId}`);
};

/**
 * Toggle product active status (admin)
 * @param {string} productId - Product ID
 */
export const toggleProductStatus = async (productId) => {
  return put(`/products/${productId}/toggle-status`);
};

/**
 * Toggle product featured status (admin)
 * @param {string} productId - Product ID
 */
export const toggleProductFeatured = async (productId) => {
  return put(`/products/${productId}/toggle-featured`);
};

// ==================== BLOGS ====================

/**
 * Get all blogs including inactive ones (admin only)
 */
export const getAdminBlogs = async () => {
  return get(`/blogs/admin/all`);
};

/**
 * Get blog by ID (admin)
 */
export const getAdminBlogById = async (blogId) => {
  return get(`/blogs/${blogId}`);
};

/**
 * Create new blog (admin)
 * @param {Object} blogData - Blog information
 * @param {File} thumbnailFile - Thumbnail image file
 */
export const createBlog = async (blogData, thumbnailFile) => {
  const formData = new FormData();
  
  formData.append("title", blogData.title);
  formData.append("content", blogData.content);
  
  // Append thumbnail file
  if (thumbnailFile) {
    formData.append("img", thumbnailFile);
  }
  
  return post("/blogs", formData);
};

/**
 * Update blog (admin)
 * @param {string} blogId - Blog ID
 * @param {Object} blogData - Blog information
 * @param {File} thumbnailFile - New thumbnail image file (optional)
 */
export const updateBlog = async (blogId, blogData, thumbnailFile = null) => {
  const formData = new FormData();
  
  formData.append("title", blogData.title);
  formData.append("content", blogData.content);
  
  // Append new thumbnail file if provided
  if (thumbnailFile) {
    formData.append("img", thumbnailFile);
  }
  
  return put(`/blogs/${blogId}`, formData);
};

/**
 * Delete blog (admin)
 */
export const deleteBlog = async (blogId) => {
  return del(`/blogs/${blogId}`);
};

/**
 * Toggle blog active status (admin)
 * @param {string} blogId - Blog ID
 */
export const toggleBlogStatus = async (blogId) => {
  return put(`/blogs/${blogId}/toggle-status`);
};

// ==================== CONTACTS ====================

/**
 * Get all contact messages (admin)
 */
export const getAdminContacts = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return get(`/contact${queryString ? `?${queryString}` : ""}`);
};

/**
 * Update contact status (admin)
 * @param {string} contactId - Contact ID
 * @param {Object} data - Update data (status, etc.)
 */
export const updateContactStatus = async (contactId, data) => {
  return put(`/contact/${contactId}`, data);
};

/**
 * Delete contact message (admin)
 */
export const deleteContact = async (contactId) => {
  return del(`/contact/${contactId}`);
};

export default {
  // Products
  getAdminProducts,
  getAdminProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductStatus,
  toggleProductFeatured,
  
  // Blogs
  getAdminBlogs,
  getAdminBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  toggleBlogStatus,
  
  // Contacts
  getAdminContacts,
  updateContactStatus,
  deleteContact,
};
