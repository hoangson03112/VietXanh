/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Underline } from "@tiptap/extension-underline";
import { TextAlign } from "@tiptap/extension-text-align";
import { Color } from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import Image from "@tiptap/extension-image";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Save,
  FileText,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Calendar,
  Bold as BoldIcon,
  Italic as ItalicIcon,
  Underline as UnderlineIcon,
  Strikethrough as StrikethroughIcon,
  List as ListIcon,
  ListOrdered as ListOrderedIcon,
  AlignLeft as AlignLeftIcon,
  AlignCenter as AlignCenterIcon,
  AlignRight as AlignRightIcon,
  Undo as UndoIcon,
  Redo as RedoIcon,
  Image as ImageIcon,
  Heading1,
  Heading2,
  Quote,
  Code,
  Minus,
} from "lucide-react";
import {
  getAdminBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  toggleBlogStatus,
} from "../../services/adminService";
import ConfirmModal from "../../components/ConfirmModal";
import Toast from "../../components/Toast";

export default function AdminBlogs() {
  // Tiptap Editor cho nội dung
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      TextStyle,
      Color,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
    ],
    content: "",
    editorProps: {
      handlePaste: (view, event) => {
        const items = event.clipboardData?.items;
        if (!items) return false;

        for (let i = 0; i < items.length; i++) {
          if (items[i].type.indexOf("image") !== -1) {
            event.preventDefault();
            const file = items[i].getAsFile();
            if (file) {
              const reader = new FileReader();
              reader.onload = (e) => {
                const url = e.target?.result;
                if (url && editor) {
                  editor.chain().focus().setImage({ src: url }).run();
                }
              };
              reader.readAsDataURL(file);
            }
            return true;
          }
        }
        return false;
      },
    },
  });

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [currentBlog, setCurrentBlog] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");

  // Toast state
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  // ConfirmModal state
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    onConfirm: () => {},
    title: "",
    message: "",
    type: "danger",
    icon: "delete",
  });

  // Helper: Show toast
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
  };

  // Load blogs from API
  useEffect(() => {
    const loadBlogs = async () => {
      try {
        setLoading(true);
        const response = await getAdminBlogs();
        setBlogs(response.data || []);
      } catch (error) {
        console.error("Error loading blogs:", error);
        showToast("Không thể tải danh sách bài viết", "error");
      } finally {
        setLoading(false);
      }
    };

    loadBlogs();
  }, []);

  // Filter and search
  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch = blog.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBlogs = filteredBlogs.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Hàm thêm ảnh vào editor từ file upload
  const addImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const url = event.target.result;
          editor?.chain().focus().setImage({ src: url }).run();
        };
        reader.readAsDataURL(file);
      }
    };

    input.click();
  };

  const handleCreate = () => {
    setModalMode("create");
    setFormData({
      title: "",
      content: "",
    });
    setThumbnailFile(null);
    setThumbnailPreview("");
    editor?.commands.setContent("");
    setShowModal(true);
  };

  const handleEdit = (blog) => {
    setModalMode("edit");
    setCurrentBlog(blog);
    setFormData({
      title: blog.title,
      content: blog.content,
    });
    setThumbnailFile(null);
    setThumbnailPreview(blog.img || "");
    editor?.commands.setContent(blog.content || "");
    setShowModal(true);
  };

  const handleDelete = (blogId) => {
    setConfirmModal({
      isOpen: true,
      title: "Xóa bài viết",
      message:
        "Bạn có chắc chắn muốn xóa bài viết này? Hành động này không thể hoàn tác.",
      type: "danger",
      icon: "delete",
      onConfirm: async () => {
        try {
          await deleteBlog(blogId);
          showToast("Xóa bài viết thành công!", "success");

          // Reload blogs
          const response = await getAdminBlogs();
          setBlogs(response.data || []);
        } catch (error) {
          console.error("Error deleting blog:", error);
          showToast("Không thể xóa bài viết", "error");
        } finally {
          setConfirmModal({ ...confirmModal, isOpen: false });
        }
      },
    });
  };

  const handleToggleStatus = (blog) => {
    const newStatus = !blog.isActive;

    setConfirmModal({
      isOpen: true,
      title: newStatus ? "Hiển thị bài viết" : "Ẩn bài viết",
      message: newStatus
        ? "Bài viết sẽ hiển thị trên website cho người dùng xem."
        : "Bài viết sẽ bị ẩn và không hiển thị trên website.",
      type: newStatus ? "info" : "warning",
      icon: newStatus ? "show" : "hide",
      onConfirm: async () => {
        try {
          await toggleBlogStatus(blog._id);
          showToast(
            newStatus ? "Đã hiển thị bài viết!" : "Đã ẩn bài viết!",
            "success"
          );

          // Reload blogs
          const response = await getAdminBlogs();
          setBlogs(response.data || []);
        } catch (error) {
          console.error("Error toggling blog status:", error);
          showToast("Không thể cập nhật trạng thái", "error");
        } finally {
          setConfirmModal({ ...confirmModal, isOpen: false });
        }
      },
    });
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);

      // Preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      showToast("Vui lòng nhập tiêu đề bài viết", "warning");
      return;
    }

    const editorContent = editor?.getHTML() || "";
    if (!editorContent.trim() || editorContent === "<p></p>") {
      showToast("Vui lòng nhập nội dung bài viết", "warning");
      return;
    }

    if (modalMode === "create" && !thumbnailFile) {
      showToast("Vui lòng chọn ảnh thumbnail cho bài viết", "warning");
      return;
    }

    try {
      setLoading(true);

      const blogData = {
        title: formData.title,
        content: editorContent,
      };

      if (modalMode === "create") {
        await createBlog(blogData, thumbnailFile);
        showToast("Tạo bài viết thành công!", "success");
      } else {
        await updateBlog(currentBlog._id, blogData, thumbnailFile);
        showToast("Cập nhật bài viết thành công!", "success");
      }

      // Reload blogs
      const response = await getAdminBlogs();
      setBlogs(response.data || []);

      setShowModal(false);
    } catch (error) {
      console.error("Error saving blog:", error);
      showToast(
        modalMode === "create"
          ? "Không thể tạo bài viết"
          : "Không thể cập nhật bài viết",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen font-sans"
      style={{ backgroundColor: "rgba(255, 244, 228, 1)" }}
    >
      <div className="max-w-full px-4 md:px-6 lg:px-8 py-6 md:py-8">
        {/* Toolbar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl md:rounded-2xl shadow-lg p-3 md:p-6 mb-4 md:mb-6"
        >
          <div className="flex flex-col lg:flex-row gap-3 md:gap-4 items-start lg:items-center justify-between">
            {/* Search */}
            <div className="flex-1 w-full lg:max-w-md relative">
              <Search
                size={18}
                className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2"
                style={{ color: "rgba(49, 87, 44, 0.5)" }}
              />
              <input
                type="text"
                placeholder="Tìm kiếm bài viết..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 md:pl-12 pr-3 md:pr-4 py-2 md:py-3 text-sm md:text-base rounded-full border-2 focus:outline-none focus:ring-2 transition-all"
                style={{
                  borderColor: "rgba(64, 145, 108, 0.3)",
                  color: "rgba(49, 87, 44, 1)",
                }}
              />
            </div>

            <div className="flex flex-wrap gap-2 md:gap-3 w-full lg:w-auto">
              {/* Add Button */}
              <button
                onClick={handleCreate}
                className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 md:px-6 py-2 md:py-3 text-sm md:text-base rounded-full text-white font-bold transition-all hover:scale-105 hover:shadow-xl cursor-pointer"
                style={{ backgroundColor: "rgba(64, 145, 108, 1)" }}
              >
                <Plus size={18} />
                <span>Viết bài mới</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Blogs Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            {paginatedBlogs.map((blog, index) => (
              <motion.div
                key={blog._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white rounded-xl md:rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all"
              >
                {/* Image */}
                <div className="h-40 md:h-48 bg-gray-100 relative overflow-hidden">
                  <img
                    src={blog.img}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "/placeholder.png";
                    }}
                  />
                </div>

                {/* Content */}
                <div className="p-3 md:p-5">
                  <div className="flex items-center gap-2 mb-2 md:mb-3">
                    {/* Status Badge */}
                    <span
                      className={`text-[10px] md:text-xs px-2 py-0.5 rounded-full font-bold ${
                        blog.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {blog.isActive ? "Hiển thị" : "Ẩn"}
                    </span>
                  </div>

                  <h3
                    className="font-bold text-sm md:text-base lg:text-lg mb-1 md:mb-2 line-clamp-2"
                    style={{ color: "rgba(49, 87, 44, 1)" }}
                  >
                    {blog.title}
                  </h3>

                  <div
                    className="flex items-center gap-2 text-[10px] md:text-xs mb-3 md:mb-4"
                    style={{ color: "rgba(49, 87, 44, 0.6)" }}
                  >
                    <Calendar size={12} className="md:w-3.5 md:h-3.5" />
                    <span>
                      {new Date(blog.createdAt).toLocaleDateString("vi-VN")}
                    </span>
                  </div>

                  <div className="flex gap-2 pt-2 md:pt-3 border-t border-gray-100">
                    <button
                      onClick={() => handleToggleStatus(blog)}
                      className={`flex-1 flex items-center justify-center gap-1 md:gap-2 px-2 md:px-4 py-2 text-xs md:text-sm rounded-full font-bold text-white transition-all hover:scale-105 cursor-pointer ${
                        blog.isActive ? "bg-orange-500" : "bg-green-500"
                      }`}
                      title={
                        blog.isActive ? "Ẩn bài viết" : "Hiển thị bài viết"
                      }
                    >
                      {blog.isActive ? (
                        <EyeOff size={14} className="md:w-4 md:h-4" />
                      ) : (
                        <Eye size={14} className="md:w-4 md:h-4" />
                      )}
                      <span className="hidden sm:inline">
                        {blog.isActive ? "Ẩn" : "Hiện"}
                      </span>
                    </button>
                    <button
                      onClick={() => handleEdit(blog)}
                      className="flex-1 flex items-center justify-center gap-1 md:gap-2 px-2 md:px-4 py-2 text-xs md:text-sm rounded-full font-bold text-white transition-all hover:scale-105 cursor-pointer"
                      style={{ backgroundColor: "rgba(64, 145, 108, 1)" }}
                    >
                      <Edit2 size={14} className="md:w-4 md:h-4" />
                      <span className="hidden sm:inline">Sửa</span>
                    </button>
                    <button
                      onClick={() => handleDelete(blog._id)}
                      className="flex-1 flex items-center justify-center gap-1 md:gap-2 px-2 md:px-4 py-2 text-xs md:text-sm rounded-full font-bold text-white transition-all hover:scale-105 cursor-pointer"
                      style={{ backgroundColor: "#F44336" }}
                    >
                      <Trash2 size={14} className="md:w-4 md:h-4" />
                      <span className="hidden sm:inline">Xóa</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Empty State */}
          {paginatedBlogs.length === 0 && (
            <div className="bg-white rounded-xl md:rounded-2xl p-8 md:p-16 text-center shadow-lg">
              <FileText
                size={48}
                className="mx-auto mb-4 opacity-30 md:w-16 md:h-16"
                style={{ color: "rgba(49, 87, 44, 1)" }}
              />
              <p
                className="text-base md:text-xl font-medium"
                style={{ color: "rgba(49, 87, 44, 0.6)" }}
              >
                Không tìm thấy bài viết nào
              </p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 md:mt-8 flex items-center justify-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:scale-110"
                style={{ backgroundColor: "rgba(64, 145, 108, 0.1)" }}
              >
                <ChevronLeft
                  size={18}
                  className="md:w-5 md:h-5"
                  style={{ color: "rgba(64, 145, 108, 1)" }}
                />
              </button>
              <span
                className="px-3 md:px-4 py-1.5 md:py-2 text-sm md:text-base rounded-lg font-bold"
                style={{
                  backgroundColor: "rgba(64, 145, 108, 0.1)",
                  color: "rgba(49, 87, 44, 1)",
                }}
              >
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:scale-110"
                style={{ backgroundColor: "rgba(64, 145, 108, 0.1)" }}
              >
                <ChevronRight
                  size={18}
                  className="md:w-5 md:h-5"
                  style={{ color: "rgba(64, 145, 108, 1)" }}
                />
              </button>
            </div>
          )}
        </motion.div>
      </div>

      {/* Modal Create/Edit - Enhanced */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto animate-fadeIn">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl my-8"
          >
            {/* Modal Header */}
            <div
              className="sticky top-0 px-6 md:px-8 py-4 md:py-5 border-b border-gray-200 flex items-center justify-between rounded-t-2xl z-10"
              style={{
                background:
                  "linear-gradient(135deg, rgba(64, 145, 108, 1) 0%, rgba(49, 87, 44, 1) 100%)",
              }}
            >
              <h2 className="text-xl md:text-3xl font-bold text-white flex items-center gap-3">
                <FileText size={28} />
                {modalMode === "create" ? "Viết bài mới" : "Sửa bài viết"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 md:p-2.5 hover:bg-white/20 rounded-xl transition-all hover:rotate-90 duration-300"
              >
                <X size={20} className="text-white md:w-6 md:h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <form
              onSubmit={handleSubmit}
              className="p-4 md:p-6 space-y-4 md:space-y-5 max-h-[70vh] overflow-y-auto"
            >
              <div>
                <label
                  className="block mb-1.5 md:mb-2 font-bold text-xs md:text-sm"
                  style={{ color: "rgba(49, 87, 44, 1)" }}
                >
                  Tiêu đề *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Nhập tiêu đề bài viết..."
                  className="w-full px-4 md:px-5 py-3 md:py-4 text-base md:text-lg rounded-xl border-2 focus:outline-none focus:ring-4 focus:ring-green-200 transition-all font-medium"
                  style={{
                    borderColor: "rgba(64, 145, 108, 0.3)",
                    color: "rgba(49, 87, 44, 1)",
                  }}
                />
              </div>

              {/* Content Editor */}
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                <label
                  className="mb-3 font-bold text-base md:text-lg flex items-center gap-2"
                  style={{ color: "rgba(49, 87, 44, 1)" }}
                >
                  <Edit2 size={20} />
                  Nội dung bài viết *
                </label>
                {/* Tiptap Toolbar - Enhanced */}
                <div
                  className="border-2 rounded-xl overflow-hidden shadow-sm"
                  style={{ borderColor: "rgba(64, 145, 108, 0.3)" }}
                >
                  <div className="bg-linear-to-r from-gray-50 to-gray-100 border-b p-3 flex flex-wrap gap-2">
                    {/* Headings */}
                    <div className="flex gap-1 pr-2 border-r border-gray-300">
                      <button
                        type="button"
                        onClick={() =>
                          editor
                            ?.chain()
                            .focus()
                            .toggleHeading({ level: 1 })
                            .run()
                        }
                        className={`p-2 rounded-lg transition-all font-bold ${
                          editor?.isActive("heading", { level: 1 })
                            ? "bg-green-600 text-white shadow-md"
                            : "hover:bg-gray-200 text-gray-700"
                        }`}
                        title="Heading 1"
                      >
                        <Heading1 size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          editor
                            ?.chain()
                            .focus()
                            .toggleHeading({ level: 2 })
                            .run()
                        }
                        className={`p-2 rounded-lg transition-all font-bold ${
                          editor?.isActive("heading", { level: 2 })
                            ? "bg-green-600 text-white shadow-md"
                            : "hover:bg-gray-200 text-gray-700"
                        }`}
                        title="Heading 2"
                      >
                        <Heading2 size={18} />
                      </button>
                    </div>

                    {/* Text Style */}
                    <div className="flex gap-1 pr-2 border-r border-gray-300">
                      <button
                        type="button"
                        onClick={() =>
                          editor?.chain().focus().toggleBold().run()
                        }
                        className={`p-2 rounded-lg transition-all ${
                          editor?.isActive("bold")
                            ? "bg-green-600 text-white shadow-md"
                            : "hover:bg-gray-200 text-gray-700"
                        }`}
                        title="Bold"
                      >
                        <BoldIcon size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          editor?.chain().focus().toggleItalic().run()
                        }
                        className={`p-2 rounded-lg transition-all ${
                          editor?.isActive("italic")
                            ? "bg-green-600 text-white shadow-md"
                            : "hover:bg-gray-200 text-gray-700"
                        }`}
                        title="Italic"
                      >
                        <ItalicIcon size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          editor?.chain().focus().toggleUnderline().run()
                        }
                        className={`p-2 rounded-lg transition-all ${
                          editor?.isActive("underline")
                            ? "bg-green-600 text-white shadow-md"
                            : "hover:bg-gray-200 text-gray-700"
                        }`}
                        title="Underline"
                      >
                        <UnderlineIcon size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          editor?.chain().focus().toggleStrike().run()
                        }
                        className={`p-2 rounded-lg transition-all ${
                          editor?.isActive("strike")
                            ? "bg-green-600 text-white shadow-md"
                            : "hover:bg-gray-200 text-gray-700"
                        }`}
                        title="Strikethrough"
                      >
                        <StrikethroughIcon size={18} />
                      </button>
                    </div>

                    {/* Text Align */}
                    <div className="flex gap-1 pr-2 border-r border-gray-300">
                      <button
                        type="button"
                        onClick={() =>
                          editor?.chain().focus().setTextAlign("left").run()
                        }
                        className={`p-2 rounded-lg transition-all ${
                          editor?.isActive({ textAlign: "left" })
                            ? "bg-green-600 text-white shadow-md"
                            : "hover:bg-gray-200 text-gray-700"
                        }`}
                        title="Align Left"
                      >
                        <AlignLeftIcon size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          editor?.chain().focus().setTextAlign("center").run()
                        }
                        className={`p-2 rounded-lg transition-all ${
                          editor?.isActive({ textAlign: "center" })
                            ? "bg-green-600 text-white shadow-md"
                            : "hover:bg-gray-200 text-gray-700"
                        }`}
                        title="Align Center"
                      >
                        <AlignCenterIcon size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          editor?.chain().focus().setTextAlign("right").run()
                        }
                        className={`p-2 rounded-lg transition-all ${
                          editor?.isActive({ textAlign: "right" })
                            ? "bg-green-600 text-white shadow-md"
                            : "hover:bg-gray-200 text-gray-700"
                        }`}
                        title="Align Right"
                      >
                        <AlignRightIcon size={18} />
                      </button>
                    </div>

                    {/* Lists */}
                    <div className="flex gap-1 pr-2 border-r border-gray-300">
                      <button
                        type="button"
                        onClick={() =>
                          editor?.chain().focus().toggleBulletList().run()
                        }
                        className={`p-2 rounded-lg transition-all ${
                          editor?.isActive("bulletList")
                            ? "bg-green-600 text-white shadow-md"
                            : "hover:bg-gray-200 text-gray-700"
                        }`}
                        title="Bullet List"
                      >
                        <ListIcon size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          editor?.chain().focus().toggleOrderedList().run()
                        }
                        className={`p-2 rounded-lg transition-all ${
                          editor?.isActive("orderedList")
                            ? "bg-green-600 text-white shadow-md"
                            : "hover:bg-gray-200 text-gray-700"
                        }`}
                        title="Numbered List"
                      >
                        <ListOrderedIcon size={18} />
                      </button>
                    </div>

                    {/* Special Elements */}
                    <div className="flex gap-1 pr-2 border-r border-gray-300">
                      <button
                        type="button"
                        onClick={() =>
                          editor?.chain().focus().toggleBlockquote().run()
                        }
                        className={`p-2 rounded-lg transition-all ${
                          editor?.isActive("blockquote")
                            ? "bg-green-600 text-white shadow-md"
                            : "hover:bg-gray-200 text-gray-700"
                        }`}
                        title="Quote"
                      >
                        <Quote size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          editor?.chain().focus().toggleCodeBlock().run()
                        }
                        className={`p-2 rounded-lg transition-all ${
                          editor?.isActive("codeBlock")
                            ? "bg-green-600 text-white shadow-md"
                            : "hover:bg-gray-200 text-gray-700"
                        }`}
                        title="Code Block"
                      >
                        <Code size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          editor?.chain().focus().setHorizontalRule().run()
                        }
                        className="p-2 rounded-lg transition-all hover:bg-gray-200 text-gray-700"
                        title="Horizontal Line"
                      >
                        <Minus size={18} />
                      </button>
                    </div>

                    {/* Image Upload */}
                    <div className="flex gap-1 pr-2 border-r border-gray-300">
                      <button
                        type="button"
                        onClick={addImage}
                        className="p-2 rounded-lg transition-all bg-blue-500 text-white hover:bg-blue-600 shadow-md hover:shadow-lg"
                        title="Upload Image"
                      >
                        <ImageIcon size={18} />
                      </button>
                    </div>

                    {/* Undo/Redo */}
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => editor?.chain().focus().undo().run()}
                        disabled={!editor?.can().undo()}
                        className="p-2 rounded-lg transition-all hover:bg-gray-200 text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Undo"
                      >
                        <UndoIcon size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={() => editor?.chain().focus().redo().run()}
                        disabled={!editor?.can().redo()}
                        className="p-2 rounded-lg transition-all hover:bg-gray-200 text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Redo"
                      >
                        <RedoIcon size={18} />
                      </button>
                    </div>
                  </div>
                  <EditorContent
                    editor={editor}
                    className="prose prose-lg prose-img:max-w-full prose-img:h-auto prose-img:rounded-xl prose-img:shadow-md prose-img:my-4 prose-headings:text-green-800 prose-a:text-blue-600 max-w-none p-5 md:p-6 min-h-[350px] focus:outline-none bg-white"
                    style={{ color: "#1a1a1a", fontSize: "16px" }}
                  />
                </div>
              </div>

              {/* Thumbnail Upload */}
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                <label
                  className="mb-3 font-bold text-base md:text-lg flex items-center gap-2"
                  style={{ color: "rgba(49, 87, 44, 1)" }}
                >
                  <ImageIcon size={20} />
                  Ảnh đại diện *
                </label>

                <div className="space-y-4">
                  <div className="flex gap-4 items-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailChange}
                      className="hidden"
                      id="thumbnail-upload"
                    />
                    <label
                      htmlFor="thumbnail-upload"
                      className="cursor-pointer px-6 py-3.5 text-base rounded-xl border-2 font-bold transition-all hover:scale-105 hover:shadow-lg flex items-center gap-3"
                      style={{
                        borderColor: "rgba(64, 145, 108, 1)",
                        color: "rgba(64, 145, 108, 1)",
                        backgroundColor: "rgba(64, 145, 108, 0.1)",
                      }}
                    >
                      <ImageIcon size={22} />
                      {modalMode === "edit"
                        ? "Chọn ảnh mới"
                        : "Chọn ảnh từ máy"}
                    </label>
                    {(thumbnailFile || thumbnailPreview) && (
                      <span className="text-base text-green-600 font-semibold flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        {thumbnailFile
                          ? "Đã chọn ảnh mới"
                          : "Đang dùng ảnh hiện tại"}
                      </span>
                    )}
                  </div>

                  {/* Thumbnail Preview */}
                  {thumbnailPreview && (
                    <div className="mt-4">
                      <img
                        src={thumbnailPreview}
                        alt="Thumbnail preview"
                        className="w-full max-w-md h-48 object-cover rounded-xl border-2 border-gray-200 shadow-md"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4 sticky bottom-0 bg-gray-50 pb-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-3.5 text-base md:text-lg rounded-xl border-2 font-bold transition-all hover:scale-105 hover:bg-gray-50"
                  style={{
                    borderColor: "rgba(64, 145, 108, 1)",
                    color: "rgba(64, 145, 108, 1)",
                  }}
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 text-base md:text-lg rounded-xl font-bold text-white transition-all hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(64, 145, 108, 1) 0%, rgba(49, 87, 44, 1) 100%)",
                  }}
                >
                  <Save size={22} />
                  {loading
                    ? "Đang lưu..."
                    : modalMode === "create"
                    ? "Xuất bản ngay"
                    : "Lưu thay đổi"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Toast Notification */}
      <Toast
        show={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
        message={toast.message}
        type={toast.type}
      />

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        type={confirmModal.type}
        icon={confirmModal.icon}
      />
    </div>
  );
}
