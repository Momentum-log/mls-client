import axios from "axios";

const stagingURL = "https://mls-server-omoq.onrender.com/api";
const localURL = "http://localhost:8000/api";

const baseURL = process.env.NODE_ENV === "development" ? localURL : stagingURL;

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
  setTokens,
  clearTokens,
} from "@/utils/auth-helper";
import { useAuthStore } from "@/store/auth-store";

apiClient.interceptors.request.use(
  (config) => {
    // Only run on client side where cookies are accessible
    if (typeof window !== "undefined") {
      const guestId = getOrSetGuestId();
      if (guestId) {
        config.headers["X-Guest-ID"] = guestId;
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
  }
);

interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
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
  async (error) => {
    const originalRequest = error.config;

    // Skip refresh logic for login endpoint or if retry already attempted
    // This prevents infinite loops if login itself returns 401
    if (originalRequest.url?.includes("/auth/login-user")) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = "Bearer " + token;
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = getRefreshToken();

      if (!refreshToken) {
        // No refresh token, logout
        useAuthStore.getState().logout();
        if (typeof window !== "undefined") {
          // Optional: Redirect to login
          // window.location.href = "/login";
        }
        return Promise.reject(error);
      }

      try {
        const response = await axios.post<RefreshResponse>(
          `${baseURL}/auth/refresh`,
          { refreshToken }
        );

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        setTokens(accessToken, newRefreshToken);

        apiClient.defaults.headers.common["Authorization"] =
          "Bearer " + accessToken;
        originalRequest.headers["Authorization"] = "Bearer " + accessToken;

        processQueue(null, accessToken);

        return apiClient(originalRequest);
      } catch (err) {
        processQueue(err, null);
        useAuthStore.getState().logout();
        if (typeof window !== "undefined") {
          // window.location.href = "/login";
        }
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
