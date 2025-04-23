import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ProfileForm from "@/components/profile/ProfileForm";
import ResponsiveSidebar from "@/components/profile/ResponsiveSidebar";
import { Profile } from "@/components/profile/ProfileTypes";
import ProfileCalorieGoals from "@/components/profile/ProfileCalorieGoals";
import { toast } from "sonner";
import { useAuth } from "@/components/auth/AuthContext";

const API_URL =
  import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL.trim() !== ""
    ? import.meta.env.VITE_API_URL
    : "https://aroi-dee-backend.vercel.app"; // Default URL ถ้าไม่มีค่าใน .en

// Import all tab content components
import {
  SavedRecipesContent,
  NutritionTrackerContent,
  MealPlansContent,
  MyRecipesContent,
  NotificationsContent,
  SettingsWrapper,
} from "@/components/profile/TabContents";

const ProfilePage: React.FC = () => {
  const { token, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(true);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Fetch profile data from backend
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return;
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${API_URL}/api/users/profile`,
          
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setProfile(response.data.user);
      } catch (error) {
        console.error("Failed to load profile data", error);
        toast.error("Failed to load profile", {
          description:
            "There was an error loading your profile data. Please try again later.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  // Handle direct profile data changes
  const handleProfileChange = (updatedProfile: Profile) => {
    setProfile(updatedProfile);
  };

  // Handle avatar upload
  const handleAvatarChange = async (file: File) => {
    if (!file || !profile) return;
    
    setIsSaving(true);
    
    try {
      // Create FormData object for the file upload
      const formData = new FormData();
      formData.append("avatar", file);
      
      // Upload to your backend API
      const response = await axios.post(
        `${API_URL}/api/users/upload-avatar`,
        formData,
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          } 
        }
      );
      
      if (response.data.success) {
        // Update the profile with the new image URL
        const imageUrl = response.data.imageUrl;
        
        // Update local state
        setProfile({
          ...profile,
          image_url: imageUrl
        });
        
        toast.success("Profile picture updated", {
          description: "Your avatar has been updated successfully."
        });
      } else {
        throw new Error("Failed to upload avatar");
      }
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error("Upload failed", {
        description: "There was an error uploading your profile picture. Please try again."
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Save profile changes to backend
  const handleSave = async () => {
    if (!profile) return;

    if (!profile.username.trim() || !profile.email.trim()) {
      toast.error("Validation Error", {
        description: "Username and Email are required",
      });
      return;
    }

    setIsSaving(true);

    try {
      const response = await axios.put(
        `${API_URL}/api/users/profile`,
        {
          username: profile.username,
          email: profile.email,
          image_url: profile.image_url,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setProfile(response.data.user);
      toast.success("Profile Updated", {
        description: "Your profile information has been successfully updated.",
      });

      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save profile", error);
      toast.error("Update Failed", {
        description:
          "There was an error updating your profile. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const tabComponents = {
    profile: (
      <motion.div
        className="w-full max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-8">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-500">Loading profile...</p>
          </div>
        ) : profile ? (
          <ProfileForm
            profile={profile}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            isSaving={isSaving}
            handleSave={handleSave}
            onProfileChange={handleProfileChange}
            onAvatarChange={handleAvatarChange}
          />
        ) : (
          <p className="text-center text-red-500">Failed to load profile.</p>
        )}
      </motion.div>
    ),
    saved: <SavedRecipesContent />,
    nutrition: <NutritionTrackerContent />,
    "meal-plans": <MealPlansContent />,
    recipes: <MyRecipesContent />,
    notifications: <NotificationsContent />,
    "calorie-goals": <ProfileCalorieGoals />,
    settings: profile ? (
      <SettingsWrapper
        profile={profile}
        setProfile={setProfile}
        isEditable={isEditing}
        setIsEditable={setIsEditing}
      />
    ) : null,
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-64 flex-shrink-0">
            <ResponsiveSidebar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </div>

          <div className="flex-grow">
            {tabComponents[activeTab as keyof typeof tabComponents] || null}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;