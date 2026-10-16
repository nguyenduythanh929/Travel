import { BACKEND_URL } from "@/lib/backend";
const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || `${BACKEND_URL}/api/tours`;

export function getImageUrl(url: string | undefined | null): string {
  if (!url) {
    return "/tour-1.png";
  }
  return `${API_BASE}/images/${url}`;
}
