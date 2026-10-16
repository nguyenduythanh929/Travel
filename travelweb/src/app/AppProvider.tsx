"use client";

import { createContext, useContext, useState } from "react";

const AppContext = createContext({
  sessionToken: "",
  userId: "",
  setSessionToken: (sessionToken: string) => {},
  setUserId: (userId: string) => {},
  cart: {},
  setCart: (cart: any) => {},
});

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

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

  return (
    <AppContext.Provider
      value={{
        sessionToken,
        setSessionToken,
        userId,
        setUserId,
        cart,
        setCart,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
