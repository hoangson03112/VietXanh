/* eslint-disable no-unused-vars */
import React from "react";
import Header from "../components/Header";
import { motion } from "framer-motion";
import Footer from "../components/Footer";

export default function About() {
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
                VỀ CHÚNG TÔI
              </h1>
              <p className=" md:text-xl opacity-80 leading-relaxed mb-6 md:mb-10 px-4 sm:px-0">
                Việt Xanh được sáng lập bởi đội ngũ trẻ đầy nhiệt huyết, chung
                một tầm nhìn về tương lai bền vững. Chúng tôi không chỉ tạo ra
                sản phẩm thân thiện với môi trường mà còn lan tỏa lối sống xanh
                đến cộng đồng.
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

        {/* Chúng tôi là Việt Xanh Section */}
        <section
          className="py-16 md:py-24"
          style={{ backgroundColor: "rgba(255, 244, 228, 1)" }}
        >
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left - Image */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: false }}
                className="order-2 lg:order-1"
              >
                <div className="rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    src="./about1.jpg"
                    alt="Việt Xanh Team"
                    className="w-full h-auto object-cover"
                  />
                </div>
              </motion.div>

              {/* Right - Content */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: false, amount: 0.3 }}
                className="order-1 lg:order-2"
              >
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: false }}
                  className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
                  style={{ color: "rgba(49, 87, 44, 1)" }}
                >
                  CHÚNG TÔI LÀ VIỆT XANH
                </motion.h2>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  viewport={{ once: false }}
                  className="opacity-90 space-y-6 text-base md:text-xl leading-relaxed font-medium"
                  style={{ color: "rgba(49, 87, 44, 0.8)" }}
                >
                  <p>
                    Chúng tôi là Việt Xanh – một trong những công ty tiên phong
                    trong việc mang đến các sản phẩm phân hủy sinh học từ tinh
                    bột ngô, góp phần thay thế nhựa truyền thống và bảo vệ môi
                    trường sống.
                  </p>
                  <p>
                    Với sứ mệnh xây dựng lối sống xanh – bền vững, Việt Xanh cam
                    kết tạo ra những sản phẩm an toàn, tiện lợi và thân thiện
                    với thiên nhiên, đồng hành cùng cộng đồng hướng tới một
                    tương lai không rác thải nhựa.
                  </p>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Việt Xanh được thành lập từ năm 2025 Section */}
        <section
          className="py-16 md:py-24"
          style={{ backgroundColor: "rgba(255, 244, 228, 1)" }}
        >
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              {/* Left - Content - 5 columns */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: false, amount: 0.3 }}
                className="lg:col-span-5"
              >
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: false }}
                  className=" md:text-4xl lg:text-5xl font-bold mb-6 leading-tight"
                  style={{ color: "rgba(49, 87, 44, 1)" }}
                >
                  VIỆT XANH ĐƯỢC THÀNH LẬP TỪ NĂM 2025
                </motion.h2>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  viewport={{ once: false }}
                  className="opacity-90 space-y-6 text-base md:text-xl leading-relaxed font-medium"
                  style={{ color: "rgba(49, 87, 44, 0.8)" }}
                >
                  <p>
                    Câu chuyện của Việt Xanh bắt đầu từ những chuyến đi thực tế
                    và các hoạt động cộng đồng hướng tới bảo vệ môi trường.
                    Chúng kiến lượng rác thải nhựa ngày càng tăng và tác động
                    nặng nề của chúng tới thiên nhiên, nhóm sáng lập nhận ra cần
                    phải hành động – không chỉ kêu gọi mà phải tạo ra một giải
                    pháp thiết thực.
                  </p>
                  <p>
                    Việt Xanh với những ý tưởng về các sản phẩm phân hủy sinh
                    học từ tinh bột ngô, thân thiện với môi trường và an toàn
                    cho người dùng. Lấy cảm hứng từ tinh thần "Một Sản Phẩm Xanh
                    - Ngàn tương lai Sạch", Việt Xanh mong muốn trở thành cầu
                    nối giữa cuộc sống hiện đại và thiên nhiên, nơi mỗi sản phẩm
                    không chỉ hữu ích mà còn mang trong mình ý nghĩa vì Trái Đất
                    xanh.
                  </p>
                </motion.div>
              </motion.div>

              {/* Right - Images Grid - 6 columns */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: false, amount: 0.3 }}
                className="lg:col-span-7"
              >
                <div className="grid grid-cols-2 gap-4">
                  {/* Large Image - Top */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: false }}
                    className="col-span-2 rounded-3xl overflow-hidden shadow-xl"
                  >
                    <img
                      src="/about2.jpg"
                      alt="Việt Xanh Team 2025"
                      className="w-full object-cover"
                      style={{ height: "400px" }}
                    />
                  </motion.div>
                  {/* Small Images - Bottom */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    viewport={{ once: false }}
                    className="rounded-2xl overflow-hidden shadow-lg"
                  >
                    <img
                      src="/about3.jpg"
                      alt="Việt Xanh Activities 1"
                      className="w-full object-cover"
                      style={{ height: "220px" }}
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    viewport={{ once: false }}
                    className="rounded-2xl overflow-hidden shadow-lg"
                  >
                    <img
                      src="/about4.jpg"
                      alt="Việt Xanh Activities 2"
                      className="w-full object-cover"
                      style={{ height: "220px" }}
                    />
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Định hướng Section */}
        <section
          className="py-16 md:py-24"
          style={{ backgroundColor: "rgba(255, 244, 228, 1)" }}
        >
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: false }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-16 md:mb-20"
              style={{ color: "rgba(49, 87, 44, 1)" }}
            >
              ĐỊNH HƯỚNG
            </motion.h2>

            {/* Three Circles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 max-w-6xl mx-auto">
              {/* Tầm nhìn */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: false, amount: 0.3 }}
                className="flex flex-col items-center md:mt-52"
              >
                <div
                  className="w-40 h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 rounded-full border-2 flex items-center justify-center mb-6 transition-all duration-300 hover:scale-105"
                  style={{ borderColor: "rgba(49, 87, 44, 0.5)" }}
                >
                  <h3
                    className="text-xl md:text-2xl font-bold text-center italic"
                    style={{ color: "rgba(49, 87, 44, 1)" }}
                  >
                    TẦM NHÌN
                  </h3>
                </div>
                <p
                  className="text-center text-base md:text-lg leading-relaxed font-medium italic opacity-90"
                  style={{ color: "rgba(49, 87, 44, 0.8)" }}
                >
                  Trở thành thương hiệu tiên phong tại Việt Nam trong lĩnh vực
                  sản phẩm phân hủy sinh học, góp phần kiến tạo cuộc sống xanh
                  và bền vững cho mọi người.
                </p>
              </motion.div>

              {/* Sứ mệnh */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: false, amount: 0.3 }}
                className="flex flex-col items-center"
              >
                <div
                  className="w-40 h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 rounded-full border-2 flex items-center justify-center mb-6 transition-all duration-300 hover:scale-105"
                  style={{ borderColor: "rgba(49, 87, 44, 0.5)" }}
                >
                  <h3
                    className="text-xl md:text-2xl font-bold text-center italic"
                    style={{ color: "rgba(49, 87, 44, 1)" }}
                  >
                    SỨ MỆNH
                  </h3>
                </div>
                <p
                  className="text-center text-base md:text-lg leading-relaxed font-medium italic opacity-90"
                  style={{ color: "rgba(49, 87, 44, 0.8)" }}
                >
                  Mang đến các giải pháp thay thế nhựa truyền thống bằng sản
                  phẩm an toàn, thân thiện môi trường.
                </p>
              </motion.div>

              {/* Giá trị cốt lõi */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: false, amount: 0.3 }}
                className="flex flex-col items-center md:mt-52"
              >
                <div
                  className="w-40 h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 rounded-full border-2 flex items-center justify-center mb-6 transition-all duration-300 hover:scale-105"
                  style={{ borderColor: "rgba(49, 87, 44, 0.5)" }}
                >
                  <h3
                    className="text-xl md:text-2xl font-bold text-center italic"
                    style={{ color: "rgba(49, 87, 44, 1)" }}
                  >
                    GIÁ TRỊ
                    <br />
                    CỐT LÕI
                  </h3>
                </div>
                <p
                  className="text-center text-base md:text-lg leading-relaxed font-medium italic opacity-90"
                  style={{ color: "rgba(49, 87, 44, 0.8)" }}
                >
                  Việt Xanh xây dựng hành trình phát triển dựa trên bốn giá trị
                  cốt lõi: Tự nhiên – Bền vững – Trách nhiệm – Sáng tạo.
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
