"use client";
import { usePathname } from "next/navigation";

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

interface TourCardProps {
  tour: TourType;
}

import { useRouter } from "next/navigation";
import path from "path";
type StartDate = [number, number, number];

export default function TourCard({ tour }: TourCardProps) {
  const router = useRouter();
  const pathname = usePathname();
  console.log("tour detail", tour);
  if (!tour) {
    return;
  }
  function formatStartDate(startDate: StartDate) {
    const [year, month, day] = startDate;

    const yy = String(year).slice(-2); // 2025 -> "25"
    const mm = String(month).padStart(2, "0"); // 1 -> "01"
    const dd = String(day).padStart(2, "0"); // 15 -> "15"

    return `${yy}/${mm}/${dd}`;
  }
  const patharray = pathname.split("/");
  // console.log("Path array:", patharray);

  const handlerClick = () => {
    let pathtour: string = "";
    if (pathname === "/" || patharray[1] != "tourdetail") {
      pathtour = `/${tour.id}`;
    } else {
      pathtour = `${pathname}/${tour.id}`;
    }
    console.log("Path tour detail:", pathtour);

    router.push(pathtour);
    console.log("Tour ID:", pathname);
  };
  return (
    <div
      onClick={handlerClick}
      className="w-[300px] max-h-[500px] bg-white rounded-xl overflow-hidden shadow hover:shadow-lg  transition-all duration-300
            hover:scale-[1.01] hover:-translate-y-2  transition p-3 flex flex-col cursor-pointer"
    >
      {/* Image */}
      <div className="relative w-full h-[200px] rounded-lg overflow-hidden">
        <img
          src={`http://localhost:8088/api/tours/images/${tour?.imageUrl}`}
          alt="tour"
          className="object-cover"
        />
        <div className="absolute top-2 left-2 bg-red-600 text-white text-sm px-3 py-1 rounded-full flex items-center gap-1">
          <span>⚡</span> Giảm -{tour?.discountPercent}%
        </div>
      </div>

      {/* Title */}
      <h3 className="mt-3 font-semibold text-[15px] leading-5">
        {tour?.name}
        <br /> Lorem ipsum dolor sit amet...
      </h3>

      {/* Prices */}
      <div className="mt-2 flex items-center gap-2">
        <span
          className={`${tour?.discountPercent}? "line-through":"" text-blue-500`}
        >
          {tour?.originalPrice.toLocaleString()}đ
        </span>
        {tour?.discountPercent ? (
          <span className="text-red-600 font-bold">
            {tour?.discountedPrice}đ
          </span>
        ) : (
          ""
        )}
        <span className="text-gray-600 font-[600]">/Khách</span>
      </div>

      {/* Info */}
      <div className="text-sm mt-2 space-y-1">
        <p>
          Mã Tour: <span className="text-blue-600">{tour?.id}</span>
        </p>
        <p>
          Ngày Khởi Hành:{" "}
          <span className="text-blue-600">
            {formatStartDate(tour.startDate)}
          </span>
        </p>
        <p>
          Thời Gian: <span className="font-medium">{tour.duration}</span>
        </p>
      </div>

      {/* Rating + slots */}
      <div className="mt-3 flex justify-between items-center mt-auto">
        <div className="flex items-center gap-1 text-yellow-400 text-lg">
          ★ ★ ★ ★ ☆ <span className="text-black text-sm">{tour.rating}</span>
        </div>
        <div className="flex items-center gap-2 o">
          <span className="text-sm">Số chỗ còn:</span>
          <span className="bg-red-600 text-white rounded-lg px-2 py-1 text-sm font-bold">
            {tour.remainSlot}
          </span>
        </div>
      </div>
    </div>
  );
}
