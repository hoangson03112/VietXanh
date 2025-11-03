/* eslint-disable no-unused-vars */
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

// Cấu hình viewport mặc định để animations luôn trigger lại khi scroll
// eslint-disable-next-line react-refresh/only-export-components
export const defaultViewport = {
  once: false, // Animation sẽ chạy lại mỗi khi scroll vào view
  amount: 0.2, // Trigger khi 20% element xuất hiện
  margin: "-50px", // Trigger sớm hơn một chút
};

export const ScrollReveal = ({ children, delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once: false, 
    margin: "-50px", 
    amount: 0.2 
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
};