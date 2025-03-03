// lib/recipes/form/validation.ts
import { RecipeInput, IngredientInput, InstructionInput, ValidationErrors } from "./types";
import { VALIDATION_LIMITS } from "./constants";

/**
 * ตรวจสอบความถูกต้องของฟอร์มสูตรอาหาร
 */
export const validateRecipe = (recipe: RecipeInput): ValidationErrors => {
  const errors: ValidationErrors = {};
  const {
    TITLE_MIN_LENGTH,
    TITLE_MAX_LENGTH,
    DESCRIPTION_MIN_LENGTH,
    MAX_COOKING_TIME,
    MAX_CALORIES,
    MAX_SERVINGS
  } = VALIDATION_LIMITS;
  
  // ตรวจสอบชื่อสูตรอาหาร
  if (!recipe.title.trim()) {
    errors.title = "กรุณาระบุชื่อสูตรอาหาร";
  } else if (recipe.title.trim().length < TITLE_MIN_LENGTH) {
    errors.title = `ชื่อสูตรอาหารต้องมีความยาวอย่างน้อย ${TITLE_MIN_LENGTH} ตัวอักษร`;
  } else if (recipe.title.trim().length > TITLE_MAX_LENGTH) {
    errors.title = `ชื่อสูตรอาหารต้องมีความยาวไม่เกิน ${TITLE_MAX_LENGTH} ตัวอักษร`;
  }
  
  // ตรวจสอบคำอธิบาย
  if (!recipe.description.trim()) {
    errors.description = "กรุณาระบุคำอธิบายสูตรอาหาร";
  } else if (recipe.description.trim().length < DESCRIPTION_MIN_LENGTH) {
    errors.description = `คำอธิบายต้องมีความยาวอย่างน้อย ${DESCRIPTION_MIN_LENGTH} ตัวอักษร`;
  }
  
  // ตรวจสอบเวลาทำอาหาร
  if (recipe.time <= 0) {
    errors.cookingTime = "เวลาทำอาหารต้องมากกว่า 0";
  } else if (recipe.time > MAX_COOKING_TIME) {
    errors.cookingTime = `เวลาทำอาหารต้องไม่เกิน 24 ชั่วโมง (${MAX_COOKING_TIME} นาที)`;
  }
  
  // ตรวจสอบแคลอรี่
  if (recipe.calories <= 0) {
    errors.calories = "แคลอรี่ต้องมากกว่า 0";
  } else if (recipe.calories > MAX_CALORIES) {
    errors.calories = `แคลอรี่ดูเยอะเกินไป กรุณาตรวจสอบอีกครั้ง (ไม่เกิน ${MAX_CALORIES})`;
  }
  
  // ตรวจสอบจำนวนที่เสิร์ฟ
  if (recipe.servings <= 0) {
    errors.servings = "จำนวนที่เสิร์ฟต้องมากกว่า 0";
  } else if (recipe.servings > MAX_SERVINGS) {
    errors.servings = `จำนวนที่เสิร์ฟดูมากเกินไป กรุณาตรวจสอบอีกครั้ง (ไม่เกิน ${MAX_SERVINGS})`;
  }
  
  // ตรวจสอบส่วนผสม
  const validIngredients = recipe.ingredients.filter(ing => ing.name.trim() && ing.amount.trim());
  if (validIngredients.length === 0) {
    errors.ingredients = "กรุณาระบุส่วนผสมอย่างน้อย 1 รายการ พร้อมชื่อและปริมาณ";
  }
  
  // ตรวจสอบขั้นตอนการทำ
  const validInstructions = recipe.instructions.filter(inst => inst.text.trim());
  if (validInstructions.length === 0) {
    errors.instructions = "กรุณาระบุขั้นตอนการทำอย่างน้อย 1 ขั้นตอน";
  }
  
  return errors;
};

/**
 * ตรวจสอบความถูกต้องของส่วนผสม
 */
export const isIngredientValid = (ingredient: IngredientInput): boolean => {
  return !!ingredient.name.trim() && !!ingredient.amount.trim();
};

/**
 * ตรวจสอบความถูกต้องของขั้นตอนการทำ
 */
export const isInstructionValid = (instruction: InstructionInput): boolean => {
  return instruction.text.trim().length > 0;
};

/**
 * จัดรูปแบบข้อความแสดงข้อผิดพลาด
 */
export const formatErrorMessage = (error: string): string => {
  return error.charAt(0).toUpperCase() + error.slice(1);
};

/**
 * ค้นหาแท็บที่มีข้อผิดพลาด
 */
export const findErrorTab = (errors: ValidationErrors): string => {
  if (errors.title || errors.description || 
      errors.cookingTime || errors.calories || 
      errors.servings) {
    return "basic";
  } else if (errors.ingredients) {
    return "ingredients";
  } else if (errors.instructions) {
    return "instructions";
  }
  return "basic";
};

/**
 * ตรวจสอบความถูกต้องของไฟล์รูปภาพ
 */
export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
  
  if (file.size > MAX_SIZE) {
    return {
      valid: false,
      error: `ขนาดไฟล์เกิน 5MB ไฟล์ของคุณมีขนาด ${(file.size / (1024 * 1024)).toFixed(2)}MB`
    };
  }
  
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: "รองรับเฉพาะไฟล์ภาพประเภท JPG, PNG และ WebP เท่านั้น"
    };
  }
  
  return { valid: true };
};