import Notifications from "./Notifications";
import SettingsContent from "./SettingsContent";
import { Profile } from "./ProfileTypes";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import RecipeCard from "@/components/common/RecipeCard";

const API_URL =
  import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL.trim() !== ""
    ? import.meta.env.VITE_API_URL
    : "https://aroi-dee-backend.vercel.app";


interface SavedRecipe {
  recipe_id: number;
  title: string;
  image_url: string;
  cook_time: number;
  rating: number;
}

// Common component for empty state tab content
interface TabContentProps {
  title: string;
  message: string;
}

const TabContent: React.FC<TabContentProps> = ({ title, message }) => (
  <div className="p-6 bg-white rounded-xl shadow-lg">
    <h2 className="text-2xl font-bold mb-4">{title}</h2>
    <p>{message}</p>
  </div>
);

// Updated SavedRecipesContent
export const SavedRecipesContent: React.FC = () => {
  const { user } = useAuth();
  const { favorites, toggleFavorite, isProcessing } = useFavorites();
  const [savedRecipes, setSavedRecipes] = useState<SavedRecipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSavedRecipes = async () => {
    try {
      if (!user?.id) return;
      console.log("Fetching saved recipes for user:", user.id); // log user ID

      const response = await axios.get(`${API_URL}/api/saved-recipes/${user.id}/saved-recipes`);
      console.log("API response:", response.data); // log API response
      if (response.data.success) {
        // Filter saved recipes based on the favorites
        const saved = response.data.savedRecipes.filter((recipe: any) =>
          favorites.includes(recipe.recipe_id)
        );
        console.log("Filtered saved recipes:", saved); // log filtered recipes
        setSavedRecipes(saved);
      }
    } catch (error) {
      console.error("Error fetching saved recipes", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedRecipes();
  }, [user, favorites]); // Triggered by user or favorites change

  const handleUnfavorite = async (recipeId: number) => {
    await toggleFavorite(recipeId);
    // Refresh the saved recipes after unfavoriting
    fetchSavedRecipes();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (savedRecipes.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-8">
        You haven't saved any recipes yet.
      </div>
    );
  }

  console.log("Displaying saved recipes:", savedRecipes); // log the saved recipes being displayed

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {savedRecipes.map((recipe) => (
        <RecipeCard
          key={recipe.recipe_id}
          recipe={{
            id: recipe.recipe_id,
            title: recipe.title,
            description: "",
            calories: 0,
            cook_time: recipe.cook_time,
            image_url: recipe.image_url,
            rating: recipe.rating,
            difficulty: "Easy",
            categories: [],
          }}
          isFavorite={true}
          isProcessing={isProcessing[recipe.recipe_id] ?? false}
          onFavoriteToggle={() => handleUnfavorite(recipe.recipe_id)}
        />
      ))}
    </div>
  );
};

export const NutritionTrackerContent: React.FC = () => (
  <TabContent
    title="Nutrition Tracker"
    message="Start tracking your nutrition goals here."
  />
);

export const MealPlansContent: React.FC = () => (
  <TabContent
    title="Meal Plans"
    message="Create and view your meal plans here."
  />
);

export const MyRecipesContent: React.FC = () => (
  <TabContent
    title="My Recipes"
    message="You haven't created any recipes yet."
  />
);

// Updated Notifications content with active notifications
export const NotificationsContent: React.FC = () => {
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      title: "Profile Updated",
      message: "Your profile information has been successfully updated.",
      time: "2 hours ago",
      type: "success" as const,
    },
    {
      id: "2",
      title: "New Recipe Added",
      message: "A new recipe matching your preferences has been added.",
      time: "Yesterday",
      type: "info" as const,
    },
    {
      id: "3",
      title: "Subscription Expiring",
      message: "Your premium subscription will expire in 3 days.",
      time: "3 days ago",
      type: "warning" as const,
    },
  ]);

  const dismissNotification = (id: string) => {
    setNotifications(
      notifications.filter((notification) => notification.id !== id)
    );
  };

  if (notifications.length === 0) {
    return (
      <TabContent
        title="Notifications"
        message="You have no new notifications."
      />
    );
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Notifications</h2>
      <Notifications
        notifications={notifications}
        onDismiss={dismissNotification}
      />
    </div>
  );
};

// เปลี่ยนชื่อ component เพื่อไม่ให้ซ้ำกับการนำเข้า
interface SettingsProps {
  profile: Profile;
  setProfile: (profile: Profile) => void;
  isEditable: boolean;
  setIsEditable: (isEditable: boolean) => void;
}

// เปลี่ยนชื่อจาก SettingsContent เป็น SettingsWrapper เพื่อไม่ให้ซ้ำกับการ import
export const SettingsWrapper: React.FC<SettingsProps> = ({
  profile,
  setProfile,
  isEditable,
  setIsEditable,
}) => (
  <SettingsContent
    profile={profile}
    setProfile={setProfile}
    isEditable={isEditable}
    setIsEditable={setIsEditable}
  />
);
