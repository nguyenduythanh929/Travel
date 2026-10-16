import Headers from "@/components/header";
import InforHeader from "@/components/home-component/infor-header";
import Footer from "@/components/footer";
import HeaderLogin from "@/components/heade-login";
import ChatBotWidget from "@/components/chatbotai/chatbotcompoent";
import { cookies } from "next/headers";
import { WebsiteSettingsProvider } from "@/app/WebsiteSettingsProvider";
import { NotificationProvider } from "@/components/notifications";

export const metadata = {
  title: "Trang chủ",
  description: "Website du lịch",
};

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore: any = await cookies();
  const sessionToken = cookieStore.get("sessionToken");

  return (
    <WebsiteSettingsProvider>
      <NotificationProvider>
        <InforHeader />
        {sessionToken?.value ? <HeaderLogin /> : <Headers />}
        {children}
        <ChatBotWidget />
        <Footer />
      </NotificationProvider>
    </WebsiteSettingsProvider>
  );
}
