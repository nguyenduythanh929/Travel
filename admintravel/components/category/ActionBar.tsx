"use client";

import { FiSearch } from "react-icons/fi";
import Link from "next/link";

export default function ActionBar() {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-4 flex justify-between items-center">
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

      <div className="flex items-center gap-2 border px-3 py-2 rounded-lg w-72">
        <FiSearch />
        <input type="text" placeholder="Tìm kiếm" className="flex-1 outline-none" />
      </div>

      <Link
        href="/category/create"
        className="px-5 py-2 bg-blue-600 text-white rounded-lg"
      >
        + Tạo mới
      </Link>
    </div>
  );
}
