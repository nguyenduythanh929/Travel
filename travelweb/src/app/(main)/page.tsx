"use client";
import LayoutSearch from "@/components/search/layoutsearch";
import SliceVoucher from "@/components/home-component/slice-voucher";
import TourIn from "@/components/home-component/frame-tour-in";
import Image from "next/image";
import TourOut from "@/components/home-component/frame-tour-out";
import NewInfor from "@/components/home-component/new-infor";

import { use, useEffect } from "react";
import Loading from "@/app/loading";

export default function Home() {
  return (
    <>
      <LayoutSearch />
      <SliceVoucher />
      <TourIn />
      <Image
        src={"/banner-4.png"}
        alt="Banner-4"
        width={1280}
        height={500}
        className="object-cover m-auto mt-20"
      />
      <TourOut />
      <Image
        src={"/banner-5.png"}
        alt="Banner-4"
        width={1280}
        height={500}
        className="object-cover m-auto mt-20"
      />
      <NewInfor />
    </>
  );
}
