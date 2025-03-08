// lib/recipes/types.ts

/**
 * สูตรอาหาร
 */
export interface Category {
  id: number;
  name: string;
  image_url: string;
}


export interface Recipe {
  id: number;
  title: string;
  description?: string; 
  calories: number;
  cook_time?: number; 
  image_url: string;
  rating: number;
  difficulty: string;
  categories: Category[];
}

  
  /**
   * ข้อมูลการแบ่งหน้า
   */
  export interface PaginationInfo {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  }
  
  /**
   * ตัวเลือกการกรอง
   */
  export interface FilterOptions {
    category?: string;
    search?: string;
    sort?: string;
    page?: number;
    cookingTime?: number;
    difficulty?: string;
    calorieRange?: number;
  }
  
  /**
   * ตัวเลือกการเรียงลำดับ
   */
  export interface SortOption {
    value: string;
    label: string;
  }
  
  /**
   * แผนผังสีของแท็ก
   */
  export interface TagColorMap {
    [key: string]: string;
  }
  
  /**
   * แผนผังหมวดหมู่
   */
  export interface CategoryMap {
    [key: string]: string;
  }
  
  /**
   * ตัวเลือกหมวดหมู่
   */
  export interface CategoryOption {
    id: string;
    name: string;
    group: string;
  }
  
  /**
   * ผลลัพธ์การเรียก API
   */
  export interface ApiResponse<T> {
    data: T[];
    pagination: PaginationInfo;
  }
  
  /**
   * ผลลัพธ์การเรียกสูตรอาหาร
   */
  export interface RecipeResponse extends ApiResponse<Recipe> {}
  
  /**
   * ชนิดของแหล่งสูตรอาหาร
   */
  export enum RecipeSource {
    ALL = 'all',
    USER = 'user',
    FAVORITE = 'favorite'
  }