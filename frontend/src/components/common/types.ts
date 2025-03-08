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
    categories: Category[]; // ✅ ต้องแน่ใจว่าเป็น Category[] ไม่ใช่ string[]
  }
  
  
  
    export interface PaginationInfo {
      currentPage: number;
      totalPages: number;
      totalItems: number;
    }
    
    export interface FilterOptions {
      category: string;
      search: string;
      sort: string;
      page: number;
    }
    
    export interface TagColorMap {
      [key: string]: string;
    }
    
    export interface CategoryMap {
      [key: string]: string;
    }
    
    export interface SortOption {
      value: string;
      label: string;
    }