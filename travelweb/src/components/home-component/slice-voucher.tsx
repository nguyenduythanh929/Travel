"use client";
import {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Autoplay,
} from "swiper/modules";

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/autoplay";
import Image from "next/image";
export default function SliceVoucher() {
  return (
    <div className="xl:w-[1280px] m-auto mt-15">
      <h1 className="text-4xl text-[#4502c7] font-bold text-center">
        Khuyến Mại Bùng Nổ - Đánh Tan Nóng Bức
      </h1>
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
        loop={true}
        autoplay={{
          delay: 2000,
          disableOnInteraction: false,
        }}
        speed={800}
        spaceBetween={10}
        slidesPerView={3}
        className="mt-8"
      >
        <SwiperSlide>
          <Image src="/banner-1.png" alt="banner-1" width={400} height={270} />
        </SwiperSlide>
        <SwiperSlide>
          <Image src="/banner-2.png" alt="banner-2" width={400} height={270} />
        </SwiperSlide>
        <SwiperSlide>
          <Image src="/banner-3.png" alt="banner-3" width={400} height={270} />
        </SwiperSlide>
        <SwiperSlide>
          <Image src="/banner-2.png" alt="banner-2" width={400} height={270} />
        </SwiperSlide>
      </Swiper>
    </div>
  );
}
