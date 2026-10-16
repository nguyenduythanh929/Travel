import { BACKEND_URL } from "@/lib/backend";
import { Client, IMessage, StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { BookingNotification, useNotificationStore } from "../store/notificationStore";

const WEBSOCKET_URL = `${BACKEND_URL}/ws`;

class WebSocketService {
  private client: Client | null = null;
  private subscriptions: StompSubscription[] = [];
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;

  connect(userId?: string): void {
    if (this.client?.connected) {
      console.log("WebSocket already connected");
      return;
    }

    this.client = new Client({
      webSocketFactory: () => new SockJS(WEBSOCKET_URL),
      connectHeaders: {},
      debug: (str) => {
        if (process.env.NODE_ENV === "development") {
          console.log("[STOMP]", str);
        }
      },
      reconnectDelay: this.reconnectDelay,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        console.log("WebSocket connected successfully");
        this.reconnectAttempts = 0;
        useNotificationStore.getState().setConnected(true);
        this.subscribeToAdminBookings();
        if (userId) {
          this.subscribeToUserNotifications(userId);
        }
      },
      onDisconnect: () => {
        console.log("WebSocket disconnected");
        useNotificationStore.getState().setConnected(false);
      },
      onStompError: (frame) => {
        console.error("STOMP error:", frame.headers["message"]);
        console.error("Details:", frame.body);
      },
      onWebSocketError: (event) => {
        console.error("WebSocket error:", event);
        this.handleReconnect(userId);
      },
      onWebSocketClose: () => {
        console.log("WebSocket closed");
        useNotificationStore.getState().setConnected(false);
      },
    });

    this.client.activate();
  }

  private handleReconnect(userId?: string): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(
        `Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`
      );
      setTimeout(() => {
        this.connect(userId);
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.error("Max reconnect attempts reached");
    }
  }

  private subscribeToAdminBookings(): void {
    if (!this.client?.connected) return;

    const subscription = this.client.subscribe(
      "/topic/admin/bookings",
      (message: IMessage) => {
        try {
          const notification: BookingNotification = JSON.parse(message.body);
          console.log("Received admin booking notification:", notification);
          useNotificationStore.getState().addNotification(notification);
        } catch (error) {
          console.error("Error parsing notification:", error);
        }
      }
    );

    this.subscriptions.push(subscription);
    console.log("Subscribed to /topic/admin/bookings");
  }

  private subscribeToUserNotifications(userId: string): void {
    if (!this.client?.connected) return;

    const subscription = this.client.subscribe(
      `/topic/users/${userId}`,
      (message: IMessage) => {
        try {
          const notification: BookingNotification = JSON.parse(message.body);
          console.log("Received user notification:", notification);
          useNotificationStore.getState().addNotification(notification);
        } catch (error) {
          console.error("Error parsing notification:", error);
        }
      }
    );

    this.subscriptions.push(subscription);
    console.log(`Subscribed to /topic/users/${userId}`);
  }

  disconnect(): void {
    this.subscriptions.forEach((sub) => {
      try {
        sub.unsubscribe();
      } catch (e) {
        console.error("Error unsubscribing:", e);
      }
    });
    this.subscriptions = [];

    if (this.client?.connected) {
      this.client.deactivate();
    }
    this.client = null;
    useNotificationStore.getState().setConnected(false);
    console.log("WebSocket disconnected and cleaned up");
  }

  isConnected(): boolean {
    return this.client?.connected ?? false;
  }
}

export const websocketService = new WebSocketService();
