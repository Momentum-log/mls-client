import { LoginData, RegisterData } from "@/types/auth";
import apiClient from "..";

// register function
export const register = async (payload: RegisterData) => {
  return apiClient.post("/auth/register", payload);
};

// login function
export const login = async (payload: LoginData) => {
  return apiClient.post("/auth/login", payload);
};
