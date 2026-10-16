import type { Metadata } from "next";
import "../globals.css";
import "../admin.css"
import { Inter } from "next/font/google";
import Header from "@/components/header";
import Sidebar from "@/components/Sidebar";
import AppProvider from "../AppProvider";
import { cookies } from "next/headers";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore: any = await cookies();
  const sessionToken = cookieStore.get("sessionToken");
  const userId = cookieStore.get("userId");

  return (
    
      <body className="min-h-screen bg-gray-50">

        {/* Header trên cùng */}
        <Header />

        {/* Layout dưới: sidebar + content */}
        <div className="flex">

          {/* Sidebar bên trái */}
          <aside className="w-64 h-[calc(100vh-64px)] fixed left-0 top-16 border-r bg-white">
            <Sidebar />
          </aside>
          {/* Content bên phải */}
           <AppProvider
            inittialToken={sessionToken?.value}
            inittialUserId={userId?.value}
          >
          <main className="ml-64 mt-15 p-6 w-full">
            {children}

          </main>
          </AppProvider>

        </div>

      </body>

  );
}
