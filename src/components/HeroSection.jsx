/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";

export default function HeroSection({
  title,
  description,
  showButton = false,
  buttonText = "",
  onButtonClick = null,
}) {
  return (
    <section
      className="w-screen relative bg-white pt-20 px-0 m-0"
      style={{ margin: 0 }}
    >
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full h-full z-10 flex justify-center items-center relative"
      >
        <img
          src="/bg.png"
          alt="Team"
          className="w-full h-full object-contain object-center"
          style={{ display: "block", objectFit: "contain" }}
        />
        {showButton && buttonText && onButtonClick && (
          <button
            onClick={onButtonClick}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black cursor-pointer text-white font-bold uppercase text-xs sm:text-sm px-6 sm:px-10 py-3 sm:py-4 rounded-full hover:bg-gray-900 transition-colors"
          >
            {buttonText}
          </button>
        )}
      </motion.div>
    </section>
  );
}
