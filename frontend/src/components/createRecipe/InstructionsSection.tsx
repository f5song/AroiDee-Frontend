import React from "react";
import { ListPlus, Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { formatErrorMessage } from "@/lib/recipes/form/validation";

interface InstructionsProps {
  instructions: any[];
  errors: any;
  addInstruction: () => void;
  updateInstruction: (id: any, value: string) => void;
  removeInstruction: (id: any) => void;
  moveInstruction: (id: any, direction: 'up' | 'down') => void;
}

export function InstructionsSection({
  instructions,
  errors,
  addInstruction,
  updateInstruction,
  removeInstruction,
  moveInstruction
}: InstructionsProps) {
  return (
    <Card>
      <CardHeader className="border-b pb-4">
        <div className="flex items-center">
          <ListPlus className="w-5 h-5 mr-2 text-orange-500" /> 
          <h2 className="text-xl font-semibold">Cooking Instructions</h2>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div>
          <div className="flex justify-between items-center mb-4">
            <Label className="text-base font-medium">Cooking Steps<span className="text-red-500">*</span></Label>
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
            {instructions.map((instruction, index) => (
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
                        disabled={index === instructions.length - 1}
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
                      disabled={instructions.length <= 1}
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
      </CardContent>
    </Card>
  );
}