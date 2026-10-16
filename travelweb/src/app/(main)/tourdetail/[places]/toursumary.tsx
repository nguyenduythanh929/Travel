import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Bus, Users } from "lucide-react";

const TourBookingCard: React.FC = () => {
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [babies, setBabies] = useState(0);

  const priceAdult = 10000000;
  const priceChild = 7990000;
  const priceBaby = 5990000;

  const total =
    adults * priceAdult + children * priceChild + babies * priceBaby;

  return (
    <Card className="max-w-md mx-auto shadow-lg rounded-2xl border p-4">
      <CardContent>
        <h2 className="text-xl font-bold text-purple-700 mb-3">
          Chuyến Đi Của Bạn
        </h2>

        <img
          src="https://cdn.tuoitre.vn/thumb_w/480/2023/3/7/fansipan-16781831500251318365931.jpg"
          alt="Tour Sapa"
          className="rounded-xl w-full mb-3"
        />

        <div className="space-y-2 text-sm">
          <p className="font-semibold text-gray-700">
            Hà Nội - Ninh Bình - Hạ Long - Yên Tử - Sapa | 6N5D
          </p>
          <p>⭐⭐⭐⭐☆ (500 lượt đánh giá)</p>
          <p>
            <span className="font-medium">Mã Tour:</span> 28T00001
          </p>
          <p>
            <Calendar className="inline-block w-4 h-4 mr-1" />
            Thời gian: <strong>6 Ngày 5 Đêm</strong>
          </p>
          <p>
            <Bus className="inline-block w-4 h-4 mr-1" />
            Phương tiện: Ô tô 45 chỗ
          </p>
          <p>
            <Calendar className="inline-block w-4 h-4 mr-1" />
            Ngày khởi hành: <strong>20/10/2024</strong>
          </p>
          <p>Khởi hành tại: Hà Nội</p>
        </div>

        <div className="mt-4 border-t pt-3">
          <h3 className="font-semibold mb-2">Số lượng hành khách</h3>

          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Người lớn:</span>
              <input
                type="number"
                value={adults}
                min={0}
                className="w-16 border rounded px-2 text-center"
                onChange={(e) => setAdults(Number(e.target.value))}
              />
              <span>
                {adults} × {priceAdult.toLocaleString()} đ
              </span>
            </div>

            <div className="flex justify-between">
              <span>Trẻ em:</span>
              <input
                type="number"
                value={children}
                min={0}
                className="w-16 border rounded px-2 text-center"
                onChange={(e) => setChildren(Number(e.target.value))}
              />
              <span>
                {children} × {priceChild.toLocaleString()} đ
              </span>
            </div>

            <div className="flex justify-between">
              <span>Em bé:</span>
              <input
                type="number"
                value={babies}
                min={0}
                className="w-16 border rounded px-2 text-center"
                onChange={(e) => setBabies(Number(e.target.value))}
              />
              <span>
                {babies} × {priceBaby.toLocaleString()} đ
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 text-right">
          <p className="text-lg font-bold text-purple-700">
            Tổng cộng: {total.toLocaleString()} đ
          </p>
          <Button className="mt-2 w-full bg-purple-600 hover:bg-purple-700 text-white rounded-xl">
            Thêm Vào Giỏ Hàng
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TourBookingCard;
