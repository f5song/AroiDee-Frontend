import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";
import { useUserProfile } from "@/contexts/UserProfileContext";

// ใช้ API_URL จาก environment variable หรือค่า default
const API_URL =
  import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL.trim() !== ""
    ? import.meta.env.VITE_API_URL
    : "https://aroi-dee-backend.vercel.app"; // Default URL ถ้าไม่มีค่าใน .env

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
  const { setUserData } = useUserProfile();
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
      const response = await axios.post(`${API_URL}/api/users/login`, {
        identifier,
        password,
      });

      const { token, user } = response.data;

      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(user));

      setToken(token);
      setUser(user);

      axios.defaults.headers.common.Authorization = `Bearer ${token}`;

      // 🔥 เพิ่มส่วนนี้: fetch profile เต็มจาก backend
      const profileRes = await axios.get(`${API_URL}/api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = profileRes.data.user;

      // 🔥 อัปเดต context ของ UserProfile
      setUserData({
        id: data.id,
        gender: data.gender,
        birthdate: data.birthdate,
        height: data.height,
        weight: data.weight,
        activityLevel: data.activity_level,
        goal: data.goal,
        calorieGoal: data.calories_goal,
        macros: {
          carbs: data.macros?.carbs || 50,
          protein: data.macros?.protein || 25,
          fat: data.macros?.fat || 25,
        },
      });
    } catch (error: any) {
      console.error(
        "Login failed:",
        error.response?.data?.message || error.message
      );
      throw new Error(error.response?.data?.message || "เข้าสู่ระบบล้มเหลว");
    } finally {
      setIsLoading(false);
    }
  };

  // เพิ่มฟังก์ชัน loginWithGoogle
  const loginWithGoogle = async (googleToken: string) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${API_URL}/api/users/google-login`, // ใช้ API_URL ที่ตั้งค่าไว้
        { token: googleToken }
      );

      const { token, user } = response.data;

      // บันทึก Token & User ลงใน LocalStorage
      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(user));

      setToken(token);
      setUser(user);

      // ตั้งค่า axios ให้ใช้ token อัตโนมัติ
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    } catch (error: any) {
      console.error(
        "Google login failed:",
        error.response?.data?.message || error.message
      );
      throw new Error(
        error.response?.data?.message || "การเข้าสู่ระบบด้วย Google ล้มเหลว"
      );
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
        logout,
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

