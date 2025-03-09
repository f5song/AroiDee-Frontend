const BASE_URL = "https://aroi-dee-backend.vercel.app/api/saved-recipes";
const USER_RECIPES_URL = "https://aroi-dee-backend.vercel.app/api/recipes/user";

/**
 * ตรวจสอบว่าสูตรอาหารถูกบันทึกไว้หรือยัง
 */
export const isRecipeSaved = async (userId: number, recipeId: number): Promise<boolean> => {
  try {
    const response = await fetch(`${USER_RECIPES_URL}/${userId}`);
    const data = await response.json();

    if (!data.success || !data.savedRecipes) {
      return false;
    }

    return data.savedRecipes.some((recipe: { recipe_id: number }) => recipe.recipe_id === recipeId);
  } catch (error) {
    console.error("❌ ไม่สามารถโหลดข้อมูลการบันทึกได้:", error);
    return false;
  }
};

/**
 * บันทึกสูตรอาหารลงฐานข้อมูล
 */
export const saveRecipe = async (userId: number, recipeId: number): Promise<boolean> => {
  try {
    const response = await fetch(`${BASE_URL}/save-recipe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
export const unsaveRecipe = async (userId: number, recipeId: number): Promise<boolean> => {
  try {
    const response = await fetch(`${BASE_URL}/unsave-recipe`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
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
