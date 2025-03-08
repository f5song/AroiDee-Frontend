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

  useEffect(() => {
    if (!user) return;

    const fetchFavorites = async () => {
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

    fetchFavorites();
  }, [user]);

  const toggleFavorite = async (recipeId: number) => {
    if (!user) return;
    if (isProcessing[recipeId]) return;

    setIsProcessing((prev) => ({ ...prev, [recipeId]: true }));

    try {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      const url = favorites.includes(recipeId)
        ? `${API_URL}/saved-recipes/unsave-recipe`
        : `${API_URL}/saved-recipes/save-recipe`;

      const response = await axios.post(
        url,
        { user_id: user.id, recipe_id: recipeId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setFavorites((prev) =>
          favorites.includes(recipeId) ? prev.filter((id) => id !== recipeId) : [...prev, recipeId]
        );
      }
    } catch (error) {
      console.error("❌ Error toggling favorite:", error);
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
