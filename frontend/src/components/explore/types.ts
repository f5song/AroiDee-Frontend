export interface Recipe {
    id: number;
    title: string;
    calories: number;
    time: number;
    image: string;
    rating: number;
    difficulty: string;
    tags: string[];
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