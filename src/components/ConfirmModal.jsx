/* eslint-disable no-unused-vars */
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle, Trash2, EyeOff, Eye } from "lucide-react";

/**
 * ConfirmModal - Reusable confirmation dialog component
 *
 * @param {boolean} isOpen - Show/hide modal
 * @param {function} onClose - Close modal callback
 * @param {function} onConfirm - Confirm action callback
 * @param {string} title - Modal title
 * @param {string} message - Confirmation message
 * @param {string} confirmText - Confirm button text (default: "Xác nhận")
 * @param {string} cancelText - Cancel button text (default: "Hủy")
 * @param {string} type - Modal type: "danger", "warning", "info" (default: "warning")
 * @param {string} icon - Icon type: "warning", "delete", "hide", "show" (default: "warning")
 */
export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  type = "warning",
  icon = "warning",
}) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  // Icon mapping
  const iconComponents = {
    warning: AlertTriangle,
    delete: Trash2,
    hide: EyeOff,
    show: Eye,
  };

  const IconComponent = iconComponents[icon] || AlertTriangle;

  // Color schemes based on type
  const colorSchemes = {
    danger: {
      iconBg: "rgba(220, 38, 38, 0.1)",
      iconColor: "rgba(220, 38, 38, 1)",
      buttonBg:
        "linear-gradient(135deg, rgba(220, 38, 38, 1), rgba(185, 28, 28, 1))",
      buttonHoverBg:
        "linear-gradient(135deg, rgba(185, 28, 28, 1), rgba(153, 27, 27, 1))",
    },
    warning: {
      iconBg: "rgba(255, 152, 0, 0.1)",
      iconColor: "rgba(255, 152, 0, 1)",
      buttonBg:
        "linear-gradient(135deg, rgba(255, 152, 0, 1), rgba(245, 124, 0, 1))",
      buttonHoverBg:
        "linear-gradient(135deg, rgba(245, 124, 0, 1), rgba(230, 81, 0, 1))",
    },
    info: {
      iconBg: "rgba(64, 145, 108, 0.1)",
      iconColor: "rgba(64, 145, 108, 1)",
      buttonBg:
        "linear-gradient(135deg, rgba(64, 145, 108, 1), rgba(49, 87, 44, 1))",
      buttonHoverBg:
        "linear-gradient(135deg, rgba(49, 87, 44, 1), rgba(34, 60, 30, 1))",
    },
  };

  const colors = colorSchemes[type] || colorSchemes.warning;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
            >
              {/* Header with close button */}
              <div className="flex justify-end p-4 pb-0">
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  style={{ color: "rgba(49, 87, 44, 0.5)" }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="px-8 pb-8 pt-2">
                {/* Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                  className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center"
                  style={{ backgroundColor: colors.iconBg }}
                >
                  <IconComponent
                    size={32}
                    style={{ color: colors.iconColor }}
                  />
                </motion.div>

                {/* Title */}
                <h3
                  className="text-2xl font-bold text-center mb-3"
                  style={{ color: "rgba(49, 87, 44, 1)" }}
                >
                  {title}
                </h3>

                {/* Message */}
                <p
                  className="text-center mb-8 leading-relaxed"
                  style={{ color: "rgba(49, 87, 44, 0.7)" }}
                >
                  {message}
                </p>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  {/* Cancel Button */}
                  <button
                    onClick={onClose}
                    className="flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-300 border-2"
                    style={{
                      borderColor: "rgba(49, 87, 44, 0.2)",
                      color: "rgba(49, 87, 44, 0.8)",
                      backgroundColor: "transparent",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        "rgba(49, 87, 44, 0.05)";
                      e.currentTarget.style.borderColor =
                        "rgba(49, 87, 44, 0.3)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.borderColor =
                        "rgba(49, 87, 44, 0.2)";
                    }}
                  >
                    {cancelText}
                  </button>

                  {/* Confirm Button */}
                  <button
                    onClick={handleConfirm}
                    className="flex-1 py-3 px-6 rounded-xl font-medium text-white transition-all duration-300 shadow-lg"
                    style={{
                      background: colors.buttonBg,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = colors.buttonHoverBg;
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow =
                        "0 8px 20px rgba(0, 0, 0, 0.15)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = colors.buttonBg;
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow =
                        "0 4px 12px rgba(0, 0, 0, 0.1)";
                    }}
                  >
                    {confirmText}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
