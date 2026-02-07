export interface User {
  id: string;
  userCode: string;
  email: string;
  name: string;
  phone?: string | null;
  address?: any | null;
  is_verified: boolean;
  is_phone_verified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface LoginData {
  identifier: string; // email or phone
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone: string;
  guestUserId?: string;
}

export interface VerifyPhoneData {
  code: string;
}
