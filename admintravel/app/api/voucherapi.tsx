const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8088/api";

// const USERS_ENDPOINT = `${API_BASE_URL}/users`;

export interface VoucherDetail {
  id: number;
  code: string;
  description: string;
  discountType: "PERCENTAGE" | "FIXED_AMOUNT";
  discountValue: number;
  minPurchaseAmount: number;
  maxDiscountAmount: number;
  validFrom: number[];
  validTo: number[];
  usageLimit: number;
  usageCount: number;
  isActive: boolean;
}

export interface VoucherRequest {
  code: string;
  description?: string;
  discountType: "PERCENTAGE" | "FIXED_AMOUNT";
  discountValue: number;
  minPurchaseAmount?: number;
  maxDiscountAmount?: number;
  validFrom: string;
  validTo: string;
  usageLimit?: number;
  isActive?: boolean;
}
// export interface VoucherResponse {
//   data: VoucherDetail[];
// }

export const getVouchers = async (): Promise<VoucherDetail[]> => {
  const res = await fetch(`${API_BASE_URL}/vouchers`, {
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("Failed to get vouchers!");
  }
  const data: VoucherDetail[] = await res.json();
  return data;
};
export const getVoucherById = async (id: number): Promise<VoucherDetail> => {
  const res = await fetch(`${API_BASE_URL}/vouchers/${id}`, {
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("Failed to get voucher by id!");
  }
  const data: VoucherDetail = await res.json();
  return data;
};

export const deleteVoucher = async (id: number): Promise<void> => {
  const res = await fetch(`${API_BASE_URL}/vouchers/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("Failed to delete voucher!");
  }
};

export const addVoucher = async (
  voucher: VoucherRequest
): Promise<VoucherDetail> => {
  const res = await fetch(`${API_BASE_URL}/vouchers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(voucher),
    credentials: "include",
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to add voucher!");
  }
  const data: VoucherDetail = await res.json();
  return data;
};
