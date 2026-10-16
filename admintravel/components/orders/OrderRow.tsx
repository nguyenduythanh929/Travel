import { useEffect, useState } from "react";
import TourList from "./TourList";
import PaymentInfo from "./PaymentInfo";
import OrderStatusBadge from "./OrderStatusBadge";
import type { Booking } from "@/app/api/bookingApi";
import { getUserById, type UserDetail } from "@/app/api/userApi";
import {
  confirmCashPayment,
  cancelBookingAdmin,
  completeBooking,
} from "@/app/api/bookingApi";

type OrderRowProps = {
  order: Booking;
  onRefresh?: () => void; // ✅ Thêm callback
};

export default function OrderRow({ order, onRefresh }: OrderRowProps) {
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loadingUser, setLoadingUser] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [bookingStatusState, setBookingStatusState] = useState<number>(
    order.status
  );
  const [paymentStatusState, setPaymentStatusState] = useState<number>(
    order.paymentStatus
  );

  const createdAt = order?.created_at
    ? `${order.created_at[0]}-${order.created_at[1]}-${order.created_at[2]} `
    : null;

  useEffect(() => {
    let isMounted = true;
    const fetchUser = async () => {
      if (!order.userId) return;
      try {
        setLoadingUser(true);
        const data = await getUserById(order.userId);
        if (isMounted) setUser(data);
      } catch (error) {
        console.error("Failed to fetch user for booking", order.id, error);
      } finally {
        if (isMounted) setLoadingUser(false);
      }
    };

    fetchUser();
    return () => {
      isMounted = false;
    };
  }, [order.userId, order.id]);

  const customer = {
    name: user?.name ?? order.customerName,
    phone: user?.phone ?? order.customerPhone,
    note: order.customerNote,
  };

  const paymentInfo = {
    total: order.totalPrice,
    discount: order.discount,
    final: order.finalPrice,
    method: order.paymentMethodName,
    status: paymentStatusState,
  };

  // Confirm cash payment (mark as paid)
  const handleConfirmCashPayment = async () => {
    try {
      setActionLoading(true);
      const result = await confirmCashPayment(order.id);
      setPaymentStatusState(result.paymentStatus);
      setBookingStatusState(result.status);
      setShowModal(false);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error("Failed to confirm cash payment", err);
      alert(err instanceof Error ? err.message : "Không thể xác nhận thanh toán");
    } finally {
      setActionLoading(false);
    }
  };

  // Cancel booking
  const handleCancelBooking = async () => {
    const reason = prompt("Nhập lý do hủy đơn hàng:");
    if (reason === null) return; // User cancelled the prompt

    try {
      setActionLoading(true);
      const result = await cancelBookingAdmin(order.id, reason);
      setPaymentStatusState(result.paymentStatus);
      setBookingStatusState(result.status);
      setShowModal(false);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error("Failed to cancel booking", err);
      alert(err instanceof Error ? err.message : "Không thể hủy đơn hàng");
    } finally {
      setActionLoading(false);
    }
  };

  // Complete booking
  const handleCompleteBooking = async () => {
    try {
      setActionLoading(true);
      const result = await completeBooking(order.id);
      setPaymentStatusState(result.paymentStatus);
      setBookingStatusState(result.status);
      setShowModal(false);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error("Failed to complete booking", err);
      alert(err instanceof Error ? err.message : "Không thể hoàn thành đơn hàng");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <tr className="border-b hover:border-b-4 hover:border-b-blue-300 hover:bg-blue-100">
      <td className="p-3 text-blue-600 font-semibold">
        BK{order.id.toString().padStart(6, "0")}
      </td>

      <td className="p-3">
        Họ tên: {customer.name}
        <br />
        SĐT: {customer.phone}
        <br />
        Ghi chú: {customer.note}
        {loadingUser && (
          <div className="text-xs text-gray-400 mt-1">
            Đang tải thông tin user...
          </div>
        )}
      </td>

      <td className="p-3">
        <TourList tours={order.items} />
      </td>

      <td className="p-3">
        <PaymentInfo info={paymentInfo} />
      </td>

      <td className="p-3">
        <OrderStatusBadge status={bookingStatusState} />
      </td>

      <td className="p-3 text-blue-600 font-semibold">{createdAt}</td>

      <td className="p-3 relative">
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-500 text-white px-2 py-2 rounded-md hover:bg-blue-700"
        >
          Sửa đổi
        </button>

        {showModal && (
          <div className="fixed inset-0 bg-black/40 z-40">
            <div
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                            w-[320px] bg-white rounded-xl shadow-xl z-50"
            >
              {/* Header */}
              <div className="flex justify-between items-center px-4 py-3 border-b">
                <h3 className="font-semibold text-gray-700">
                  Quản lý đơn hàng
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-red-500"
                  disabled={actionLoading}
                >
                  ✕
                </button>
              </div>

              {/* Body */}
              {/* Backend BookingStatus: 1=PENDING_PAYMENT, 2=PAID, 3=COMPLETED, 4=CANCELLED, 5=EXPIRED */}
              {/* Payment status: 0=Not paid, 1=Paid, 2=Cancelled/Refund */}
              <div className="flex flex-col gap-3 p-4">
                {/* Confirm cash payment - only show if payment not done and booking is pending */}
                {paymentStatusState === 0 && bookingStatusState === 1 && (
                  <button
                    onClick={handleConfirmCashPayment}
                    disabled={actionLoading}
                    className="py-2 rounded-md bg-green-200 text-green-700
                               hover:bg-green-300 transition disabled:opacity-50"
                  >
                    {actionLoading ? "Đang xử lý..." : "Xác nhận thanh toán (tiền mặt)"}
                  </button>
                )}

                {/* Complete booking - only show if paid (status 2) */}
                {bookingStatusState === 2 && (
                  <button
                    onClick={handleCompleteBooking}
                    disabled={actionLoading}
                    className="py-2 rounded-md bg-blue-200 text-blue-700
                               hover:bg-blue-300 transition disabled:opacity-50"
                  >
                    {actionLoading ? "Đang xử lý..." : "Hoàn thành đơn hàng"}
                  </button>
                )}

                {/* Cancel booking - only show if not already completed, cancelled, or expired */}
                {bookingStatusState !== 3 && bookingStatusState !== 4 && bookingStatusState !== 5 && (
                  <button
                    onClick={handleCancelBooking}
                    disabled={actionLoading}
                    className="py-2 rounded-md bg-red-200 text-red-600
                               hover:bg-red-300 transition disabled:opacity-50"
                  >
                    {actionLoading ? "Đang xử lý..." : "Hủy đơn hàng"}
                  </button>
                )}

                {/* Info when no actions available */}
                {bookingStatusState === 3 && (
                  <p className="text-center text-green-600 font-medium">
                    Đơn hàng đã hoàn thành
                  </p>
                )}
                {bookingStatusState === 4 && (
                  <p className="text-center text-red-600 font-medium">
                    Đơn hàng đã bị hủy
                  </p>
                )}
                {bookingStatusState === 5 && (
                  <p className="text-center text-gray-600 font-medium">
                    Đơn hàng đã hết hạn
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </td>
    </tr>
  );
}
