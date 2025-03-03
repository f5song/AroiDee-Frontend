// UPDATED Profile.tsx - Using only ResponsiveSidebar
import React, { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/navigation";
import Footer from "@/components/footer";
import ProfileForm from "@/components/profile/ProfileForm";
import ProfileStats from "@/components/profile/ProfileStats"; // Using original ProfileStats
import ProfileActions from "@/components/profile/ProfileActions";
import ResponsiveSidebar from "@/components/profile/ResponsiveSidebar";
import { Profile } from "@/components/profile/ProfileTypes";

// Import all tab content components
import {
  SavedRecipesContent,
  ShoppingListContent,
  NutritionTrackerContent,
  MealPlansContent,
  MyRecipesContent,
  NotificationsContent,
  SettingsContent,
} from "@/components/profile/TabContents";

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<Profile>({
    fullName: "",
    username: "",
    email: "",
    dateOfBirth: "",
    gender: "Other",
    notifications: true,
  });

  const [isEditable, setIsEditable] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  const handleSave = () => {
    console.log("Saving profile", profile);
    // Here you would typically make an API call to save the profile
    setIsEditable(false);
  };

  // Map of tab IDs to their content components
  const tabComponents = {
    profile: (
      <motion.div
        className="w-full bg-white border border-gray-200 shadow-lg rounded-xl px-8 py-10 space-y-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <ProfileForm
          profile={profile}
          setProfile={setProfile}
          isEditable={isEditable}
          setIsEditable={setIsEditable}
        />

        <ProfileStats />

        <ProfileActions
          profile={profile}
          handleSave={handleSave}
          isEditable={isEditable}
        />
      </motion.div>
    ),
    saved: <SavedRecipesContent />,
    shopping: <ShoppingListContent />,
    nutrition: <NutritionTrackerContent />,
    "meal-plans": <MealPlansContent />,
    recipes: <MyRecipesContent />,
    notifications: <NotificationsContent />,
    settings: <SettingsContent />,
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Use only ResponsiveSidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <ResponsiveSidebar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </div>

          {/* Main Content */}
          <div className="flex-grow">
            {tabComponents[activeTab as keyof typeof tabComponents] || null}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
