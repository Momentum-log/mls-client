import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { SessionInfo, User } from "@/types/auth";
import { setTokens, clearTokens, setSessionInfo } from "@/utils/auth-helper";
import { secureStorage } from "@/utils/secure-storage";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  /** Null for anyone signed in before the server started returning it. */
  session: SessionInfo | null;
  isPhoneVerificationModalOpen: boolean;
}

interface AuthActions {
  setAuth: (
    user: User,
    accessToken: string,
    refreshToken: string,
    session?: SessionInfo,
  ) => void;
  setSessionTokens: (
    accessToken: string,
    refreshToken: string,
    session?: SessionInfo,
  ) => void;
  updateUser: (user: User) => void;
  logout: () => void;
  setIsPhoneVerificationModalOpen: (isOpen: boolean) => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      accessToken: null,
      refreshToken: null,
      session: null,
      isPhoneVerificationModalOpen: false,

      setAuth: (user, accessToken, refreshToken, session) => {
        setTokens(accessToken, refreshToken);
        if (session) setSessionInfo(session);
        set({
          user,
          isAuthenticated: true,
          accessToken,
          refreshToken,
          session: session ?? null,
        });
      },

      /**
       * Records a rotated token pair without touching the user profile.
       *
       * The refresh interceptor must go through here rather than calling
       * `setTokens` directly: writing only the cookies leaves the persisted
       * store holding the *previous* refresh token, which is then what logout
       * tries to revoke. A rotation only echoes `expiresAt`, so an existing
       * `deviceLabel` is preserved rather than dropped.
       */
      setSessionTokens: (accessToken, refreshToken, session) => {
        setTokens(accessToken, refreshToken);
        set((state) => {
          const merged = session
            ? { ...state.session, ...session }
            : state.session;
          if (merged) setSessionInfo(merged);
          return { accessToken, refreshToken, session: merged };
        });
      },

      updateUser: (user) => {
        set((state) => ({ ...state, user }));
      },

      logout: () => {
        clearTokens();
        set({
          user: null,
          isAuthenticated: false,
          accessToken: null,
          refreshToken: null,
          session: null,
        });
      },

      setIsPhoneVerificationModalOpen: (isOpen) => {
        set({ isPhoneVerificationModalOpen: isOpen });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => secureStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        session: state.session,
      }),
    },
  ),
);
