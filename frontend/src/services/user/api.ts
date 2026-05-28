import type { User } from "./types";
// import { APIEndpoints } from "@/services/api/endpoints";

// TODO: This UserAPI is not part of current scope
// Implement once user authentication is needed
export const UserAPI = {
  fetchUserData: async (): Promise<User> => {
    try {
      throw new Error("Not implemented");
    } catch (error) {
      console.error("Error fetching user data:", error);
      throw error;
    }
  },
};
