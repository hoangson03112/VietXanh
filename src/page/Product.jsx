/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  ArrowLeft,
  Minus,
  Plus,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Check,
} from "lucide-react";
import { motion } from "framer-motion";
import { getProductById, getProducts } from "../services/productService";
import HeroSection from "../components/HeroSection";

export default function Product() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  console.log(relatedProducts);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        const productResponse = await getProductById(id);
        console.log("📦 Product detail response:", productResponse);

        if (productResponse.success && productResponse.data) {
          console.log("✅ Product data:", productResponse.data);
          console.log("🖼️ Images:", productResponse.data.images);

          const normalizedProduct = {
            ...productResponse.data,
            images: productResponse.data.images?.map((img) =>
              img.startsWith("./") ? img.substring(2) : img
            ),
          };

          setProduct(normalizedProduct);
        } else {
          setError("Không tìm thấy sản phẩm");
        }

        const productsResponse = await getProducts();
        if (productsResponse.success && productsResponse.data) {
          const otherProducts = productsResponse.data.filter(
            (p) => p._id !== id
          );

          const shuffled = otherProducts.sort(() => Math.random() - 0.5);
          console.log(shuffled);

          setRelatedProducts(shuffled.slice(0, 4));
        }
      } catch (err) {
        console.error("❌ Error fetching product:", err);
        setError(err.message || "Đã có lỗi xảy ra");
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id]);

  const features = [
    "100% sản phẩm phân hủy sinh học từ tinh bột ngô",
    "Giao hàng nhanh, thành toán khi nhận",
    "Dễ dàng đổi trả trong 14 ngày",
    "An toàn, thân thiện với môi trường",
  ];

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  const handlePrevImage = () => {
    if (product && product.images) {
      setSelectedImage((prev) =>
        prev === 0 ? product.images.length - 1 : prev - 1
      );
    }
  };

  const handleNextImage = () => {
    if (product && product.images) {
      setSelectedImage((prev) =>
        prev === product.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  // Thêm vào giỏ hàng (localStorage)
  const handleAddToCart = () => {
    if (!product) return;

    // Lấy giỏ hàng hiện tại từ localStorage
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    // Kiểm tra sản phẩm đã có trong giỏ chưa
    const existingItemIndex = cart.findIndex(
      (item) => item._id === product._id
    );

    if (existingItemIndex > -1) {
      // Nếu đã có, tăng số lượng
      cart[existingItemIndex].quantity += quantity;
    } else {
      // Nếu chưa có, thêm mới
      cart.push({
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || "/product1.png",
        quantity: quantity,
      });
    }

    // Lưu lại vào localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    // Dispatch custom event để thông báo cart đã được update
    window.dispatchEvent(new Event("cartUpdated"));

    // Hiển thị toast notification
    setToastMessage(
      `Đã thêm ${quantity} ${product.name} vào giỏ hàng thành công!`
    );
    setShowToast(true);

    // Tự động ẩn toast sau 3 giây
    setTimeout(() => {
      setShowToast(false);
    }, 3000);

    // Reset số lượng về 1
    setQuantity(1);
  };

  // Mua ngay - chuyển sang trang liên hệ
  const handleBuyNow = () => {
    if (!product) return;

    // Lưu thông tin sản phẩm cần mua vào localStorage (để hiển thị ở trang liên hệ nếu cần)
    localStorage.setItem(
      "buyNowProduct",
      JSON.stringify({
        _id: product._id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        image: product.images?.[0] || "/product1.png",
      })
    );

    // Chuyển sang trang liên hệ
    navigate("/contact");
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen font-sans">
        <Header />
        <main
          className="pt-20 md:pt-24 min-h-screen flex items-center justify-center"
          style={{ backgroundColor: "rgba(255, 244, 228, 1)" }}
        >
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-700"></div>
        </main>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="min-h-screen font-sans">
        <Header />
        <main
          className="pt-20 md:pt-24 min-h-screen flex items-center justify-center"
          style={{ backgroundColor: "rgba(255, 244, 228, 1)" }}
        >
          <div className="text-center">
            <p className="text-red-600 text-lg font-semibold mb-4">
              {error || "Không tìm thấy sản phẩm"}
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-700 text-white rounded-full hover:bg-green-800 transition-colors"
            >
              <ArrowLeft size={18} />
              Quay lại danh sách sản phẩm
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans">
      <Header />
      <main
          style={{ backgroundColor: "rgba(255, 244, 228, 1)" }}
      >
        <HeroSection />
        <div className="py-4 py-6">
          <div className="container mt-5 mx-auto px-4 md:px-6">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-sm md:text-base hover:underline"
              style={{ color: "rgba(49, 87, 44, 1)" }}
            >
              <ArrowLeft size={18} />
              <span>Quay lại</span>
            </Link>
          </div>
        </div>

        {/* Product Detail */}
        <section className="pb-12 md:pb-16 lg:pb-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
              {/* Left Column - Product Info */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="order-2 lg:order-1"
              >
                <div className=" p-6 md:p-8 lg:p-10">
                  {/* Product Title */}
                  <h1
                    className="text-5xl  font-bold mb-4"
                    style={{ color: "rgba(49, 87, 44, 1)" }}
                  >
                    {product.name}
                  </h1>

                  {/* Price */}
                  <p className="text-red-800 text-2xl md:text-3xl font-bold my-6">
                    {product.price
                      ? `${product.price.toLocaleString("vi-VN")} VNĐ`
                      : "Liên hệ"}
                  </p>

                  {/* Description */}
                  <p
                    className="text-sm md:text-base leading-relaxed mb-8"
                    style={{ color: "rgba(49, 87, 44, 0.7)" }}
                  >
                    {product.description}
                  </p>

                  {/* Quantity Selector */}
                  <div className="mb-6">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={handleDecrease}
                        className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-white hover:opacity-90 transition-opacity cursor-pointer"
                        style={{ backgroundColor: "rgba(64, 145, 108, 1)" }}
                      >
                        <Minus size={20} className="text-white" />
                      </button>
                      <span
                        className="text-2xl md:text-3xl font-bold w-12 text-center"
                        style={{ color: "rgba(49, 87, 44, 1)" }}
                      >
                        {quantity}
                      </span>
                      <button
                        onClick={handleIncrease}
                        className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-white hover:opacity-90 transition-opacity cursor-pointer"
                        style={{ backgroundColor: "rgba(64, 145, 108, 1)" }}
                      >
                        <Plus size={20} className="text-white" />
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 pb-8 border-b"
                    style={{ borderColor: "rgba(49, 87, 44, 0.2)" }}
                  >
                    <button
                      onClick={handleBuyNow}
                      className="px-6 py-4 rounded-lg text-white font-bold text-base hover:opacity-90 transition-opacity cursor-pointer"
                      style={{ backgroundColor: "rgba(64, 145, 108, 1)" }}
                    >
                      Mua ngay
                    </button>
                    <button
                      onClick={handleAddToCart}
                      className="bg-amber-50 px-6 py-4 rounded-lg font-bold text-base hover:bg-amber-100 border-2 cursor-pointer"
                      style={{
                        color: "rgba(49, 87, 44, 1)",
                        borderColor: "rgba(49, 87, 44, 1)",
                      }}
                    >
                      Thêm vào giỏ
                    </button>
                  </div>

                  {/* Features */}
                  <div>
                    <ul className="space-y-3">
                      {features.map((feature, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-3 text-sm md:text-base"
                          style={{ color: "rgba(49, 87, 44, 0.8)" }}
                        >
                          <span
                            className="text-xl leading-none"
                            style={{ color: "rgba(49, 87, 44, 0.8)" }}
                          >
                            •
                          </span>
                          <span className="flex-1">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>

              {/* Right Column - Product Images */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="order-1 lg:order-2"
              >
                <div className="space-y-8">
                  {/* Main Image with Navigation */}
                  <div className="relative">
                    <div
                      className="overflow-hidden p-8 md:p-10 lg:p-12"
                      style={{ borderRadius: "60px 0 60px 0" }}
                    >
                      <div
                        className="relative w-full"
                        style={{ paddingBottom: "100%" }}
                      >
                        <img
                          src={
                            product.images &&
                            product.images.length > 0 &&
                            product.images[selectedImage]
                              ? product.images[selectedImage]
                              : "/product1.png"
                          }
                          alt={product.name}
                          className="absolute inset-0 w-full h-full object-contain transition-opacity duration-500"
                          onError={(e) => {
                            console.log("❌ Image load error:", e.target.src);
                            e.target.src = "/product1.png";
                          }}
                        />
                      </div>
                    </div>

                    {/* Navigation Arrows with Modern Design */}
                    {product.images && product.images.length > 1 && (
                      <>
                        <button
                          onClick={handlePrevImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-110 border-2 cursor-pointer"
                          style={{
                            backgroundColor: "rgba(64, 145, 108, 1)",
                            borderColor: "rgba(255, 255, 255, 0.3)",
                            color: "white",
                          }}
                        >
                          <ChevronLeft size={24} strokeWidth={3} />
                        </button>
                        <button
                          onClick={handleNextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-110 border-2 cursor-pointer"
                          style={{
                            backgroundColor: "rgba(64, 145, 108, 1)",
                            borderColor: "rgba(255, 255, 255, 0.3)",
                            color: "white",
                          }}
                        >
                          <ChevronRight size={24} strokeWidth={3} />
                        </button>
                      </>
                    )}
                  </div>

                  {/* Thumbnail Images with Modern Grid */}
                  {product.images && product.images.length > 1 && (
                    <div className="flex gap-4 justify-center">
                      {product.images.map((img, i) => (
                        <button
                          key={i}
                          onClick={() => setSelectedImage(i)}
                          className={`relative rounded-xl overflow-hidden transition-all duration-300 cursor-pointer ${
                            selectedImage === i
                              ? "ring-3 ring-[#3F906B] ring-offset-4 scale-110 "
                              : "opacity-50 hover:opacity-100 hover:scale-105"
                          }`}
                          style={{
                            ringColor:
                              selectedImage === i
                                ? "rgba(64, 145, 108, 1)"
                                : "transparent",
                          }}
                        >
                          <div className="bg-white p-2">
                            <div className="relative w-20 h-20 md:w-24 md:h-24">
                              <img
                                src={img}
                                alt={`${product.name} ${i + 1}`}
                                className="absolute inset-0 w-full h-full object-contain rounded-lg"
                                onError={(e) => {
                                  e.target.src = "/product1.png";
                                }}
                              />
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        <section className="container mx-auto my-20 px-4">
          <h2
            style={{ color: "rgba(49, 87, 44, 1)" }}
            className="uppercase text-center text-4xl font-bold mb-10"
          >
            Sản phẩm liên quan
          </h2>
          {relatedProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {relatedProducts.map((p) => (
                <Link
                  key={p._id}
                  to={`/product/${p._id}`}
                  className="block"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  <div className="rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-2">
                    <div className="aspect-[295/210]">
                      <img
                        src={p.images?.[0]}
                        alt={p.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6" style={{ backgroundColor: "#4B9D7E" }}>
                      <h3 className="text-white font-bold text-xl mb-2">
                        {p.name}
                      </h3>
                      <p className="text-white text-sm opacity-90 mb-4 h-10 line-clamp-2">
                        {p.description}
                      </p>
                      <div className="text-white font-bold text-xl flex items-center gap-2">
                        Xem thêm <ArrowRight size={16} />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600">
              Không có sản phẩm liên quan
            </p>
          )}
        </section>
        <Footer />
      </main>

      {/* Toast Notification */}
      {showToast && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-8 right-8 z-50 bg-white rounded-2xl shadow-2xl p-6 max-w-md border-l-4"
          style={{ borderColor: "rgba(64, 145, 108, 1)" }}
        >
          <div className="flex items-start gap-4">
            <div
              className="shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "rgba(64, 145, 108, 0.1)" }}
            >
              <Check
                size={24}
                className="text-white"
                style={{ color: "rgba(64, 145, 108, 1)" }}
              />
            </div>
            <div className="flex-1">
              <h4
                className="font-bold text-lg mb-1"
                style={{ color: "rgba(49, 87, 44, 1)" }}
              >
                Thành công!
              </h4>
              <p className="text-gray-600 text-sm">{toastMessage}</p>
            </div>
            <button
              onClick={() => setShowToast(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            >
              <Plus size={20} className="rotate-45" />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
