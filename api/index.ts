import axios, { AxiosError, AxiosRequestConfig } from "axios";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

import {
  getAccessToken,
  getOrSetGuestId,
  getRefreshToken,
} from "@/utils/auth-helper";
import { useAuthStore } from "@/store/auth-store";
import { forceSignOut } from "@/utils/force-sign-out";
import {
  classifyAuthError,
  getAuthFailureDetails,
  getAuthFailureReason,
} from "@/utils/auth-failure";
import { RefreshResponse } from "@/types/auth";

apiClient.interceptors.request.use(
  (config) => {
    // Only run on client side where cookies are accessible
    if (typeof window !== "undefined") {
      const guestId = getOrSetGuestId();
      if (guestId) {
        config.headers["X-Guest-ID"] = guestId;
      }

      const mlsKey = process.env.NEXT_PUBLIC_MLS_KEY;
      if (mlsKey) {
        config.headers["X-MLS-Key"] = mlsKey;
      }

      const token = getAccessToken();
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

/**
 * Endpoints whose 401s are about the credentials in the request body, not about
 * an expired session. Refreshing on their behalf would be meaningless, and for
 * `/auth/refresh-token` itself it would recurse.
 */
const NO_REFRESH_ENDPOINTS = [
  "/auth/login-user",
  "/auth/register-user",
  "/auth/refresh-token",
  "/auth/logout-user",
  "/auth/forgot-password",
  "/auth/reset-password",
];

type RetriableRequest = AxiosRequestConfig & { _retry?: boolean };

interface QueuedRequest {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}

let isRefreshing = false;
let failedQueue: QueuedRequest[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error || !token) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as RetriableRequest | undefined;

    if (!originalRequest) return Promise.reject(error);

    const url = originalRequest.url ?? "";
    if (NO_REFRESH_ENDPOINTS.some((endpoint) => url.includes(endpoint))) {
      return Promise.reject(error);
    }

    // Read the server's `reason` before deciding anything. Getting this wrong is
    // the difference between a seamless retry and an unexplained logout.
    const action = classifyAuthError(error);

    if (action === "SIGN_OUT") {
      // Deliberately no refresh attempt: for a revoked, expired, or replayed
      // session it fails identically and only delays the inevitable.
      forceSignOut(getAuthFailureReason(error), getAuthFailureDetails(error));
      return Promise.reject(error);
    }

    if (action === "REFRESH") {
      // One retry per 401, full stop. A second refresh presenting an already
      // rotated token outside the server's 60-second grace window is read as a
      // stolen token and ends the session outright.
      if (originalRequest._retry) {
        forceSignOut("REFRESH_FAILED");
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      // A request dispatched before a rotation completed carries the old token
      // and 401s after the refresh already finished. Replaying it with the
      // current token is enough — refreshing again would burn the fresh token
      // for nothing and is the second way to trip reuse detection.
      const sentWith = String(
        originalRequest.headers?.Authorization ?? "",
      ).replace("Bearer ", "");
      const current = getAccessToken();

      if (current && sentWith && current !== sentWith) {
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${current}`,
        };
        return apiClient(originalRequest);
      }

      // A refresh is already in flight — wait on it rather than starting a
      // second one. `_retry` above is set for queued requests too, so one that
      // 401s again lands in the branch above instead of here.
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers = {
            ...originalRequest.headers,
            Authorization: `Bearer ${token}`,
          };
          return apiClient(originalRequest);
        });
      }

      isRefreshing = true;

      const refreshToken = getRefreshToken();

      if (!refreshToken) {
        isRefreshing = false;
        processQueue(error, null);
        forceSignOut("NO_TOKEN");
        return Promise.reject(error);
      }

      try {
        // Deliberately bare `axios`, not `apiClient`: routing this through the
        // instance would put a failing refresh back into this interceptor.
        const response = await axios.post<RefreshResponse>(
          `${baseURL}/auth/refresh-token`,
          { refreshToken },
        );

        const {
          accessToken,
          refreshToken: newRefreshToken,
          session,
        } = response.data;

        // Through the store, so the persisted copy of the refresh token stays
        // in step with the cookie. Logout revokes whatever the store holds.
        useAuthStore
          .getState()
          .setSessionTokens(accessToken, newRefreshToken, session);

        apiClient.defaults.headers.common["Authorization"] =
          `Bearer ${accessToken}`;
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${accessToken}`,
        };

        processQueue(null, accessToken);

        return apiClient(originalRequest);
      } catch (err) {
        processQueue(err, null);
        // Never retry with the old token. This is also the v6.0.0 rollout path:
        // a pre-upgrade token refreshes against a migration-revoked refresh
        // token, fails, and the user lands on sign-in.
        forceSignOut("REFRESH_FAILED", getAuthFailureDetails(err));
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    if (
      error.response?.status === 403 &&
      (error.response.data as { message?: string } | undefined)?.message ===
        "Verification Required"
    ) {
      useAuthStore.getState().setIsPhoneVerificationModalOpen(true);
    }

    return Promise.reject(error);
  },
);

export default apiClient;
