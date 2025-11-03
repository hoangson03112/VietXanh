/* eslint-disable no-unused-vars */
// src/components/HowToOrder.jsx
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

const STEPS = [
  {
    id: 1,
    title: "Chọn & Tuỳ chỉnh",
    desc: "Sau khi chọn chúng tôi, hãy chuyển đến các tuỳ chọn tuỳ chỉnh bao gồm kích thước, vật liệu, hoàn thiện và thời gian giao hàng, cập nhật các thiết kế đặc biệt của bạn và bắt đầu đóng gói",
  },
  {
    id: 2,
    title: "Nhận Mẫu Miễn Phí",
    desc: "Bản thiết kế trực tuyến miễn phí cùng với tất cả các chi tiết sẽ được gửi đến bạn trong vòng 24 giờ để phân tích và phê duyệt",
  },
  {
    id: 3,
    title: "Đặt Hàng",
    desc: "Xác nhận thiết kế của bạn và đặt hàng chỉ bằng một cú nhấp chuột. Đối với dịch vụ giao hàng tiêu chuẩn và giao hàng nhanh, hãy chọn tuỳ chọn phù hợp và nhận hộp trong thời gian ngắn nhất",
  },
];

function StepCard({ id, title, desc, offsetClass = "", delay = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -50 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
      transition={{ duration: 0.6, delay }}
      className={`relative ${offsetClass} my-8 md:my-[70px]`}
    >
      {/* Badge số */}
      <div className="absolute -left-4 md:-left-6 -top-4 md:-top-6 z-10 flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg">
        <span className="text-lg md:text-xl font-bold">{id}</span>
      </div>

      {/* Card trắng + bóng đổ dày nhiều lớp */}
      <div className="relative rounded-xl bg-white px-4 py-5 md:px-8 md:py-7 border border-black/5 shadow-2xl">
        <h3
          className="text-lg md:text-xl lg:text-2xl font-bold"
          style={{ color: "rgba(49, 87, 44, 1)" }}
        >
          {title}
        </h3>
        <p
          className="mt-3 text-sm md:text-base leading-6 md:leading-7"
          style={{ color: "rgba(49, 87, 44, 0.7)" }}
        >
          {desc}
        </p>

        {/* lớp mỏng tạo cảm giác mép */}
        <div className="pointer-events-none absolute -z-10 inset-0 rounded-2xl shadow-[0_0_0_1px_rgba(0,0,0,0.02)]" />
      </div>
    </motion.div>
  );
}

export default function HowToOrder() {
  const titleRef = useRef(null);
  const isTitleInView = useInView(titleRef, { once: true, margin: "-50px" });

  return (
    <section className="relative mx-auto container py-8 md:py-12 lg:py-14 px-4 md:px-6">
      <div className="grid gap-8 md:gap-10 lg:gap-28 md:grid-cols-2">
        {/* Cột trái: bước */}
        <div className="space-y-6 md:space-y-10 col-auto max-w-xl md:mx-auto order-2 md:order-1">
          {STEPS.map((s, i) => (
            <StepCard
              key={s.id}
              id={s.id}
              title={s.title}
              desc={s.desc}
              delay={i * 0.2}
              offsetClass={
                i === 1
                  ? "md:translate-x-20 lg:translate-x-40"
                  : i === 2
                  ? "md:translate-x-0"
                  : ""
              }
            />
          ))}
        </div>

        {/* Cột phải: tiêu đề & mô tả */}
        <aside className="md:pl-6 col-auto flex flex-col justify-center max-w-lg md:mx-auto order-1 md:order-2 text-center md:text-left">
          <motion.div
            ref={titleRef}
            initial={{ opacity: 0, y: 30 }}
            animate={
              isTitleInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
            }
            transition={{ duration: 0.6 }}
          >
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight"
              style={{ color: "rgba(49, 87, 44, 1)" }}
            >
              CÁCH ĐỂ
              <br />
              ĐẶT HÀNG
            </h2>
            <p
              className="mt-4 md:mt-6 max-w-xl leading-6 md:leading-7 text-base md:text-lg lg:text-xl font-medium opacity-80 px-4 sm:px-0"
              style={{ color: "rgba(49, 87, 44, 1)" }}
            >
              Bạn có thể đặt hàng nhanh chóng qua website hoặc liên hệ trực tiếp
              với chúng tôi để được tư vấn chi tiết. Đội ngũ của chúng tôi luôn
              sẵn sàng hỗ trợ và mang đến cho bạn trải nghiệm mua sắm thuận
              tiện, đáng tin cậy.
            </p>
          </motion.div>
        </aside>
      </div>
    </section>
  );
}
