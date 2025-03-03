import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IngredientInputProps } from "@/components/explore/sidebar/types";

export function IngredientInput({
  ingredients,
  setIngredients,
  ingredientsList,
  handleAddIngredient,
  removeIngredient,
}: IngredientInputProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Ingredients</h3>
      <div className="flex gap-2">
        <Input
          placeholder="Add ingredient..."
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddIngredient();
            }
          }}
        />
        <Button type="button" variant="outline" onClick={handleAddIngredient} size="sm">
          Add
        </Button>
      </div>
      
      {ingredientsList.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {ingredientsList.map(ingredient => (
            <Badge key={ingredient} variant="secondary" className="flex items-center gap-1">
              {ingredient}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => removeIngredient(ingredient)}
                className="h-4 w-4 p-0 ml-1"
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

export default IngredientInput;