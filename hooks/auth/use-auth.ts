import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import {
  login,
  logout as apiLogout,
  logoutAll,
  register,
  sendPhoneOTP,
  verifyPhoneOTP,
} from "@/api/auth";
import { useAuthStore } from "@/store/auth-store";
import { useToast } from "@/hooks/use-toast";
import {
  AuthErrorBody,
  LoginData,
  RegisterData,
  VerifyPhoneData,
} from "@/types/auth";

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
      // `session` is absent on a server older than v6.0.0; the store treats it
      // as optional and the Security card hides itself without one.
      const { user, accessToken, refreshToken, session } = response.data;
      if (user && accessToken && refreshToken) {
        setAuth(user, accessToken, refreshToken, session);
        addToast({
          type: "success",
          title: "Welcome back!",
          message: "You have successfully logged in.",
        });
      }
    },
  });
};

/**
 * Ends the session on this device.
 *
 * Revokes the refresh token server-side before clearing locally — since v6.0.0
 * that revocation is what actually kills the session, so skipping it leaves the
 * access token working elsewhere for its remaining lifetime. Local state is
 * cleared either way: a user who asked to sign out is signed out.
 */
export const useLogout = () => {
  const { logout, refreshToken } = useAuthStore();
  const { addToast } = useToast();
  const router = useRouter();

  return async () => {
    try {
      if (refreshToken) {
        await apiLogout(refreshToken);
      }
    } catch {
      // A failed revocation is not a reason to strand the user signed in.
    } finally {
      logout();
      addToast({
        type: "success",
        title: "Signed out",
        message: "You have been logged out safely.",
      });
      router.push("/login");
    }
  };
};

/**
 * Ends every session for this account, including the current device — so this
 * signs the user out here too.
 */
export const useLogoutAll = () => {
  const logout = useAuthStore((state) => state.logout);
  const { addToast } = useToast();
  const router = useRouter();

  return useMutation({
    mutationFn: () => logoutAll(),
    onSuccess: () => {
      logout();
      addToast({
        type: "success",
        title: "Signed out everywhere",
        message: "Every device has been signed out of your account.",
      });
      router.push("/login");
    },
    onError: (error: AxiosError<AuthErrorBody>) => {
      addToast({
        type: "error",
        title: "Could not sign out everywhere",
        message:
          error.response?.data?.error ??
          "Something went wrong. Please try again.",
      });
    },
  });
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
