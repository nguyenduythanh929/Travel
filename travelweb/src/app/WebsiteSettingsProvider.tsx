"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getWebsiteSettings,
  WebsiteSettingResponse,
} from "@/app/api/websiteApi";

interface WebsiteSettingsContextType {
  settings: WebsiteSettingResponse | null;
  loading: boolean;
  error: string | null;
}

const WebsiteSettingsContext = createContext<
  WebsiteSettingsContextType | undefined
>(undefined);

export function WebsiteSettingsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, setSettings] = useState<WebsiteSettingResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const response = await getWebsiteSettings();
        setSettings(response.data);
      } catch (err: any) {
        setError(err.message || "Failed to load website settings");
        console.error("Error fetching website settings:", err);
        // Set default values on error
        setSettings({
          id: 0,
          websiteName: "28.TRAVEL",
          phone: "0123.456.789",
          email: "contact@28travel.com",
          address: "Số 141, đường Chiến Thắng, quận Hà Đông",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return (
    <WebsiteSettingsContext.Provider value={{ settings, loading, error }}>
      {children}
    </WebsiteSettingsContext.Provider>
  );
}

export function useWebsiteSettings() {
  const context = useContext(WebsiteSettingsContext);
  if (context === undefined) {
    throw new Error(
      "useWebsiteSettings must be used within a WebsiteSettingsProvider"
    );
  }
  return context;
}
