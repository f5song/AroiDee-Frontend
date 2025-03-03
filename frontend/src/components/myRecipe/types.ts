// components/explore/types.ts
export interface Recipe {
    id: number;
    title: string;
    description: string;
    image: string;
    time: number; // เวลาในการทำอาหาร (นาที)
    difficulty: 'easy' | 'medium' | 'hard';
    servings: number;
    rating: number;
    tags: string[]; // แท็กและหมวดหมู่ต่างๆ
    author: {
      id: number;
      name: string;
      avatar: string;
    };
    createdAt: string;
  }
  
  export interface RecipeFilters {
    search?: string;
    categories?: string[];
    sort?: string;
    page?: number;
  }