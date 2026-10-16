"use client";
import OrderTable from "@/components/orders/OrderTable";
import { useEffect, useState } from "react";
import { getBookings, type BookingListResponse } from "@/app/api/bookingApi";
import OrderFilter from "@/components/orders/OrderFilter";

export default function OrdersPage() {
  const limit = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [data, setData] = useState<BookingListResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [statusPayment, setStatusPayment] = useState<number | undefined>();
  const [bookingStatus, setBookingStatus] = useState<number | undefined>();
  const [dateFrom, setDateFrom] = useState<string | undefined>();
  const [dateTo, setDateTo] = useState<string | undefined>();
  const [searchName, setSearchName] = useState<string | undefined>();

  // Reset về trang 1 khi filter thay đổi
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [statusPayment, bookingStatus, dateFrom, dateTo, searchName]);

  // Function để fetch data
  const fetchData = async () => {
    setLoading(true);
    setError(null);

    console.log("=== FETCHING DATA ===");
    console.log("Page:", currentPage);
    console.log("Limit:", limit);
    console.log("Payment Status:", statusPayment);
    console.log("Booking Status:", bookingStatus);
    console.log("Date From:", dateFrom);
    console.log("Date To:", dateTo);
    console.log("Search Name:", searchName);

    try {
      // Backend uses PageRequest.of(offset, limit) which expects page number (0-indexed)
      // So we send currentPage - 1 as the offset parameter
      const offset = currentPage - 1;
      const res = await getBookings(
        offset,
        limit,
        statusPayment,
        searchName,
        dateFrom,
        dateTo,
        bookingStatus
      );

      console.log("=== FETCH SUCCESS ===");
      console.log("Total Items:", res.totalItems);
      console.log("Total Pages:", res.totalPages);
      console.log("Data Count:", res.data?.length);

      setData(res);
      setTotalItems(res.totalItems);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error("=== FETCH ERROR ===", err);
      setError(
        err instanceof Error ? err.message : "Không thể tải danh sách đơn hàng"
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch khi dependencies thay đổi
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, statusPayment, bookingStatus, dateFrom, dateTo, searchName]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-black">Quản lý đơn hàng</h1>

      {/* Bộ lọc */}
      <OrderFilter
        status={statusPayment}
        setStatusPayment={setStatusPayment}
        bookingStatus={bookingStatus}
        setBookingStatus={setBookingStatus}
        dateFrom={dateFrom}
        dateTo={dateTo}
        setDateFrom={setDateFrom}
        setDateTo={setDateTo}
        searchName={searchName}
        setSearchName={setSearchName}
      />

      {/* Hiển thị thông tin filter đang áp dụng */}
      {(statusPayment !== undefined || bookingStatus !== undefined || dateFrom || dateTo || searchName) && (
        <div className="mb-4 p-3 bg-blue-50 rounded-md text-sm">
          <span className="font-semibold">Đang lọc: </span>
          {statusPayment !== undefined && (
            <span className="mr-3">
              Thanh toán:{" "}
              {statusPayment === 0 ? "Chưa thanh toán" : statusPayment === 1 ? "Đã thanh toán" : "Đã hủy"}
            </span>
          )}
          {bookingStatus !== undefined && (
            <span className="mr-3">
              Đơn hàng:{" "}
              {bookingStatus === 1 ? "Chờ thanh toán" :
               bookingStatus === 2 ? "Đã thanh toán" :
               bookingStatus === 3 ? "Hoàn thành" :
               bookingStatus === 4 ? "Đã hủy" :
               bookingStatus === 5 ? "Đã hết hạn" : "Không xác định"}
            </span>
          )}
          {dateFrom && <span className="mr-3">Từ: {dateFrom}</span>}
          {dateTo && <span className="mr-3">Đến: {dateTo}</span>}
          {searchName && <span className="mr-3">Tên: "{searchName}"</span>}
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mb-4 rounded-md bg-red-50 px-4 py-2 text-sm text-red-600">
          ❌ {error}
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
        </div>
      ) : (
        <OrderTable bookings={data?.data ?? []} onRefresh={fetchData} />
      )}

      {/* Pagination */}
      <div className="section-7 mt-4 flex items-center justify-between">
        <span className="inner-label text-gray-600">
          {loading
            ? "Đang tải..."
            : totalItems === 0
            ? "Không có kết quả"
            : `Hiển thị ${Math.min(
                (currentPage - 1) * limit + 1,
                totalItems
              )} - ${Math.min(
                currentPage * limit,
                totalItems
              )} của ${totalItems} đơn hàng`}
        </span>

        {totalPages > 0 && (
          <select
            className="inner-pagination px-4 py-2 border rounded-md"
            value={currentPage}
            onChange={(e) => setCurrentPage(Number(e.target.value))}
            aria-label="Chọn trang đơn hàng"
            disabled={loading || totalPages === 0}
          >
            {Array.from(
              { length: Math.max(1, totalPages) },
              (_, i) => i + 1
            ).map((page) => (
              <option key={page} value={page}>
                Trang {page}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
}
