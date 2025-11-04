/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { Menu, X, User, LogOut, ChevronDown, Settings } from "lucide-react";
export default function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };

    if (userMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userMenuOpen]);

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 w-full shadow-md"
        style={{ backgroundColor: "#2d4628 " }}

        // style={{ backgroundColor: "rgba(64, 145, 108, 1)" }}
      >
        <div className="container max-w-9xl mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
          <Link to="/home" className="flex-shrink-0">
            <img
              src="/logo.png"
              alt="Việt Xanh"
              className="h-14 md:h-12 lg:h-13 w-auto"
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-6 xl:gap-10 text-white font-semibold text-sm xl:text-base">
            <Link to="/" className="hover:opacity-80 transition-opacity">
              Trang Chủ
            </Link>
            <Link
              to="/products"
              className="hover:opacity-80 transition-opacity"
            >
              Sản Phẩm
            </Link>
            <Link to="/about" className="hover:opacity-80 transition-opacity">
              Về Chúng Tôi
            </Link>
            <Link to="/blogs" className="hover:opacity-80 transition-opacity">
              Bài Viết
            </Link>
            <Link to="/contact" className="hover:opacity-80 transition-opacity">
              Liên Hệ
            </Link>
          </nav>

          <div className="hidden lg:flex items-center gap-3 xl:gap-4">
            {user ? (
              // User is logged in - show user menu
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 bg-white text-gray-800 px-4 xl:px-5 py-2 xl:py-2.5 rounded-full font-bold text-xs xl:text-sm shadow-md hover:bg-gray-100 transition-colors"
                >
                  <User size={16} />
                  <span>{user.name || user.userName}</span>
                  <ChevronDown size={16} />
                </button>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-sm font-semibold text-gray-800">
                        {user.name || user.userName}
                      </p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    {user.role === "admin" && (
                      <Link
                        to="/admin"
                        className="block px-4 py-2 text-sm font-medium transition-colors"
                        style={{
                          color: "rgba(64, 145, 108, 1)",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor =
                            "rgba(64, 145, 108, 0.1)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                        }}
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <div className="flex items-center gap-2">
                          <Settings size={16} />
                          <span>Quản Trị Viên</span>
                        </div>
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        handleLogout();
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <LogOut size={16} />
                        <span>Đăng Xuất</span>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // User is not logged in - show login button
              <Link
                to="/login"
                className="bg-white text-gray-800 px-4 xl:px-5 py-2 xl:py-2.5 rounded-full font-bold text-xs xl:text-sm shadow-md hover:bg-gray-100 transition-colors"
              >
                Đăng Nhập
              </Link>
            )}
            <Link
              to="/cart"
              className="bg-black text-white px-4 xl:px-5 py-2 xl:py-2.5 rounded-full font-bold text-xs xl:text-sm shadow-md hover:bg-gray-800 transition-colors"
            >
              Giỏ Hàng
            </Link>
          </div>

          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden text-white p-2"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Menu Panel */}
          <div
            className="absolute top-0 right-0 h-full w-[280px] sm:w-[320px] bg-white shadow-2xl"
            style={{ backgroundColor: "rgba(64, 145, 108, 1)" }}
          >
            <div className="flex items-center justify-between p-4 border-b border-white/20">
              <img src="/logo.png" alt="Việt Xanh" className="h-14 w-auto" />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-white p-2"
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>

            <nav className="flex flex-col p-6 gap-4">
              <Link
                to="/"
                className="text-white font-semibold text-base py-3 border-b border-white/20 hover:opacity-80 transition-opacity"
                onClick={() => setMobileMenuOpen(false)}
              >
                Trang Chủ
              </Link>
              <Link
                to="/products"
                className="text-white font-semibold text-base py-3 border-b border-white/20 hover:opacity-80 transition-opacity"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sản Phẩm
              </Link>
              <Link
                to="/"
                className="text-white font-semibold text-base py-3 border-b border-white/20 hover:opacity-80 transition-opacity"
                onClick={() => setMobileMenuOpen(false)}
              >
                Về Chúng Tôi
              </Link>
              <Link
                to="/"
                className="text-white font-semibold text-base py-3 border-b border-white/20 hover:opacity-80 transition-opacity"
                onClick={() => setMobileMenuOpen(false)}
              >
                Bài Viết
              </Link>
              <Link
                to="/"
                className="text-white font-semibold text-base py-3 border-b border-white/20 hover:opacity-80 transition-opacity"
                onClick={() => setMobileMenuOpen(false)}
              >
                Liên Hệ
              </Link>

              <div className="flex flex-col gap-3 mt-6">
                {user ? (
                  // User is logged in - show user info and logout
                  <>
                    <div className="bg-white/10 backdrop-blur-sm px-5 py-4 rounded-lg border border-white/20">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="bg-white rounded-full p-2">
                          <User size={20} className="text-green-700" />
                        </div>
                        <div>
                          <p className="text-white font-bold text-sm">
                            {user.name || user.userName}
                          </p>
                          <p className="text-white/70 text-xs">{user.email}</p>
                        </div>
                      </div>
                      {user.role === "admin" && (
                        <Link
                          to="/admin"
                          className="flex items-center justify-center gap-2 px-4 py-2 rounded-full font-semibold text-sm text-center mb-2 transition-colors"
                          style={{
                            backgroundColor: "rgba(255, 255, 255, 0.95)",
                            color: "rgba(64, 145, 108, 1)",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor =
                              "rgba(255, 255, 255, 1)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor =
                              "rgba(255, 255, 255, 0.95)";
                          }}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Settings size={16} />
                          <span>Quản Trị Viên</span>
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          handleLogout();
                        }}
                        className="w-full bg-red-500 text-white px-4 py-2 rounded-full font-semibold text-sm hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                      >
                        <LogOut size={16} />
                        <span>Đăng Xuất</span>
                      </button>
                    </div>
                  </>
                ) : (
                  // User is not logged in - show login button
                  <Link
                    to="/login"
                    className="bg-white text-gray-800 px-5 py-3 rounded-full font-bold text-sm text-center shadow-md"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Đăng Nhập
                  </Link>
                )}
                <Link
                  to="/cart"
                  className="bg-black text-white px-5 py-3 rounded-full font-bold text-sm text-center shadow-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Giỏ Hàng
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
