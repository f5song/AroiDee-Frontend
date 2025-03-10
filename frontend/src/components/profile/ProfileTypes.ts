export interface Profile {
  fullName: string;
  username: string;
  email: string;
  dateOfBirth?: string;
  gender: "Male" | "Female" | "Other";
  notifications?: boolean;
  avatar?: string;
  location?: string; // Added location field for display purposes
  // Change from avatar to image_url to match API response
  image_url?: string;
  // User preferences
  preferences?: {
    language: "th" | "en";
    darkMode?: boolean;
    units: "metric" | "imperial";
    emailNotifications?: boolean;
    pushNotifications?: boolean;
    newsletterSubscribed?: boolean;
  };
}