"use client";
import '../places.css'
import FilterForm from "@/app/(main)/tourdetail/filtertour";
import { useEffect, useState } from "react";
import TourCard from "@/components/home-component/tour-card";
import { useInCountryStore } from "@/store/incountryStore";
import { useOutCountryStore } from "@/store/outcountryStore";
import { usePathname, useSearchParams } from "next/navigation";
import { getTours } from "../../../api/tours/route";
import  Pagination  from "@/components/pagination";

const regions = [
  { id: 1, value: "trongnuoc", label: "Trong Nước" },
  { id: 2, value: "nuocngoai", label: "Nước Ngoài" },
  { id: 3, value: "bac", label: "Miền Bắc" },
  { id: 4, value: "trung", label: "Miền Trung" },
  { id: 5, value: "nam", label: "Miền Nam" },
  { id: 6, value: "chaua", label: "Châu á" },
  { id: 7, value: "chauau", label: "Châu âu" },
  { id: 8, value: "chauuc", label: "Châu úc" },
];

export default function Page() {
  const [tourshow, setTourshow] = useState<any>([]);
  const [offset , setOffset] = useState<number>(1);
  const [totalpage , setTotalpage]= useState<number>(0);
  const [filters, setFilters] = useState<any>({});

  const pathname = usePathname();
  const pivotfilter: string | undefined = pathname.split("/").pop();
  const tourtypeid = regions.find((item) => item.value == pivotfilter);
  console.log("Tour Type ID:", tourtypeid?.id);

  useEffect(() => {
    async function loadTours() {
      if (tourtypeid?.id) {
        const res = await getTours({
          offset: offset - 1,
          limit: 3,
          typeId: tourtypeid.id,
          ...filters,
        });
        setTourshow(res.data.tours);
        setTotalpage(res.data.totalPages);
      }
    }

    loadTours();
  }, [pivotfilter, tourtypeid, offset, filters]);

  console.log("tourshow", offset);

  const handleFilterApply = (newFilters: any) => {
    console.log("handleFilterApply called with:", newFilters);
    setFilters(newFilters);
    setOffset(1); // Reset to first page when filters change
  };

  return (
    <div className="flex  mt-6 mb-10 xl:w-[1280px] m-auto">
      <FilterForm onFilterApply={handleFilterApply} />
      <div className="flex-1 ml-4">
        {tourshow ? (
          <div className="flex flex-col justify-between h-full w-full">
            <div className="flex gap-4">

          {tourshow.map((tour: any) => <TourCard key={tour.id} tour={tour} />)}
            </div>
          <Pagination currentPage={offset} totalPages={totalpage} onPageChange={(page:number)=> setOffset(page)} />
          
          </div>
        ) : (
        <div className='flex justify-center items-center h-full'>
          <div className="loader"></div>
        </div>
        )}
      </div>y
    </div>
  );
}
