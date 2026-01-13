import { LoginData, RegisterData } from "@/types/auth";
import apiClient from "..";

// register function
/**
 * Registers a new user.
 */
export const register = (data: RegisterData) => {
  return apiClient.post("/auth/register-user", data);
};

/**
 * Logins a user.
 */
export const login = (data: LoginData) => {
  return apiClient.post("/auth/login-user", data);
};

/**
 * Logouts the current user.
 */
export const logout = () => {
  return apiClient.post("/auth/logout-user");
};

/**
 * Gets the current authenticated user's profile.
 */
export const getCurrentUser = () => {
  return apiClient.get("/auth/get-current-user");
};

/**
 * Updates the current user's profile information.
 */
export const updateProfile = (data: any) => {
  return apiClient.put("/auth/update-user-profile", data);
};
