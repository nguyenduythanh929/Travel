// import { toast } from "@/components/ui/use-toast";
import { EntityError } from "@/app/lib/http";
import { type ClassValue, clsx } from "clsx";
import { UseFormSetError } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import jwt from "jsonwebtoken";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const handleErrorApi = ({
  error,
  setError,
  duration,
}: {
  error: any;
  setError?: UseFormSetError<any>;
  duration?: number;
}) => {
  if (error instanceof EntityError && setError) {
    error.payload.errors.forEach((item) => {
      setError(item.field, {
        type: "server",
        message: item.message,
      });
    });
  } else {
    toast({
      title: "Lỗi",
      description: error?.payload?.message ?? "Lỗi không xác định",
      variant: "destructive",
      duration: duration ?? 5000,
    });
  }
};
/**
 * Xóa đi ký tự `/` đầu tiên của path
 */
export const normalizePath = (path: string) => {
  return path.startsWith("/") ? path.slice(1) : path;
};

export const decodeJWT = <Payload = any>(token: string) => {
  return jwt.decode(token) as Payload;
};

/**
 * Format số tiền thành chuỗi tiền tệ VND
 */
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
};

/**
 * Format LocalDateTime từ backend thành "HH:mm - dd/MM/yyyy"
 * @param dateTimeArray - Array [year, month, day, hour, minute, second] từ backend
 * @returns Chuỗi ngày giờ format: "16:30 - 20/10/2024"
 */
export const formatDateTime = (dateTimeArray: [number, number, number, number, number, number] | string | null | undefined): string => {
  if (!dateTimeArray) {
    return "";
  }

  // Nếu là string, trả về như cũ
  if (typeof dateTimeArray === "string") {
    return dateTimeArray;
  }

  // Nếu không phải array, trả về empty
  if (!Array.isArray(dateTimeArray)) {
    return "";
  }

  const [year, month, day, hour, minute, second] = dateTimeArray;

  const dayStr = String(day).padStart(2, "0");
  const monthStr = String(month).padStart(2, "0");
  const hourStr = String(hour).padStart(2, "0");
  const minuteStr = String(minute).padStart(2, "0");

  return `${hourStr}:${minuteStr} - ${dayStr}/${monthStr}/${year}`;
};

/**
 * Format chỉ ngày (không có giờ)
 */
export const formatDate = (dateArray: [number, number, number, number, number, number] | string | null | undefined): string => {
  if (!dateArray) {
    return "";
  }

  // Nếu là string, convert to date
  if (typeof dateArray === "string") {
    const date = new Date(dateArray);
    const dayStr = String(date.getDate()).padStart(2, "0");
    const monthStr = String(date.getMonth() + 1).padStart(2, "0");
    return `${dayStr}/${monthStr}/${date.getFullYear()}`;
  }

  // Nếu không phải array, trả về empty
  if (!Array.isArray(dateArray)) {
    return "";
  }

  const [year, month, day] = dateArray;
  const dayStr = String(day).padStart(2, "0");
  const monthStr = String(month).padStart(2, "0");
  return `${dayStr}/${monthStr}/${year}`;
};
