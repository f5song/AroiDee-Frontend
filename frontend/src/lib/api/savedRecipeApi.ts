const BASE_URL = "https://aroi-dee-backend.vercel.app/api/saved_recipes";

// ✅ ตรวจสอบว่า Recipe ถูกบันทึกไว้หรือยัง
export const isRecipeSaved = async (userId: number, recipeId: number): Promise<boolean> => {
  try {
    const response = await fetch(`${BASE_URL}?user_id=${userId}&recipe_id=${recipeId}`);
    const data = await response.json();
    return !!data.saved; // ✅ คืนค่า true หรือ false
  } catch (error) {
    console.error("❌ ไม่สามารถโหลดข้อมูลการบันทึกได้:", error);
    return false;
  }
};

// ✅ บันทึกสูตรอาหารลงฐานข้อมูล
export const saveRecipe = async (userId: number, recipeId: number): Promise<boolean> => {
  try {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, recipe_id: recipeId }),
    });
    const data = await response.json();
    return response.ok && data.success;
  } catch (error) {
    console.error("❌ ไม่สามารถบันทึกสูตรอาหารได้:", error);
    return false;
  }
};

// ✅ ยกเลิกการบันทึกสูตรอาหาร
export const unsaveRecipe = async (userId: number, recipeId: number): Promise<boolean> => {
  try {
    const response = await fetch(BASE_URL, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, recipe_id: recipeId }),
    });
    const data = await response.json();
    return response.ok && data.success;
  } catch (error) {
    console.error("❌ ไม่สามารถยกเลิกการบันทึกสูตรอาหารได้:", error);
    return false;
  }
};
