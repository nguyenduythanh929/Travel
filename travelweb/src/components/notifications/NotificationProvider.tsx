"use client";

import { useEffect, useRef } from "react";
import { useAppContext } from "@/app/AppProvider";
import { webSocketService } from "@/lib/websocket";
import { useNotificationStore } from "@/store/notificationStore";
import { toast } from "sonner";

interface NotificationProviderProps {
  children: React.ReactNode;
  isAdmin?: boolean;
}

export default function NotificationProvider({
  children,
  isAdmin = false,
}: NotificationProviderProps) {
  const { userId, sessionToken } = useAppContext();
  const previousNotificationsRef = useRef<number>(0);
  const notifications = useNotificationStore((state) => state.notifications);
  const hasHydrated = useNotificationStore((state) => state.hasHydrated);

  // Connect to WebSocket when user is authenticated
  useEffect(() => {
    if (userId && sessionToken) {
      console.log("Connecting WebSocket for user:", userId);
      webSocketService.connect(userId, isAdmin);

      return () => {
        webSocketService.disconnect();
      };
    }
  }, [userId, sessionToken, isAdmin]);

  // Show toast when new notification arrives
  useEffect(() => {
    if (!hasHydrated) return;

    const currentCount = notifications.length;
    if (currentCount > previousNotificationsRef.current && previousNotificationsRef.current > 0) {
      const latestNotification = notifications[0];
      if (latestNotification && !latestNotification.read) {
        showNotificationToast(latestNotification);
      }
    }
    previousNotificationsRef.current = currentCount;
  }, [notifications, hasHydrated]);

  const showNotificationToast = (notification: typeof notifications[0]) => {
    const { notificationType, message, bookingCode, status } = notification;

    switch (notificationType) {
      case "NEW_BOOKING":
        toast.info(`New Booking: ${bookingCode}`, {
          description: message,
          duration: 5000,
        });
        break;

      case "PAYMENT_CONFIRMED":
        toast.success(`Payment Confirmed: ${bookingCode}`, {
          description: message,
          duration: 5000,
        });
        break;

      case "BOOKING_CANCELLED":
        toast.error(`Booking Cancelled: ${bookingCode}`, {
          description: message,
          duration: 5000,
        });
        break;

      case "BOOKING_EXPIRED":
        toast.warning(`Booking Expired: ${bookingCode}`, {
          description: message,
          duration: 5000,
        });
        break;

      case "BOOKING_COMPLETED":
        toast.success(`Booking Completed: ${bookingCode}`, {
          description: message,
          duration: 5000,
        });
        break;

      case "STATUS_CHANGE":
        toast.info(`Booking Update: ${bookingCode}`, {
          description: `Status: ${status} - ${message}`,
          duration: 5000,
        });
        break;

      default:
        toast(message, {
          description: `Booking: ${bookingCode}`,
          duration: 5000,
        });
    }
  };

  return <>{children}</>;
}
