import { BACKEND_URL } from "@/lib/backend";
// src/app/api/websiteApi.ts
// Service để gọi API backend Spring Boot cho Website Settings

import axios from "axios";

// Lấy URL từ environment variables
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || `${BACKEND_URL}/api`;

// Tạo axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// ============== TYPES ==============

export interface WebsiteSettingResponse {
  id: number;
  websiteName: string;
  phone: string;
  email: string;
  address: string;
}

// ============== API FUNCTIONS ==============

/**
 * Lấy thông tin website settings (public endpoint)
 */
export const getWebsiteSettings = async () => {
  console.log("🚀 Calling getWebsiteSettings API");
  return api.get<WebsiteSettingResponse>("/website-settings");
};

// Export axios instance nếu cần custom requests
export { api };
