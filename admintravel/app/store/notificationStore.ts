import { create } from "zustand";

export interface BookingNotification {
  bookingId: number;
  bookingCode: string;
  status: string;
  message: string;
  timestamp: string;
  customerName: string;
  totalAmount: number;
  userId: number;
  notificationType: string;
  read?: boolean;
}

interface NotificationState {
  notifications: BookingNotification[];
  unreadCount: number;
  isConnected: boolean;

  addNotification: (notification: BookingNotification) => void;
  markAsRead: (bookingId: number) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  setConnected: (connected: boolean) => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isConnected: false,

  addNotification: (notification) => {
    set((state) => {
      const newNotification = { ...notification, read: false };
      const notifications = [newNotification, ...state.notifications].slice(0, 50); // Keep last 50
      return {
        notifications,
        unreadCount: state.unreadCount + 1,
      };
    });
  },

  markAsRead: (bookingId) => {
    set((state) => {
      const notifications = state.notifications.map((n) =>
        n.bookingId === bookingId ? { ...n, read: true } : n
      );
      const unreadCount = notifications.filter((n) => !n.read).length;
      return { notifications, unreadCount };
    });
  },

  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    }));
  },

  clearNotifications: () => {
    set({ notifications: [], unreadCount: 0 });
  },

  setConnected: (connected) => {
    set({ isConnected: connected });
  },
}));
