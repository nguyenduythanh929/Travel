"use client";

import Image from "next/image";
import { useWebsiteSettings } from "@/app/WebsiteSettingsProvider";

export default function InforHeader() {
  const { settings, loading } = useWebsiteSettings();

  if (loading) {
    return (
      <div className="flex justify-center pt-[10px] pb-[10px] bg-blue-700 ">
        <div className=" flex items-center justify-end xl:w-[1280px] gap-4">
          <p className="text-white font-medium">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center pt-[10px] pb-[10px]   bg-blue-700 ">
      <div className=" flex items-center justify-end xl:w-[1280px] gap-4">
        {settings?.phone && (
          <span className="flex gap-1">
            <Image src="/phone.svg" alt="phone" width={25} height={25} />
            <p className="text-white font-medium">{settings.phone}</p>
          </span>
        )}
        {settings?.email && (
          <span className="flex gap-1">
            <Image src="/email.svg" alt="email" width={25} height={25} />
            <p className="text-white font-medium">{settings.email}</p>
          </span>
        )}
        {settings?.address && (
          <span className="flex gap-1">
            <Image src="/build.svg" alt="address" width={25} height={25} />
            <p className="text-white font-medium">{settings.address}</p>
          </span>
        )}
      </div>
    </div>
  );
}
