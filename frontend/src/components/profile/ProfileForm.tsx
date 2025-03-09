import React from "react";
import { motion } from "framer-motion";
import { User, Mail, MapPin } from "lucide-react";
import { Profile } from "./ProfileTypes";
import AvatarUpload from "./AvatarUpload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProfileFormProps {
  profile: Profile;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  isSaving: boolean;
  handleSave: () => Promise<void>;
  onProfileChange: (updatedProfile: Profile) => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  profile,
  onProfileChange,
}) => {
  const handleAvatarChange = async (file: File) => {
    console.log("Avatar file:", file);

    // ✅ Upload image to backend (you need to implement this API)
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const response = await fetch(
        "https://aroi-dee-backend.vercel.app/api/users/upload-avatar",
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`, // ✅ ดึง Token จาก LocalStorage
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        onProfileChange({ ...profile, image_url: data.imageUrl }); // ✅ อัปเดตค่า `image_url`
      }
    } catch (error) {
      console.error("Failed to upload avatar", error);
    }
  };

  return (
    <motion.div
      className="w-full max-w-4xl mx-auto px-4 sm:px-6 md:px-0"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="shadow-sm border overflow-hidden bg-white">
        {/* Header */}
        <div className="h-20 sm:h-24 bg-gray-50 border-b relative"></div>

        <div className="px-4 sm:px-6 pb-6">
          {/* Avatar and Name */}
          <div className="flex flex-col items-center -mt-12 mb-6">
            <div className="z-10">
              <AvatarUpload
                username={profile.username}
                currentAvatar={profile.image_url || "/default-avatar.png"} // ✅ ใช้ image_url จาก Profile type ที่แก้ไขแล้ว
                onAvatarChange={handleAvatarChange}
              />
            </div>
            <div className="mt-4 space-y-1 text-center">
              <p className="text-gray-500 flex items-center justify-center">
                <MapPin className="h-3 w-3 mr-1" />{" "}
                {/* สามารถเพิ่ม location ได้ถ้ามีข้อมูล */}
              </p>
            </div>
          </div>

          {/* Personal Info */}
          <Card className="border bg-white shadow-sm">
            <CardHeader className="pb-2 pt-4 px-4 sm:px-6">
              <CardTitle className="text-md sm:text-lg flex items-center justify-center">
                <User className="h-4 w-4 mr-2 text-gray-500" /> Personal
                Information
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <ProfileField
                icon={<Mail className="text-gray-500" />}
                label="Email"
                value={profile.email}
                centered
              />
            </CardContent>
          </Card>
        </div>
      </Card>
    </motion.div>
  );
};

// Profile Field Component
interface ProfileFieldProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  centered?: boolean;
}

const ProfileField: React.FC<ProfileFieldProps> = ({
  icon,
  label,
  value,
  centered = false,
}) => (
  <div
    className={`flex flex-col space-y-1 ${
      centered ? "items-center text-center" : ""
    }`}
  >
    <span className="text-sm text-gray-500">{label}</span>
    <div className="flex items-center gap-2">
      {React.cloneElement(icon as React.ReactElement, {
        className: "h-4 w-4 text-gray-500",
      })}
      <span className="text-sm sm:text-base text-gray-800 break-words">
        {value}
      </span>
    </div>
  </div>
);

export default ProfileForm;
