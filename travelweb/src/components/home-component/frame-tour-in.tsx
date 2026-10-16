import TourCard from "@/components/home-component/tour-card";
import { useEffect, useMemo, useState } from "react";

import { useInCountryStore } from "@/store/incountryStore";
import Loading from "@/app/loading";
import Link from "next/link";

export default function TourIn() {
  const [show, setShow] = useState<boolean>(false);

  const { tours, loading, error, fetchTours } = useInCountryStore();
  useEffect(() => {
    fetchTours();
  }, []);

  const showtourin = tours.tours;
  console.log("Tour trong nuoc:", showtourin);

  if (loading) {
    <Loading />;
  }

  // useEffect(() => {
  //   if (show) {
  //     setshowtourIn(tourin);
  //   } else {
  //     setshowtourIn(tourin.length > 5 ? tourin.slice(0, 4) : tourin);
  //   }
  // }, [tourin, show]);

  // const showTour = () => {
  //   setShow((prevShow) => !prevShow);
  // };
  return (
    <div className="xl:w-[1280px] m-auto mt-30">
      <h2 className="text-4xl text-[#4502c7] font-bold text-center">
        Tour Trong Nước
      </h2>
      <div className="flex gap-5 mt-12 flex-wrap">
        {showtourin?.map((tour: any) => {
          return <TourCard key={tour.id} tour={tour} />;
        })}
      </div>

      <button className="text-blue-600 p-3 border-2 rounded-md border-blue-600 mt-10 mx-auto flex hover:bg-blue-600 hover:text-white transition">
        <Link href={"/tourdetail/trongnuoc"}> Xem thêm</Link>
      </button>
    </div>
  );
}
