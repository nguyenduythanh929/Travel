import { create } from "zustand";
import { persist } from "zustand/middleware";

// Notification type matching backend BookingNotificationDTO
export interface BookingNotification {
  bookingId: number;
  bookingCode: string;
  status: string;
  message: string;
  timestamp: string;
  customerName?: string;
  totalAmount?: number;
  userId?: number;
  notificationType: string;
  read: boolean;
  id: string; // Unique ID for frontend tracking
}

interface NotificationState {
  notifications: BookingNotification[];
  unreadCount: number;
  isConnected: boolean;
  hasHydrated: boolean;

  // Actions
  addNotification: (notification: Omit<BookingNotification, "read" | "id">) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  removeNotification: (id: string) => void;
  setConnected: (connected: boolean) => void;
  setHasHydrated: (hydrated: boolean) => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,
      isConnected: false,
      hasHydrated: false,

      addNotification: (notification) => {
        const newNotification: BookingNotification = {
          ...notification,
          read: false,
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        };

        set((state) => ({
          notifications: [newNotification, ...state.notifications].slice(0, 50), // Keep last 50
          unreadCount: state.unreadCount + 1,
        }));
      },

      markAsRead: (id) => {
        set((state) => {
          const notification = state.notifications.find((n) => n.id === id);
          if (notification && !notification.read) {
            return {
              notifications: state.notifications.map((n) =>
                n.id === id ? { ...n, read: true } : n
              ),
              unreadCount: Math.max(0, state.unreadCount - 1),
            };
          }
          return state;
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

      removeNotification: (id) => {
        set((state) => {
          const notification = state.notifications.find((n) => n.id === id);
          const unreadDecrease = notification && !notification.read ? 1 : 0;
          return {
            notifications: state.notifications.filter((n) => n.id !== id),
            unreadCount: Math.max(0, state.unreadCount - unreadDecrease),
          };
        });
      },

      setConnected: (connected) => {
        set({ isConnected: connected });
      },

      setHasHydrated: (hydrated) => {
        set({ hasHydrated: hydrated });
      },
    }),
    {
      name: "notification-storage",
      partialize: (state) => ({
        notifications: state.notifications,
        unreadCount: state.unreadCount,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
