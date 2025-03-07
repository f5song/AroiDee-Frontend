import React from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, Mail, Calendar, MapPin, Globe, Clock, Users } from "lucide-react";
import { Profile } from "./ProfileTypes";
import AvatarUpload from "./AvatarUpload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProfileFormProps {
  profile: Profile;
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
          {/* Avatar and Name section */}
          <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-12 mb-6">
            <div className="z-10">
              <AvatarUpload 
                username={profile.username} 
                currentAvatar={profile.avatar} 
                onAvatarChange={handleAvatarChange}
              />
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-4 space-y-1 text-center sm:text-left">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">{profile.fullName}</h1>
              <p className="text-gray-500 flex items-center justify-center sm:justify-start">
                <MapPin className="h-3 w-3 mr-1" /> 
                {profile.location || "No location set"}
              </p>
            </div>
          </div>

          {/* Main content */}
          <div className="space-y-6">
            {/* Personal Info */}
            <Card className="border bg-white shadow-sm">
              <CardHeader className="pb-2 pt-4 px-4 sm:px-6">
                <CardTitle className="text-md sm:text-lg flex items-center">
                  <User className="h-4 w-4 mr-2 text-gray-500" /> Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 sm:px-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                  <ProfileField 
                    icon={<Mail className="text-gray-500" />} 
                    label="Email" 
                    value={profile.email} 
                  />
                  <ProfileField 
                    icon={<Calendar className="text-gray-500" />} 
                    label="Date of Birth" 
                    value={profile.dateOfBirth ? formatDate(profile.dateOfBirth) : "Not provided"} 
                  />
                  <ProfileField 
                    icon={<Users className="text-gray-500" />} 
                    label="Gender" 
                    value={profile.gender || "Not specified"} 
                  />
                  <ProfileField 
                    icon={<Clock className="text-gray-500" />} 
                    label="Cooking Experience" 
                    value={profile.cookingExperience || "Intermediate"} 
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

// Format date function
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  }).format(date);
};

// Profile field component
interface ProfileFieldProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const ProfileField: React.FC<ProfileFieldProps> = ({ icon, label, value }) => (
  <div className="flex flex-col space-y-1">
    <span className="text-sm text-gray-500">{label}</span>
    <div className="flex items-center gap-2">
      {React.cloneElement(icon as React.ReactElement, { className: "h-4 w-4 text-gray-500" })}
      <span className="text-sm sm:text-base text-gray-800 break-words">{value}</span>
    </div>
  </div>
);

export default ProfileForm;