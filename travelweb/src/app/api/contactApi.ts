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

export interface ContactRequest {
  email: string;
}

export interface ContactResponse {
  id: number;
  email: string;
}

/**
 * Gửi thông tin liên hệ (public endpoint)
 */
export const createContact = async (data: ContactRequest) => {
  console.log("🚀 Calling createContact API:", data);
  return api.post<ContactResponse>("/contacts", data);
};

export { api };
