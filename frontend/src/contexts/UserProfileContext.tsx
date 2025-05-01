// contexts/UserProfileContext.tsx
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

type Macros = {
  carbs: number;
  protein: number;
  fat: number;
};

type UserProfile = {
  id: any;
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
  id: 0,
  gender: "male",
  birthdate: "2000-01-01",
  height: 170,
  weight: 65,
  activityLevel: "moderate",
  goal: "maintain",
  calorieGoal: 1000,
  macros: {
    carbs: 50,
    protein: 25,
    fat: 25,
  },
};

const API_URL =
import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL.trim() !== ""
  ? import.meta.env.VITE_API_URL
  : "https://aroi-dee-backend.vercel.app";


type UserProfileContextType = {
  userData: UserProfile;
  setUserData: React.Dispatch<React.SetStateAction<UserProfile>>;
};

const UserProfileContext = createContext<UserProfileContextType | undefined>(
  undefined
);

export const UserProfileProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [userData, setUserData] = useState<UserProfile>(defaultUserProfile);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      try {
        const response = await axios.get(`${API_URL}/api/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = response.data.user;

        if (data) {
          setUserData((prev) => ({
            ...prev,
            id: data.id,
            calorieGoal: data.calories_goal ?? prev.calorieGoal,
            // หากต้องการ fetch เพิ่ม เช่น weight, height ให้ map ใส่เพิ่มตรงนี้
          }));
        }
      } catch (error) {
        console.error("Failed to fetch user profile", error);
      }
    };

    fetchUserProfile();
  }, []);

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
