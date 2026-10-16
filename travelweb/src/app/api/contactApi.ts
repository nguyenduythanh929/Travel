// src/app/api/contactApi.ts
// Service để gọi API backend Spring Boot cho Contact

import axios from "axios";

// Lấy URL từ environment variables
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8088/api";

// Tạo axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// ============== TYPES ==============

export interface ContactRequest {
  email: string;
}

export interface ContactResponse {
  id: number;
  email: string;
}

// ============== API FUNCTIONS ==============

/**
 * Gửi thông tin liên hệ (public endpoint)
 */
export const createContact = async (data: ContactRequest) => {
  console.log("🚀 Calling createContact API:", data);
  return api.post<ContactResponse>("/contacts", data);
};

// Export axios instance nếu cần custom requests
export { api };
