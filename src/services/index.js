/**
 * Services Index - Central export point for all services
 */

// API Client
export * from "./apiClient";

// Auth Service
export * as authService from "./authService";

// Product Service
export * as productService from "./productService";

// Blog Service
export * as blogService from "./blogService";

// Contact Service
export * as contactService from "./contactService";

// Order Service
export * as orderService from "./orderService";

// Cart Service
export * as cartService from "./cartService";

// Upload Service
export * as uploadService from "./uploadService";

// Default export for convenience
import authService from "./authService";
import productService from "./productService";
import blogService from "./blogService";
import contactService from "./contactService";
import orderService from "./orderService";
import cartService from "./cartService";
import uploadService from "./uploadService";

export default {
  auth: authService,
  product: productService,
  blog: blogService,
  contact: contactService,
  order: orderService,
  cart: cartService,
  upload: uploadService,
};
