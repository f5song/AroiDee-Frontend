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

  // ✅ โหลดรายการ Favorites จาก API
  const fetchFavorites = async () => {
    if (!user) return;
    setIsLoadingFavorites(true);

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("❌ No auth token found.");
        return;
      }

      console.log("📌 Fetching favorites...");

      const response = await axios.get(`${API_URL}/saved-recipes/${user.id}/saved-recipes`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("✅ API Response:", response.data);

      if (response.data.success) {
        const savedRecipeIds = response.data.savedRecipes.map((r: any) => r.id);
        setFavorites(savedRecipeIds);
        console.log("✅ Updated favorites:", savedRecipeIds);
      }
    } catch (error) {
      console.error("❌ Error fetching saved recipes:", error);
    } finally {
      setIsLoadingFavorites(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [user]);

  const toggleFavorite = async (recipeId: number) => {
    if (!user || isProcessing[recipeId]) return;

    setIsProcessing((prev) => ({ ...prev, [recipeId]: true }));

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("❌ No authentication token found.");
        return;
      }

      if (!recipeId) {
        console.error("❌ Recipe ID is missing!");
        return;
      }

      const isCurrentlyFavorite = favorites.includes(recipeId);
      const url = isCurrentlyFavorite
        ? `${API_URL}/saved-recipes/unsave-recipe`
        : `${API_URL}/saved-recipes/save-recipe`;

      console.log(`📌 Sending request to ${url} for recipe ID: ${recipeId}`);

      const response = await axios.post(
        url,
        { user_id: user.id, recipe_id: recipeId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("✅ API Response:", response.data);

      if (!response.data.success) {
        console.error("❌ API error:", response.data.message);
        fetchFavorites(); // โหลดใหม่ถ้า API มีปัญหา
      } else {
        // ✅ อัปเดต Favorites โดยตรง
        setFavorites((prev) =>
          isCurrentlyFavorite
            ? prev.filter((id) => id !== recipeId) // ลบออก
            : [...prev, recipeId] // เพิ่มเข้า
        );
      }
    } catch (error) {
      console.error("❌ Error toggling favorite:", error);
      fetchFavorites(); // โหลดใหม่จาก database ถ้ามีปัญหา
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
