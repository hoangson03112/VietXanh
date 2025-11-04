/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { ArrowRight, Check, Facebook, Instagram, Twitter } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import HowToOrder from "../components/HowToOrder";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import { ScrollReveal } from "../util/conmom";
import { getFeaturedProducts } from "../services/productService";

export default function Home() {
  const navigate = useNavigate();
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

  // Navigate to product detail
  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      <Header />

      <main>
        {/* Hero Section */}
        <HeroSection
          title={
            <>
              MỘT SẢN PHẨM XANH
              <br />
              NGÀN TƯƠNG LAI SẠCH
            </>
          }
          description="Việt Xanh là một trong những thương hiệu tiên phong trong việc thiết kế và sản xuất các sản phẩm phân hủy sinh học từ tinh bột ngô thân thiện với môi trường."
          showButton={true}
          buttonText="XEM CÁC SẢN PHẨM"
          onButtonClick={() => navigate("/products")}
        />
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
                ) : featuredProducts.length === 0 ? (
                  <div className="col-span-full text-center py-8">
                    <p className="text-gray-500">
                      Chưa có sản phẩm nổi bật nào
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                      Admin vui lòng đánh dấu sản phẩm nổi bật
                    </p>
                  </div>
                ) : (
                  featuredProducts.map((p, i) => (
                    <ScrollReveal key={p._id || i} delay={i * 0.1}>
                      <div
                        onClick={() => handleProductClick(p._id)}
                        className="rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group"
                      >
                        <div className="aspect-[295/210] overflow-hidden">
                          <img
                            src={p.images?.[0] || "./product1.png"}
                            alt={p.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <div
                          className="p-6"
                          style={{ backgroundColor: "#4B9D7E" }}
                        >
                          <h3 className="text-white font-bold text-xl mb-2 line-clamp-1">
                            {p.name}
                          </h3>
                          <p className="text-white text-sm opacity-90 mb-4 h-10 line-clamp-2">
                            {p.description}
                          </p>
                          <button className="text-white font-bold text-lg flex items-center gap-2 hover:gap-4 transition-all duration-300 cursor-pointer">
                            Xem thêm{" "}
                            <ArrowRight
                              size={18}
                              className="group-hover:translate-x-1 transition-transform"
                            />
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
