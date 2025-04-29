// contexts/UserProfileContext.tsx
import { createContext, useContext, useState } from "react";

type Macros = {
  carbs: number;
  protein: number;
  fat: number;
};

type UserProfile = {
  gender: "male" | "female";
  birthdate: string;
  height: number;
  weight: number;
  activityLevel: "sedentary" | "light" | "moderate" | "active" | "very_active";
  goal: "lose_weight" | "maintain" | "gain_weight";
  calorieGoal: number;
  macros: Macros;
};

const defaultUserProfile: UserProfile = {
  gender: "male",
  birthdate: "2000-01-01",
  height: 170,
  weight: 65,
  activityLevel: "moderate",
  goal: "maintain",
  calorieGoal: 2200,
  macros: {
    carbs: 50,
    protein: 25,
    fat: 25,
  },
};

type UserProfileContextType = {
  userData: UserProfile;
  setUserData: React.Dispatch<React.SetStateAction<UserProfile>>;
};

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export const UserProfileProvider = ({ children }: { children: React.ReactNode }) => {
  const [userData, setUserData] = useState<UserProfile>(defaultUserProfile);

  return (
    <UserProfileContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfile = (): UserProfileContextType => {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error("useUserProfile must be used within a UserProfileProvider");
  }
  return context;
};
