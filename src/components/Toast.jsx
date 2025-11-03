import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, AlertCircle, Info } from "lucide-react";

export default function Toast({
  show,
  onClose,
  message,
  type = "success",
  duration = 3000,
}) {
  // Auto hide
  React.useEffect(() => {
    if (show && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  const configs = {
    success: {
      icon: Check,
      title: "Thành công!",
      borderColor: "rgba(64, 145, 108, 1)",
      iconBg: "rgba(64, 145, 108, 0.1)",
      iconColor: "rgba(64, 145, 108, 1)",
      titleColor: "rgba(49, 87, 44, 1)",
    },
    error: {
      icon: X,
      title: "Lỗi!",
      borderColor: "#ef4444",
      iconBg: "rgba(239, 68, 68, 0.1)",
      iconColor: "#ef4444",
      titleColor: "#dc2626",
    },
    warning: {
      icon: AlertCircle,
      title: "Cảnh báo!",
      borderColor: "#f59e0b",
      iconBg: "rgba(245, 158, 11, 0.1)",
      iconColor: "#f59e0b",
      titleColor: "#d97706",
    },
    info: {
      icon: Info,
      title: "Thông báo!",
      borderColor: "#3b82f6",
      iconBg: "rgba(59, 130, 246, 0.1)",
      iconColor: "#3b82f6",
      titleColor: "#2563eb",
    },
  };

  const config = configs[type] || configs.success;
  const Icon = config.icon;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="fixed bottom-8 right-8 z-50 bg-white rounded-2xl shadow-2xl p-6 max-w-md border-l-4"
          style={{ borderColor: config.borderColor }}
        >
          <div className="flex items-start gap-4">
            <div
              className="shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: config.iconBg }}
            >
              <Icon size={24} style={{ color: config.iconColor }} />
            </div>
            <div className="flex-1">
              <h4
                className="font-bold text-lg mb-1"
                style={{ color: config.titleColor }}
              >
                {config.title}
              </h4>
              <p className="text-gray-600 text-sm">{message}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors shrink-0"
            >
              <X size={20} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
