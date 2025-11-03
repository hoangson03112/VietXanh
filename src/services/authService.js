// API Base URL - thay đổi theo backend của bạn
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000/api";

// Helper function to handle API calls
const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
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

// Login API
export const loginAPI = async (credentials) => {
  try {
    console.log("🚀 Sending login request:", credentials);
    const response = await apiCall("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    console.log("✅ Login response:", response);
    return response;
  } catch (error) {
    console.error("❌ Login error:", error);
    throw error; // Throw error để component xử lý
  }
};

// Register API
export const registerAPI = async (userData) => {
  try {
    console.log("🚀 Sending register request:", userData);
    const response = await apiCall("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
    console.log("✅ Register response:", response);
    return response;
  } catch (error) {
    console.error("❌ Register error:", error);
    throw error; // Throw error thay vì return undefined
  }
};

// Logout API (optional - if your backend needs to invalidate tokens)
export const logoutAPI = async () => {
  try {
    const response = await apiCall("/auth/logout", {
      method: "POST",
    });
    return response;
  } catch (error) {
    console.error("Logout error:", error);
    // Even if the API call fails, we can still logout locally
    return { success: true };
  }
};

// Get current user profile
export const getUserProfile = async () => {
  return apiCall("/auth/profile", {
    method: "GET",
  });
};

// Update user profile
export const updateUserProfile = async (profileData) => {
  return apiCall("/auth/profile", {
    method: "PUT",
    body: JSON.stringify(profileData),
  });
};
