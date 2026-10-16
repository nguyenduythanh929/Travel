"use client";
import { BACKEND_URL } from "@/lib/backend";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { deleteCartItem } from "../../api/cart/route";
import { useRouter } from "next/navigation";

interface CartItem {
  id: number;
  cartId: number;
  tourId: number;
  tourName: string;
  tourAvatar: string;
  tourDuration: number;
  adultCount: number;
  childCount: number;
  infantCount: number;
  departureDate: number[];
  departureLocation: string;
  priceAdult: number;
  priceChild: number;
  priceInfant: number;
  subtotal: number;
  specialRequests: string;
  createdAt: string;
  updatedAt: string;
  remainAdult: number;
  remainChild: number;
  remainInfant: number;
  isAvailable: boolean;
}

interface SummaryProps {
  data: CartItem;
  onRefresh: () => Promise<void>;
  userId: number;
  isSelected: boolean;
  onToggleSelection: (itemId: number) => void;
}

export default function CardItemOrder({
  data,
  onRefresh,
  userId,
  isSelected,
  onToggleSelection,
}: SummaryProps) {
  const route = useRouter();
  console.log("onRefresh received:", onRefresh);
  const tour = data;
  console.log(tour);

  function formatStartDate(startDate: number[]) {
    const [year, month, day] = startDate;

    const yy = String(year).slice(-2); // 2025 -> "25"
    const mm = String(month).padStart(2, "0"); // 1 -> "01"
    const dd = String(day).padStart(2, "0"); // 15 -> "15"

    return `${yy}/${mm}/${dd}`;
  }

  async function deleteItem() {
    try {
      const res = await deleteCartItem(tour.id, userId);
      console.log("delete", res);

      if (res.status === 200 || res.status === 204) {
        await onRefresh();
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  }

  const routeTour = () => {
    route.push(`/order/${tour.tourId}`);
  };

  const handleCheckboxChange = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleSelection(tour.id);
  };

  const imageUrl = tour.tourAvatar
    ? `${BACKEND_URL}/api/tours/images/${tour.tourAvatar}`
    : "/placeholder-tour.jpg";

  return (
    <div
      className={`flex items-start gap-4 p-4 bg-white w-full shadow-md rounded-xl transition-all ${
        isSelected ? "ring-2 ring-purple-500 bg-purple-50" : "hover:shadow-lg"
      }`}
    >
      {/* Checkbox for selection */}
      <div
        className="flex items-center justify-center pt-10"
        onClick={handleCheckboxChange}
      >
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => {}}
          className="w-5 h-5 accent-purple-600 cursor-pointer"
        />
      </div>

      {/* Hình ảnh tour */}
      <div
        onClick={routeTour}
        className="w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden cursor-pointer"
      >
        <img
          src={imageUrl}
          alt={tour.tourName}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Thông tin tour */}
      <div className="flex-1 cursor-pointer" onClick={routeTour}>
        <h2 className="text-lg font-semibold text-gray-800">{tour.tourName}</h2>
        <p className="text-sm text-gray-600 mt-1">
          <span className="font-medium">Mã Tour:</span> {tour.tourId}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Ngày Khởi Hành:</span>{" "}
          {formatStartDate(tour.departureDate)}
        </p>
        <p className="text-sm text-gray-600 mb-3">
          <span className="font-medium">Khởi Hành Tại:</span>{" "}
          {tour.departureLocation}
        </p>
      </div>

      {/* Số lượng hành khách */}
      <div className="text-sm text-gray-700 flex flex-col gap-2 mr-3">
        <p className="text-[18px] font-medium">Số Lượng Hành Khách</p>
        <p>
          <span className="font-medium">Người lớn:</span> {tour.adultCount} x{" "}
          <span className="text-purple-600 font-semibold">
            {tour.priceAdult?.toLocaleString("vi-VN")}
          </span>
        </p>
        <p>
          <span className="font-medium">Trẻ em:</span> {tour.childCount} x{" "}
          <span className="text-purple-600 font-semibold">
            {tour.priceChild?.toLocaleString("vi-VN")}
          </span>
        </p>
        <p>
          <span className="font-medium">Em bé:</span> {tour.infantCount} x{" "}
          <span className="text-purple-600 font-semibold">
            {tour.priceInfant?.toLocaleString("vi-VN")}
          </span>
        </p>
        <p className="font-bold text-purple-700 mt-1">
          Tổng: {tour.subtotal?.toLocaleString("vi-VN")} đ
        </p>
      </div>

      {/* Delete button */}
      <div className="flex items-start pt-2">
        <FontAwesomeIcon
          icon={faXmark}
          onClick={(e) => {
            e.stopPropagation();
            deleteItem();
          }}
          className="cursor-pointer hover:scale-125 transition-all text-gray-400 hover:text-red-500 text-xl"
        />
      </div>
    </div>
  );
}
