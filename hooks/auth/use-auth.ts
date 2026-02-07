import { useMutation } from "@tanstack/react-query";
import { login, register, sendPhoneOTP, verifyPhoneOTP } from "@/api/auth";
import { useAuthStore } from "@/store/auth-store";
import { useToast } from "@/hooks/use-toast";
import { LoginData, RegisterData, VerifyPhoneData } from "@/types/auth";

export const useRegister = () => {
  return useMutation({
    mutationFn: (payload: RegisterData) => register(payload),
  });
};

export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const { addToast } = useToast();

  return useMutation({
    mutationFn: (payload: LoginData) => login(payload),
    onSuccess: (response) => {
      // Assuming response.data contains { user, accessToken, refreshToken }
      // Adjust based on actual API response structure if strictly typed
      const { user, accessToken, refreshToken } = response.data;
      if (user && accessToken && refreshToken) {
        setAuth(user, accessToken, refreshToken);
        addToast({
          type: "success",
          title: "Welcome back!",
          message: "You have successfully logged in.",
        });
      }
    },
  });
};

export const useLogout = () => {
  const logout = useAuthStore((state) => state.logout);
  const { addToast } = useToast();

  return () => {
    logout();
    addToast({
      type: "info",
      title: "Logged out",
      message: "You have been logged out safely.",
    });
    // Optional: Redirect
  };
};

/**
 * Hook for sending phone verification OTP.
 */
export const useSendPhoneOTP = () => {
  return useMutation({
    mutationFn: (payload?: { phone?: string }) => sendPhoneOTP(payload),
  });
};

/**
 * Hook for verifying phone OTP.
 */
export const useVerifyPhoneOTP = () => {
  return useMutation({
    mutationFn: (payload: VerifyPhoneData & { phone?: string }) =>
      verifyPhoneOTP(payload),
  });
};
