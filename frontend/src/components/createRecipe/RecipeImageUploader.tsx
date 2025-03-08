import React from "react";
import { Upload, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface RecipeImageUploaderProps {
  imageUrl: string | null;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
}

export function RecipeImageUploader({
  imageUrl,
  onImageChange,
  onRemoveImage
}: RecipeImageUploaderProps) {
  return (
    <div>
      <Label className="text-base font-medium">Recipe Image</Label>
      <div className="mt-2 flex flex-col md:flex-row gap-4 items-start">
        <div className="border rounded-md overflow-hidden bg-gray-50 flex items-center justify-center w-full md:w-36 h-36">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Recipe preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <Upload className="h-8 w-8 text-gray-400" />
          )}
        </div>
        <div className="flex-1">
          <Label
            htmlFor="image-upload"
            className="btn cursor-pointer inline-flex items-center gap-2 rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            <Upload className="h-4 w-4" />
            Upload Image
          </Label>
          <Input
            id="image-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onImageChange}
          />
          <p className="text-xs text-gray-500 mt-2">
            Recommended: Square image, at least 500x500px
          </p>
          {imageUrl && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onRemoveImage}
              className="mt-2"
            >
              <Trash2 className="h-3 w-3 mr-1" /> Remove
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}