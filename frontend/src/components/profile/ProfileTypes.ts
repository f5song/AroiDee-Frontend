export interface Profile {
    fullName: string;
    username: string;
    email: string;
    dateOfBirth?: string;
    gender: "Male" | "Female" | "Other";
    notifications?: boolean;
  }