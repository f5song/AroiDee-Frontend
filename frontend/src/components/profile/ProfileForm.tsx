import React from "react";
import { motion } from "framer-motion";
import { User, Mail, MapPin} from "lucide-react";
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
  profile
}) => {
  const handleAvatarChange = (file: File) => {
    console.log("Avatar file:", file);
    // Here you would typically upload the file to your server
    // and update the profile with the new avatar URL
  };

  return (
    <motion.div
      className="w-full max-w-4xl mx-auto px-4 sm:px-6 md:px-0"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="shadow-sm border overflow-hidden bg-white">
        {/* Simple Header */}
        <div className="h-20 sm:h-24 bg-gray-50 border-b relative">
          {/* Profile Stats - Removed Recipes badge and Join date */}
          <div className="absolute bottom-0 right-0 p-2 sm:p-4 flex gap-2 sm:gap-3 flex-wrap justify-end">
            {/* Badges removed as requested */}
          </div>
        </div>
        
        <div className="px-4 sm:px-6 pb-6">
          {/* Avatar and Name section - Center everything */}
          <div className="flex flex-col items-center -mt-12 mb-6">
            <div className="z-10">
              <AvatarUpload 
                username={profile.username} 
                currentAvatar={profile.avatar} 
                onAvatarChange={handleAvatarChange}
              />
            </div>
            <div className="mt-4 space-y-1 text-center">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">{profile.fullName}</h1>
              <p className="text-gray-500 flex items-center justify-center">
                <MapPin className="h-3 w-3 mr-1" /> 
              </p>
            </div>
          </div>

          {/* Main content */}
          <div className="space-y-6">
            {/* Personal Info */}
            <Card className="border bg-white shadow-sm">
              <CardHeader className="pb-2 pt-4 px-4 sm:px-6">
                <CardTitle className="text-md sm:text-lg flex items-center justify-center">
                  <User className="h-4 w-4 mr-2 text-gray-500" /> Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 sm:px-6">
                <div className="grid grid-cols-1 gap-y-4 gap-x-6">
                  <ProfileField 
                    icon={<Mail className="text-gray-500" />} 
                    label="Email" 
                    value={profile.email} 
                    centered={true}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};



// Profile field component - Updated to support centered layout
interface ProfileFieldProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  centered?: boolean;
}

const ProfileField: React.FC<ProfileFieldProps> = ({ icon, label, value, centered = false }) => (
  <div className={`flex flex-col space-y-1 ${centered ? 'items-center text-center' : ''}`}>
    <span className="text-sm text-gray-500">{label}</span>
    <div className="flex items-center gap-2">
      {React.cloneElement(icon as React.ReactElement, { className: "h-4 w-4 text-gray-500" })}
      <span className="text-sm sm:text-base text-gray-800 break-words">{value}</span>
    </div>
  </div>
);

export default ProfileForm;