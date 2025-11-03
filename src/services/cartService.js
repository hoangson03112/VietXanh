/**
 * Cart Service - Handles shopping cart API calls
 */

import { get, post, put, del } from "./apiClient";

/**
 * Get user's cart
 */
export const getCart = async () => {
  return get("/cart");
};

/**
 * Add item to cart
 * @param {Object} itemData - Item data (productId, quantity, variant, etc.)
 */
export const addToCart = async (itemData) => {
  return post("/cart/items", itemData);
};

/**
 * Update cart item quantity
 * @param {string} itemId - Cart item ID
 * @param {number} quantity - New quantity
 */
export const updateCartItem = async (itemId, quantity) => {
  return put(`/cart/items/${itemId}`, { quantity });
};

/**
 * Remove item from cart
 * @param {string} itemId - Cart item ID
 */
export const removeFromCart = async (itemId) => {
  return del(`/cart/items/${itemId}`);
};

/**
 * Clear entire cart
 */
export const clearCart = async () => {
  return del("/cart");
};

/**
 * Apply coupon/discount code
 * @param {string} couponCode - Coupon code
 */
export const applyCoupon = async (couponCode) => {
  return post("/cart/coupon", { code: couponCode });
};

/**
 * Remove coupon
 */
export const removeCoupon = async () => {
  return del("/cart/coupon");
};

export default {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  applyCoupon,
  removeCoupon,
};
