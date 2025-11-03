/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import { motion } from "framer-motion";
import { ScrollReveal } from "../util/conmom";
import {
  ArrowRight,
  Check,
  Facebook,
  Instagram,
  Twitter,
  ChevronsDown,
} from "lucide-react";
import Footer from "../components/Footer";
import { getProducts } from "../services/productService";

const ITEMS_PER_PAGE = 16;

export default function Products() {
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Lấy tất cả sản phẩm từ API (không có params)
        const response = await getProducts();
        console.log("📦 Products response:", response);

        if (response.success && response.data) {
          // Normalize image URLs - nếu là relative path thì bỏ "./"
          const normalizedProducts = response.data.map((product) => ({
            ...product,
            images: product.images?.map((img) =>
              img.startsWith("./") ? img.substring(2) : img
            ),
          }));
          
          setProducts(normalizedProducts);
        } else {
          setError("Không thể tải danh sách sản phẩm");
        }
      } catch (err) {
        console.error("❌ Error fetching products:", err);
        setError(err.message || "Đã có lỗi xảy ra khi tải sản phẩm");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const visibleProducts = products.slice(0, visibleCount);
  const hasMore = visibleCount < products.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
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
                SẢN PHẨM
              </h1>
              <p className=" md:text-xl opacity-90 leading-relaxed mb-6 md:mb-10 px-4 sm:px-0">
                Bộ sưu tập các sản phẩm phân hủy sinh học và thân thiện môi
                trường, giúp bạn thay thế nhựa dùng một lần bằng lựa chọn xanh,
                an toàn và bền vững cho cuộc sống hằng ngày.
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
        <div style={{ backgroundColor: "rgba(255, 244, 228, 1)" }}>
          {/* Products Section */}
          <section className=" md:py-8">
            <div className="container mx-auto px-4 md:px-6 py-8 md:py-16 lg:py-24">
              <div className="space-y-2 mb-8 md:mb-12 lg:mb-16 text-center lg:text-left">
                <ScrollReveal>
                  <p
                    className="font-bold text-sm md:text-base lg:text-lg uppercase tracking-widest"
                    style={{
                      color: "rgba(49, 87, 44, 1)",
                      letterSpacing: "0.2em",
                    }}
                  >
                    VIET XANH
                  </p>
                </ScrollReveal>
                <h2
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 uppercase tracking-wide"
                  style={{ color: "rgba(49, 87, 44, 1)" }}
                >
                  DANH MỤC SẢN PHẨM
                </h2>
                <p
                  className="text-base md:text-lg leading-relaxed regular fw-400 px-4 sm:px-0"
                  style={{ color: "rgba(49, 87, 44, 0.8)" }}
                >
                  Danh mục sản phẩm Việt Xanh mang đến các giải pháp bao bì sinh
                  học thân thiện môi trường, an toàn và bền vững cho cuộc sống
                  xanh.
                </p>
              </div>
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-700"></div>
                </div>
              ) : error ? (
                <div className="text-center py-20">
                  <p className="text-red-600 text-lg font-semibold">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-6 py-2 bg-green-700 text-white rounded-full hover:bg-green-800 transition-colors"
                  >
                    Thử lại
                  </button>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-gray-600 text-lg">Chưa có sản phẩm nào</p>
                </div>
              ) : (
                <div className="my-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 px-4 sm:px-0">
                  {visibleProducts.map((p, i) => (
                    <ScrollReveal key={p._id || i} delay={(i % 16) * 0.05}>
                      <Link to={`/product/${p._id}`} className="block">
                        <div className="rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-2">
                          <div className="aspect-[295/210]">
                            <img
                              src={p.images?.[0] || "./product1.png"}
                              alt={p.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div
                            className="p-6"
                            style={{ backgroundColor: "#4B9D7E" }}
                          >
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
                    </ScrollReveal>
                  ))}
                </div>
              )}
              {hasMore && !loading && !error && (
                <div className="flex justify-center mt-12">
                  <button
                    type="button"
                    onClick={handleLoadMore}
                    className="flex items-center justify-center gap-3 px-10 py-4 rounded-full text-white font-bold hover:scale-105 transition-transform cursor-pointer"
                    style={{ backgroundColor: "rgba(64, 145, 108, 1)" }}
                  >
                    XEM THÊM
                    <ChevronsDown size={22} className="animate-bounce" />
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
