"use client";

import { FiFilter, FiRefreshCcw } from "react-icons/fi";

export default function TourFilter() {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-4 flex flex-wrap items-center gap-4">
      {/* Bộ lọc */}
      <button className="flex items-center gap-2 px-4 py-2 border rounded-lg">
        <FiFilter /> Bộ lọc
      </button>

      {/* Trạng thái */}
      <select className="border px-3 py-2 rounded-lg min-w-[140px]">
        <option>Trạng thái</option>
        <option>Hoạt động</option>
        <option>Tạm dừng</option>
      </select>

      {/* Người tạo */}
      <select className="border px-3 py-2 rounded-lg min-w-[140px]">
        <option>Người tạo</option>
        <option>Lê Văn A</option>
        <option>Lê Văn B</option>
      </select>

      {/* Ngày */}
      <div className="flex items-center gap-2">
        <input type="date" className="border px-3 py-2 rounded-lg" />
        <span>-</span>
        <input type="date" className="border px-3 py-2 rounded-lg" />
      </div>

      {/* Danh mục */}
      <select className="border px-3 py-2 rounded-lg min-w-[140px]">
        <option>Danh mục</option>
        <option>Biển đảo</option>
        <option>Núi rừng</option>
      </select>

      {/* Mức giá */}
      <select className="border px-3 py-2 rounded-lg min-w-[140px]">
        <option>Mức giá</option>
        <option>&lt; 1.000.000đ</option>
        <option>1 - 3 triệu</option>
        <option>&gt; 3 triệu</option>
      </select>

      {/* Xóa bộ lọc */}
      <button className="flex items-center gap-2 text-red-500 px-4 py-2">
        <FiRefreshCcw /> Xóa bộ lọc
      </button>
    </div>
  );
}
