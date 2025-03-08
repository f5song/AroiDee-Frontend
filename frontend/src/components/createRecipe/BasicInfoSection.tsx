import React from "react";
import { ChefHat } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Category } from "../../lib/recipes/types"; // ✅ เพิ่ม Category


import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { getCategoryOptions } from "@/lib/recipes/utils";
import { formatErrorMessage } from "@/lib/recipes/form/validation";
import { RecipeImageUploader } from "./RecipeImageUploader";


import { RecipeInput } from "@/lib/recipes/types"; // ✅ Import RecipeInput 

interface BasicInfoSectionProps {
  recipe: RecipeInput;
  errors: Record<string, string>;
  tagInput: string;
  setTagInput: (value: string) => void;
  addTag: (category: Category) => void; // ✅ เปลี่ยนจาก string → Category
  removeTag: (categoryName: string) => void; // ✅ ใช้ category.name
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: () => void;
  handleCategorySelect: (category: string) => void;
  handleTagKeyDown: (e: React.KeyboardEvent) => void;
  updateBasicInfo: <K extends keyof RecipeInput>(field: K, value: RecipeInput[K]) => void;
}



export function BasicInfoSection({
  recipe,
  errors,
  updateBasicInfo,
  handleImageChange,
  removeImage,
  handleCategorySelect,

}: BasicInfoSectionProps) {
  const categoryOptions = getCategoryOptions();

  return (
    <Card className="shadow-sm">
      <CardHeader className="border-b pb-3">
        <div className="flex items-center">
          <ChefHat className="w-5 h-5 mr-2 text-orange-500" />
          <h2 className="text-xl font-semibold">Basic Information</h2>
        </div>
      </CardHeader>
      <CardContent className="pt-5">
        <div className="grid gap-5">
          {/* Title Field */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-base font-medium">
              Recipe Title<span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="title"
              value={recipe.title}
              onChange={(e) => updateBasicInfo("title", e.target.value)}
              placeholder="e.g. Delicious Chocolate Cake"
              className={`${errors.title ? "border-red-500" : ""}`}
            />
            {errors.title && (
              <p className="text-red-500 text-sm">
                {formatErrorMessage(errors.title)}
              </p>
            )}
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-base font-medium">
              Description<span className="text-red-500 ml-1">*</span>
            </Label>
            <Textarea
              id="description"
              value={recipe.description}
              onChange={(e) => updateBasicInfo("description", e.target.value)}
              placeholder="Briefly describe your recipe..."
              className={`min-h-[120px] ${
                errors.description ? "border-red-500" : ""
              }`}
            />
            {errors.description && (
              <p className="text-red-500 text-sm">
                {formatErrorMessage(errors.description)}
              </p>
            )}
          </div>

          {/* Categories & Tags */}
          <div className="space-y-3">
            <Label className="text-base font-medium block">
              Categories & Tags
            </Label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Select value={""} onValueChange={handleCategorySelect}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center">
                          <span className="mr-2">{option.icon}</span>
                          <span>{option.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            
            {/* Image Uploader */}
            <div className="py-1">
              <RecipeImageUploader
                imageUrl={recipe.image_url}
                onImageChange={handleImageChange}
                onRemoveImage={removeImage}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
