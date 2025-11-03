import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerAPI } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
    setApiError("");
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.userName) {
      newErrors.userName = "Họ tên là bắt buộc";
    } else if (formData.userName.length < 3) {
      newErrors.userName = "Họ tên phải có ít nhất 3 ký tự";
    }

    if (!formData.email) {
      newErrors.email = "Email là bắt buộc";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!formData.password) {
      newErrors.password = "Mật khẩu là bắt buộc";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu không khớp";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await registerAPI(formData);

      if (res.success) {
        // Lưu token và user vào localStorage
        if (res.data?.token) {
          localStorage.setItem("token", res.data.token);
        }

        // Cập nhật AuthContext để Header hiển thị ngay
        const userData = {
          name: res.data?.user?.userName || formData.userName,
          email: res.data?.user?.email || formData.email,
          role: res.data?.user?.role || 'user',
          token: res.data?.token,
        };
        
        console.log("✅ Calling login() with userData:", userData);
        login(userData);

        // Navigate về home
        navigate("/home");
      } else {
        setApiError(res.message || "Đăng ký thất bại");
      }
    } catch (error) {
      console.error("Register error:", error);
      setApiError(error.message || "Đăng ký thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <img
        src={"./bgLogin.png"}
        alt="background"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Form đăng ký - nằm trên ảnh */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-3 py-6 sm:px-4 sm:py-8 md:p-8 lg:p-10">
        <div className="bg-white rounded-2xl shadow-2xl p-5 sm:p-7 md:p-9 lg:p-12 w-full max-w-[calc(100%-1.5rem)] sm:max-w-[480px] md:max-w-[520px] lg:max-w-[560px]">
          {/* Logo */}
          <div className="flex justify-center mb-4 sm:mb-5 md:mb-6">
            <img
              src={"./logo.png"}
              alt="Việt Xanh Logo"
              className="w-[100px] h-auto sm:w-[120px] md:w-[140px] lg:w-[160px]"
            />
          </div>

          {apiError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg mb-3 sm:mb-4 text-xs sm:text-sm">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            {/* Tên đăng nhập */}
            <div className="pb-5">
              <label className=" pb-2 block text-[#374151] font-Inter mb-1.5 sm:mb-2 text-[12px] sm:text-[13px] md:text-[15px] font-bold">
                Tên đăng nhập
              </label>
              <input
                type="text"
                name="userName"
                placeholder="Nhập tên đăng nhập"
                value={formData.userName}
                onChange={handleChange}
                className="w-full px-3 py-2.5 sm:px-4 sm:py-3 md:py-3.5 rounded-xl border-2 border-[#E5E7EB] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-[13px] sm:text-[14px] md:text-[15px]"
              />
              {errors.userName && (
                <p className="text-red-500 text-[11px] sm:text-xs mt-1.5">
                  {errors.userName}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="pb-5">
              <label className=" pb-2 block text-[#374151] font-Inter mb-1.5 sm:mb-2 text-[12px] sm:text-[13px] md:text-[15px] font-bold">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="example@email.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2.5 sm:px-4 sm:py-3 md:py-3.5 rounded-xl border-2 border-[#E5E7EB] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-[13px] sm:text-[14px] md:text-[15px]"
              />
              {errors.email && (
                <p className="text-red-500 text-[11px] sm:text-xs mt-1.5">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Mật khẩu */}
            <div className="pb-5">
              <label className=" pb-2 block text-[#374151] font-Inter mb-1.5 sm:mb-2 text-[12px] sm:text-[13px] md:text-[15px] font-bold">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Tạo mật khẩu mạnh"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 sm:px-4 sm:py-3 md:py-3.5 rounded-xl border-2 border-[#E5E7EB] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all pr-11 sm:pr-12 text-[13px] sm:text-[14px] md:text-[15px] placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 sm:right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1.5 sm:p-2 rounded-lg hover:bg-gray-100"
                  aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-[11px] sm:text-xs mt-1.5">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Xác nhận mật khẩu */}
            <div className="pb-5">
              <label className=" pb-2 block text-[#374151] font-Inter mb-1.5 sm:mb-2 text-[12px] sm:text-[13px] md:text-[15px] font-bold">
                Xác nhận mật khẩu
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Nhập lại mật khẩu"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 sm:px-4 sm:py-3 md:py-3.5 rounded-xl border-2 border-[#E5E7EB] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all pr-11 sm:pr-12 text-[13px] sm:text-[14px] md:text-[15px] placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 sm:right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1.5 sm:p-2 rounded-lg hover:bg-gray-100"
                  aria-label={
                    showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-[11px] sm:text-xs mt-1.5">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Button Đăng ký */}
            <div className="pt-2 sm:pt-3 md:pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0066FF] hover:bg-blue-600 active:bg-blue-700 text-white font-bold py-3 sm:py-3.5 md:py-4 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-[14px] sm:text-[15px] md:text-[16px] shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 touch-manipulation min-h-[44px]"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-4 w-4 sm:h-5 sm:w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Đang xử lý...
                  </span>
                ) : (
                  "Đăng Ký"
                )}
              </button>
            </div>
          </form>

          {/* Đăng nhập */}
          <div className="mt-4 sm:mt-5 md:mt-6 pt-4 sm:pt-5 border-t border-gray-100">
            <p className="text-center text-gray-600 text-[13px] sm:text-[14px] md:text-[15px]">
              Đã có tài khoản?{" "}
              <Link
                to="/login"
                className="text-[#0066FF] hover:text-blue-700 font-bold inline-flex items-center transition-colors"
              >
                Đăng nhập ngay
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
