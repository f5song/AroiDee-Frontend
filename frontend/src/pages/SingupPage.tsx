import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  useTermsPrivacy,
  TermsPrivacyProvider,
} from "@/components/auth/TermsPrivacyManager";
import { Eye, EyeOff } from "lucide-react";
import GoogleAuthButton from '@/components/auth/GoogleAuthButton';


const API_URL =
  import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL.trim() !== ""
    ? import.meta.env.VITE_API_URL
    : "https://aroi-dee-backend.vercel.app"; // Default URL ถ้าไม่มีค่าใน .env


const SignupPageContent: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { openTerms, openPrivacy } = useTermsPrivacy();
  const navigate = useNavigate();

  const validateUsername = (username: string): boolean => {
    // Check if username is all lowercase and contains no spaces
    const usernameRegex = /^[a-z0-9_-]+$/;
    return usernameRegex.test(username);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password) {
      setError("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return;
    }

    if (!validateUsername(name)) {
      setError("ชื่อผู้ใช้ต้องเป็นตัวพิมพ์เล็กและไม่มีช่องว่าง (อนุญาตเฉพาะตัวอักษร, ตัวเลข, เครื่องหมายขีดล่าง และขีดกลางเท่านั้น)");
      return;
    }

    if (password !== confirmPassword) {
      setError("รหัสผ่านไม่ตรงกัน");
      return;
    }

    if (password.length < 8) {
      setError("รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/users/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: name, email, password }),
        }
      );

      // Check if the response has content
      if (!response.ok) {
        const errorText = await response.text(); // Read message from response
        throw new Error(errorText || "การลงทะเบียนล้มเหลว");
      }

      const data = await response.json(); // Convert response to JSON

      if (!data.success) {
        throw new Error(data.message || "การลงทะเบียนล้มเหลว");
      }

      alert("ลงทะเบียนสำเร็จ! 🎉 กรุณาเข้าสู่ระบบ");
      navigate("/login"); // Navigate user to Login page
    } catch (err: any) {
      setError(err.message || "เกิดข้อผิดพลาด");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = () => {
    // จัดการเมื่อล็อกอินด้วย Google สำเร็จ (การนำทางจะจัดการโดย GoogleAuthButton)
  };

  const handleGoogleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            สมัครสมาชิก
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            หรือ{" "}
            <Link
              to="/login"
              className="font-medium text-orange-500 hover:text-orange-600"
            >
              เข้าสู่ระบบ
            </Link>{" "}
            หากคุณมีบัญชีอยู่แล้ว
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <div className="mt-8">
          <GoogleAuthButton 
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
          />

          <div className="relative mt-6 mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">หรือสมัครด้วยอีเมล</span>
            </div>
          </div>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                ชื่อผู้ใช้
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="username"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                placeholder="ชื่อผู้ใช้ (ตัวพิมพ์เล็ก ไม่มีช่องว่าง)"
              />
              <p className="mt-1 text-xs text-gray-500">
                ชื่อผู้ใช้ต้องเป็นตัวพิมพ์เล็กและไม่มีช่องว่าง อนุญาตเฉพาะตัวอักษร ตัวเลข เครื่องหมายขีดล่าง และขีดกลางเท่านั้น
              </p>
            </div>

            <div>
              <label
                htmlFor="email-address"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                อีเมล
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                รหัสผ่าน
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                ยืนยันรหัสผ่าน
              </label>
              <div className="relative">
                <input
                  id="confirm-password"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
              ฉันยอมรับ{" "}
              <button
                type="button"
                onClick={openTerms}
                className="text-orange-500 hover:text-orange-600 hover:underline focus:outline-none"
              >
                เงื่อนไขการใช้บริการ
              </button>{" "}
              และ{" "}
              <button
                type="button"
                onClick={openPrivacy}
                className="text-orange-500 hover:text-orange-600 hover:underline focus:outline-none"
              >
                นโยบายความเป็นส่วนตัว
              </button>
            </label>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "กำลังดำเนินการ..." : "สมัครสมาชิก"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main component wrapped with TermsPrivacyProvider
const SignupPage: React.FC = () => {
  return (
    <TermsPrivacyProvider>
      <SignupPageContent />
    </TermsPrivacyProvider>
  );
};

export default SignupPage;