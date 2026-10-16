import OrderRow from "./OrderRow";
import type { Booking } from "@/app/api/bookingApi";

type OrderTableProps = {
  bookings: Booking[];
  onRefresh?: () => void;
};

export default function OrderTable({ bookings, onRefresh }: OrderTableProps) {
  console.log("OrderTable render with bookings:", bookings.length);

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-3 font-semibold">Mã</th>
              <th className="p-3 font-semibold">Thông tin khách</th>
              <th className="p-3 font-semibold">Danh sách tour</th>
              <th className="p-3 font-semibold">Thanh toán</th>
              <th className="p-3 font-semibold">Trạng thái</th>
              <th className="p-3 font-semibold">Ngày đặt</th>
              <th className="p-3 font-semibold">Hành động</th>
            </tr>
          </thead>

          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12">
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <svg
                      className="w-16 h-16 mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <p className="text-lg font-medium">Không tìm thấy đơn hàng nào</p>
                    <p className="text-sm mt-1">Thử thay đổi bộ lọc hoặc tìm kiếm</p>
                  </div>
                </td>
              </tr>
            ) : (
              bookings.map((order) => (
                <OrderRow key={order.id} order={order} onRefresh={onRefresh} />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}