import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8088/api";

// Create shared axios instance with interceptors
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Response interceptor - handle errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const status = error.response.status;

      // Handle 401 - Unauthorized
      if (status === 401) {
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }

      // Handle 403 - Forbidden (no permission)
      if (status === 403) {
        if (typeof window !== "undefined") {
          window.location.href = "/not-found";
        }
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

// Keep this for backward compatibility
export function setupAxiosInterceptors() {
  // No longer needed, interceptors are on the instance
}
