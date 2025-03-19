import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import axios from "axios";

type User = {
  id: number;
  username: string;
  email: string;
  avatar?: string;
} | null;

interface AuthContextType {
  user: User;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  loginWithGoogle: (token: string) => Promise<void>; // เพิ่มฟังก์ชันสำหรับ Google login
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // ดึง token และ user จาก localStorage เมื่อโหลดหน้า
    const savedToken = localStorage.getItem("authToken");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));

      // ตั้งค่า axios ให้ใช้ token อัตโนมัติ
      axios.defaults.headers.common.Authorization = `Bearer ${savedToken}`;
    }

    setIsLoading(false);
  }, []);

  // ใช้ API /api/login เพื่อเข้าสู่ระบบ (รองรับทั้ง username และ email)
  const login = async (identifier: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await axios.post("https://aroi-dee-backend.vercel.app/api/users/login", {
        identifier, // ใช้ identifier (username หรือ email)
        password,
      });

      const { token, user } = response.data;

      // บันทึก Token & User ลงใน LocalStorage
      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(user));

      setToken(token);
      setUser(user);

      // ตั้งค่า axios ให้ใช้ token อัตโนมัติ
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    } catch (error: any) {
      console.error("Login failed:", error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || "เข้าสู่ระบบล้มเหลว");
    } finally {
      setIsLoading(false);
    }
  };

  // เพิ่มฟังก์ชัน loginWithGoogle
  const loginWithGoogle = async (googleToken: string) => {
    setIsLoading(true);
    try {
      // ส่ง Google ID token ไปที่ backend เพื่อตรวจสอบและรับ JWT token กลับมา
      const response = await axios.post("https://aroi-dee-backend.vercel.app/api/users/google-login", {
        token: googleToken,
      });

      const { token, user } = response.data;

      // บันทึก Token & User ลงใน LocalStorage
      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(user));

      setToken(token);
      setUser(user);

      // ตั้งค่า axios ให้ใช้ token อัตโนมัติ
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    } catch (error: any) {
      console.error("Google login failed:", error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || "การเข้าสู่ระบบด้วย Google ล้มเหลว");
    } finally {
      setIsLoading(false);
    }
  };

  // ลบ Token และข้อมูลผู้ใช้เมื่อ Logout
  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);

    // รีเฟรชแอปเพื่อเคลียร์ข้อมูลทั้งหมด
    window.location.reload();
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        token, 
        isAuthenticated: !!user, 
        isLoading, 
        login, 
        loginWithGoogle, // เพิ่ม loginWithGoogle เข้าไปใน context
        logout 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook สำหรับใช้งาน Context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export default AuthContext;