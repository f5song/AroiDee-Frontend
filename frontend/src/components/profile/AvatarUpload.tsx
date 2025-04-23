import React, { useState, useRef } from "react";
import { Camera, UserCircle } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@/contexts/UserContext";

interface AvatarUploadProps {
  currentAvatar?: string;
  username: string;
  onAvatarChange: (file: File) => Promise<void>;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({
  currentAvatar,
  username,
  onAvatarChange,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { setUser } = useUser(); // ✅ เพิ่ม useUser context

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Invalid file type", {
        description: "Please select an image file",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large", {
        description: "File size should not exceed 5MB",
      });
      return;
    }

    // Show preview immediately
    const reader = new FileReader();
    reader.onload = () => setPreviewUrl(reader.result as string);
    reader.readAsDataURL(file);

    setIsUploading(true);
    try {
      await onAvatarChange(file);

      // ✅ อัปเดต image_url ใน global context
      setUser((prev) => ({
        ...prev,
        image_url: reader.result as string,
      }));
    } catch (error) {
      console.error("Failed to upload avatar", error);
      toast.error("Upload failed", {
        description: "Something went wrong while uploading.",
      });
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
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div className="rounded-full w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 ring-4 ring-gray-300 shadow-md bg-gray-100 flex items-center justify-center overflow-hidden">
          {previewUrl || currentAvatar ? (
            <img
              src={previewUrl || currentAvatar}
              alt={`${username}'s avatar`}
              className="w-full h-full object-cover"
            />
          ) : (
            <UserCircle className="text-gray-400 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24" />
          )}
        </div>

        {(isHovering || isUploading) && (
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center transition-opacity duration-200">
            {!isUploading && <Camera size={24} className="text-white" />}
            {isUploading && (
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
          </div>
        )}
      </div>

      <h2 className="mt-3 text-lg sm:text-xl font-semibold text-gray-700">
        {username}
      </h2>

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
