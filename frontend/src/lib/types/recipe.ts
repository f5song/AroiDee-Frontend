import { Dispatch, SetStateAction } from "react";

export interface RecipeHeaderProps {
  title: string;
  author: string;
  date: string;
  rating: number;
  comments: number;
  image_url: string;
  liked: boolean;
  saved: boolean;
  setLiked: Dispatch<SetStateAction<boolean>>;
  setSaved: Dispatch<SetStateAction<boolean>>;
}
