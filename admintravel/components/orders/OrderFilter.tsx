"use client";

import { FaFilter, FaRotateLeft } from "react-icons/fa6";

interface Props {
  status: number | undefined;
  setStatusPayment: React.Dispatch<React.SetStateAction<number | undefined>>;
  bookingStatus?: number | undefined;
  setBookingStatus?: React.Dispatch<React.SetStateAction<number | undefined>>;
  dateFrom?: string | undefined;
  dateTo?: string | undefined;
  setDateFrom?: React.Dispatch<React.SetStateAction<string | undefined>>;
  setDateTo?: React.Dispatch<React.SetStateAction<string | undefined>>;
  searchName?: string | undefined;
  setSearchName?: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export default function OrderFilter({
  status,
  setStatusPayment,
  bookingStatus,
  setBookingStatus,
  dateFrom,
  dateTo,
  setDateFrom,
  setDateTo,
  searchName,
  setSearchName,
}: Props) {
  const handleDelete = () => {
    setStatusPayment(undefined);
    setBookingStatus && setBookingStatus(undefined);
    setDateFrom && setDateFrom(undefined);
    setDateTo && setDateTo(undefined);
    setSearchName && setSearchName(undefined);
  };

  return (
    <div className="mb-6 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="flex items-center flex-wrap divide-x divide-gray-200 border-b border-gray-200">
        {/* Label */}
        <div className="flex items-center gap-2 px-5 py-3 min-h-[60px] font-semibold text-gray-700 bg-gray-50 border-b border-gray-200">
          <FaFilter className="text-blue-600" size={16} />
          <span>Bộ lọc</span>
        </div>

        {/* Filter theo trạng thái thanh toán */}
        <div className="flex items-center px-4 py-3 min-h-[60px] hover:bg-gray-50 transition-colors border-b border-gray-200">
          <select
            value={status !== undefined ? String(status) : ""}
            onChange={(e) => {
              const v = e.currentTarget.value;
              setStatusPayment(v === "" ? undefined : parseInt(v));
            }}
            className="bg-transparent outline-none text-sm min-w-[220px] cursor-pointer focus:text-blue-600 text-gray-700"
          >
            <option value="">Tất cả trạng thái thanh toán</option>
            <option value="0">💳 Chưa thanh toán</option>
            <option value="1">✅ Đã thanh toán</option>
            <option value="2">❌ Đã hủy (thanh toán)</option>
          </select>
        </div>

        {/* Filter theo trạng thái đơn hàng */}
        <div className="flex items-center px-4 py-3 min-h-[60px] hover:bg-gray-50 transition-colors border-b border-gray-200">
          <select
            value={bookingStatus !== undefined ? String(bookingStatus) : ""}
            onChange={(e) => {
              const v = e.currentTarget.value;
              setBookingStatus &&
                setBookingStatus(v === "" ? undefined : parseInt(v));
            }}
            className="bg-transparent outline-none text-sm min-w-[200px] cursor-pointer focus:text-blue-600 text-gray-700"
          >
            <option value="">Tất cả trạng thái đơn</option>
            <option value="1">Chờ thanh toán</option>
            <option value="2">Đã thanh toán</option>
            <option value="3">Hoàn thành</option>
            <option value="4">Đã hủy</option>
            <option value="5">Đã hết hạn</option>
          </select>
        </div>

        {/* Filter theo ngày tạo */}
        <div className="flex items-center gap-2 px-4 py-3 min-h-[60px] hover:bg-gray-50 transition-colors border-b border-gray-200">
          <input
            type="date"
            placeholder="Từ ngày"
            value={dateFrom ?? ""}
            onChange={(e) =>
              setDateFrom && setDateFrom(e.target.value || undefined)
            }
            className="bg-transparent outline-none text-sm text-gray-700 cursor-pointer focus:text-blue-600 hover:text-blue-600"
          />
          <span className="text-gray-400 font-semibold">→</span>
          <input
            type="date"
            placeholder="Đến ngày"
            value={dateTo ?? ""}
            onChange={(e) =>
              setDateTo && setDateTo(e.target.value || undefined)
            }
            className="bg-transparent outline-none text-sm text-gray-700 cursor-pointer focus:text-blue-600 hover:text-blue-600"
          />
        </div>

        {/* Tìm kiếm theo tên khách hàng */}
        <div className="flex items-center px-4 py-3 min-h-[60px] hover:bg-gray-50 transition-colors flex-1 min-w-[220px] border-b border-gray-200">
          <input
            type="text"
            placeholder="🔍 Tìm theo tên khách hàng..."
            value={searchName ?? ""}
            onChange={(e) =>
              setSearchName && setSearchName(e.target.value || undefined)
            }
            className="bg-transparent outline-none text-sm w-full text-gray-700 placeholder:text-gray-400 focus:placeholder:text-blue-400"
          />
        </div>

        {/* Nút xóa filter */}
        <button
          onClick={handleDelete}
          className="flex items-center gap-2 px-5 py-3 min-h-[60px] text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 font-medium border-l-2 border-transparent hover:border-l-red-600"
        >
          <FaRotateLeft size={14} />
          <span>Xóa bộ lọc</span>
        </button>
      </div>
    </div>
  );
}
