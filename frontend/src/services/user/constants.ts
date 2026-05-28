// Validation rules for user data
export const USER_VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 8,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 20,
} as const;

// Default User Data
export const DEFAULT_USER = {
  id: "",
  email: "",
  username: "",
  role: "USER" as const, // Default role is USER and is read-only
  createdAt: new Date().toISOString(),
} as const;
