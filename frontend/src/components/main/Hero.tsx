import React from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Hero = () => {
  // Animation variants
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="relative w-full h-screen max-h-[600px] overflow-hidden">
      {/* Main Hero Image */}
      <img
        src="Apples.jpg"
        alt="Cinnamon Apple Loaded Tart"
        className="w-full h-full object-cover"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-black/20"></div>

      {/* Content Container */}
      <div className="absolute inset-0 flex flex-col justify-end px-12 pb-16">
        <div className="container mx-auto">
          {/* Small Meta Text */}
          <motion.div
            className="text-white/90 text-sm mb-2 tracking-wide uppercase"
            initial="hidden"
            animate="visible"
            variants={textVariants}
          >
            Signature This Month
          </motion.div>

          {/* Hero Title */}
          <motion.h1
            className="text-white text-4xl md:text-6xl font-semibold mb-6 max-w-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Cinnamon Apple Tart
          </motion.h1>

          {/* Optional Subtitle or CTA Button can be added here */}
        </div>
      </div>
    </section>
  );
};

export default Hero;
