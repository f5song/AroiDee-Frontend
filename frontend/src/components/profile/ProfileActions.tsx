import React from "react";
import { Profile } from "./ProfileTypes";

interface ProfileActionsProps {
  profile: Profile;
}

const ProfileActions: React.FC<ProfileActionsProps> = ({
  profile
}) => {
  // Component no longer has any functionality since editing is removed
  return null;
};

export default ProfileActions;