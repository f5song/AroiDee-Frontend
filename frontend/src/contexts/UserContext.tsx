// src/contexts/UserContext.tsx
import React, { createContext, useState, useContext } from "react";

interface User {
  username: string;
  image_url?: string;
}

const UserContext = createContext<{
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
} | null>(null);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>({ username: "guest", image_url: undefined });

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};
