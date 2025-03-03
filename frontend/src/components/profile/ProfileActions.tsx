import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Profile } from "./ProfileTypes";
import DeleteAccountDialog from "./DeleteAccountDialog";

interface ProfileActionsProps {
  profile: Profile;
  handleSave: () => void;
  isEditable: boolean;
}

const ProfileActions: React.FC<ProfileActionsProps> = ({ profile, handleSave, isEditable }) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const openDeleteDialog = () => {
    setIsDeleteDialogOpen(true);
  };
  
  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
  };
  
  const handleDeleteAccount = () => {
    console.log("Account deletion confirmed");
    // Here you would make an API call to delete the account
    closeDeleteDialog();
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-end gap-4">
        {isEditable && (
          <Button 
            className="w-full sm:w-60 bg-green-500 hover:bg-green-600 text-white" 
            onClick={handleSave}
          >
            Save Changes
          </Button>
        )}
        <Button 
          className="w-full sm:w-60 bg-red-500 hover:bg-red-600 text-white" 
          variant="destructive"
          onClick={openDeleteDialog}
        >
          Delete Account
        </Button>
      </div>
      
      {/* Delete Account Confirmation Dialog */}
      <DeleteAccountDialog 
        isOpen={isDeleteDialogOpen}
        onClose={closeDeleteDialog}
        onConfirm={handleDeleteAccount}
        username={profile.username}
      />
    </div>
  );
};

export default ProfileActions;