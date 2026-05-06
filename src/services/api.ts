import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { tokenStorage } from "../utils/cookies";

const rawBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
const BASE_URL = `${rawBaseUrl.replace(/\/$/, "").replace(/\/api$/, "")}/api`;

const redirectToSignIn = () => {
  if (typeof window === "undefined") {
    return;
  }

  const target = `${window.location.origin}/signin`;
  if (window.location.pathname + window.location.search + window.location.hash !== new URL(target).pathname) {
    // Use replace to avoid adding history entry
    window.location.replace(target);
  }
};

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenStorage.getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const originalRequest = (error.config as InternalAxiosRequestConfig & { _retry?: boolean }) || {};

    // Attempt token refresh and retry once
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = tokenStorage.getRefreshToken();
      if (refreshToken) {
        // Use a raw axios call (no interceptors) to refresh token
        return axios
          .post(
            `${BASE_URL}/auth/refresh`,
            { refreshToken },
            { headers: { "Content-Type": "application/json" }, timeout: 10000 }
          )
          .then((res) => {
            const refreshed = res.data && (res.data.data || res.data);
            const newAccessToken = refreshed?.accessToken || refreshed?.access_token || null;
            const newRefreshToken = refreshed?.refreshToken || refreshed?.refresh_token || null;
            if (newAccessToken) {
              tokenStorage.setToken(newAccessToken);
            }
            if (newRefreshToken && tokenStorage.setRefreshToken) {
              tokenStorage.setRefreshToken(newRefreshToken);
            }

            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            }
            return api(originalRequest);
          })
          .catch((refreshError) => {
            tokenStorage.clear();
            document.cookie = "user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";
            document.cookie = "refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";
            document.cookie = "user_data=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";
            redirectToSignIn();
            return Promise.reject(refreshError);
          });
      }
    }

    // Fallback: clear auth and redirect to signin on 401
    if (error.response?.status === 401) {
      tokenStorage.clear();
      document.cookie = "user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";
      document.cookie = "refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";
      document.cookie = "user_data=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";
      redirectToSignIn();
    }
    return Promise.reject(error);
  }
);

export default api;
