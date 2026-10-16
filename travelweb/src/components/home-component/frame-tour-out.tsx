import TourCard from "@/components/home-component/tour-card";
import { useEffect, useMemo, useState } from "react";
import { useOutCountryStore } from "@/store/outcountryStore";
import Loading from "@/app/loading";
import Link from "next/link";

export default function TourOut() {
  const [show, setShow] = useState<boolean>(false);

  const { tours, loading, error, fetchTours } = useOutCountryStore();
  useEffect(() => {
    fetchTours();
  }, []);

  const showtourout = tours.tours;
  console.log("Tour trong nuoc:", showtourout);

  if (loading) {
    <Loading />;
  }

  // const showTour = () => {
  //   setShow((prevShow) => !prevShow);
  // };
  return (
    <div className="xl:w-[1280px] m-auto mt-30 ">
      <h2 className="text-4xl text-[#4502c7] font-bold text-center">
        Tour Nuớc Ngoài
      </h2>
      <div className="flex gap-5 mt-12 flex-wrap">
        {showtourout?.map((tour: any) => {
          return <TourCard key={tour.id} tour={tour} />;
        })}
      </div>
      <button className="text-blue-600 p-3 border-2 rounded-md border-blue-600 mt-10 mx-auto flex hover:bg-blue-600 hover:text-white transition">
        <Link href={"/tourdetail/nuocngoai"}> Xem thêm</Link>
      </button>
    </div>
  );
}
