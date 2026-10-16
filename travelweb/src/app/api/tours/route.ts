export const dynamic = "force-dynamic";

import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8088/api",
  withCredentials: true,
});
export interface TourListResponse {
  totalPages: number;
  totalItems: number;
  page: number;
  limit: number;
  tours: TourDetailResponse[];
}

export interface TourDetailResponse {
  id: number;
  name: string;
  imageUrl: string;
  originalPrice: number;
  discountedPrice: number;
  discountPercent: number;
  isOnSale: boolean;
  startDate: [number, number, number];
  duration: string;
  remainSlot: number;
  rating: number;
  reviewCount: number;
  promotionName: string;
}

export interface TourFilterParams {
  offset: number;
  limit: number;
  typeId?: number | null;
  name?: string;
  startLocation?: string;
  destination?: string;
  departureDate?: string;
  adultCount?: number;
  childCount?: number;
  infantCount?: number;
  priceFrom?: number;
  priceTo?: number;
}

// Overloaded function signatures
export function getTours(params: TourFilterParams): ReturnType<typeof api.get<TourListResponse>>;
export function getTours(
  offset: number,
  limit: number,
  typeId?: number | null,
  name?: string,
  priceFrom?: number,
  priceTo?: number,
  startDate?: string
): ReturnType<typeof api.get<TourListResponse>>;

// Implementation
export function getTours(
  paramsOrOffset: TourFilterParams | number,
  limit?: number,
  typeId?: number | null,
  name?: string,
  priceFrom?: number,
  priceTo?: number,
  startDate?: string
) {
  // Check if first parameter is an object (new signature) or number (old signature)
  if (typeof paramsOrOffset === 'object') {
    const params = paramsOrOffset;
    return api.get<TourListResponse>("/tours", {
      params: {
        ...params,
        typeId: params.typeId ?? undefined,
      },
    });
  } else {
    // Old signature - convert to new format
    const offset = paramsOrOffset;
    return api.get<TourListResponse>("/tours", {
      params: {
        offset,
        limit,
        typeId: typeId ?? undefined,
        name,
        priceFrom,
        priceTo,
        startDate,
      },
    });
  }
}

export const getTourDetail = (id: number) => {
  return api.get<TourDetailResponse>(`/tours/${id}`);
};

export const createTour = (data: any) => {
  return api.post<number>("/tours/create", data);
};

export const deleteTour = (id: number) => {
  return api.delete<string>(`/tours/${id}`);
};
export const uploadTourImages = (id: number, files: File[]) => {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  return api.post(`/tours/uploads/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
