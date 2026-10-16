"use client";

import { FiSearch } from "react-icons/fi";

export default function OrderSearch() {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-4 flex items-center gap-3">
      <div className="flex items-center gap-2 border px-3 py-2 rounded-lg w-full">
        <FiSearch />
        <input
          type="text"
          className="flex-1 outline-none"
          placeholder="Tìm kiếm"
        />
      </div>
    </div>
  );
}
