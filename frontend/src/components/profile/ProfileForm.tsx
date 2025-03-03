import React, { ChangeEvent, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit, User, Mail, Calendar, VenetianMask, AlertCircle } from "lucide-react";
import { Profile } from "./ProfileTypes";
import AvatarUpload from "./AvatarUpload";

interface ProfileFormProps {
  profile: Profile;
  setProfile: (profile: Profile) => void;
  isEditable: boolean;
  setIsEditable: (editable: boolean) => void;
}

// Extended form errors interface
interface FormErrors {
  fullName?: string;
  email?: string;
  dateOfBirth?: string;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  profile,
  setProfile,
  isEditable,
  setIsEditable,
}) => {
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  
  const handleInputChange = (field: keyof Profile, value: string) => {
    setProfile({ ...profile, [field]: value });
    
    // Clear error when field is edited
    if (formErrors[field as keyof FormErrors]) {
      setFormErrors({
        ...formErrors,
        [field]: undefined,
      });
    }
  };
  
  const handleAvatarChange = (file: File) => {
    console.log("Avatar file:", file);
    // Here you would typically upload the file to your server
    // and update the profile with the new avatar URL
  };
  
  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    
    // Validate name
    if (!profile.fullName || profile.fullName.trim().length < 2) {
      errors.fullName = "Name must be at least 2 characters";
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!profile.email || !emailRegex.test(profile.email)) {
      errors.email = "Please enter a valid email address";
    }
    
    // Validate date of birth (optional)
    if (profile.dateOfBirth) {
      const dob = new Date(profile.dateOfBirth);
      const now = new Date();
      if (dob > now) {
        errors.dateOfBirth = "Date of birth cannot be in the future";
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
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
        currentAvatar={undefined} 
        onAvatarChange={handleAvatarChange} 
      />
      <ProfileFormFields 
        profile={profile} 
        handleInputChange={handleInputChange}
        isEditable={isEditable}
        setIsEditable={setIsEditable}
        formErrors={formErrors}
        validateForm={validateForm}
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
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  readOnly: boolean;
  error?: string;
}

// Individual form field component
const FormField: React.FC<FormFieldProps> = ({
  icon,
  type,
  placeholder,
  value,
  onChange,
  readOnly,
  error,
}) => (
  <div className="space-y-1">
    <div className={`flex items-center gap-2 bg-gray-50 p-3 rounded-md shadow-sm ${
      error ? "border border-red-300" : ""
    }`}>
      {icon}
      <Input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        className="h-8 text-sm border-0 focus-visible:ring-0 p-0 pl-1"
      />
    </div>
    {error && (
      <div className="flex items-center gap-1 text-xs text-red-500 pl-2">
        <AlertCircle size={12} />
        <span>{error}</span>
      </div>
    )}
  </div>
);

// Form fields container
interface ProfileFormFieldsProps {
  profile: Profile;
  handleInputChange: (field: keyof Profile, value: string) => void;
  isEditable: boolean;
  setIsEditable: (editable: boolean) => void;
  formErrors: FormErrors;
  validateForm: () => boolean;
}

const ProfileFormFields: React.FC<ProfileFormFieldsProps> = ({
  profile,
  handleInputChange,
  isEditable,
  setIsEditable,
  formErrors,
}) => {
  return (
    <div className="flex-grow space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
          User Profile
        </h1>
        {!isEditable && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditable(true)}
            className="p-2"
          >
            <Edit className="w-4 h-4 text-gray-600" />
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
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleInputChange("fullName", e.target.value)
          }
          readOnly={!isEditable}
          error={formErrors.fullName}
        />

        {/* Email */}
        <FormField
          icon={<Mail className="text-gray-500 w-4 h-4 flex-shrink-0" />}
          type="email"
          placeholder="Email"
          value={profile.email}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleInputChange("email", e.target.value)
          }
          readOnly={!isEditable}
          error={formErrors.email}
        />

        {/* Birth Date */}
        <FormField
          icon={<Calendar className="text-gray-500 w-4 h-4 flex-shrink-0" />}
          type="date"
          placeholder="Date of Birth"
          value={profile.dateOfBirth ? profile.dateOfBirth.split('T')[0] : ''}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleInputChange("dateOfBirth", e.target.value)
          }
          readOnly={!isEditable}
          error={formErrors.dateOfBirth}
        />

        {/* Gender Selection */}
        <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-md shadow-sm">
          <VenetianMask className="text-gray-500 w-4 h-4 flex-shrink-0" />
          <Select
            value={profile.gender}
            onValueChange={(value) =>
              handleInputChange("gender", value as "Male" | "Female" | "Other")
            }
            disabled={!isEditable}
          >
            <SelectTrigger className="w-full h-8 text-sm border-gray-300">
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