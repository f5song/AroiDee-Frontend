import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

type User = {
  id: number;
  username: string;
  email: string;
} | null;

interface AuthContextType {
  user: User;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  login: async () => {},
  logout: () => {}
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // ตรวจสอบว่ามี token และ user ที่บันทึกไว้หรือไม่
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('authToken');

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  // ✅ ใช้ API /api/users/login เพื่อเข้าสู่ระบบ
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);

      const response = await fetch('https://aroi-dee-backend.vercel.app/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'เข้าสู่ระบบล้มเหลว');
      }

      // ✅ บันทึก Token & User ลงใน LocalStorage
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      setUser(data.user);
    } catch (error: any) {
      console.error('Login failed:', error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ ลบ Token และข้อมูลผู้ใช้ออกเมื่อล็อกเอาต์
  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
