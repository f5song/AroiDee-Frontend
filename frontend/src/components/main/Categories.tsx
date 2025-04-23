import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL.trim() !== ""
    ? import.meta.env.VITE_API_URL
    : "https://aroi-dee-backend.vercel.app";

// Motion variants
const categoryVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.4,
      ease: "easeOut",
    },
  }),
  hover: {
    y: -5,
    transition: { duration: 0.2 },
  },
};

const Categories = () => {
  const [categories, setCategories] = useState<
    { id: number; name: string; image_url?: string }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get(`${API_URL}/api/categories`, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data.success) {
          setCategories(response.data.data); // ✅ ตรวจสอบว่า API คืนค่า success=true
        } else {
          setError("Failed to load categories.");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        setError("Failed to load categories.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section className="container mx-auto py-8 px-4">
        <motion.h3
          className="text-3xl font-bold text-gray-800 mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Categories
        </motion.h3>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 justify-items-center">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="flex flex-col items-center animate-pulse"
              variants={categoryVariants}
              custom={i}
              initial="hidden"
              animate="visible"
            >
              <div className="w-24 h-24 rounded-full bg-gray-300 mb-2 shadow-md" />
              <div className="w-16 h-4 bg-gray-300 rounded" />
            </motion.div>
          ))}
        </div>
      </section>
    );
  }

  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <section className="container mx-auto py-8 px-4">
      {/* Section Title */}
      <motion.h3
        className="text-3xl font-bold text-gray-800 mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Categories
      </motion.h3>

      {/* Category Grid */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-4 justify-items-center">
        {categories.map((category, i) => (
          <motion.div
            key={category.id}
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
                src={category.image_url || "/default-category.png"} // ✅ ใช้ภาพ fallback
                alt={category.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Category Name */}
            <span className="text-sm font-medium text-center">
              {category.name}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Categories;
