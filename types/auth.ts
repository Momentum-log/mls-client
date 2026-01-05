export interface User {
  id: string;
  userCode: string;
  email: string;
  name: string;
  phone?: string | null;
  address?: any | null; // Detailed address type can be defined later if needed
  is_verified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  guestUserId?: string;
}
