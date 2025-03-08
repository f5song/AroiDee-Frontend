
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FormActionsProps {
  errors: any;
  isSaving: boolean;
  onCancel: () => void;
}

export function FormActions({
  errors,
  isSaving,
  onCancel
}: FormActionsProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        {errors.submit && (
          <div className="bg-red-50 p-4 mb-4 rounded text-red-600 text-sm">
            {errors.submit}
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
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
        </div>
      </CardContent>
    </Card>
  );
}