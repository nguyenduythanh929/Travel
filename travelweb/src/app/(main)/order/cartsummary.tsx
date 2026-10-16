"use client";

import Link from "next/link";
import { useMemo } from "react";
import CardItemOrder from "@/app/(main)/order/carditem_order";
import { useAppContext } from "@/app/AppProvider";

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

interface CartData {
  id: number;
  userId: number;
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  createdAt: string;
  updatedAt: string;
}

interface SummaryProps {
  data: CartItem[] | null;
  cartData: CartData | null;
  onRefresh: () => Promise<void>;
  selectedIds: Set<number>;
  onToggleSelection: (itemId: number) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  allSelected: boolean;
  selectedTotal: number;
}

export default function CartSummary({
  data,
  cartData,
  onRefresh,
  selectedIds,
  onToggleSelection,
  onSelectAll,
  onDeselectAll,
  allSelected,
  selectedTotal,
}: SummaryProps) {
  const { userId } = useAppContext();

  console.log("log data", data);
  console.log("log cartData", cartData);

  const total = useMemo(() => {
    return (
      data?.reduce((sum: number, item: CartItem) => sum + item.subtotal, 0) ?? 0
    );
  }, [data]);

  const selectedCount = selectedIds.size;

  return (
    <div className="max-w-5xl mx-auto bg-white p-6 rounded-2xl shadow-sm mt-6 ">
      {/* Header */}
      <div className="">
        <div className="flex justify-between items-center border-b pb-4 mb-4 ">
          <h2 className="text-xl font-bold text-purple-700">Giỏ Hàng</h2>
          <Link
            href="/"
            className="text-gray-500 hover:text-purple-600 text-sm flex items-center gap-1"
          >
            Quay lại mua hàng →
          </Link>
        </div>

        {/* Select All / Deselect All Controls */}
        {data && data.length > 0 && (
          <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={() => (allSelected ? onDeselectAll() : onSelectAll())}
                className="w-5 h-5 accent-purple-600 cursor-pointer"
              />
              <span className="text-gray-700 font-medium">
                Chọn tất cả ({data.length} sản phẩm)
              </span>
            </div>
            <div className="text-sm text-gray-600">
              Đã chọn: <span className="font-semibold text-purple-700">{selectedCount}</span> sản phẩm
            </div>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {data && data.length !== 0 ? (
            data?.map((item) => (
              <CardItemOrder
                data={item}
                key={item.id}
                onRefresh={onRefresh}
                userId={userId}
                isSelected={selectedIds.has(item.id)}
                onToggleSelection={onToggleSelection}
              />
            ))
          ) : (
            <div className="h-[200px] flex justify-center items-center text-3xl text-blue-700 ">
              Chưa có tour nào
            </div>
          )}
        </div>
      </div>

      <hr className="my-4" />

      {/* Tổng tiền */}
      <div className="space-y-2 text-gray-700 text-sm max-w-5xl">
        <div className="flex justify-between">
          <span>Tổng tiền giỏ hàng:</span>
          <span>{total.toLocaleString("vi-VN")} đ</span>
        </div>
        <div className="flex justify-between text-purple-600">
          <span>Đã chọn ({selectedCount} sản phẩm):</span>
          <span className="font-semibold">{selectedTotal.toLocaleString("vi-VN")} đ</span>
        </div>
        <hr className="my-2" />
        <div className="flex justify-between font-bold text-lg text-purple-700 mt-2">
          <span>Thanh toán:</span>
          <span>{selectedTotal.toLocaleString("vi-VN")} đ</span>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          * Mã giảm giá sẽ được áp dụng khi thanh toán
        </p>
      </div>
    </div>
  );
}
