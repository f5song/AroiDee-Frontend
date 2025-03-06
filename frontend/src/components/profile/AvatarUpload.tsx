import React, { useState, useRef } from "react";
import { Camera, CheckCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface AvatarUploadProps {
  currentAvatar?: string;
  username: string;
  onAvatarChange: (file: File) => void;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({ 
  currentAvatar, 
  username, 
  onAvatarChange 
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error({
        title: "Invalid file type",
        description: "Please select an image file"
      });
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error({
        title: "File too large",
        description: "Image size should be less than 5MB"
      });
      return;
    }
    
    // Preview the image
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  const cancelUpload = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };
  
  const confirmUpload = async () => {
    if (!previewUrl || !fileInputRef.current?.files?.[0]) return;
    
    try {
      setIsUploading(true);
      // Call the parent callback
      onAvatarChange(fileInputRef.current.files[0]);
      
      // Show success message
      toast.success({
        title: "Avatar updated",
        description: "Your profile picture has been updated successfully"
      });
      
      // Clear the file input but keep the preview
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      toast.error({
        title: "Update failed",
        description: "Failed to update profile picture. Please try again."
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  const avatarSrc = previewUrl || currentAvatar || "/api/placeholder/150/150";
  
  return (
    <div className="relative text-center flex flex-col items-center">
      <div 
        className="relative"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <img
          src={avatarSrc}
          alt={`${username || 'User'}'s avatar`}
          className="rounded-full w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 object-cover ring-4 ring-gray-300 shadow-md"
        />
        
        {/* Upload overlay */}
        {isHovering && !previewUrl && (
          <div 
            className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center cursor-pointer"
            onClick={triggerFileInput}
          >
            <Camera size={24} className="text-white" />
          </div>
        )}
        
        {/* Preview controls */}
        {previewUrl && (
          <div className="absolute -bottom-2 -right-2 flex space-x-1">
            <Button 
              size="sm" 
              className="rounded-full w-8 h-8 p-0 bg-red-500 hover:bg-red-600"
              onClick={cancelUpload}
              disabled={isUploading}
            >
              <X size={14} />
            </Button>
            <Button 
              size="sm" 
              className="rounded-full w-8 h-8 p-0 bg-green-500 hover:bg-green-600"
              onClick={confirmUpload}
              disabled={isUploading}
            >
              <CheckCircle size={14} />
            </Button>
          </div>
        )}
        
        {/* Uploading indicator */}
        {isUploading && (
          <div className="absolute inset-0 bg-black bg-opacity-30 rounded-full flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
      
      <h2 className="mt-3 text-lg sm:text-xl font-semibold text-gray-700">
        {username || "Username"}
      </h2>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={triggerFileInput}
        className="mt-2 text-sm text-gray-500"
        disabled={isUploading}
      >
        Change Photo
      </Button>
    </div>
  );
};

export default AvatarUpload;