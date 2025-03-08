import { createContext, useContext, useState, useEffect } from "react";
import { saveRecipe, unsaveRecipe } from "@/lib/recipes/api";
import { useAuth } from "@/components/auth/AuthContext";

const FavoritesContext = createContext<any>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isProcessing, setIsProcessing] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (!user) return;
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) return;

        const response = await fetch(
          `https://aroi-dee-backend.vercel.app/api/saved-recipes/${user.id}/saved-recipes`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await response.json();
        if (data.success) {
          setFavorites(data.savedRecipeIds || []);
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
      if (favorites.includes(recipeId)) {
        await unsaveRecipe(user.id, recipeId);
        setFavorites((prev) => prev.filter((id) => id !== recipeId));
      } else {
        await saveRecipe(user.id, recipeId);
        setFavorites((prev) => [...prev, recipeId]);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
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
}

export function useFavorites() {
  return useContext(FavoritesContext);
}
