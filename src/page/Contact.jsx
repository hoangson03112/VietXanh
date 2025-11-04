/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import {
  Facebook,
  Instagram,
  Mail,
  Phone,
  MapPin,
  Check,
  X,
} from "lucide-react";
import { submitContactForm } from "../services/contactService";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    message: "",
  });

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success"); // "success" or "error"
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await submitContactForm({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address, // Thêm address field
        message: formData.message,
      });

      if (response.success) {
        setToastType("success");
        setToastMessage(
          "Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất."
        );
        setShowToast(true);

        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          address: "",
          message: "",
        });

        // Auto hide toast after 5 seconds
        setTimeout(() => {
          setShowToast(false);
        }, 5000);
      }
    } catch (error) {
      console.error("Error submitting contact:", error);
      setToastType("error");
      setToastMessage("Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại!");
      setShowToast(true);

      setTimeout(() => {
        setShowToast(false);
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen font-sans">
      <Header />
      <main>
        {/* Hero Section */}
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
                LIÊN HỆ
              </h1>
              <p className=" md:text-xl opacity-90 leading-relaxed mb-6 md:mb-10 px-4 sm:px-0">
                Gửi thông tin của bạn cho Việt Xanh để được hỗ trợ nhanh chóng.
                Chúng tôi luôn sẵn sàng lắng nghe và đồng hành cùng bạn trên
                hành trình sống xanh.
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

        {/* Contact Form Section */}
        <section
          className="py-16 md:py-24"
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
              <h2
                className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
                style={{ color: "rgba(49, 87, 44, 1)" }}
              >
                LIÊN HỆ TỚI CHÚNG TÔI VIỆT XANH
              </h2>
              <p
                className="text-base md:text-lg opacity-90"
                style={{ color: "rgba(49, 87, 44, 0.8)" }}
              >
                Điền thông tin chi tiết của bạn bên dưới!
              </p>
            </motion.div>

            {/* Social Icons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: false }}
              className="flex justify-center gap-6 mb-8"
            >
              <a
                href="https://www.facebook.com/profile.php?id=61582827898558"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                style={{ backgroundColor: "rgba(64, 145, 108, 1)" }}
              >
                <Facebook className="text-white" size={24} />
              </a>
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                style={{ backgroundColor: "rgba(64, 145, 108, 1)" }}
              >
                <Instagram className="text-white" size={24} />
              </a>
              <a
                href="mailto:vietxanh662025@gmail.com"
                className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                style={{ backgroundColor: "rgba(64, 145, 108, 1)" }}
              >
                <Mail className="text-white" size={24} />
              </a>
              <a
                href="tel:0399557326"
                className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                style={{ backgroundColor: "rgba(64, 145, 108, 1)" }}
              >
                <Phone className="text-white" size={24} />
              </a>
              <a
                href="https://maps.app.goo.gl/s5kVHHiXrGAmLvMs8"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                style={{ backgroundColor: "rgba(64, 145, 108, 1)" }}
              >
                <MapPin className="text-white" size={24} />
              </a>
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
                    Câu hỏi
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Vui lòng điền câu hỏi cho chúng tôi ở đây..."
                    required
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
                    {isSubmitting ? "Đang gửi..." : "Gửi tin nhắn"}
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
