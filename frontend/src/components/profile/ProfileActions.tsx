import React from "react";
import { Button } from "@/components/ui/button";
import { Save, X } from "lucide-react";
import { Profile } from "./ProfileTypes";

interface ProfileActionsProps {
  profile: Profile;
  handleSave: () => void;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  isSaving?: boolean;
}

const ProfileActions: React.FC<ProfileActionsProps> = ({
  handleSave,
  isEditing,
  setIsEditing,
  isSaving = false
}) => {
  if (!isEditing) {
    return null; // Don't render actions if not in edit mode
  }
  
  return (
    <div className="border-t pt-4 mt-4">
      <div className="flex flex-col sm:flex-row justify-end gap-4">
        <Button 
          variant="outline"
          className="w-full sm:w-auto"
          onClick={() => setIsEditing(false)}
          disabled={isSaving}
        >
          <X className="h-4 w-4 mr-2" /> Cancel
        </Button>
        
        <Button 
          className="w-full sm:w-60 bg-green-500 hover:bg-green-600 text-white" 
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" /> Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ProfileActions;