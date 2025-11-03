/**
 * API Client - Central configuration for all API calls
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

/**
 * Generic API call handler with error handling and authentication
 */
export const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  // Handle FormData (for file uploads)
  if (options.body instanceof FormData) {
    delete config.headers["Content-Type"]; // Let browser set it with boundary
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    // Handle empty responses (204 No Content)
    if (response.status === 204) {
      return { success: true };
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("API call error:", error);
    throw error;
  }
};

/**
 * GET request helper
 */
export const get = (endpoint, options = {}) => {
  return apiCall(endpoint, { method: "GET", ...options });
};

/**
 * POST request helper
 */
export const post = (endpoint, data, options = {}) => {
  const body = data instanceof FormData ? data : JSON.stringify(data);
  return apiCall(endpoint, { method: "POST", body, ...options });
};

/**
 * PUT request helper
 */
export const put = (endpoint, data, options = {}) => {
  const body = data instanceof FormData ? data : JSON.stringify(data);
  return apiCall(endpoint, { method: "PUT", body, ...options });
};

/**
 * DELETE request helper
 */
export const del = (endpoint, options = {}) => {
  return apiCall(endpoint, { method: "DELETE", ...options });
};

/**
 * PATCH request helper
 */
export const patch = (endpoint, data, options = {}) => {
  return apiCall(endpoint, {
    method: "PATCH",
    body: JSON.stringify(data),
    ...options,
  });
};

export default {
  get,
  post,
  put,
  delete: del,
  patch,
};
