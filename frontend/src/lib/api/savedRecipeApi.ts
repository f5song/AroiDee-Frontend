const BASE_URL = "https://aroi-dee-backend.vercel.app/api/saved-recipes";

/**
 * ตรวจสอบว่าสูตรอาหารถูกบันทึกไว้หรือยังสำหรับ userId และ recipeId ที่กำหนด
 */
export const isRecipeSaved = async (userId: number, recipeId: number, token: string): Promise<boolean> => {
  try {
    const response = await fetch(`${BASE_URL}/${userId}/saved-recipes`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();
    console.log("🔄 isRecipeSaved API Response:", data);

    if (!data.success || !data.savedRecipes) return false;

    // ✅ ตรวจสอบว่า recipeId นี้อยู่ในรายการที่บันทึกหรือไม่
    return data.savedRecipes.some((recipe: { recipe_id: number }) => recipe.recipe_id === recipeId);
  } catch (error) {
    console.error("❌ ไม่สามารถโหลดข้อมูลการบันทึกได้:", error);
    return false;
  }
};


/**
 * บันทึกสูตรอาหารลงฐานข้อมูล
 */
export const saveRecipe = async (userId: number, recipeId: number, token: string): Promise<boolean> => {
  try {
    const response = await fetch(`${BASE_URL}/save-recipe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // ✅ ส่ง Token
      },
      body: JSON.stringify({ user_id: userId, recipe_id: recipeId }),
    });

    if (!response.ok) {
      console.error("❌ ไม่สามารถบันทึกสูตรอาหาร:", await response.json());
      return false;
    }

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error("❌ ไม่สามารถบันทึกสูตรอาหารได้:", error);
    return false;
  }
};

/**
 * ยกเลิกการบันทึกสูตรอาหาร
 */
export const unsaveRecipe = async (userId: number, recipeId: number, token: string): Promise<boolean> => {
  try {
    const response = await fetch(`${BASE_URL}/unsave-recipe`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // ✅ ส่ง Token
      },
      body: JSON.stringify({ user_id: userId, recipe_id: recipeId }),
    });

    if (!response.ok) {
      console.error("❌ ไม่สามารถยกเลิกการบันทึกสูตรอาหาร:", await response.json());
      return false;
    }

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error("❌ ไม่สามารถยกเลิกการบันทึกสูตรอาหารได้:", error);
    return false;
  }
};
