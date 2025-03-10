import React, { useState, useRef } from "react";
import { Camera } from "lucide-react";
import { toast } from "sonner";

interface AvatarUploadProps {
  currentAvatar?: string;
  username: string;
  onAvatarChange: (file: File) => Promise<void>;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({ 
  currentAvatar, 
  username, 
  onAvatarChange 
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isHovering, setIsHovering] = useState(false); // เพิ่ม state สำหรับการ hover
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Invalid file type", { description: "Please select an image file" });
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large", { description: "File size should not exceed 5MB" });
      return;
    }

    // Show preview immediately
    const reader = new FileReader();
    reader.onload = () => setPreviewUrl(reader.result as string);
    reader.readAsDataURL(file);
    
    // Upload the file
    setIsUploading(true);
    try {
      await onAvatarChange(file);
    } catch (error) {
      console.error("Failed to upload avatar", error);
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="relative text-center flex flex-col items-center">
      <div 
        className="relative cursor-pointer" 
        onClick={triggerFileInput}
        onMouseEnter={() => setIsHovering(true)} // เพิ่ม event handlers สำหรับ hover
        onMouseLeave={() => setIsHovering(false)}
      >
        <img
          src={previewUrl || currentAvatar || "/default-avatar.png"}
          alt={`${username}'s avatar`}
          className="rounded-full w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 object-cover ring-4 ring-gray-300 shadow-md"
        />
        {/* แสดงไอคอนกล้องเฉพาะเมื่อ hover หรือกำลังอัพโหลด */}
        {(isHovering || isUploading) && (
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center transition-opacity duration-200">
            <Camera size={24} className="text-white" />
            {isUploading && (
              <div className="absolute inset-0 bg-black bg-opacity-70 rounded-full flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
        )}
      </div>
      <h2 className="mt-3 text-lg sm:text-xl font-semibold text-gray-700">{username}</h2>
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />
    </div>
  );
};

export default AvatarUpload;