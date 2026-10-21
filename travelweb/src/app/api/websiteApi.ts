import { BACKEND_URL } from "@/lib/backend";
import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || `${BACKEND_URL}/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export interface WebsiteSettingResponse {
  id: number;
  websiteName: string;
  phone: string;
  email: string;
  address: string;
}

/**
 * Lấy thông tin website settings (public endpoint)
 */
export const getWebsiteSettings = async () => {
  console.log("🚀 Calling getWebsiteSettings API");
  return api.get<WebsiteSettingResponse>("/website-settings");
};

export { api };
