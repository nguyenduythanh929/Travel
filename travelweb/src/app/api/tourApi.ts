// src/services/tourApi.ts
// Service để gọi API backend Spring Boot

import axios from "axios";

// Lấy URL từ environment variables
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8088/api";

// Tạo axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Add response interceptor để handle errors
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Success: ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    console.error(
      `❌ API Error: ${error.config?.url}`,
      error.response?.data || error.message
    );
    return Promise.reject(error);
  }
);

// ============== TYPES ==============

export interface TourListResponse {
  totalPages: number;
  totalItems: number;
  page: number;
  limit: number;
  tours: TourResponse[];
}

export interface TourResponse {
  id: number;
  name: string;
  imageUrl: string;
  originalPrice: number;
  discountedPrice: number;
  discountPercent: number;
  isOnSale: boolean;
  startDate: [number, number, number];
  duration: number;
  remainSlot: number;
  rating: number;
  reviewCount: number;
  promotionName: string;
  tourDetail: string;
  priceAdult: number;
  priceChild: number;
  priceInfant: number;
  remainAdult: number;
  remainChild: number;
  remainInfant: number;
  status: number;
  createdBy: string;
  updatedBy: string;
  createdAt: [number, number, number, number, number, number] | string;
  updatedAt: [number, number, number, number, number, number] | string;
}

export interface LocationResponse {
  id: number;
  name: string;
  selected: boolean;
}

export interface TourScheduleResponse {
  id: number;
  title: string;
  description: string;
}

export interface TourDetailResponse {
  id: number;
  name: string;
  avatar: string;
  originalPrice: number;
  discountedPrice: number;
  discountPercent: number;
  isOnSale: boolean;
  tourDetail: string;
  startDate: [number, number, number];
  duration: string;
  remainSlot: number;
  rating: number;
  reviewCount: number;
  promotionName: string;
  images: string[];
  schedules: TourScheduleResponse[];
  locations: LocationResponse[];
}

export interface TourFilterParams {
  offset?: number;
  limit?: number;
  typeId?: number | null;
  name?: string;
  priceFrom?: number;
  priceTo?: number;
  startDate?: string;
  status?: number;
}

// ============== ADMIN TYPES ==============

export interface LocationResponse {
  id: number;
  name: string;
  selected: boolean;
}

export interface TourTypeResponse {
  id: number;
  name: string;
  description: string;
  status: number;
  parentId: number | null;
  tourTypes?: TourTypeResponse[];
  children?: TourTypeResponse[];
  selected: boolean;
}

export interface TourAdminInitResponse {
  locations: LocationResponse[];
  tourTypes: TourTypeResponse[];
}

export interface TourAdminResponse {
  id: number;
  name: string;
  tourTypes: TourTypeResponse[];
  avatar: string;
  images: string[];
  priceAdult: number;
  priceChild: number;
  priceInfant: number;
  remainAdult: number;
  remainChild: number;
  remainInfant: number;
  locations: LocationResponse[];
  duration: number;
  transport: string;
  status: number;
  departureDate: [number, number, number];
  tourDetail: string;
  schedules: TourScheduleResponse[];
  discount: number;
  discountType: string;
  promotionId: number;
  createdBy: string;
  updatedBy: string;
}

export interface TourScheduleRequest {
  title: string;
  description: string;
}

export interface TourAdminRequest {
  name: string;
  avatar?: string;
  priceAdult: number;
  priceChild: number;
  priceInfant: number;
  description?: string;
  tourDetail: string;
  note?: string;
  remainAdult: number;
  remainChild: number;
  remainInfant: number;
  duration: number;
  transport: string;
  status: number;
  tourTypeId: number;
  locationIds: number[];
  departureDates: string; // Format: dd/MM/yyyy
  schedules: TourScheduleRequest[];
  discount?: number;
  discountType?: string;
}

// ============== API FUNCTIONS ==============

/**
 * Lấy danh sách tours với filters
 */
export const getTours = async (
  offset: number = 0,
  limit: number = 10,
  typeId: number | null = null,
  name: string = "",
  priceFrom?: number,
  priceTo?: number,
  startDate?: string,
  status?: number
) => {
  console.log("Calling getTours API:", {
    offset,
    limit,
    typeId,
    name,
    priceFrom,
    priceTo,
    startDate,
    status,
  });

  return api.get<TourListResponse>("/tours", {
    params: {
      offset,
      limit,
      typeId: typeId ?? undefined,
      name: name || undefined,
      priceFrom,
      priceTo,
      startDate,
      status: status !== undefined ? status : undefined,
    },
  });
};

/**
 * Lấy chi tiết một tour
 */
export const getTourDetail = async (id: number) => {
  console.log("🚀 Calling getTourDetail API:", id);
  return api.get<TourDetailResponse>(`/tours/${id}`);
};

/**
 * Lấy dữ liệu khởi tạo cho form admin (locations, tourTypes)
 */
export const getTourInitData = async () => {
  console.log("🚀 Calling getTourInitData API");
  return api.get<TourAdminInitResponse>("/tours/admin");
};

export const getTourAdminData = async (id: number) => {
  return api.get<TourAdminResponse>(`/tours/admin/${id}`);
};

/**
 * Tạo tour mới (Admin)
 */
export const createTour = async (data: TourAdminRequest) => {
  console.log("🚀 Calling createTour API:", data);
  return api.post<number>("/tours/create", data);
};

/**
 * Cập nhật tour (Admin)
 */
export const updateTour = async (id: number, data: TourAdminRequest) => {
  console.log("🚀 Calling updateTour API:", id, data);
  return api.put<string>(`/tours/${id}`, data);
};

/**
 * Xóa tour (Admin) - Soft delete (status = 0)
 */
export const deleteTour = async (id: number) => {
  console.log("🚀 Calling deleteTour API:", id);
  return api.delete<string>(`/tours/${id}`);
};

/**
 * Khôi phục tour từ thùng rác (Admin) - Restore (status = 1)
 */
export const restoreTour = async (id: number) => {
  console.log("🚀 Calling restoreTour API:", id);
  return api.patch<string>(`/tours/${id}/restore`);
};

/**
 * Xóa vĩnh viễn tour (Admin) - Permanent delete
 */
export const permanentDeleteTour = async (id: number) => {
  console.log("🚀 Calling permanentDeleteTour API:", id);
  return api.delete<string>(`/tours/${id}/permanent`);
};

/**
 * Upload hình ảnh tour (Admin)
 */
export const uploadTourImages = async (id: number, files: File[]) => {
  console.log("🚀 Calling uploadTourImages API:", id, files.length);

  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  return api.post(`/tours/uploads/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

/**
 * Lấy tours theo type ID
 */
export const getToursByType = async (typeId: number, limit: number = 10) => {
  console.log("🚀 Calling getToursByType API:", typeId);
  return getTours(0, limit, typeId);
};

// Export axios instance nếu cần custom requests
export { api };
