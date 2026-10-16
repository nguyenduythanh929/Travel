"use client";
import TourCardSumary from "@/app/(main)/tourdetail/[places]/[idtour]/sumarytourdetail";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getTourDetail } from "../../../app/api/tours/route";
import TourPage from "@/app/(main)/tourdetail/[places]/[idtour]/infortour";

type TourType = {
  id: number;
  name: string;
  imageUrl: string;
  originalPrice: number;
  discountedPrice: number;
  discountPercent: number;
  isOnSale: boolean;
  startDate: [number, number, number];
  duration: string;
  remainSlot: number;
  rating: number;
  reviewCount: number;
  promotionName: string;
};
export default function Tourdetail() {
  const [data, setData] = useState<TourType | null>(null);
  const pathname = usePathname();
  const tourId = pathname.split("/").pop();

  useEffect(() => {
    async function fetchTourDetail() {
      const res = await getTourDetail(Number(tourId));
      const data = await res.data;
      setData(data);
    }
    fetchTourDetail();
  }, [tourId]);
  console.log("Tour Detail:", data);

  return (
    <div className="xl:w-[1280px] flex m-auto">
      {data ? (
        <>
          <TourPage data={data} />
          <TourCardSumary data={data} />
        </>
      ) : (
        <div> Loading....</div>
      )}
    </div>
  );
}
