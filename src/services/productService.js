/**
 * Product Service - Handles all product-related API calls
 */

import { get, post, put, del } from "./apiClient";

/**
 * Get all active products (for users - only isActive = true)
 * No filters, search, or pagination
 */
export const getProducts = async () => {
  return get(`/products`);
};

/**
 * Get a single product by ID
 * @param {string} productId - Product ID
 */
export const getProductById = async (productId) => {
  return get(`/products/${productId}`);
};

/**
 * Create a new product (Admin only)
 * @param {Object} productData - Product data
 * @param {string} productData.name - Product name
 * @param {number} productData.price - Product price
 * @param {string} productData.description - Product description
 * @param {Array<File>} productData.images - Array of image files
 * @param {number} [productData.stock] - Stock quantity
 */
export const createProduct = async (productData) => {
  // Create FormData to handle file uploads
  const formData = new FormData();
  formData.append("name", productData.name);
  formData.append("price", productData.price);
  formData.append("description", productData.description);

  if (productData.stock !== undefined) {
    formData.append("stock", productData.stock);
  }

  // Append image files
  if (productData.images && Array.isArray(productData.images)) {
    for (let i = 0; i < productData.images.length; i++) {
      const image = productData.images[i];
      if (image instanceof File) {
        formData.append("images", image);
      } else if (typeof image === "string" && image.startsWith("data:")) {
        // Handle base64 images
        const { base64ToFile } = await import("./uploadService");
        const imageFile = base64ToFile(image, `product-image-${i}.png`);
        formData.append("images", imageFile);
      }
    }
  }

  return post("/products", formData);
};

/**
 * Update a product (Admin only)
 * @param {string} productId - Product ID
 * @param {Object} productData - Updated product data
 * @param {Array<File>} [productData.images] - New image files (optional)
 */
export const updateProduct = async (productId, productData) => {
  // Create FormData to handle file uploads
  const formData = new FormData();

  if (productData.name) formData.append("name", productData.name);
  if (productData.price) formData.append("price", productData.price);
  if (productData.description)
    formData.append("description", productData.description);
  if (productData.stock !== undefined)
    formData.append("stock", productData.stock);

  // Append image files if exists
  if (productData.images && Array.isArray(productData.images)) {
    for (let i = 0; i < productData.images.length; i++) {
      const image = productData.images[i];
      if (image instanceof File) {
        formData.append("images", image);
      } else if (typeof image === "string" && image.startsWith("data:")) {
        // Handle base64 images
        const { base64ToFile } = await import("./uploadService");
        const imageFile = base64ToFile(image, `product-image-${i}.png`);
        formData.append("images", imageFile);
      }
    }
  }

  return put(`/products/${productId}`, formData);
};

/**
 * Delete a product (Admin only)
 * @param {string} productId - Product ID
 */
export const deleteProduct = async (productId) => {
  return del(`/products/${productId}`);
};

/**
 * Get featured/popular products
 */
export const getFeaturedProducts = async () => {
  return get("/products/featured");
};

/**
 * Search products
 * @param {string} query - Search query
 */
export const searchProducts = async (query) => {
  return get(`/products/search?q=${encodeURIComponent(query)}`);
};

export default {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  searchProducts,
};
