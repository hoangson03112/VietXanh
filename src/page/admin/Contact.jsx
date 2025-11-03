/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  MapPin,
  Calendar,
  MessageSquare,
  Check,
  X as XIcon,
  Loader2,
  ShoppingCart,
} from "lucide-react";
import { getContactMessages } from "../../services/contactService";
import ConfirmModal from "../../components/ConfirmModal";
import Toast from "../../components/Toast";

export default function AdminContact() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const itemsPerPage = 10;

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

  // Load messages from API
  useEffect(() => {
    const loadMessages = async () => {
      try {
        setLoading(true);
        const response = await getContactMessages();
        setMessages(response.data || []);
      } catch (error) {
        console.error("Error loading messages:", error);
        showToast("Không thể tải danh sách tin nhắn", "error");
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, []);

  // Filter and search
  const filteredMessages = messages.filter((msg) => {
    const matchesSearch =
      msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || msg.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredMessages.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMessages = filteredMessages.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleViewMessage = async (message) => {
    setSelectedMessage(message);

    // Auto mark as read if status is "new"
    if (message.status === "new") {
      try {
        // Update local state
        setMessages(
          messages.map((m) =>
            m._id === message._id ? { ...m, status: "read" } : m
          )
        );
        setSelectedMessage({ ...message, status: "read" });
      } catch (error) {
        console.error("Error marking as read:", error);
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };




  return (
    <div
      className="min-h-screen font-sans"
      style={{ backgroundColor: "rgba(255, 244, 228, 1)" }}
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
        {/* Toolbar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-lg p-4 md:p-6 mb-6 md:mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            {/* Search */}
            <div className="flex-1 w-full md:max-w-md relative">
              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2"
                style={{ color: "rgba(49, 87, 44, 0.5)" }}
              />
              <input
                type="text"
                placeholder="Tìm kiếm tin nhắn..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-full border-2 focus:outline-none focus:ring-2 transition-all"
                style={{
                  borderColor: "rgba(64, 145, 108, 0.3)",
                  color: "rgba(49, 87, 44, 1)",
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* Messages Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Messages List */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2
                    size={48}
                    className="animate-spin"
                    style={{ color: "rgba(64, 145, 108, 1)" }}
                  />
                </div>
              ) : (
                <>
                  <div className="divide-y divide-gray-100">
                    {paginatedMessages.map((message, index) => {
              
                      return (
                        <motion.div
                          key={message._id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className={`p-5 cursor-pointer transition-all hover:bg-gray-50 ${
                            selectedMessage?._id === message._id
                              ? "bg-green-50"
                              : ""
                          }`}
                          onClick={() => handleViewMessage(message)}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3
                                  className="font-bold text-base"
                                  style={{ color: "rgba(49, 87, 44, 1)" }}
                                >
                                  {message.name}
                                </h3>
          
                              </div>
                              <p
                                className="text-sm mb-2 line-clamp-2"
                                style={{ color: "rgba(49, 87, 44, 0.7)" }}
                              >
                                {message.message}
                              </p>
                              <div
                                className="flex items-center gap-4 text-xs"
                                style={{ color: "rgba(49, 87, 44, 0.5)" }}
                              >
                                <span className="flex items-center gap-1">
                                  <Calendar size={14} />
                                  {formatDate(message.createdAt)}
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewMessage(message);
                              }}
                              className="p-2 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
                            >
                              <Eye
                                size={20}
                                style={{ color: "rgba(64, 145, 108, 1)" }}
                              />
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Empty State */}
                  {paginatedMessages.length === 0 && (
                    <div className="py-16 text-center">
                      <MessageSquare
                        size={64}
                        className="mx-auto mb-4 opacity-30"
                        style={{ color: "rgba(49, 87, 44, 1)" }}
                      />
                      <p
                        className="text-xl font-medium"
                        style={{ color: "rgba(49, 87, 44, 0.6)" }}
                      >
                        Không tìm thấy tin nhắn nào
                      </p>
                    </div>
                  )}

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <p
                          className="text-sm"
                          style={{ color: "rgba(49, 87, 44, 0.7)" }}
                        >
                          Hiển thị {startIndex + 1} -{" "}
                          {Math.min(
                            startIndex + itemsPerPage,
                            filteredMessages.length
                          )}{" "}
                          trong tổng số {filteredMessages.length} tin nhắn
                        </p>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              setCurrentPage((prev) => Math.max(1, prev - 1))
                            }
                            disabled={currentPage === 1}
                            className="p-2 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:scale-110 cursor-pointer"
                            style={{
                              backgroundColor: "rgba(64, 145, 108, 0.1)",
                            }}
                          >
                            <ChevronLeft
                              size={20}
                              style={{ color: "rgba(64, 145, 108, 1)" }}
                            />
                          </button>
                          <span
                            className="px-4 py-2 rounded-lg font-bold"
                            style={{
                              backgroundColor: "rgba(64, 145, 108, 0.1)",
                              color: "rgba(49, 87, 44, 1)",
                            }}
                          >
                            {currentPage} / {totalPages}
                          </span>
                          <button
                            onClick={() =>
                              setCurrentPage((prev) =>
                                Math.min(totalPages, prev + 1)
                              )
                            }
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:scale-110 cursor-pointer"
                            style={{
                              backgroundColor: "rgba(64, 145, 108, 0.1)",
                            }}
                          >
                            <ChevronRight
                              size={20}
                              style={{ color: "rgba(64, 145, 108, 1)" }}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-1">
            {selectedMessage ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl shadow-lg p-6 sticky top-24"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3
                    className="text-xl font-bold"
                    style={{ color: "rgba(49, 87, 44, 1)" }}
                  >
                    Chi tiết tin nhắn
                  </h3>
                  <button
                    onClick={() => setSelectedMessage(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden cursor-pointer"
                  >
                    <XIcon size={20} style={{ color: "rgba(49, 87, 44, 1)" }} />
                  </button>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <p
                      className="text-xs font-bold mb-1"
                      style={{ color: "rgba(49, 87, 44, 0.6)" }}
                    >
                      Họ tên
                    </p>
                    <p
                      className="font-semibold"
                      style={{ color: "rgba(49, 87, 44, 1)" }}
                    >
                      {selectedMessage.name}
                    </p>
                  </div>

                  <div>
                    <p
                      className="text-xs font-bold mb-1 flex items-center gap-1"
                      style={{ color: "rgba(49, 87, 44, 0.6)" }}
                    >
                      <Mail size={14} />
                      Email
                    </p>
                    <p
                      className="font-semibold"
                      style={{ color: "rgba(49, 87, 44, 1)" }}
                    >
                      {selectedMessage.email}
                    </p>
                  </div>

                  <div>
                    <p
                      className="text-xs font-bold mb-1 flex items-center gap-1"
                      style={{ color: "rgba(49, 87, 44, 0.6)" }}
                    >
                      <Phone size={14} />
                      Số điện thoại
                    </p>
                    <p
                      className="font-semibold"
                      style={{ color: "rgba(49, 87, 44, 1)" }}
                    >
                      {selectedMessage.phone}
                    </p>
                  </div>

                  <div>
                    <p
                      className="text-xs font-bold mb-1 flex items-center gap-1"
                      style={{ color: "rgba(49, 87, 44, 0.6)" }}
                    >
                      <MapPin size={14} />
                      Địa chỉ
                    </p>
                    <p
                      className="font-semibold"
                      style={{ color: "rgba(49, 87, 44, 1)" }}
                    >
                      {selectedMessage.address}
                    </p>
                  </div>

                  <div>
                    <p
                      className="text-xs font-bold mb-1 flex items-center gap-1"
                      style={{ color: "rgba(49, 87, 44, 0.6)" }}
                    >
                      <Calendar size={14} />
                      Thời gian
                    </p>
                    <p
                      className="font-semibold"
                      style={{ color: "rgba(49, 87, 44, 1)" }}
                    >
                      {formatDate(selectedMessage.createdAt)}
                    </p>
                  </div>

                  <div>
                    <p
                      className="text-xs font-bold mb-2 flex items-center gap-1"
                      style={{ color: "rgba(49, 87, 44, 0.6)" }}
                    >
                      <MessageSquare size={14} />
                      Nội dung
                    </p>
                    <div
                      className="p-4 rounded-xl"
                      style={{ backgroundColor: "rgba(64, 145, 108, 0.05)" }}
                    >
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: "rgba(49, 87, 44, 1)" }}
                      >
                        {selectedMessage.message}
                      </p>
                    </div>
                  </div>

                  {/* Products Section */}
                  {selectedMessage.products && selectedMessage.products.length > 0 && (
                    <div>
                      <p
                        className="text-xs font-bold mb-2 flex items-center gap-1"
                        style={{ color: "rgba(49, 87, 44, 0.6)" }}
                      >
                        <ShoppingCart size={14} />
                        Sản phẩm đã đặt ({selectedMessage.products.length})
                      </p>
                      <div className="space-y-2">
                        {selectedMessage.products.map((product, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 p-3 rounded-xl"
                            style={{ backgroundColor: "rgba(64, 145, 108, 0.05)" }}
                          >
                            <img
                              src={product.productImage || "/product1.png"}
                              alt={product.productName}
                              className="w-12 h-12 object-cover rounded-lg"
                              onError={(e) => {
                                e.target.src = "/product1.png";
                              }}
                            />
                            <div className="flex-1 min-w-0">
                              <h5
                                className="font-semibold text-sm truncate"
                                style={{ color: "rgba(49, 87, 44, 1)" }}
                              >
                                {product.productName}
                              </h5>
                              <p className="text-xs text-gray-500">
                                {product.price.toLocaleString("vi-VN")} VNĐ x {product.quantity}
                              </p>
                            </div>
                            <div className="text-right">
                              <p
                                className="font-bold text-sm"
                                style={{ color: "rgba(64, 145, 108, 1)" }}
                              >
                                {product.subtotal.toLocaleString("vi-VN")} VNĐ
                              </p>
                            </div>
                          </div>
                        ))}
                        
                        {/* Total Amount */}
                        {selectedMessage.totalAmount > 0 && (
                          <div
                            className="flex items-center justify-between p-3 rounded-xl font-bold"
                            style={{ backgroundColor: "rgba(64, 145, 108, 0.1)" }}
                          >
                            <span style={{ color: "rgba(49, 87, 44, 1)" }}>
                              Tổng cộng:
                            </span>
                            <span
                              className="text-lg"
                              style={{ color: "rgba(64, 145, 108, 1)" }}
                            >
                              {selectedMessage.totalAmount.toLocaleString("vi-VN")} VNĐ
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="hidden lg:flex bg-white rounded-2xl shadow-lg p-12 items-center justify-center h-96"
              >
                <div className="text-center">
                  <MessageSquare
                    size={64}
                    className="mx-auto mb-4 opacity-30"
                    style={{ color: "rgba(49, 87, 44, 1)" }}
                  />
                  <p
                    className="text-lg font-medium"
                    style={{ color: "rgba(49, 87, 44, 0.6)" }}
                  >
                    Chọn tin nhắn để xem chi tiết
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

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
