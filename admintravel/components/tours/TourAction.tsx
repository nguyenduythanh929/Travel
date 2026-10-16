"use client";

import { FiSearch } from "react-icons/fi";
import Link from "next/link";

export default function TourAction() {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-4 flex flex-wrap items-center justify-between gap-4">
      {/* Hành động */}
      <div className="flex items-center gap-2">
        <select className="border px-3 py-2 rounded-lg">
          <option>-- Hành động --</option>
          <option>Hoạt động</option>
          <option>Dừng hoạt động</option>
          <option>Xóa</option>
        </select>
        <button className="px-4 py-2 bg-red-500 text-white rounded-lg">
          Áp dụng
        </button>
      </div>

      {/* Ô tìm kiếm */}
      <div className="flex-1 min-w-[260px] max-w-xl flex items-center gap-2 border px-3 py-2 rounded-lg">
        <FiSearch />
        <input
          type="text"
          className="flex-1 outline-none"
          placeholder="Tìm kiếm"
        />
      </div>

      {/* Nút tạo mới + thùng rác */}
      <div className="flex items-center gap-3">
        <Link
          href="/tours/create"
          className="px-6 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700"
        >
          + Tạo mới
        </Link>
        <button className="px-6 py-2 rounded-lg bg-red-100 text-red-500 font-medium">
          Thùng rác
        </button>
      </div>
    </div>
  );
}
