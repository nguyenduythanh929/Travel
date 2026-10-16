"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-300">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mt-4">
          Trang không tồn tại
        </h2>
        <p className="text-gray-500 mt-2">
          Trang bạn đang tìm kiếm không tồn tại hoặc bạn không có quyền truy cập.
        </p>
        <Link
          href="/home"
          className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Quay về trang chủ
        </Link>
      </div>
    </div>
  );
}
