export const dynamic = "force-dynamic";

import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8088",
  withCredentials: true,
});

export interface ChatbotRequest {
  userMessage: string;
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
  return api.post<ChatbotResponse>("/api/chatbot/chat", {
    message: message,
    sessionId: sessionId || null,
    userId: userId || null,
  });
};
