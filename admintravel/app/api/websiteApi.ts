import api from "@/app/lib/axios";

export interface WebsiteSettingResponse {
  id: number;
  websiteName: string;
  phone: string;
  email: string;
  address: string;
}

export interface WebsiteSettingRequest {
  websiteName: string;
  phone: string;
  email: string;
  address: string;
}

/**
 * Lấy thông tin website settings
 */
export const getWebsiteSettings = async () => {
  console.log("🚀 Calling getWebsiteSettings API");
  return api.get<WebsiteSettingResponse>("/website-settings");
};

/**
 * Cập nhật thông tin website settings
 */
export const updateWebsiteSettings = async (data: WebsiteSettingRequest) => {
  console.log("🚀 Calling updateWebsiteSettings API:", data);
  return api.put<WebsiteSettingResponse>("/website-settings", data);
};

export { api };
