import React from "react";
import { UtensilsCrossed, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  CardHeader,
} from "@/components/ui/card";
import { UNIT_OPTIONS } from "@/lib/recipes/form/constants";
import { formatErrorMessage } from "@/lib/recipes/form/validation";

// Define the IngredientInput type
interface IngredientInput {
  id: any;
  name: string;
  amount: string;
  unit: string;
}

interface IngredientsProps {
  ingredients: IngredientInput[];
  errors: any;
  addIngredient: () => void;
  updateIngredient: (id: any, field: keyof Omit<IngredientInput, 'id'>, value: string) => void;
  removeIngredient: (id: any) => void;
}

export function IngredientsSection({
  ingredients,
  errors,
  addIngredient,
  updateIngredient,
  removeIngredient
}: IngredientsProps) {
  return (
    <Card>
      <CardHeader className="border-b pb-4">
        <div className="flex items-center">
          <UtensilsCrossed className="w-5 h-5 mr-2 text-orange-500" /> 
          <h2 className="text-xl font-semibold">Ingredients</h2>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
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
            {ingredients.map((ingredient) => (
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
                        <SelectItem key={option.value || "none"} value={option.value || "none"}>
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
                    disabled={ingredients.length <= 1}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}