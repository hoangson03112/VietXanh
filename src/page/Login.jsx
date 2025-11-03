import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginAPI } from "../services/authService";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
      newErrors.userName = "Tài khoản là bắt buộc";
    }

    if (!formData.password) {
      newErrors.password = "Mật khẩu là bắt buộc";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
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
      const response = await loginAPI(formData);
      
      // Lưu token vào localStorage
      if (response.data?.token) {
        localStorage.setItem("token", response.data.token);
      }
      
      // Chuẩn bị userData với field name (thống nhất với Register)
      const userData = {
        name: response.data?.user?.userName || response.data?.user?.name,
        email: response.data?.user?.email,
        role: response.data?.user?.role,
        token: response.data?.token,
      };
      
      console.log("✅ Calling login() with userData:", userData);
      
      // Login context
      login(userData);
      
      // Redirect dựa trên role
      if (userData.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/home");
      }
    } catch (error) {
      setApiError(error.message || "Đăng nhập thất bại. Vui lòng thử lại.");
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

      {/* Form login - nằm trên ảnh */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-6 sm:p-6 md:p-8">
        <div className="bg-white rounded-lg sm:rounded-2xl shadow-2xl p-6 sm:p-8 md:p-10 lg:p-[50px] w-full max-w-[95%] sm:max-w-[480px] md:max-w-[504px] lg:min-w-[504px]">
          {/* Back button */}
          <div className="mb-4 sm:mb-5">
            <Link
              to="/home"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:-translate-x-1" />
              <span className="text-[13px] sm:text-[14px] md:text-[15px] font-semibold">
                Quay lại
              </span>
            </Link>
          </div>

          {/* Logo */}
          <div className="flex justify-center mb-6 sm:mb-7 md:mb-8">
            <img
              src={"./logo.png"}
              alt="Việt Xanh Logo"
              className="w-[140px] h-auto sm:w-[160px] md:w-[180px] lg:w-[190px]"
            />
          </div>

          {apiError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg mb-3 sm:mb-4 text-xs sm:text-sm">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="py-3 sm:py-4 md:py-5">
            {/* Tài khoản */}
            <div className="pb-4 sm:pb-5">
              <label className="block text-[#374151] font-Inter mb-1.5 sm:mb-2 text-[13px] sm:text-[14px] md:text-[15px] font-bold pb-1 sm:pb-2">
                Tài khoản
              </label>
              <input
                type="text"
                name="userName"
                placeholder="Tên đăng nhập"
                value={formData.userName}
                onChange={handleChange}
                className="w-full px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl border-[#E5E7EB]  border-2 focus:outline-none focus:border-blue-500 transition-colors text-[13px] sm:text-[14px] md:text-[15px]"
              />
              {errors.userName && (
                <p className="text-red-500 text-[10px] sm:text-xs mt-1">
                  {errors.userName}
                </p>
              )}
            </div>

            {/* Mật khẩu */}
            <div>
              <label className="block text-[#374151] font-Inter mb-1.5 sm:mb-2 text-[13px] sm:text-[14px] md:text-[15px] font-bold pb-1 sm:pb-2">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Tạo một mật khẩu"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl border-2 border-[#E5E7EB] focus:outline-none focus:border-blue-500 transition-colors pr-10 sm:pr-12 text-[13px] sm:text-[14px] md:text-[15px] placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-[10px] sm:text-xs mt-1">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Quên mật khẩu */}
            <div className="text-left py-3 sm:py-4">
              <Link
                to="/forgot-password"
                className="text-[#0066FF] hover:text-blue-600 text-[13px] sm:text-[14px] md:text-[15px] font-bold inline-block"
              >
                Quên mật khẩu?
              </Link>
            </div>

            {/* Button Đăng nhập */}
            <button
              type="submit"
              disabled={loading}
              className="cursor-pointer w-full bg-[#0066FF] hover:bg-blue-600 active:bg-blue-700 text-white font-semibold py-3 sm:py-3.5 rounded-lg sm:rounded-xl transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed text-[14px] sm:text-[15px] md:text-[16px] touch-manipulation"
            >
              {loading ? "Đang đăng nhập..." : "Đăng Nhập"}
            </button>
          </form>

          {/* Đăng ký */}
          <p className="text-center  sm:mt-5 text-gray-500 text-[13px] sm:text-[14px] md:text-[15px]">
            Chưa có tài khoản?{" "}
            <Link
              to="/register"
              className="text-[#0066FF] hover:text-blue-600 font-semibold inline-block"
            >
              Đăng kí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
