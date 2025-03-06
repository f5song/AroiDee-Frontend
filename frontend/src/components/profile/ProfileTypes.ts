export interface Profile {
  fullName: string;
  username: string;
  email: string;
  dateOfBirth?: string;
  gender: "Male" | "Female" | "Other";
  notifications?: boolean;
  avatar?: string;
  // เพิ่ม preferences สำหรับการตั้งค่า
  preferences?: {
    language: "th" | "en";
    darkMode?: boolean;
    units: "metric" | "imperial";
    emailNotifications?: boolean;
    pushNotifications?: boolean;
    newsletterSubscribed?: boolean;
  };
}