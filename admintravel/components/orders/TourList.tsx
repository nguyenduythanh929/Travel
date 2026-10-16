import type { BookingItem } from "@/app/api/bookingApi";

type TourListProps = {
  tours: BookingItem[];
};

export default function TourList({ tours }: TourListProps) {
  return (
    <div className="flex flex-col gap-4">
      {tours.map((t) => (
        <div key={t.id} className="flex items-start justify-between gap-4">
          {/* Thông tin tour */}
          <div className="flex-1">
            <div className="font-semibold text-gray-900">{t.tourName}</div>

            <div className="text-sm text-gray-500 leading-relaxed mt-1">
              Người lớn: {t.adultCount} ×{" "}
              {t.pricePerAdult.toLocaleString("vi-VN")}₫
              <br />
              Trẻ em: {t.childCount} × {t.pricePerChild.toLocaleString("vi-VN")}
              ₫
              <br />
              Em bé: {t.infantCount} ×{" "}
              {t.pricePerInfant.toLocaleString("vi-VN")}₫
              <br />
              Điểm khởi hành: {t.departureLocation}
              <br />
              <span className="font-medium text-gray-700">
                Tạm tính: {t.subTotal.toLocaleString("vi-VN")}₫
              </span>
            </div>
          </div>

          {/* Ảnh tour */}
          <img
            src={`http://localhost:8088/api/tours/images/${t.tourImage}`}
            alt={t.tourName}
            className="w-20 h-20 rounded-md object-cover border"
          />
        </div>
      ))}
    </div>
  );
}
