import NavBarHeader from "@/components/navigation_menu_header";
import Image from "next/image";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import IconCard from "@/components/icon-cart";
import { NotificationBell } from "@/components/notifications";

export default function HeaderLogin() {
  return (
    <div className=" flex justify-center  pt-[20px] pb-[20px]  bg-white  shadow-md sticky top-0
left-0 z-10">
      <div className=" flex items-center justify-between xl:w-[1280px]">
        {/* dang ki dang nhap */}
        <div>
          <Image src={"/logo.png"} alt="Logo" width={200} height={200} />
        </div>
        <div className="flex gap-2 mr-4 ml-auto items-center">
          <NavBarHeader />
          <Link href={"/order"}>
            <IconCard />
          </Link>
          {/* Notification Bell */}
          <NotificationBell />
          <Link href={"/profile"} className="ml-4">
            <Avatar className="border-3 w-{24px} h-{24px}">
              <AvatarImage src="" />
              <AvatarFallback>PV</AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </div>
    </div>
  );
}
