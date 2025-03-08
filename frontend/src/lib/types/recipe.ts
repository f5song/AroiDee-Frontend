
export interface RecipeHeaderProps {
    title: string;
    author: string;
    date: string;
    rating: number;
    comments: number;
    image_url: string;
    saved: boolean;
    setSaved: (value: boolean) => void;
    liked: boolean; // ✅ เพิ่ม
    setLiked: (value: boolean) => void; // ✅ เพิ่ม
  }
  