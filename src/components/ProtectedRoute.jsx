import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert } from 'lucide-react';

/**
 * Protected Route Component
 * Bảo vệ các routes yêu cầu authentication và authorization
 */

export const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, loading } = useAuth();

  // Đang loading - hiển thị loading screen
  if (loading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "rgba(255, 244, 228, 1)" }}
      >
        <div className="text-center">
          <div 
            className="animate-spin rounded-full h-16 w-16 border-b-4 mx-auto mb-4"
            style={{ borderColor: "rgba(64, 145, 108, 1)" }}
          ></div>
          <p className="text-lg font-semibold" style={{ color: "rgba(49, 87, 44, 1)" }}>
            Đang tải...
          </p>
        </div>
      </div>
    );
  }

  // Chưa đăng nhập - redirect to login
  if (!user) {
    return <Navigate to="/login" replace state={{ from: window.location.pathname }} />;
  }

  // Yêu cầu admin nhưng user không phải admin
  if (requireAdmin && user.role !== 'admin') {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4"
        style={{ backgroundColor: "rgba(255, 244, 228, 1)" }}
      >
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-md text-center">
          <div 
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: "rgba(239, 68, 68, 0.1)" }}
          >
            <ShieldAlert size={48} className="text-red-500" />
          </div>
          
          <h2 
            className="text-2xl md:text-3xl font-bold mb-4"
            style={{ color: "rgba(49, 87, 44, 1)" }}
          >
            Truy cập bị từ chối
          </h2>
          
          <p className="text-gray-600 mb-6">
            Bạn không có quyền truy cập vào trang này. 
            Chỉ quản trị viên mới có thể truy cập trang quản lý.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => window.history.back()}
              className="px-6 py-3 rounded-full font-bold text-white transition-all hover:opacity-90 cursor-pointer"
              style={{ backgroundColor: "rgba(64, 145, 108, 1)" }}
            >
              Quay lại
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="px-6 py-3 rounded-full font-bold border-2 transition-all hover:bg-gray-50 cursor-pointer"
              style={{ 
                borderColor: "rgba(64, 145, 108, 1)",
                color: "rgba(64, 145, 108, 1)"
              }}
            >
              Về trang chủ
            </button>
          </div>
        </div>
      </div>
    );
  }

  // User hợp lệ - cho phép truy cập
  return children;
};

/**
 * Admin Route Component
 * Shorthand cho routes chỉ dành cho admin
 */
export const AdminRoute = ({ children }) => {
  return <ProtectedRoute requireAdmin={true}>{children}</ProtectedRoute>;
};

export default ProtectedRoute;
