import { Client, IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useNotificationStore, BookingNotification } from "@/store/notificationStore";

const WEBSOCKET_URL = "http://localhost:8088/ws";

// WebSocket topics
const ADMIN_BOOKING_TOPIC = "/topic/admin/bookings";
const USER_TOPIC_PREFIX = "/topic/users/";

class WebSocketService {
  private client: Client | null = null;
  private userId: string | null = null;
  private isAdmin: boolean = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;

  connect(userId: string, isAdmin: boolean = false): void {
    if (this.client?.connected) {
      console.log("WebSocket already connected");
      return;
    }

    this.userId = userId;
    this.isAdmin = isAdmin;
    this.reconnectAttempts = 0;

    this.initializeClient();
  }

  private initializeClient(): void {
    this.client = new Client({
      webSocketFactory: () => new SockJS(WEBSOCKET_URL),
      reconnectDelay: this.reconnectDelay,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: (str) => {
        if (process.env.NODE_ENV === "development") {
          console.log("[WebSocket Debug]:", str);
        }
      },
      onConnect: () => {
        console.log("WebSocket connected successfully");
        this.reconnectAttempts = 0;
        useNotificationStore.getState().setConnected(true);
        this.subscribe();
      },
      onDisconnect: () => {
        console.log("WebSocket disconnected");
        useNotificationStore.getState().setConnected(false);
      },
      onStompError: (frame) => {
        console.error("WebSocket STOMP error:", frame.headers["message"]);
        useNotificationStore.getState().setConnected(false);
      },
      onWebSocketError: (event) => {
        console.error("WebSocket error:", event);
        useNotificationStore.getState().setConnected(false);
      },
      onWebSocketClose: () => {
        console.log("WebSocket closed");
        useNotificationStore.getState().setConnected(false);
        this.handleReconnect();
      },
    });

    this.client.activate();
  }

  private subscribe(): void {
    if (!this.client?.connected) {
      console.warn("Cannot subscribe - WebSocket not connected");
      return;
    }

    // Subscribe to user-specific notifications
    if (this.userId) {
      const userTopic = `${USER_TOPIC_PREFIX}${this.userId}`;
      this.client.subscribe(userTopic, (message: IMessage) => {
        this.handleNotification(message);
      });
      console.log(`Subscribed to user topic: ${userTopic}`);
    }

    // Subscribe to admin notifications if user is admin
    if (this.isAdmin) {
      this.client.subscribe(ADMIN_BOOKING_TOPIC, (message: IMessage) => {
        this.handleNotification(message);
      });
      console.log(`Subscribed to admin topic: ${ADMIN_BOOKING_TOPIC}`);
    }
  }

  private handleNotification(message: IMessage): void {
    try {
      const notification = JSON.parse(message.body);
      console.log("Received notification:", notification);

      // Add notification to store
      useNotificationStore.getState().addNotification({
        bookingId: notification.bookingId,
        bookingCode: notification.bookingCode,
        status: notification.status,
        message: notification.message,
        timestamp: notification.timestamp,
        customerName: notification.customerName,
        totalAmount: notification.totalAmount,
        userId: notification.userId,
        notificationType: notification.notificationType,
      });
    } catch (error) {
      console.error("Error parsing notification:", error);
    }
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error("Max reconnect attempts reached");
      return;
    }

    this.reconnectAttempts++;
    console.log(
      `Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`
    );

    setTimeout(() => {
      if (this.userId) {
        this.initializeClient();
      }
    }, this.reconnectDelay * this.reconnectAttempts);
  }

  disconnect(): void {
    if (this.client) {
      this.client.deactivate();
      this.client = null;
      this.userId = null;
      this.isAdmin = false;
      useNotificationStore.getState().setConnected(false);
      console.log("WebSocket disconnected manually");
    }
  }

  isConnected(): boolean {
    return this.client?.connected ?? false;
  }

  // Update user context (e.g., when user logs in/out or role changes)
  updateContext(userId: string, isAdmin: boolean): void {
    if (this.userId !== userId || this.isAdmin !== isAdmin) {
      this.disconnect();
      this.connect(userId, isAdmin);
    }
  }
}

// Singleton instance
export const webSocketService = new WebSocketService();

// React hook for using WebSocket service
export function useWebSocket() {
  return {
    connect: (userId: string, isAdmin?: boolean) =>
      webSocketService.connect(userId, isAdmin),
    disconnect: () => webSocketService.disconnect(),
    isConnected: () => webSocketService.isConnected(),
    updateContext: (userId: string, isAdmin: boolean) =>
      webSocketService.updateContext(userId, isAdmin),
  };
}
