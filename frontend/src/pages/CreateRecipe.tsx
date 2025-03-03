import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  Clock, 
  UtensilsCrossed, 
  ChefHat, 
  ListPlus, 
  Trash2, 
  Plus, 
  Upload,
  X,
  Save,
  ArrowUp,
  ArrowDown,
  Flame
} from "lucide-react";
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
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Slider } from "@/components/ui/slider";
import Navbar from "@/components/navigation";
import Footer from "@/components/footer";

// Import from refactored files
import { 
  useRecipeForm, 
  createRecipe, 
  UNIT_OPTIONS, 
  FORM_TABS, 
  formatErrorMessage 
} from "@/lib/recipes/form";
import { getCategoryOptions } from "@/lib/recipes/utils";
/**
 * Create New Recipe page component
 */
export default function CreateRecipePage() {
  const navigate = useNavigate();
  
  // Use the recipe form hook
  const {
    recipe,
    errors,
    activeTab,
    setActiveTab,
    isSaving,
    setIsSaving,
    tagInput,
    setTagInput,
    updateBasicInfo,
    addTag,
    removeTag,
    addIngredient,
    updateIngredient,
    removeIngredient,
    addInstruction,
    updateInstruction,
    removeInstruction,
    moveInstruction,
    handleImageChange,
    removeImage,
    validateForm
  } = useRecipeForm();

  // Get category options for dropdown
  const categoryOptions = getCategoryOptions();
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    // Start saving process
    setIsSaving(true);
    
    try {
      // Save recipe using the updated API
      const result = await createRecipe(recipe);
      
      if (result.success) {
        // Navigate to the recipe page or my recipes page
        navigate("/my-recipes");
      } else {
        // Show error
        updateBasicInfo('submit' as any, result.error || "Failed to save recipe");
      }
    } catch (error) {
      console.error("Error saving recipe:", error);
      updateBasicInfo('submit' as any, "An unexpected error occurred. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle category selection
  const handleCategorySelect = (category: string) => {
    // Add the category as a tag if it's not already in the tags list
    if (!recipe.tags.includes(category) && category !== "all") {
      addTag(category);
    }
  };
  
  // Handle tag input keydown
  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(tagInput);
    }
  };

  return (
    <div>
      <div className="min-h-screen bg-gray-50 p-6 md:p-8 lg:p-10">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">🍳 Create New Recipe</h1>
            <p className="text-gray-500">
              Share your culinary creations with the world
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <Card>
                <CardHeader>
                  <TabsList className="grid grid-cols-3 w-full">
                    <TabsTrigger value={FORM_TABS.BASIC} className="flex items-center">
                      <ChefHat className="w-4 h-4 mr-2" /> Basic Info
                    </TabsTrigger>
                    <TabsTrigger value={FORM_TABS.INGREDIENTS} className="flex items-center">
                      <UtensilsCrossed className="w-4 h-4 mr-2" /> Ingredients
                    </TabsTrigger>
                    <TabsTrigger value={FORM_TABS.INSTRUCTIONS} className="flex items-center">
                      <ListPlus className="w-4 h-4 mr-2" /> Instructions
                    </TabsTrigger>
                  </TabsList>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Basic Information Tab */}
                  <TabsContent value={FORM_TABS.BASIC} className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="title" className="text-base font-medium">
                          Recipe Title<span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="title"
                          value={recipe.title}
                          onChange={(e) => updateBasicInfo('title', e.target.value)}
                          placeholder="e.g. Delicious Chocolate Cake"
                          className={`mt-1 ${errors.title ? 'border-red-500' : ''}`}
                        />
                        {errors.title && (
                          <p className="text-red-500 text-sm mt-1">{formatErrorMessage(errors.title)}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="description" className="text-base font-medium">
                          Description<span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                          id="description"
                          value={recipe.description}
                          onChange={(e) => updateBasicInfo('description', e.target.value)}
                          placeholder="Briefly describe your recipe..."
                          className={`mt-1 min-h-[100px] ${errors.description ? 'border-red-500' : ''}`}
                        />
                        {errors.description && (
                          <p className="text-red-500 text-sm mt-1">{formatErrorMessage(errors.description)}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="cookingTime" className="text-base font-medium">
                            Cooking Time (minutes)<span className="text-red-500">*</span>
                          </Label>
                          <div className="flex items-center mt-2">
                            <Clock className="w-4 h-4 mr-2 text-gray-500" />
                            <Slider
                              id="cookingTime"
                              value={[recipe.time]}
                              min={5}
                              max={180}
                              step={5}
                              onValueChange={(value) => updateBasicInfo('time', value[0])}
                              className={`${errors.cookingTime ? 'border-red-500' : ''}`}
                            />
                            <span className="ml-2 min-w-[60px] text-right">{recipe.time} min</span>
                          </div>
                          {errors.cookingTime && (
                            <p className="text-red-500 text-sm mt-1">{formatErrorMessage(errors.cookingTime)}</p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="calories" className="text-base font-medium">
                            Calories (per serving)<span className="text-red-500">*</span>
                          </Label>
                          <div className="flex items-center mt-2">
                            <Flame className="w-4 h-4 mr-2 text-gray-500" />
                            <Slider
                              id="calories"
                              value={[recipe.calories]}
                              min={50}
                              max={1000}
                              step={10}
                              onValueChange={(value) => updateBasicInfo('calories', value[0])}
                              className={`${errors.calories ? 'border-red-500' : ''}`}
                            />
                            <span className="ml-2 min-w-[80px] text-right">{recipe.calories} kcal</span>
                          </div>
                          {errors.calories && (
                            <p className="text-red-500 text-sm mt-1">{formatErrorMessage(errors.calories)}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="difficulty" className="text-base font-medium">
                            Difficulty Level<span className="text-red-500">*</span>
                          </Label>
                          <Select 
                            value={recipe.difficulty} 
                            onValueChange={(value) => updateBasicInfo('difficulty', value)}
                          >
                            <SelectTrigger id="difficulty" className="mt-1">
                              <SelectValue placeholder="Select difficulty" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="easy">Easy</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="hard">Hard</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="servings" className="text-base font-medium">
                            Servings<span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="servings"
                            type="number"
                            min={1}
                            value={recipe.servings}
                            onChange={(e) => updateBasicInfo('servings', parseInt(e.target.value) || 1)}
                            className={`mt-1 ${errors.servings ? 'border-red-500' : ''}`}
                          />
                          {errors.servings && (
                            <p className="text-red-500 text-sm mt-1">{formatErrorMessage(errors.servings)}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <Label className="text-base font-medium">Recipe Image</Label>
                        <div className="mt-2 flex flex-col md:flex-row gap-4 items-start">
                          <div className="border rounded-md overflow-hidden bg-gray-50 flex items-center justify-center w-full md:w-36 h-36">
                            {recipe.image ? (
                              <img
                                src={recipe.image}
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
                              onChange={handleImageChange}
                            />
                            <p className="text-xs text-gray-500 mt-2">
                              Recommended: Square image, at least 500x500px
                            </p>
                            {recipe.image && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={removeImage}
                                className="mt-2"
                              >
                                <Trash2 className="h-3 w-3 mr-1" /> Remove
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label className="text-base font-medium mb-2 block">Categories & Tags</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Select
                              value={""}
                              onValueChange={handleCategorySelect}
                            >
                              <SelectTrigger>
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
                          <div className="flex gap-2">
                            <Input
                              placeholder="Add a tag..."
                              value={tagInput}
                              onChange={(e) => setTagInput(e.target.value)}
                              onKeyDown={handleTagKeyDown}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => addTag(tagInput)}
                              className="shrink-0"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        {recipe.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-3">
                            {recipe.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                                {tag}
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeTag(tag)}
                                  className="h-4 w-4 p-0 ml-1"
                                >
                                  <X className="h-2 w-2" />
                                </Button>
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  {/* Ingredients Tab */}
                  <TabsContent value={FORM_TABS.INGREDIENTS} className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <Label className="text-base font-medium">Ingredients<span className="text-red-500">*</span></Label>
                        <Button
                          type="button"
                          onClick={addIngredient}
                          size="sm"
                          className="flex items-center gap-1"
                        >
                          <Plus className="h-4 w-4" /> Add Ingredient
                        </Button>
                      </div>
                      
                      {errors.ingredients && (
                        <p className="text-red-500 text-sm mb-2">{formatErrorMessage(errors.ingredients)}</p>
                      )}
                      
                      <div className="space-y-3">
                        {recipe.ingredients.map((ingredient, index) => (
                          <div key={ingredient.id} className="grid grid-cols-12 gap-2 items-center">
                            <div className="col-span-6 md:col-span-5">
                              <Input
                                placeholder="Ingredient name"
                                value={ingredient.name}
                                onChange={(e) => updateIngredient(ingredient.id, 'name', e.target.value)}
                              />
                            </div>
                            
                            <div className="col-span-3 md:col-span-2">
                              <Input
                                placeholder="Amount"
                                value={ingredient.amount}
                                onChange={(e) => updateIngredient(ingredient.id, 'amount', e.target.value)}
                              />
                            </div>
                            
                            <div className="col-span-3 md:col-span-4">
                              <Select
                                value={ingredient.unit}
                                onValueChange={(value) => updateIngredient(ingredient.id, 'unit', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Unit" />
                                </SelectTrigger>
                                <SelectContent>
                                  {UNIT_OPTIONS.map(option => (
                                    <SelectItem key={option.value} value={option.value}>
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="col-span-12 md:col-span-1 flex justify-end">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeIngredient(ingredient.id)}
                                className="h-8 w-8 p-0"
                                disabled={recipe.ingredients.length <= 1}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  {/* Instructions Tab */}
                  <TabsContent value={FORM_TABS.INSTRUCTIONS} className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <Label className="text-base font-medium">Cooking Instructions<span className="text-red-500">*</span></Label>
                        <Button
                          type="button"
                          onClick={addInstruction}
                          size="sm"
                          className="flex items-center gap-1"
                        >
                          <Plus className="h-4 w-4" /> Add Step
                        </Button>
                      </div>
                      
                      {errors.instructions && (
                        <p className="text-red-500 text-sm mb-2">{formatErrorMessage(errors.instructions)}</p>
                      )}
                      
                      <div className="space-y-4">
                        {recipe.instructions.map((instruction, index) => (
                          <div key={instruction.id} className="flex gap-3">
                            <div className="shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-medium">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <Textarea
                                placeholder={`Step ${index + 1}: Describe this step...`}
                                value={instruction.text}
                                onChange={(e) => updateInstruction(instruction.id, e.target.value)}
                                className="min-h-[80px]"
                              />
                              <div className="flex justify-between mt-1">
                                <div className="flex gap-1">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => moveInstruction(instruction.id, 'up')}
                                    disabled={index === 0}
                                    className="h-6 px-2 text-xs"
                                  >
                                    <ArrowUp className="h-3 w-3 mr-1" /> Move Up
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => moveInstruction(instruction.id, 'down')}
                                    disabled={index === recipe.instructions.length - 1}
                                    className="h-6 px-2 text-xs"
                                  >
                                    <ArrowDown className="h-3 w-3 mr-1" /> Move Down
                                  </Button>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeInstruction(instruction.id)}
                                  disabled={recipe.instructions.length <= 1}
                                  className="h-6 px-2 text-xs text-red-500 hover:text-red-600 hover:bg-red-50"
                                >
                                  <Trash2 className="h-3 w-3 mr-1" /> Remove
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                </CardContent>

                <CardFooter className="flex justify-between border-t p-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/my-recipes")}
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div>
                          <Button 
                            type="submit" 
                            className="bg-orange-500 hover:bg-orange-600 text-white"
                            disabled={isSaving}
                          >
                            {isSaving ? (
                              <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Saving...
                              </>
                            ) : (
                              <>
                                <Save className="w-4 h-4 mr-2" /> Save Recipe
                              </>
                            )}
                          </Button>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Save your recipe and publish it</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </CardFooter>
              </Card>
            </Tabs>
          </form>
        </div>
      </div>
    </div>
  );
}