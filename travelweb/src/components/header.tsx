// import { ModeToggle } from "@/components/toggle-theme";
import NavBarHeader from "@/components/navigation_menu_header";
import Image from "next/image";
import Link from "next/link";

export default function Headers() {
  return (
    <div className=" flex justify-center  pt-[20px] pb-[20px] w-full bg-white  shadow-md sticky top-0
left-0 z-10">
      <div className=" flex items-center justify-between xl:w-[1280px]">
        {/* dang ki dang nhap */}
        <div>
          <Image src={"/logo.png"} alt="Logo" width={200} height={200} />
        </div>
        <div className="flex gap-2 mr-4 ml-auto items-center">
          <NavBarHeader />
          <button className="p-2 pl-6 pr-6  bg-[#00a8ef] hover:bg-blue-500 text-white text-lg rounded-lg ">
            <Link href="/login">Login</Link>
          </button>

          <button className="p-2 pl-4 pr-4  bg-[#00a8ef] hover:bg-blue-500 text-white text-lg rounded-lg">
            <Link href="/register">Sign in</Link>
          </button>
        </div>
      </div>
    </div>
  );
}
