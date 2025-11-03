/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Package, FileText, MessageSquare, Menu, X, Home } from "lucide-react";
import AdminProducts from "./Products";
import AdminBlogs from "./Blogs";
import AdminContact from "./Contact";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("messages");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    {
      id: "products",
      name: "Sản phẩm",
      icon: Package,
      color: "rgba(64, 145, 108, 1)",
    },
    {
      id: "blogs",
      name: "Tin tức",
      icon: FileText,
      color: "rgba(64, 145, 108, 1)",
    },
    {
      id: "messages",
      name: "Liên hệ",
      icon: MessageSquare,
      color: "rgba(64, 145, 108, 1)",
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "products":
        return <AdminProducts />;
      case "blogs":
        return <AdminBlogs />;
      case "messages":
        return <AdminContact />;
      default:
        return <AdminContact />;
    }
  };

  return (
    <div
      className="min-h-screen flex"
      style={{ backgroundColor: "rgba(255, 244, 228, 1)" }}
    >
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: sidebarOpen ? 0 : -280 }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 h-screen z-50 shadow-2xl flex flex-col"
        style={{
          width: "280px",
          backgroundColor: "rgba(49, 87, 44, 1)",
        }}
      >
        {/* Logo/Header */}
        <div className="p-6 border-b border-white/10 shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">VIỆT XANH</h1>
              <p className="text-sm text-white/70 mt-1">Admin Panel</p>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white hover:bg-white/10 p-2 rounded-lg cursor-pointer"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (window.innerWidth < 1024) setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "bg-white text-[rgba(49,87,44,1)] shadow-lg scale-105"
                    : "text-white hover:bg-white/10"
                }`}
              >
                <Icon size={22} />
                <span className="font-semibold text-base">{item.name}</span>
              </button>
            );
          })}

          {/* Back to Home Button */}
          <button
            onClick={() => navigate("/home")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-white hover:bg-white/10 border-t border-white/10 mt-4 pt-4 cursor-pointer"
          >
            <Home size={22} />
            <span className="font-semibold text-base">Về Trang Chủ</span>
          </button>
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-white/10 shrink-0">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">
              A
            </div>
            <div className="flex-1">
              <p className="text-white font-semibold text-sm">Admin</p>
              <p className="text-white/60 text-xs">admin@vietxanh.com</p>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 min-h-screen lg:ml-[280px]">
        {/* Top Bar */}
        <div className="sticky top-0 z-30 bg-white shadow-md">
          <div className="px-4 md:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                style={{ color: "rgba(49, 87, 44, 1)" }}
              >
                <Menu size={24} />
              </button>
              <h2
                className="text-xl md:text-2xl font-bold"
                style={{ color: "rgba(49, 87, 44, 1)" }}
              >
                {menuItems.find((item) => item.id === activeTab)?.name ||
                  "Liên hệ"}
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-green-50">
                <div
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: "rgba(64, 145, 108, 1)" }}
                ></div>
                <span
                  className="text-sm font-medium"
                  style={{ color: "rgba(49, 87, 44, 1)" }}
                >
                  Online
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-0">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
