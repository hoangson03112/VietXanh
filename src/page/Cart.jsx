/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import {
  CreditCard,
  FileText,
  Minus,
  Plus,
  Check,
  ShoppingCart,
  Trash2,
  X,
} from "lucide-react";
import { submitContactForm } from "../services/contactService";

export default function Cart() {
  const location = useLocation();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    message: "",
  });

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Navigate to product detail
  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  // Load cart from localStorage khi component mount
  useEffect(() => {
    const loadCart = () => {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          console.log("🛒 Cart loaded from localStorage:", parsedCart);
          setCartItems(parsedCart);
        } catch (error) {
          console.error("❌ Error parsing cart from localStorage:", error);
          setCartItems([]);
        }
      }
      setIsLoaded(true); // Đánh dấu đã load xong
    };

    loadCart();

    // Lắng nghe sự kiện storage change từ các tab/window khác
    const handleStorageChange = (e) => {
      if (e.key === "cart") {
        console.log("🔄 Cart updated from another tab/window");
        loadCart();
      }
    };

    // Lắng nghe custom event khi cart được update trong cùng tab
    const handleCartUpdate = () => {
      console.log("🔄 Cart updated in current tab");
      loadCart();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, []);

  // Reload cart mỗi khi navigate đến trang Cart
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        console.log("🔄 Reloading cart on page visit:", parsedCart);
        setCartItems(parsedCart);
      } catch (error) {
        console.error("❌ Error reloading cart:", error);
      }
    }
  }, [location]);

  // Lưu cart vào localStorage mỗi khi cartItems thay đổi (CHỈ SAU KHI ĐÃ LOAD)
  useEffect(() => {
    if (isLoaded && cartItems.length >= 0) {
      localStorage.setItem("cart", JSON.stringify(cartItems));
      console.log("💾 Cart saved to localStorage:", cartItems);
    }
  }, [cartItems, isLoaded]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const [currentStep, setCurrentStep] = useState(2);

  const steps = [
    { id: 1, label: "Giỏ hàng", icon: ShoppingCart },
    { id: 2, label: "Điền thông tin", icon: FileText },
    { id: 3, label: "Thanh toán", icon: CreditCard },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate cart
    if (cartItems.length === 0) {
      setToastType("error");
      setToastMessage("Giỏ hàng trống! Vui lòng thêm sản phẩm trước khi đặt hàng.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare contact data with cart products
      const contactData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        message: formData.message || `Đơn hàng với ${cartItems.length} sản phẩm`,
        products: cartItems.map(item => ({
          productId: item._id,
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: item.quantity,
        })),
      };

      const response = await submitContactForm(contactData);

      if (response.success) {
        setToastType("success");
        setToastMessage("Đơn hàng đã được gửi thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.");
        setShowToast(true);
        
        // Reset form and clear cart
        setFormData({
          name: "",
          email: "",
          phone: "",
          address: "",
          message: "",
        });
        
        // Clear cart after successful order
        setCartItems([]);
        localStorage.removeItem("cart");

        setTimeout(() => {
          setShowToast(false);
        }, 5000);
      }
    } catch (error) {
      console.error("Error submitting order:", error);
      setToastType("error");
      setToastMessage(
        error.response?.data?.message || 
        "Có lỗi xảy ra khi gửi đơn hàng. Vui lòng thử lại!"
      );
      setShowToast(true);

      setTimeout(() => {
        setShowToast(false);
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuantityChange = (id, change) => {
    setCartItems((items) =>
      items.map((item) =>
        item._id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const handleRemoveItem = (id) => {
    setCartItems((items) => items.filter((item) => item._id !== id));
  };

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen font-sans">
      <Header />
      <main>
        <section
          style={{ backgroundColor: "rgba(64, 145, 108, 1)" }}
          className="pt-20 md:pt-24 text-white min-h-[60vh] md:min-h-[75vh] overflow-hidden relative"
        >
          <div className="container mx-auto max-w-9xl px-4 md:px-6 lg:px-3 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center min-h-[calc(60vh-5rem)] md:min-h-[calc(75vh-6rem)] relative py-8 md:py-0">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="col-span-1 lg:col-span-6 z-10 text-center lg:text-left"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 md:mb-6">
                GIỎ HÀNG
              </h1>
              <p className=" md:text-xl opacity-90 leading-relaxed mb-6 md:mb-10 px-4 sm:px-0">
                Thông tin chi tiết số lượng đơn hàng và số tiền bạn cần thanh
                toán
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden lg:block absolute bottom-0 right-0"
              style={{ width: "75%", height: "calc(100% - 6rem)" }}
            >
              <div className="h-full flex items-end justify-end">
                <img
                  src="/team.png"
                  alt="Team"
                  className="h-auto object-bottom"
                  style={{
                    width: "140%",
                    maxHeight: "100%",
                    marginRight: "-25%",
                  }}
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Cart Content */}
        <section
          className="py-16 md:py-24"
          style={{ backgroundColor: "rgba(255, 244, 228, 1)" }}
        >
          <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-6xl">
            {/* Progress Steps */}

            <div className="max-w-7xl mx-auto">
              {/* Modern Progress Steps */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-16"
              >
                <div className="relative">
                  {/* Connection Lines */}
                  <div className="absolute top-12 left-0 right-0 flex items-center px-20 md:px-28">
                    <div className="flex-1 flex gap-2">
                      {/* Line 1 to 2 */}
                      <motion.div
                        className="flex-1 h-1 rounded-full overflow-hidden bg-slate-200"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        <motion.div
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: currentStep >= 2 ? 1 : 0 }}
                          transition={{ duration: 0.5, delay: 0.4 }}
                          style={{ transformOrigin: "left" }}
                        />
                      </motion.div>

                      {/* Line 2 to 3 */}
                      <motion.div
                        className="flex-1 h-1 rounded-full overflow-hidden bg-slate-200"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                      >
                        <motion.div
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: currentStep >= 3 ? 1 : 0 }}
                          transition={{ duration: 0.5, delay: 0.5 }}
                          style={{ transformOrigin: "left" }}
                        />
                      </motion.div>
                    </div>
                  </div>

                  {/* Steps */}
                  <div className="relative flex items-start justify-between">
                    {steps.map((step, index) => {
                      const isActive = currentStep >= step.id;
                      const isCompleted = currentStep > step.id;
                      const Icon = step.icon;

                      return (
                        <motion.div
                          key={step.id}
                          className="flex flex-col items-center gap-4 relative z-10 flex-1"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                          {/* Icon Circle */}
                          <motion.div
                            className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer ${
                              isActive
                                ? "bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-200"
                                : "bg-white border-2 border-slate-300"
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setCurrentStep(step.id)}
                          >
                            {/* Animated Ring */}
                            {isActive && (
                              <motion.div
                                className="absolute inset-0 rounded-full border-2 border-emerald-400"
                                initial={{ scale: 1, opacity: 0.8 }}
                                animate={{ scale: 1.3, opacity: 0 }}
                                transition={{
                                  duration: 1.5,
                                  repeat: Infinity,
                                  ease: "easeOut",
                                }}
                              />
                            )}

                            {/* Icon or Check */}
                            {isCompleted ? (
                              <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ duration: 0.5, type: "spring" }}
                              >
                                <Check
                                  className="w-10 h-10 text-white"
                                  strokeWidth={3}
                                />
                              </motion.div>
                            ) : (
                              <Icon
                                className={`w-10 h-10 transition-colors duration-300 ${
                                  isActive ? "text-white" : "text-slate-400"
                                }`}
                                strokeWidth={2}
                              />
                            )}

                            {/* Step Number Badge */}
                            <motion.div
                              className={`absolute -top-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                                isActive
                                  ? "bg-white text-emerald-600"
                                  : "bg-slate-200 text-slate-500"
                              }`}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{
                                duration: 0.3,
                                delay: index * 0.1 + 0.3,
                              }}
                            >
                              {step.id}
                            </motion.div>
                          </motion.div>

                          {/* Label */}
                          <motion.div
                            className="text-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: index * 0.1 + 0.4 }}
                          >
                            <span
                              className={`text-sm md:text-base font-semibold block transition-colors duration-300 ${
                                isActive ? "text-emerald-700" : "text-slate-500"
                              }`}
                            >
                              {step.label}
                            </span>
                            {isActive && (
                              <motion.div
                                className="mt-1 text-xs text-emerald-600"
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                              >
                                {isCompleted
                                  ? "Hoàn thành ✓"
                                  : "Đang thực hiện"}
                              </motion.div>
                            )}
                          </motion.div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Order Information Title */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-2xl md:text-3xl lg:text-4xl font-bold mb-8"
              style={{ color: "rgba(49, 87, 44, 1)" }}
            >
              THÔNG TIN ĐƠN HÀNG
            </motion.h2>

            {/* Cart Items */}
            <div className="space-y-4">
              {cartItems.map((item, index) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="bg-white rounded-2xl p-4 md:p-6 shadow-lg flex items-center gap-4 md:gap-6 group"
                >
                  {/* Product Image - Clickable */}
                  <div 
                    onClick={() => handleProductClick(item._id)}
                    className="w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden shrink-0 bg-gray-100 cursor-pointer transition-transform duration-300 hover:scale-105"
                  >
                    <img
                      src={item.image || "/product1.png"}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  {/* Product Info - Clickable */}
                  <div 
                    onClick={() => handleProductClick(item._id)}
                    className="flex-1 cursor-pointer"
                  >
                    <h3
                      className="text-base md:text-lg font-bold mb-2 hover:underline transition-all"
                      style={{ color: "rgba(49, 87, 44, 1)" }}
                    >
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {item.price.toLocaleString("vi-VN")} VNĐ / sản phẩm
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleQuantityChange(item._id, -1)}
                      className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:opacity-80 cursor-pointer"
                      style={{ backgroundColor: "rgba(64, 145, 108, 1)" }}
                    >
                      <Minus size={18} />
                    </button>
                    <span
                      className="text-lg md:text-xl font-bold w-8 text-center"
                      style={{ color: "rgba(49, 87, 44, 1)" }}
                    >
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(item._id, 1)}
                      className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:opacity-80 cursor-pointer"
                      style={{ backgroundColor: "rgba(64, 145, 108, 1)" }}
                    >
                      <Plus size={18} />
                    </button>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <p
                      className="text-base md:text-lg font-bold"
                      style={{ color: "rgba(64, 145, 108, 1)" }}
                    >
                      {(item.price * item.quantity).toLocaleString("vi-VN")} VNĐ
                    </p>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleRemoveItem(item._id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-300 cursor-pointer"
                  >
                    <Trash2 size={20} />
                  </button>
                </motion.div>
              ))}
            </div>

            {/* Empty Cart Message */}
            {cartItems.length === 0 && (
              <div className="text-center py-12">
                <p
                  className="text-xl font-medium"
                  style={{ color: "rgba(49, 87, 44, 0.6)" }}
                >
                  Giỏ hàng của bạn đang trống
                </p>
              </div>
            )}
          </div>
        </section>

        <section
          className="pb-16"
          style={{ backgroundColor: "rgba(255, 244, 228, 1)" }}
        >
          <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: false }}
              className="text-center mb-12"
            >
              \
              <p
                className="text-base md:text-lg opacity-90"
                style={{ color: "rgba(49, 87, 44, 0.8)" }}
              >
                Điền thông tin chi tiết của bạn bên dưới!
              </p>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: false }}
              className="rounded-3xl p-8 md:p-10 lg:p-12 shadow-2xl"
              style={{ backgroundColor: "rgba(64, 145, 108, 0.95)" }}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Họ tên */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-white font-semibold mb-3 text-sm md:text-base"
                    >
                      Họ tên
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Nguyễn Văn A"
                      required
                      className="w-full px-5 py-3.5 rounded-full focus:outline-none focus:ring-2 focus:ring-white/60 transition-all duration-300 placeholder:text-gray-400 bg-white"
                      style={{ color: "rgba(49, 87, 44, 1)" }}
                    />
                  </div>

                  {/* Địa chỉ email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-white font-semibold mb-3 text-sm md:text-base"
                    >
                      Địa chỉ email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="vidu@email.com"
                      required
                      className="w-full px-5 py-3.5 rounded-full focus:outline-none focus:ring-2 focus:ring-white/60 transition-all duration-300 placeholder:text-gray-400 bg-white"
                      style={{ color: "rgba(49, 87, 44, 1)" }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Số điện thoại */}
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-white font-semibold mb-3 text-sm md:text-base"
                    >
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="0123 447 393"
                      required
                      className="w-full px-5 py-3.5 rounded-full focus:outline-none focus:ring-2 focus:ring-white/60 transition-all duration-300 placeholder:text-gray-400 bg-white"
                      style={{ color: "rgba(49, 87, 44, 1)" }}
                    />
                  </div>

                  {/* Địa chỉ */}
                  <div>
                    <label
                      htmlFor="address"
                      className="block text-white font-semibold mb-3 text-sm md:text-base"
                    >
                      Địa chỉ
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Thành phố Hà Nội"
                      required
                      className="w-full px-5 py-3.5 rounded-full focus:outline-none focus:ring-2 focus:ring-white/60 transition-all duration-300 placeholder:text-gray-400 bg-white"
                      style={{ color: "rgba(49, 87, 44, 1)" }}
                    />
                  </div>
                </div>

                {/* Câu hỏi */}
                <div>
                  <label
                    htmlFor="message"
                    className="block text-white font-semibold mb-3 text-sm md:text-base"
                  >
                    Ghi chú (tùy chọn)
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Ghi chú thêm về đơn hàng (không bắt buộc)..."
                    rows="6"
                    className="w-full px-5 py-4 rounded-3xl focus:outline-none focus:ring-2 focus:ring-white/60 resize-none transition-all duration-300 placeholder:text-gray-400 bg-white"
                    style={{ color: "rgba(49, 87, 44, 1)" }}
                  ></textarea>
                </div>

                {/* Submit Button */}
                <div className="flex justify-start pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="cursor-pointer px-10 py-4 rounded-full font-bold text-base md:text-lg transition-all duration-300 hover:opacity-90 hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                    style={{
                      backgroundColor: "rgba(139, 161, 90, 1)",
                      color: "white",
                    }}
                  >
                    {isSubmitting ? "Đang gửi..." : "Gửi đơn hàng"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </section>

        {/* Toast Notification */}
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 right-8 z-50 bg-white rounded-2xl shadow-2xl p-6 max-w-md"
            style={{
              borderLeft: `4px solid ${
                toastType === "success" ? "rgba(64, 145, 108, 1)" : "#ef4444"
              }`,
            }}
          >
            <div className="flex items-start gap-4">
              <div
                className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor:
                    toastType === "success"
                      ? "rgba(64, 145, 108, 0.1)"
                      : "rgba(239, 68, 68, 0.1)",
                }}
              >
                {toastType === "success" ? (
                  <Check
                    className="text-white"
                    style={{ color: "rgba(64, 145, 108, 1)" }}
                    size={20}
                  />
                ) : (
                  <X className="text-red-500" size={20} />
                )}
              </div>
              <div className="flex-1">
                <h4
                  className="font-bold mb-1"
                  style={{
                    color:
                      toastType === "success"
                        ? "rgba(64, 145, 108, 1)"
                        : "#ef4444",
                  }}
                >
                  {toastType === "success" ? "Thành công!" : "Lỗi!"}
                </h4>
                <p className="text-sm text-gray-600">{toastMessage}</p>
              </div>
              <button
                onClick={() => setShowToast(false)}
                className="shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </motion.div>
        )}
      </main>
      <Footer />
    </div>
  );
}
