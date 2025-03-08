import React from "react";
import { ChefHat, Clock, Plus, X, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { getCategoryOptions } from "@/lib/recipes/utils";
import { formatErrorMessage } from "@/lib/recipes/form/validation";
import { RecipeImageUploader } from "./RecipeImageUploader";

// Define RecipeInput type to match your form data structure
interface RecipeInput {
  title: string;
  description: string;
  time: number;
  calories: number;
  difficulty: string;
  servings: number;
  tags: string[];
  ingredients: any[];
  instructions: any[];
  image_url: string | null;
  // Include any other fields you have in your recipe form
}

interface BasicInfoSectionProps {
  recipe: any;
  errors: any;
  tagInput: string;
  setTagInput: (value: string) => void;
  updateBasicInfo: (field: string, value: any) => void;
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: () => void;
  handleCategorySelect: (category: string) => void;
  handleTagKeyDown: (e: React.KeyboardEvent) => void;
}

export function BasicInfoSection({
  recipe,
  errors,
  tagInput,
  setTagInput,
  updateBasicInfo,
  addTag,
  removeTag,
  handleImageChange,
  removeImage,
  handleCategorySelect,
  handleTagKeyDown,
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
            
            {/* Tags Display */}
            {recipe.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {recipe.tags.map((tag: string) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="flex items-center gap-1 px-2 py-1"
                  >
                    {tag}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTag(tag)}
                      className="h-4 w-4 p-0 ml-1"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
            
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
