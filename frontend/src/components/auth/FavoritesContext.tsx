import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const API_URL = "https://aroi-dee-backend.vercel.app/api";

interface FavoritesContextProps {
  favorites: number[];
  isProcessing: Record<number, boolean>;
  toggleFavorite: (recipeId: number) => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextProps | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isProcessing, setIsProcessing] = useState<Record<number, boolean>>({});

  // ✅ ฟังก์ชันโหลดรายการ Favorites
  const fetchFavorites = async () => {
    if (!user) return;
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      const response = await axios.get(`${API_URL}/saved-recipes/${user.id}/saved-recipes`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setFavorites(response.data.savedRecipeIds || []);
      }
    } catch (error) {
      console.error("❌ Error fetching saved recipes:", error);
    }
  };

  // ✅ โหลดรายการ Favorites ทันทีเมื่อผู้ใช้เข้าสู่ระบบ หรือ Favorites มีการเปลี่ยนแปลง
  useEffect(() => {
    fetchFavorites();
  }, [user]);

  const toggleFavorite = async (recipeId: number) => {
    if (!user) return;
    if (isProcessing[recipeId]) return;

    setIsProcessing((prev) => ({ ...prev, [recipeId]: true }));

    try {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      const isFavorite = favorites.includes(recipeId);
      const url = isFavorite
        ? `${API_URL}/saved-recipes/unsave-recipe`
        : `${API_URL}/saved-recipes/save-recipe`;

      // ✅ อัปเดต UI ทันทีที่กดปุ่ม ก่อนส่ง API
      setFavorites((prev) =>
        isFavorite ? prev.filter((id) => id !== recipeId) : [...prev, recipeId]
      );

      const response = await axios.post(
        url,
        { user_id: user.id, recipe_id: recipeId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!response.data.success) {
        console.error("❌ API error:", response.data.message);
        fetchFavorites(); // ✅ รีโหลด Favorites ถ้า API error
      }
    } catch (error) {
      console.error("❌ Error toggling favorite:", error);
      fetchFavorites(); // ✅ รีโหลด Favorites ถ้ามีข้อผิดพลาด
    } finally {
      setTimeout(() => {
        setIsProcessing((prev) => {
          const newProcessing = { ...prev };
          delete newProcessing[recipeId];
          return newProcessing;
        });
      }, 500);
    }
  };

  return (
    <FavoritesContext.Provider value={{ favorites, isProcessing, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};
