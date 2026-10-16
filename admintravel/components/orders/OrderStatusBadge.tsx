type Props = {
  status: number;
};

// Backend BookingStatus enum values:
// 1 = PENDING_PAYMENT
// 2 = PAID
// 3 = COMPLETED
// 4 = CANCELLED
// 5 = EXPIRED
export default function OrderStatusBadge({ status }: Props) {
  let label = "Không xác định";
  let classes = "bg-gray-100 text-gray-600";

  if (status === 1) {
    label = "Chờ thanh toán";
    classes = "bg-yellow-100 text-yellow-700";
  } else if (status === 2) {
    label = "Đã thanh toán";
    classes = "bg-blue-100 text-blue-600";
  } else if (status === 3) {
    label = "Hoàn thành";
    classes = "bg-green-100 text-green-700";
  } else if (status === 4) {
    label = "Đã hủy";
    classes = "bg-red-100 text-red-600";
  } else if (status === 5) {
    label = "Đã hết hạn";
    classes = "bg-gray-200 text-gray-600";
  }

  return (
    <span className={`px-3 py-1 rounded-lg text-sm font-medium ${classes}`}>
      {label}
    </span>
  );
}
