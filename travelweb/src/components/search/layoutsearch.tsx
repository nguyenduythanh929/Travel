import Search from "@/components/search/search";
import { Image } from "next/image";

export default function LayoutSearch() {
  return (
    <div className="bg-[url(/background-1.png)] w-full h-[600px] bg-cover bg-center flex flex-col items-center  ">
      <h1 className="text-5xl font-[700] text-center w-[900px] pt-[100px] !text-[#4502c7]">
        Du lịch Châu Á - Khám phá Mỹ, Úc, Âu
        <br></br>Đi nơi đâu bạn muốn
      </h1>
      <Search />
    </div>
  );
}
