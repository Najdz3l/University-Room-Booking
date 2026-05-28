export const UserRoles = {
  USER: "USER",
  ADMIN: "ADMIN",
} as const;

export type UserRole = (typeof UserRoles)[keyof typeof UserRoles];

export interface User {
  id: string;
  name: string;
  role: UserRole;
}
