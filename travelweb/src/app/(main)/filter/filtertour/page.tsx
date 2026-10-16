"use client";
import React from "react";
import TourCard from "@/components/home-component/tour-card";

export default function page() {
  const tours = JSON.parse(localStorage.getItem("dataFilterTour"));
  console.log("Data in Filter Tour Page:", tours);
  return (
    <div className="xl:w-[1280px] flex flex-col gap-4 m-auto">
      <h1 className="text-4xl text-center !text-blue-700 mt-6">
        Kết quả tìm kiếm ...
      </h1>
      <div>
        {tours?.map((tour: any) => (
          <TourCard key={tour.id} tour={tour} />
        ))}
      </div>
    </div>
  );
}
