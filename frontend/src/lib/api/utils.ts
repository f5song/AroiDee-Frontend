const API_URL =
  import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL.trim() !== ""
    ? import.meta.env.VITE_API_URL
    : "https://aroi-dee-backend.vercel.app";

export async function fetchCategories() {
    try {
      const response = await fetch(`${API_URL}/api/categories`);
      if (!response.ok) throw new Error("Failed to fetch categories");
  
      const data = await response.json();
      return data.data; // ✅ คืนค่าเฉพาะหมวดหมู่
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  }

// ✅ ฟังก์ชันอัปโหลดรูปภาพไปยัง Cloudinary
export async function uploadImageToCloudinary(file: File, folder: string = "profile") {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    formData.append("folder", folder);

    try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) throw new Error("Failed to upload image");
        const data = await response.json();
        return data.secure_url; // ✅ คืนค่า URL ของรูปที่อัปโหลด
    } catch (error) {
        console.error("Error uploading image:", error);
        return "";
    }
}
