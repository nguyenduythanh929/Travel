"use client";

import { useEffect, useCallback } from "react";
import { toast } from "sonner";
import { websocketService } from "../services/websocketService";
import {
  useNotificationStore,
  BookingNotification,
} from "../store/notificationStore";

export function useWebSocketConnection(userId?: string) {
  useEffect(() => {
    websocketService.connect(userId);

    return () => {
      websocketService.disconnect();
    };
  }, [userId]);

  return useNotificationStore((state) => state.isConnected);
}

export function useNotifications() {
  const notifications = useNotificationStore((state) => state.notifications);
  const unreadCount = useNotificationStore((state) => state.unreadCount);
  const isConnected = useNotificationStore((state) => state.isConnected);
  const markAsRead = useNotificationStore((state) => state.markAsRead);
  const markAllAsRead = useNotificationStore((state) => state.markAllAsRead);
  const clearNotifications = useNotificationStore(
    (state) => state.clearNotifications
  );

  return {
    notifications,
    unreadCount,
    isConnected,
    markAsRead,
    markAllAsRead,
    clearNotifications,
  };
}

export function useNotificationToast() {
  const notifications = useNotificationStore((state) => state.notifications);

  useEffect(() => {
    const unsubscribe = useNotificationStore.subscribe((state, prevState) => {
      if (state.notifications.length > prevState.notifications.length) {
        const newNotification = state.notifications[0];
        showNotificationToast(newNotification);
      }
    });

    return () => unsubscribe();
  }, []);
}

function showNotificationToast(notification: BookingNotification) {
  const { notificationType, message, bookingCode, customerName, totalAmount } =
    notification;

  const formattedAmount = totalAmount?.toLocaleString("vi-VN") + " VND";

  switch (notificationType) {
    case "NEW_BOOKING":
      toast.success(`Booking moi: ${bookingCode}`, {
        description: `Khach hang: ${customerName} - ${formattedAmount}`,
        duration: 5000,
      });
      break;

    case "STATUS_CHANGE":
      toast.info(`Cap nhat booking: ${bookingCode}`, {
        description: message,
        duration: 4000,
      });
      break;

    case "PAYMENT_CONFIRMED":
      toast.success(`Thanh toan xac nhan: ${bookingCode}`, {
        description: message,
        duration: 4000,
      });
      break;

    case "BOOKING_CANCELLED":
      toast.warning(`Booking huy: ${bookingCode}`, {
        description: message,
        duration: 4000,
      });
      break;

    case "BOOKING_EXPIRED":
      toast.error(`Booking het han: ${bookingCode}`, {
        description: message,
        duration: 4000,
      });
      break;

    case "BOOKING_COMPLETED":
      toast.success(`Booking hoan thanh: ${bookingCode}`, {
        description: message,
        duration: 4000,
      });
      break;

    default:
      toast.info(message || "Thong bao moi", {
        description: `Ma booking: ${bookingCode}`,
        duration: 4000,
      });
  }
}

export function getNotificationIcon(type: string): string {
  switch (type) {
    case "NEW_BOOKING":
      return "🆕";
    case "STATUS_CHANGE":
      return "🔄";
    case "PAYMENT_CONFIRMED":
      return "💰";
    case "BOOKING_CANCELLED":
      return "❌";
    case "BOOKING_EXPIRED":
      return "⏰";
    case "BOOKING_COMPLETED":
      return "✅";
    default:
      return "📢";
  }
}

export function formatNotificationTime(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Vua xong";
  if (diffMins < 60) return `${diffMins} phut truoc`;
  if (diffHours < 24) return `${diffHours} gio truoc`;
  if (diffDays < 7) return `${diffDays} ngay truoc`;

  return date.toLocaleDateString("vi-VN");
}
