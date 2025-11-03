/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { ArrowRight, Check, Facebook, Instagram, Twitter } from "lucide-react";
import { motion, useInView } from "framer-motion";
import Header from "../components/Header";
import HowToOrder from "../components/HowToOrder";
import Footer from "../components/Footer";
import { ScrollReveal } from "../util/conmom";
import { getFeaturedProducts } from "../services/productService";

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Load featured products
  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const response = await getFeaturedProducts();
        if (response.success) {
          setFeaturedProducts(response.data);
        }
      } catch (error) {
        console.error("Error loading featured products:", error);
      } finally {
        setLoadingProducts(false);
      }
    };

    loadFeatured();
  }, []);

  // Fallback products nếu không có featured
  const fallbackProducts = [
    {
      name: "Túi cuộn rút",
      description:
        "Túi cuộn một đầu gọn nhẹ, dễ dàng mở và bảo quản đồ tiện lợi.",
      images: ["./product1.png"],
    },
    {
      name: "Túi 2 quai (T-Shirt)",
      description:
        "Túi hai quai chắc chắn, tiện lợi và phù hợp cho nhiều mục đích sử dụng.",
      images: ["./product1.png"],
    },
    {
      name: "Cốc",
      description:
        "Cốc nhựa sinh học bền nhẹ, an toàn cho sức khoẻ, dễ dàng tái sử dụng.",
      images: ["./product1.png"],
    },
    {
      name: "Ống hút",
      description:
        "Ống hút sinh học bền, không thấm nước, dùng an toàn cho đồ uống.",
      images: ["./product1.png"],
    },
  ];

  const displayProducts =
    featuredProducts.length > 0 ? featuredProducts : fallbackProducts;

  return (
    <div className="min-h-screen bg-white font-sans">
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
                MỘT SẢN PHẨM XANH
                <br />
                NGÀN TƯƠNG LAI SẠCH
              </h1>
              <p className="text-base md:text-xl opacity-90 leading-relaxed mb-6 md:mb-10 px-4 sm:px-0">
                Việt Xanh là một trong những thương hiệu tiên phong trong việc
                thiết kế và sản xuất các sản phẩm phân hủy sinh học từ tinh bột
                ngô thân thiện với môi trường.
              </p>
              <button className="bg-black cursor-pointer text-white font-bold uppercase text-xs sm:text-sm px-6 sm:px-10 py-3 sm:py-4 rounded-full hover:bg-gray-900 transition-colors w-full sm:w-auto lg:w-[50%]">
                XEM CÁC SẢN PHẨM
              </button>
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
          <section className="py-12 md:py-16 lg:py-24">
            <div className="container mx-auto px-4 md:px-6 py-8 md:py-16 lg:py-24">
              <div className="mb-8 md:mb-12 lg:mb-16 text-center lg:text-left">
                <h2
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 uppercase tracking-wide"
                  style={{ color: "rgba(49, 87, 44, 1)" }}
                >
                  Sản phẩm có sẵn – Thân thiện với môi trường
                </h2>
                <p
                  className="text-base md:text-lg leading-relaxed regular fw-400 px-4 sm:px-0"
                  style={{ color: "rgba(49, 87, 44, 0.8)" }}
                >
                  Với Việt Xanh, bạn hoàn toàn yên tâm lựa chọn vì mỗi sản phẩm
                  đều thân thiện với môi trường và an toàn cho cuộc sống.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 px-4 sm:px-0">
                {loadingProducts ? (
                  <div className="col-span-full text-center py-8">
                    <p className="text-gray-500">Đang tải sản phẩm...</p>
                  </div>
                ) : (
                  displayProducts.map((p, i) => (
                    <ScrollReveal key={i} delay={i * 0.1}>
                      <div className="rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-2">
                        <div className="aspect-[295/210]">
                          <img
                            src={p.images?.[0] || "./product1.png"}
                            alt={p.name}
                            className="w-full h-full object-fill"
                          />
                        </div>
                        <div
                          className="p-6"
                          style={{ backgroundColor: "#4B9D7E" }}
                        >
                          <h3 className="text-white font-bold text-xl mb-2">
                            {p.name}
                          </h3>
                          <p className="text-white text-sm opacity-90 mb-4 h-10">
                            {p.description}
                          </p>
                          <button className="text-white font-bold text-xl flex items-center gap-2 cursor-pointer">
                            Xem thêm <ArrowRight size={16} />
                          </button>
                        </div>
                      </div>
                    </ScrollReveal>
                  ))
                )}
              </div>
            </div>
          </section>

          {/* Solution Section */}
          <section className="py-12 md:py-16 lg:py-24">
            <div className="container mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
              <div className="space-y-2 max-w-[650px] mx-auto lg:mx-0 text-center lg:text-left">
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
                <ScrollReveal delay={0.1}>
                  <h2
                    className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold uppercase leading-tight tracking-wide"
                    style={{
                      color: "rgba(49, 87, 44, 1)",
                      letterSpacing: "0.08em",
                    }}
                  >
                    GIẢI PHÁP XANH – CÁC SẢN PHẨM PHÂN HỦY SINH HỌC TỪ TINH BỘT
                    NGÔ
                  </h2>
                </ScrollReveal>
                <ScrollReveal delay={0.2}>
                  <p
                    className="text-base md:text-lg lg:text-xl leading-relaxed my-4 md:my-7 font-normal px-4 sm:px-0"
                    style={{
                      color: "rgba(49, 87, 44, 1)",
                    }}
                  >
                    Sản phẩm phân hủy sinh học Việt Xanh được sản xuất từ tinh
                    bột ngô tự nhiên, có khả năng phân hủy hoàn toàn trong môi
                    trường mà không để lại chất thải độc hại.
                  </p>
                </ScrollReveal>
                <ScrollReveal delay={0.3}>
                  <button
                    className="text-white font-bold text-sm md:text-base lg:text-lg px-6 md:px-10 py-4 md:py-5 shadow-lg cursor-pointer hover:opacity-90 w-full sm:w-auto"
                    style={{ backgroundColor: "#4B9D7E" }}
                  >
                    KHÁM PHÁ NGAY
                  </button>
                </ScrollReveal>
              </div>
              <ScrollReveal delay={0.2}>
                <div className="flex flex-col gap-3 md:gap-4 max-w-[700px] mx-auto lg:mx-0 px-4 sm:px-0">
                  <div className="w-full h-[250px] sm:h-[350px] md:h-[436px] rounded-2xl md:rounded-[3rem] shadow-lg overflow-hidden">
                    <img
                      src="./solution1.jpg"
                      alt=""
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex gap-3 md:gap-4">
                    <div className="flex-1 h-[120px] sm:h-[150px] md:h-[196px] rounded-xl md:rounded-2xl shadow-lg overflow-hidden">
                      <img
                        src="./solution2.jpg"
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 h-[120px] sm:h-[150px] md:h-[196px] rounded-xl md:rounded-2xl shadow-lg overflow-hidden">
                      <img
                        src="./solution3.jpg"
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </section>

          {/* Why Choose Section */}
          <section className="py-12 md:py-16 lg:py-24">
            <div className="container mx-auto px-4 md:px-6">
              <h2
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-3 md:mb-4 uppercase tracking-wide"
                style={{ color: "rgba(49, 87, 44, 1)" }}
              >
                VÌ SAO CHỌN VIỆT XANH
              </h2>
              <p
                className="text-center text-base md:text-lg lg:text-xl mb-8 md:mb-12 lg:mb-16 max-w-3xl mx-auto font-[450] px-4 sm:px-0"
                style={{ color: "rgba(49, 87, 44, 1)" }}
              >
                Chúng tôi mang đến trải nghiệm xanh – tiện lợi và thân thiện với
                môi trường trong từng sản phẩm Việt Xanh.
              </p>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
                <ScrollReveal delay={0.2}>
                  <img
                    src="./ship.jpg"
                    className="w-full h-64 md:h-80 lg:h-96 object-cover shadow-lg rounded-2xl"
                  />
                </ScrollReveal>
                <ScrollReveal delay={0.3}>
                  <div className="space-y-3 md:space-y-4 px-4 sm:px-0">
                    {[
                      "Giao hàng nhanh chóng - Nhận hàng nhanh chóng, không lo về thời gian.",
                      "Dễ dàng mua sắm - Mua sắm đơn giản, thuận tiện chỉ trong vài bước.",
                      "Hỗ trợ 24/7 - Luôn sẵn sàng hỗ trợ bạn mọi lúc, mọi nơi.",
                      "Hỗ trợ 24/7 - Thoải mái đổi trả nếu sản phẩm không phù hợp.",
                    ].map((text, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 md:gap-4"
                      >
                        <div
                          className="shrink-0 w-5 h-5 md:w-6 md:h-6 flex items-center justify-center mt-1"
                          style={{ borderColor: "rgba(49, 87, 44, 1)" }}
                        >
                          <img
                            src="./tick-circle.svg"
                            alt="check"
                            className="w-full h-full"
                          />
                        </div>
                        <p
                          className="leading-relaxed font-medium text-base md:text-lg lg:text-xl"
                          style={{ color: "rgba(49, 87, 44, 1)" }}
                        >
                          {text}
                        </p>
                      </div>
                    ))}
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </section>

          {/* Steps Section */}
          <HowToOrder />
        </div>
        {/* Footer */}
        <Footer />
      </main>
    </div>
  );
}
