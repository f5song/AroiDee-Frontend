import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const API_URL = "https://aroi-dee-backend.vercel.app/api";

interface FavoritesContextProps {
  favorites: number[];
  isLoadingFavorites: boolean;
  isProcessing: Record<number, boolean>;
  toggleFavorite: (recipeId: number) => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextProps | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isProcessing, setIsProcessing] = useState<Record<number, boolean>>({});
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(true);

  // ✅ ฟังก์ชันโหลดรายการ Favorites จาก API (ตรวจสอบจาก database)
  const fetchFavorites = async () => {
    if (!user) return;
    setIsLoadingFavorites(true); // ✅ ตั้งค่าเป็นกำลังโหลด

    try {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      const response = await axios.get(`${API_URL}/saved-recipes/${user.id}/saved-recipes`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setFavorites(response.data.savedRecipeIds || []); // ✅ อัปเดต Favorites ตาม database
      }
    } catch (error) {
      console.error("❌ Error fetching saved recipes:", error);
    } finally {
      setIsLoadingFavorites(false); // ✅ โหลดเสร็จแล้ว
    }
  };

  // ✅ โหลด Favorites เมื่อผู้ใช้ล็อกอิน
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

      const response = await axios.post(
        url,
        { user_id: user.id, recipe_id: recipeId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        // ✅ อัปเดต UI ทันที และโหลดข้อมูลใหม่จาก API
        fetchFavorites();
      } else {
        console.error("❌ API error:", response.data.message);
        fetchFavorites(); // ✅ โหลดใหม่ถ้า API error
      }
    } catch (error) {
      console.error("❌ Error toggling favorite:", error);
      fetchFavorites(); // ✅ โหลดใหม่ถ้าพบข้อผิดพลาด
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
    <FavoritesContext.Provider value={{ favorites, isLoadingFavorites, isProcessing, toggleFavorite }}>
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
