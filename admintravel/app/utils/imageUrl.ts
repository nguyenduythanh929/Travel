const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8088/api/tours";

export function getImageUrl(url: string | undefined | null): string {
  if (!url) {
    return "/tour-1.png";
  }
  return `${API_BASE}/images/${url}`;
}
