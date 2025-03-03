import React from "react";
import { motion } from "framer-motion";

// Updated categories with food images
const categories = [
  { 
    name: "Pasta", 
    image: "/api/placeholder/120/120",
    alt: "Pasta dish with noodles"
  },
  { 
    name: "Pizza", 
    image: "/api/placeholder/120/120",
    alt: "Pizza with vegetables"
  },
  { 
    name: "Vegan", 
    image: "/api/placeholder/120/120",
    alt: "Vegan salad bowl"
  },
  { 
    name: "Desserts", 
    image: "/api/placeholder/120/120",
    alt: "Sweet desserts"
  },
  { 
    name: "Smoothies", 
    image: "/api/placeholder/120/120",
    alt: "Fruit smoothie"
  },
  { 
    name: "Breakfast", 
    image: "/api/placeholder/120/120",
    alt: "Breakfast bowl"
  },
];

// Motion variants
const categoryVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({ 
    opacity: 1, 
    y: 0, 
    transition: { 
      delay: i * 0.1,
      duration: 0.4, 
      ease: "easeOut" 
    } 
  }),
  hover: { 
    y: -5,
    transition: { duration: 0.2 } 
  },
};

const Categories = () => {
  return (
    <section className="container mx-auto py-8 px-4">
      {/* Section Title */}
      <motion.h3
        className="text-3xl font-bold text-gray-800 mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Popular Categories
      </motion.h3>

      {/* Category Grid */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-4 justify-items-center">
        {categories.map((category, i) => (
          <motion.div
            key={category.name}
            className="flex flex-col items-center cursor-pointer"
            variants={categoryVariants}
            custom={i}
            initial="hidden"
            animate="visible"
            whileHover="hover"
          >
            {/* Circular Image */}
            <div className="w-24 h-24 rounded-full overflow-hidden mb-2 shadow-md">
              <img 
                src={category.image} 
                alt={category.alt} 
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Category Name */}
            <span className="text-sm font-medium text-center">{category.name}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Categories;