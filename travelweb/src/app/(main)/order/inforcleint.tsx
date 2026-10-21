"use client";
import { BACKEND_URL } from "@/lib/backend";
import { useEffect, useState } from "react";
import { useAppContext } from "@/app/AppProvider";
import { toast } from "sonner";
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
}

interface CartData {
  id: number;
  userId: number;
  items: CartItem[];
  totalItems: number;
  subtotal: number;
}

interface PaymentFormProps {
  cartData: CartData | null;
  selectedItemIds: number[];
  selectedTotal: number;
}

export default function PaymentForm({
  cartData,
  selectedItemIds,
  selectedTotal,
}: PaymentFormProps) {
  const route = useRouter();
  const { userId } = useAppContext();
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [payId, setPayId] = useState(0);
  const [note, setNote] = useState("");
  const [voucherCode, setVoucherCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePaymentSelect = (method: number) => {
    setPayId(method);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!username.trim()) {
      toast.warning("Tên không được để trống");
      return;
    }

    if (!phone.trim()) {
      toast.warning("Số điện thoại không được để trống");
      return;
    }

    if (phone.length < 10 || phone[0] !== "0") {
      toast.warning("Số điện thoại không hợp lệ");
      return;
    }

    if (payId === 0) {
      toast.warning("Chọn phương thức thanh toán");
      return;
    }

    if (!selectedItemIds || selectedItemIds.length === 0) {
      toast.warning("Vui lòng chọn ít nhất một sản phẩm để thanh toán");
      return;
    }

    setIsSubmitting(true);

    try {
      const checkoutRequest = {
        userId: userId,
        cartItemIds: selectedItemIds,
        customerName: username,
        customerPhone: phone,
        customerEmail: email || undefined,
        paymentMethodId: payId,
        voucherCode: voucherCode.trim() || undefined,
        note: note || undefined,
        returnUrl: `${window.location.origin}/order?success=true`,
      };

      const res = await fetch(`${BACKEND_URL}/api/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(checkoutRequest),
        credentials: "include",
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.error || "Đặt tour thất bại");
        return;
      }

      if (payId === 3 && result.paymentUrl) {
        window.location.href = result.paymentUrl;
        return;
      }

      console.log("Checkout successful:", result);
      toast.success("Đặt tour thành công!");
      route.push("/");
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Đã xảy ra lỗi khi đặt tour");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const success = params.get("success");

    if (success === "true") {
      toast.success("Thanh toán thành công!");
      window.history.replaceState({}, "", window.location.pathname);
    } else if (success === "false") {
      toast.error("Thanh toán thất bại");
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md max-w-3xl mx-auto mt-6">
      <h2 className="text-2xl font-bold text-purple-700 mb-4">
        Thông Tin Khách Hàng
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Họ và tên *"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
          <input
            type="text"
            name="phone"
            placeholder="Số điện thoại *"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>

        <input
          type="email"
          name="email"
          placeholder="Email (không bắt buộc)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-purple-600"
        />

        <textarea
          name="note"
          rows={3}
          placeholder="Ghi chú"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-purple-600"
        />

        <div>
          <h2 className="text-2xl font-bold text-purple-700 mt-6 mb-2">
            Mã Giảm Giá
          </h2>
          <input
            type="text"
            placeholder="Nhập mã giảm giá (nếu có)"
            value={voucherCode}
            onChange={(e) => setVoucherCode(e.target.value)}
            className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>

        <h2 className="text-2xl font-bold text-purple-700 mt-6">
          Chọn Phương Thức Thanh Toán
        </h2>
        <div className="flex flex-col gap-2 mt-2">
          {[1, 2, 3, 4, 5].map((method) => (
            <label key={method} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                checked={payId === method}
                onChange={() => handlePaymentSelect(method)}
              />
              <span>
                {method === 1 && "Thanh toán tiền mặt khi đi tour"}
                {method === 2 && "Chuyển khoản ngân hàng"}
                {method === 3 && "Thanh toán VNPay"}
                {method === 4 && "Ví MoMo"}
                {method === 5 && "Thẻ tín dụng"}
              </span>
            </label>
          ))}
        </div>

        {payId === 2 && (
          <div className="bg-gray-100 border-l-4 border-purple-600 p-4 mt-4 rounded-lg">
            <h3 className="font-semibold text-purple-700 mb-1">
              Thông tin chuyển khoản
            </h3>
            <p>
              Ngân hàng: <strong>Vietcombank</strong>
            </p>
            <p>
              Tên tài khoản: <strong>Le Van A</strong>
            </p>
            <p>
              STK: <strong>0123456789</strong>
            </p>
          </div>
        )}

        <div className="bg-purple-50 p-4 rounded-lg mt-6">
          <div className="flex justify-between items-center">
            <span className="text-gray-700">
              Sản phẩm đã chọn: <strong>{selectedItemIds.length}</strong>
            </span>
            <span className="text-xl font-bold text-purple-700">
              {selectedTotal.toLocaleString("vi-VN")} đ
            </span>
          </div>
        </div>

        {/* Nút đặt tour */}
        <button
          type="submit"
          disabled={isSubmitting || selectedItemIds.length === 0}
          className="bg-purple-700 hover:bg-purple-800 text-white font-semibold w-full py-3 rounded-lg mt-4 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting
            ? "Đang xử lý..."
            : selectedItemIds.length === 0
            ? "Chọn sản phẩm để thanh toán"
            : `ĐẶT TOUR (${selectedItemIds.length} sản phẩm)`}
        </button>
      </form>
    </div>
  );
}
