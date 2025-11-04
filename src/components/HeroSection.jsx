
/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";

export default function HeroSection({ 
  title, 
  description, 
  showButton = false, 
  buttonText = "", 
  onButtonClick = null 
}) {
  return (
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
            {title}
          </h1>
          <p className="text-base md:text-xl opacity-90 leading-relaxed mb-6 md:mb-10 px-4 sm:px-0">
            {description}
          </p>
          {showButton && buttonText && onButtonClick && (
            <button
              onClick={onButtonClick}
              className="bg-black cursor-pointer text-white font-bold uppercase text-xs sm:text-sm px-6 sm:px-10 py-3 sm:py-4 rounded-full hover:bg-gray-900 transition-colors w-full sm:w-auto lg:w-[50%]"
            >
              {buttonText}
            </button>
          )}
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
  );
}
