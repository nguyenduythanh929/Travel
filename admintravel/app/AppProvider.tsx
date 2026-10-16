"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { setupAxiosInterceptors } from "@/app/lib/axios";
import { Toaster } from "sonner";
import {
  useWebSocketConnection,
  useNotificationToast,
} from "@/app/hooks/useNotifications";

const AppContext = createContext({
  sessionToken: "",
  userId: "",
  setSessionToken: (sessionToken: string) => {},
  setUserId: (userId: string) => {},
});

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

function WebSocketProvider({ userId }: { userId?: string }) {
  useWebSocketConnection(userId);
  useNotificationToast();
  return null;
}

export default function AppProvider({
  children,
  inittialToken,
  inittialUserId,
}: {
  children: React.ReactNode;
  inittialToken: string | undefined;
  inittialUserId: string | undefined;
}) {
  const [sessionToken, setSessionToken] = useState(inittialToken || "");
  const [userId, setUserId] = useState(inittialUserId || "");
  const [cart, setCart] = useState({});

  // Setup global axios interceptors once when app loads
  useEffect(() => {
    setupAxiosInterceptors();
  }, []);

  // useState only reads its initial value once. After login/logout,
  // router.refresh() passes new cookie values here, so sync them into state.
  useEffect(() => {
    setSessionToken(inittialToken || "");
  }, [inittialToken]);

  useEffect(() => {
    setUserId(inittialUserId || "");
  }, [inittialUserId]);

  return (
    <AppContext.Provider
      value={{
        sessionToken,
        setSessionToken,
        userId,
        setUserId,
      }}
    >
      <WebSocketProvider userId={userId || undefined} />
      <Toaster position="top-right" richColors closeButton />
      {children}
    </AppContext.Provider>
  );
}
