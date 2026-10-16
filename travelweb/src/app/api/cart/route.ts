import { BACKEND_URL } from "@/lib/backend";
export const dynamic = "force-dynamic";

import axios from "axios";

const api = axios.create({
  baseURL: `${BACKEND_URL}/api/cart`,
  withCredentials: true,
});

export const getCart = (userId: number) => {
  return api.get(`/user/${userId}`);
};

export const deleteCartItem = (cartItemId: number, userId: number) => {
  return api.delete(`/item/${cartItemId}/user/${userId}`);
};

export const clearCart = (userId: number) => {
  return api.delete(`/clear/user/${userId}`);
};

export const getCartItemCount = (userId: number) => {
  return api.get(`/count/user/${userId}`);
};
