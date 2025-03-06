import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ProfileForm from "@/components/profile/ProfileForm";
import ProfileStats from "@/components/profile/ProfileStats";
import ProfileActions from "@/components/profile/ProfileActions";
import ResponsiveSidebar from "@/components/profile/ResponsiveSidebar";
import { Profile } from "@/components/profile/ProfileTypes";
import ProfileCalorieGoals from "@/components/profile/ProfileCalorieGoals";
import { toast } from "sonner";

// Import all tab content components
import {
  SavedRecipesContent,
  ShoppingListContent,
  NutritionTrackerContent,
  MealPlansContent,
  MyRecipesContent,
  NotificationsContent,
  SettingsWrapper,
} from "@/components/profile/TabContents";

const ProfilePage: React.FC = () => {
  // Improved initial state with placeholders
  const [profile, setProfile] = useState<Profile>({
    fullName: "Loading...",
    username: "Loading...",
    email: "Loading...",
    dateOfBirth: "",
    gender: "Other",
    notifications: true,
    preferences: {
      language: "th",
      units: "metric",
      darkMode: false,
      emailNotifications: true,
      pushNotifications: true,
      newsletterSubscribed: false
    }
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading profile data
  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        // Mock API call - replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const userData: Profile = {
          fullName: "John Doe",
          username: "johndoe",
          email: "john.doe@example.com",
          dateOfBirth: "1990-01-01T00:00:00",
          gender: "Male",
          notifications: true,
          avatar: "/api/placeholder/150/150",
          preferences: {
            language: "en",
            units: "metric",
            darkMode: false,
            emailNotifications: true,
            pushNotifications: true,
            newsletterSubscribed: false
          }
        };
        
        setProfile(userData);
      } catch (error) {
        console.error("Failed to load profile data", error);
        toast.error({
          title: "Failed to load profile",
          description: "There was an error loading your profile data. Please try again later."
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, []);

  const handleProfileChange = (updatedProfile: Profile) => {
    setProfile(updatedProfile);
  };

  const handleSave = async () => {
    // Validate required fields
    if (!profile.fullName.trim()) {
      toast.error({
        title: "Validation Error",
        description: "Full name is required"
      });
      return;
    }
    
    if (!profile.email.trim()) {
      toast.error({
        title: "Validation Error",
        description: "Email is required"
      });
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profile.email)) {
      toast.error({
        title: "Validation Error",
        description: "Please enter a valid email address"
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Simulate API call - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success({
        title: "Profile Updated",
        description: "Your profile information has been successfully updated."
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save profile", error);
      toast.error({
        title: "Update Failed",
        description: "There was an error updating your profile. Please try again."
      });
    } finally {
      setIsSaving(false);
    }
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
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-8">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-500">Loading profile...</p>
          </div>
        ) : (
          <>
            <ProfileForm
              profile={profile}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              onProfileChange={handleProfileChange}
            />

            <ProfileStats />

            <ProfileActions
              profile={profile}
              handleSave={handleSave}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              isSaving={isSaving}
            />
          </>
        )}
      </motion.div>
    ),
    saved: <SavedRecipesContent />,
    shopping: <ShoppingListContent />,
    nutrition: <NutritionTrackerContent />,
    "meal-plans": <MealPlansContent />,
    recipes: <MyRecipesContent />,
    notifications: <NotificationsContent />,
    "calorie-goals": <ProfileCalorieGoals />,
    settings: <SettingsWrapper profile={profile} setProfile={setProfile} isEditable={isEditing} setIsEditable={setIsEditing} />,
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