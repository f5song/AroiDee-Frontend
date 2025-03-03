import React, { useState, useRef } from "react";
import { Camera, CheckCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Preview the image
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    // Call the parent callback
    onAvatarChange(file);
  };
  
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  const cancelUpload = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };
  
  const avatarSrc = previewUrl || currentAvatar || "https://via.placeholder.com/150";
  
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
        {isHovering && (
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
            >
              <X size={14} />
            </Button>
            <Button 
              size="sm" 
              className="rounded-full w-8 h-8 p-0 bg-green-500 hover:bg-green-600"
            >
              <CheckCircle size={14} />
            </Button>
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
      >
        Change Photo
      </Button>
    </div>
  );
};

export default AvatarUpload;