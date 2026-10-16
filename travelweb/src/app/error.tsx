"use client"; // 👈 Bắt buộc phải có, vì error.tsx là Client Component

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Ghi log hoặc báo lỗi lên server nếu cần
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h2 className="text-2xl font-bold text-red-500 mb-2">
        ⚠️ Đã xảy ra lỗi!
      </h2>
      <p className="mb-4 text-gray-600">{error.message}</p>

      <button
        onClick={() => reset()} // Gọi hàm này để thử render lại
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Thử lại
      </button>
    </div>
  );
}
