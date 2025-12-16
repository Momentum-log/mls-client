import axios from "axios";
import { getOrSetGuestId } from "@/utils/auth-helper";

const BASE_URL = "http://localhost:8000/api";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    // Only run on client side where cookies are accessible
    if (typeof window !== "undefined") {
      const guestId = getOrSetGuestId();
      if (guestId) {
        config.headers["X-Guest-ID"] = guestId;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
