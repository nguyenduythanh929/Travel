import { BACKEND_URL } from "@/lib/backend";
export const dynamic = "force-dynamic";

import axios from "axios";

const api = axios.create({
  baseURL: `${BACKEND_URL}`,
  withCredentials: true,
});

export interface ChatbotRequest {
  message: string;
  sessionId?: string | null;
  userId?: number | null;
}

export interface TourResponse {
  id: number;
  name: string;
  priceAdult: number;
  priceChild: number;
  duration: number;
  transport: string;
  locations: string[];
  tourType: string;
}

export interface ChatbotResponse {
  message: string;
  sessionId: string;
  recommendedTours: TourResponse[];
}

export const getResponseAi = (
  message: string,
  sessionId?: string | null,
  userId?: number | null
) => {
  const request: ChatbotRequest = {
    message: message,
    sessionId: sessionId || null,
    userId: userId || null,
  };
  return api.post<ChatbotResponse>("/api/chatbot/chat", request);
};
