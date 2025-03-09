const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

export async function fetchCategories() {
    try {
      const response = await fetch("https://aroi-dee-backend.vercel.app/api/categories");
      if (!response.ok) throw new Error("Failed to fetch categories");
  
      const data = await response.json();
      return data.data; // ✅ คืนค่าเฉพาะหมวดหมู่
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  }

// ✅ ฟังก์ชันอัปโหลดรูปภาพไปยัง Cloudinary
export async function uploadImageToCloudinary(file: File, folder: string = "default") {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    formData.append("folder", folder); // ✅ สามารถกำหนด folder ได้ เช่น "profile"
    
    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) throw new Error("Failed to upload image");
      const data = await response.json();
      return data.secure_url; // ✅ คืนค่า URL ของรูปที่อัปโหลดไป Cloudinary
    } catch (error) {
      console.error("Error uploading image:", error);
      return "";
    }
  }