import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

// ประกาศ interface สำหรับ window object เพื่อรองรับ Google API
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement, config: any) => void;
          prompt: () => void;
        };
      };
    };
  }
}

interface GoogleAuthButtonProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({
  onSuccess,
  onError,
}) => {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // โหลด Google Identity Services JavaScript API
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = initializeGoogleAuth;

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const initializeGoogleAuth = () => {
    if (window.google && buttonRef.current) {
      // ใส่ Google Client ID ของคุณที่นี่
      const clientId =
        "245606437462-ppji0r1kh89tuhreq4d1u49i83tagn3k.apps.googleusercontent.com";

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleResponse,
        auto_select: false,
      });

      window.google.accounts.id.renderButton(buttonRef.current, {
        type: "standard",
        theme: "outline",
        size: "large",
        text: "continue_with",
        shape: "rectangular",
        logo_alignment: "center",
        width: "100%",
      });
    }
  };

  const handleGoogleResponse = async (response: any) => {
    try {
      // การตอบกลับจาก Google จะมี credential (ID token)
      const { credential } = response;

      // ส่ง Google token ไปยัง backend ผ่านฟังก์ชั่น loginWithGoogle ใน AuthContext
      await loginWithGoogle(credential);

      // เรียกใช้ callback onSuccess ถ้ามี
      onSuccess?.();

      // Redirect ไปยังหน้าหลักหลังจากเข้าสู่ระบบสำเร็จ
      navigate("/");
    } catch (error: any) {
      console.error("Google Authentication Error:", error);
      onError?.(error.message || "Failed to authenticate with Google");
    }
  };

  return (
    <div className="w-full">
      <div ref={buttonRef} className="w-full"></div>
    </div>
  );
};

export default GoogleAuthButton;
