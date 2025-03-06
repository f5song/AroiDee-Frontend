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
import { User, Mail, Calendar, VenetianMask, Edit } from "lucide-react";
import { Profile } from "./ProfileTypes";
import AvatarUpload from "./AvatarUpload";
import { Button } from "@/components/ui/button";

interface ProfileFormProps {
  profile: Profile;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  onProfileChange: (updatedProfile: Profile) => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  profile,
  isEditing,
  setIsEditing,
  onProfileChange
}) => {
  const handleAvatarChange = (file: File) => {
    console.log("Avatar file:", file);
    // Here you would typically upload the file to your server
    // and update the profile with the new avatar URL
  };

  const handleInputChange = (field: keyof Profile, value: string) => {
    onProfileChange({
      ...profile,
      [field]: value
    });
  };

  return (
    <motion.div
      className="flex flex-col md:flex-row gap-6 md:gap-8"
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
    >
      <AvatarUpload 
        username={profile.username} 
        currentAvatar={profile.avatar} 
        onAvatarChange={handleAvatarChange} 
      />
      <ProfileFormFields 
        profile={profile} 
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        onInputChange={handleInputChange}
      />
    </motion.div>
  );
};

// Form field props
interface FormFieldProps {
  icon: React.ReactNode;
  type: string;
  placeholder: string;
  value: string;
  onChange?: (value: string) => void;
  readOnly: boolean;
}

// Individual form field component
const FormField: React.FC<FormFieldProps> = ({
  icon,
  type,
  placeholder,
  value,
  onChange,
  readOnly,
}) => (
  <div className="space-y-1">
    <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-md shadow-sm">
      {icon}
      <Input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        readOnly={readOnly}
        className={`h-8 text-sm p-0 pl-1 ${readOnly ? 'border-0 focus-visible:ring-0' : 'border-gray-300'}`}
      />
    </div>
  </div>
);

// Form fields container
interface ProfileFormFieldsProps {
  profile: Profile;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  onInputChange: (field: keyof Profile, value: string) => void;
}

const ProfileFormFields: React.FC<ProfileFormFieldsProps> = ({
  profile,
  isEditing,
  setIsEditing,
  onInputChange
}) => {
  return (
    <div className="flex-grow space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
          User Profile
        </h1>
        
        {!isEditing && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1"
          >
            <Edit className="h-4 w-4" /> Edit Profile
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Full Name */}
        <FormField
          icon={<User className="text-gray-500 w-4 h-4 flex-shrink-0" />}
          type="text"
          placeholder="Full Name"
          value={profile.fullName}
          onChange={isEditing ? (value) => onInputChange('fullName', value) : undefined}
          readOnly={!isEditing}
        />

        {/* Email */}
        <FormField
          icon={<Mail className="text-gray-500 w-4 h-4 flex-shrink-0" />}
          type="email"
          placeholder="Email"
          value={profile.email}
          onChange={isEditing ? (value) => onInputChange('email', value) : undefined}
          readOnly={!isEditing}
        />

        {/* Birth Date */}
        <FormField
          icon={<Calendar className="text-gray-500 w-4 h-4 flex-shrink-0" />}
          type="date"
          placeholder="Date of Birth"
          value={profile.dateOfBirth ? profile.dateOfBirth.split('T')[0] : ''}
          onChange={isEditing ? (value) => onInputChange('dateOfBirth', value) : undefined}
          readOnly={!isEditing}
        />

        {/* Gender Selection */}
        <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-md shadow-sm">
          <VenetianMask className="text-gray-500 w-4 h-4 flex-shrink-0" />
          <Select
            value={profile.gender}
            disabled={!isEditing}
            onValueChange={isEditing ? (value) => onInputChange('gender', value) : undefined}
          >
            <SelectTrigger className={`w-full h-8 text-sm ${!isEditing ? 'border-0' : 'border-gray-300'}`}>
              <SelectValue>{profile.gender || "Select Gender"}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;