/**
 * Blog Service - Handles all blog-related API calls
 */

import { get, post, put, del } from "./apiClient";

/**
 * Get all blogs with optional pagination and filters
 * @param {Object} params - Query parameters (page, limit, search, category, etc.)
 */
export const getBlogs = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return get(`/blogs${queryString ? `?${queryString}` : ""}`);
};

/**
 * Get a single blog by ID
 * @param {string} blogId - Blog ID
 */
export const getBlogById = async (blogId) => {
  return get(`/blogs/${blogId}`);
};

export const createBlog = async (blogData) => {
  const formData = new FormData();
  formData.append("title", blogData.title);
  formData.append("content", blogData.content);
  formData.append("author", blogData.author);

  if (blogData.img instanceof File) {
    formData.append("img", blogData.img);
  } else if (
    typeof blogData.img === "string" &&
    blogData.img.startsWith("data:")
  ) {
    const { base64ToFile } = await import("./uploadService");
    const imageFile = base64ToFile(blogData.img, "blog-image.png");
    formData.append("img", imageFile);
  }

  return post("/blogs", formData);
};

export const updateBlog = async (blogId, blogData) => {
  const formData = new FormData();

  if (blogData.title) formData.append("title", blogData.title);
  if (blogData.content) formData.append("content", blogData.content);
  if (blogData.author) formData.append("author", blogData.author);

  if (blogData.img instanceof File) {
    formData.append("img", blogData.img);
  } else if (
    typeof blogData.img === "string" &&
    blogData.img.startsWith("data:")
  ) {
    const { base64ToFile } = await import("./uploadService");
    const imageFile = base64ToFile(blogData.img, "blog-image.png");
    formData.append("img", imageFile);
  }

  return put(`/blogs/${blogId}`, formData);
};

export const deleteBlog = async (blogId) => {
  return del(`/blogs/${blogId}`);
};

export const getFeaturedBlogs = async () => {
  return get("/blogs/featured");
};

export default {
  getBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  getFeaturedBlogs,
};
