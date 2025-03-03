import React from 'react';
import { useAuth } from '@/components/auth/AuthContext';

const AuthDemoComponent: React.FC = () => {
  const { isAuthenticated, user, login, logout } = useAuth();

  const handleDemoLogin = async () => {
    try {
      await login('demo@example.com', 'password123');
    } catch (error) {
      console.error('Demo login failed:', error);
    }
  };

  const handleDemoLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Demo logout failed:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto my-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">สถานะการเข้าสู่ระบบ</h2>
      
      <div className="p-4 bg-gray-50 rounded-md mb-4">
        <p className="mb-2">
          <span className="font-semibold">สถานะ:</span>{' '}
          {isAuthenticated ? (
            <span className="text-green-600 font-medium">เข้าสู่ระบบแล้ว</span>
          ) : (
            <span className="text-red-600 font-medium">ยังไม่ได้เข้าสู่ระบบ</span>
          )}
        </p>
        
        {isAuthenticated && user && (
          <div className="mt-2">
            <p className="mb-1"><span className="font-semibold">ชื่อ:</span> {user.name}</p>
            <p><span className="font-semibold">อีเมล:</span> {user.email}</p>
          </div>
        )}
      </div>
      
      <div className="flex flex-col space-y-2">
        {isAuthenticated ? (
          <button
            onClick={handleDemoLogout}
            className="w-full py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            ออกจากระบบ
          </button>
        ) : (
          <button
            onClick={handleDemoLogin}
            className="w-full py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
          >
            เข้าสู่ระบบ (สาธิต)
          </button>
        )}
      </div>
    </div>
  );
};

export default AuthDemoComponent;