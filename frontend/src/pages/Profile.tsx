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
  const { token, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(true);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // ✅ ถ้าไม่ได้ล็อกอิน ให้ redirect ไปหน้า login
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // ✅ ดึงข้อมูลโปรไฟล์จาก Backend
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return;
      setIsLoading(true);
      try {
        const response = await axios.get(
          "https://aroi-dee-backend.vercel.app/api/users/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setProfile(response.data.user);
        setPreviewImage(response.data.user.image_url || null);
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

  const handleProfileChange = (updatedProfile: Profile) => {
    setProfile(updatedProfile);
  };

  // ✅ ฟังก์ชันอัปโหลดรูปภาพไปยัง Cloudinary
  const handleImageUpload = async () => {
    if (!newImage) return;

    const formData = new FormData();
    formData.append("file", newImage);
    formData.append("upload_preset", "your_upload_preset");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload",
        formData
      );

      const imageUrl = response.data.secure_url;
      setPreviewImage(imageUrl); // ✅ อัปเดตรูปที่แสดงใน UI
      setProfile((prevProfile) => prevProfile ? { ...prevProfile, image_url: imageUrl } : null);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  // ✅ ฟังก์ชันอัปเดตข้อมูลโปรไฟล์
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
        "https://aroi-dee-backend.vercel.app/api/users/profile",
        {
          username: profile.username,
          email: profile.email,
          image_url: previewImage, // ✅ อัปเดตรูปภาพโปรไฟล์
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
          <>
            {/* ✅ แสดงรูปโปรไฟล์ */}
            {previewImage && (
              <div className="flex justify-center mb-6">
                <img
                  src={previewImage}
                  alt="User Profile"
                  className="w-32 h-32 rounded-full border-4 border-gray-300 shadow-md"
                />
              </div>
            )}

            {/* ✅ ฟอร์มแก้ไขข้อมูล */}
            <ProfileForm
              profile={profile}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              isSaving={isSaving}
              handleSave={handleSave}
              onProfileChange={handleProfileChange}
            />

            {/* ✅ อัปโหลดรูปภาพ */}
            {isEditing && (
              <div className="flex flex-col items-center mt-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setNewImage(e.target.files[0]);
                      setPreviewImage(URL.createObjectURL(e.target.files[0]));
                    }
                  }}
                  className="mt-3"
                />
                <button
                  onClick={handleImageUpload}
                  className="bg-blue-500 text-white px-4 py-2 rounded mt-3"
                >
                  Upload Image
                </button>
              </div>
            )}
          </>
        ) : (
          <p className="text-center text-red-500">Failed to load profile.</p>
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
