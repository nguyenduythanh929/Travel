"use client";

import { createContext, useContext, useEffect, useState } from "react";

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
        cart,
        setCart,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
