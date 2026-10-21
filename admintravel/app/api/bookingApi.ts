import { BACKEND_URL } from "@/lib/backend";
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || `${BACKEND_URL}/api`;

const handleResponse = async (res: Response) => {
  if (res.status === 401) {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    throw new Error("Unauthorized");
  }
  if (res.status === 403) {
    if (typeof window !== "undefined") {
      window.location.href = "/not-found";
    }
    throw new Error("Forbidden");
  }
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "API request failed");
  }
  return res;
};

export interface BookingItem {
  id: number;
  tourId: number;
  tourName: string;
  tourImage: string;
  departureDate: string;
  adultCount: number;
  childCount: number;
  infantCount: number;
  departureLocation: string;
  pricePerAdult: number;
  pricePerChild: number;
  pricePerInfant: number;
  subTotal: number;
}

export interface Booking {
  id: number;
  bookingCode?: string;
  userId: number;
  items: BookingItem[];
  totalPrice: number;
  discount: number;
  finalPrice: number;
  voucherCode?: string;
  paymentStatus: number;
  paymentStatusDescription?: string;
  paymentMethodName: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerAddress?: string;
  customerNote?: string;
  status: number;
  statusDescription?: string;
  note?: string;
  specialRequests?: string;
  expirationTime?: string;
  paidAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  cancelledBy?: string;
  confirmedByStaff?: string;
  totalAdults?: number;
  totalChildren?: number;
  totalInfants?: number;
  totalPassengers?: number;
  capacityDeducted?: boolean;
  isExpired?: boolean;
  canCancel?: boolean;
  canPay?: boolean;
  created_at?: number[];
}

export interface BookingListResponse {
  data: Booking[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

export const getBookings = async (
  offset = 0,
  limit = 10,
  paymentStatus: number | undefined,
  name?: string | undefined,
  dateFrom?: string | undefined,
  dateTo?: string | undefined,
  bookingStatus?: number | undefined
) => {
  const params = new URLSearchParams();
  params.set("offset", String(offset));
  params.set("limit", String(limit));
  if (paymentStatus !== undefined)
    params.set("paymentStatus", String(paymentStatus));
  if (bookingStatus !== undefined) params.set("status", String(bookingStatus));
  if (name) params.set("keyword", name);
  if (dateFrom) params.set("startDate", dateFrom);
  if (dateTo) params.set("endDate", dateTo);

  const url = `${API_BASE_URL}/bookings/search?${params.toString()}`;
  const res = await fetch(url, {
    credentials: "include",
  });
  await handleResponse(res);
  const data: BookingListResponse = await res.json();
  return data;
};

export const updateBookingPaymentStatus = async (
  id: number,
  paymentStatus: number
) => {
  const url = `${API_BASE_URL}/bookings/${id}`;
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ paymentStatus }),
  });
  await handleResponse(res);
  const data: Booking = await res.json();
  return data;
};


/**
 * Confirm cash payment by staff (offline payment).
 * This will mark the booking as PAID and deduct tour capacity.
 */
export const confirmCashPayment = async (
  bookingId: number,
  staffNote?: string
) => {
  const url = `${API_BASE_URL}/admin/bookings/confirm-cash-payment`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ bookingId, staffNote }),
  });
  await handleResponse(res);
  const data: Booking = await res.json();
  return data;
};

/**
 * Cancel a booking by admin.
 * This will restore tour capacity if the booking was paid.
 */
export const cancelBookingAdmin = async (
  bookingId: number,
  reason?: string,
  refundAmount?: number,
  restoreCapacity: boolean = true
) => {
  const url = `${API_BASE_URL}/admin/bookings/cancel`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ bookingId, reason, refundAmount, restoreCapacity }),
  });
  await handleResponse(res);
  const data: Booking = await res.json();
  return data;
};

/**
 * Mark a booking as completed.
 */
export const completeBooking = async (bookingId: number) => {
  const url = `${API_BASE_URL}/admin/bookings/${bookingId}/complete`;
  const res = await fetch(url, {
    method: "POST",
    credentials: "include",
  });
  await handleResponse(res);
  const data: Booking = await res.json();
  return data;
};

/**
 * Get a single booking by ID (admin).
 */
export const getBookingById = async (bookingId: number) => {
  const url = `${API_BASE_URL}/admin/bookings/${bookingId}`;
  const res = await fetch(url, {
    credentials: "include",
  });
  await handleResponse(res);
  const data: Booking = await res.json();
  return data;
};

/**
 * Get a single booking by booking code (admin).
 */
export const getBookingByCode = async (bookingCode: string) => {
  const url = `${API_BASE_URL}/admin/bookings/code/${bookingCode}`;
  const res = await fetch(url, {
    credentials: "include",
  });
  await handleResponse(res);
  const data: Booking = await res.json();
  return data;
};

/**
 * Get all bookings with a specific status.
 */
export const getBookingsByStatus = async (
  status: number,
  offset: number = 0,
  limit: number = 10
) => {
  const url = `${API_BASE_URL}/admin/bookings/status/${status}?offset=${offset}&limit=${limit}`;
  const res = await fetch(url, {
    credentials: "include",
  });
  await handleResponse(res);
  const data: BookingListResponse = await res.json();
  return data;
};

/**
 * Get all pending payment bookings.
 */
export const getPendingPaymentBookings = async (
  offset: number = 0,
  limit: number = 10
) => {
  const url = `${API_BASE_URL}/admin/bookings/pending-payment?offset=${offset}&limit=${limit}`;
  const res = await fetch(url, {
    credentials: "include",
  });
  await handleResponse(res);
  const data: BookingListResponse = await res.json();
  return data;
};

/**
 * Get bookings expiring soon (within specified hours).
 */
export const getBookingsExpiringSoon = async (
  hours: number = 6,
  offset: number = 0,
  limit: number = 10
) => {
  const url = `${API_BASE_URL}/admin/bookings/expiring-soon?hours=${hours}&offset=${offset}&limit=${limit}`;
  const res = await fetch(url, {
    credentials: "include",
  });
  await handleResponse(res);
  const data: BookingListResponse = await res.json();
  return data;
};

/**
 * Manually expire a booking (for testing or admin override).
 */
export const expireBooking = async (bookingId: number) => {
  const url = `${API_BASE_URL}/admin/bookings/${bookingId}/expire`;
  const res = await fetch(url, {
    method: "POST",
    credentials: "include",
  });
  await handleResponse(res);
  const data: Booking = await res.json();
  return data;
};

/**
 * Run manual expiration check (for testing or admin use).
 */
export const runExpirationCheck = async () => {
  const url = `${API_BASE_URL}/admin/bookings/run-expiration-check`;
  const res = await fetch(url, {
    method: "POST",
    credentials: "include",
  });
  await handleResponse(res);
  const data: { message: string; expiredBookings: number; completedBookings: number } = await res.json();
  return data;
};

export interface BookingStatusOption {
  value: number;
  name: string;
  description: string;
}

/**
 * Get booking status options.
 */
export const getStatusOptions = async () => {
  const url = `${API_BASE_URL}/admin/bookings/status-options`;
  const res = await fetch(url, {
    credentials: "include",
  });
  await handleResponse(res);
  const data: { statuses: BookingStatusOption[] } = await res.json();
  return data;
};
