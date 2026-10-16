type PaymentInfoProps = {
  info: {
    total: number;
    discount: number;
    final: number;
    method: string;
    status: number;
  };
};

export default function PaymentInfo({ info }: PaymentInfoProps) {
  const formatVnd = (value: number) => `${value.toLocaleString("vi-VN")}₫`;

  const statusText =
    info.status === 1
      ? "Đã thanh toán"
      : info.status === 0
      ? "Chưa thanh toán"
      : info.status === 2
      ? "Hủy/Hoàn tiền"
      : "Không rõ";

  return (
    <div className="text-sm">
      <div>Tổng tiền: {formatVnd(info.total)}</div>
      <div>Giảm: {formatVnd(info.discount)}</div>
      <div>Thanh toán: {formatVnd(info.final)} </div>
      <div>PTTT: {info.method}</div>
      <div>TTTT: {statusText}</div>
    </div>
  );
}
