"use client";

import { SearchIcon, X } from "lucide-react";
import * as React from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Calendar } from "@/components/ui/calendar";
import Image from "next/image";
import { useStore } from "@/store/tourStore";
import { getTours } from "@/app/api/tours/route";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { get } from "http";
export type TourType = {
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

type SrearchValue = {
  name: string;
  priceFrom: number;
  priceTo: number;
  startDate: string;
};

export default function Search() {
  const router = useRouter();
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  const [open, setOpen] = React.useState(false);
  const [dataform, setDataform] = React.useState<SrearchValue>({
    name: "",
    priceFrom: 0,
    priceTo: 0,
    startDate: "",
  });

  // fomat ngay
  React.useEffect(() => {
    if (date) {
      let day = String(date.getDate()).padStart(2, "0");
      let month = String(date.getMonth() + 1).padStart(2, "0");
      let year = String(date.getFullYear());
      let datefomat = day + "/" + month + "/" + year;
      setDataform((prev) => ({ ...prev, startDate: datefomat }));
    } else {
      setDataform((prev) => ({ ...prev, startDate: "" }));
    }
  }, [date]);

  function showCalendar() {
    const calendar = document.querySelector(".calendar");
    calendar?.classList.toggle("hidden");
  }

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    // Close calendar after selection
    const calendar = document.querySelector(".calendar");
    calendar?.classList.add("hidden");
  };

  function HandleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setDataform((prev) => ({ ...prev, [name]: value }));
  }
  async function FilterHandler(e: React.FormEvent) {
    e.preventDefault();
    const res = await getTours(
      0,
      4,
      null,
      dataform.name || undefined,
      dataform.priceFrom || undefined,
      dataform.priceTo || undefined,
      dataform.startDate || undefined
    );
    // const result = await res.json();
    console.log("Filter result:", res.data);
    if (res.data.tours.length === 0) {
      setOpen(true);
    } else {
      console.log("Filtered Tours:", res.data.tours);
      localStorage.setItem("dataFilterTour", JSON.stringify(res.data.tours));
      router.push("/filter/filtertour");
    }
  }

  return (
    <div>
      <form
        onSubmit={FilterHandler}
        className="p-[50px] bg-black/30 rounded-lg mt-[80px] flex flex-col gap-6"
      >
        <InputGroup className="bg-white w-[800px] h-[60px]">
          <InputGroupInput
            className="h-[50px]"
            name="name"
            value={dataform.name}
            onChange={HandleChange}
            placeholder="Bạn muốn đi đâu?"
          />
          <InputGroupAddon className="h-[30px] w-[30px]">
            <Image
              src={"/icon-address.svg"}
              alt="icon-adress"
              width={20}
              height={20}
            />
          </InputGroupAddon>
        </InputGroup>
        <div className="flex gap-4">
          <Select
            onValueChange={(value) => {
              const prices = value.split(" ");
              setDataform((prev) => ({
                ...prev,
                priceFrom: Number(prices[0]),
                priceTo: prices[1] ? Number(prices[1]) : 1000000000,
              }));
            }}
          >
            <SelectTrigger className="min-w-[250px] !h-[60px] bg-white rounded-md">
              <SelectValue placeholder="Ngân sách" className="h-[60px]" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Mức giá</SelectLabel>
                <SelectItem value="0 10000000">Dưới 10 triệu</SelectItem>
                <SelectItem value="10000000 20000000">
                  Từ 10 tới 20 triệu
                </SelectItem>
                <SelectItem value="20000000">Trên 20 triệu</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <div className="bg-white w-[300px] h-[60px] rounded-md flex items-center justify-between relative cursor-pointer">
            <div className="flex items-center flex-1" onClick={showCalendar}>
              <Image
                src={"/icon-calendar.svg"}
                alt="icon-adress"
                width={20}
                height={20}
                className="ml-4"
              />
              <span className={`ml-4 text-xl font-medium ${date ? 'text-[#4502c7]' : 'text-gray-400'}`}>
                {date ? date.toLocaleDateString() : 'Chọn ngày khởi hành'}
              </span>
            </div>
            {date && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setDate(undefined);
                }}
                className="mr-3 p-1 hover:bg-gray-100 rounded-full transition"
                title="Xóa ngày đã chọn"
              >
                <X size={18} className="text-gray-500" />
              </button>
            )}
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              className="rounded-md border shadow-sm absolute top-[70px] z-10 rounded-md hidden calendar bg-white"
              captionLayout="dropdown"
            />
          </div>
          <button
            type="submit"
            className="p-4 pl-6 pr-6  bg-[#4502c7] cursor-pointer text-white text-lg rounded-lg flex items-center gap-2"
          >
            <SearchIcon />
            Tìm kiếm
          </button>
        </div>
      </form>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-blue-600 font-bold">
              Không tìm thấy tour phù hợp
            </AlertDialogTitle>
            <AlertDialogDescription>
              Vui lòng thử lại với điểm đến hoặc ngày khởi hành khác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-blue-400 hover:border-blue-600 hover:text-blue-400">
              Đóng
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
