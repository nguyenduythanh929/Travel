"use client";

import { FiFilter, FiRefreshCcw } from "react-icons/fi";

type UserFilterProps = {
  statusFilter: string;
  setStatusFilter: React.Dispatch<React.SetStateAction<string>>;
};

export default function UserFilter({ statusFilter, setStatusFilter }: UserFilterProps) {
  const handleClear = () => setStatusFilter("");

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-4 flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-2">
        <FiFilter />
        <span className="font-medium">Bộ lọc người dùng</span>
      </div>

      <select
        className="border px-3 py-2 rounded-lg min-w-[160px]"
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        aria-label="Lọc theo trạng thái"
      >
        <option value="">Tất cả trạng thái</option>
        <option value="1">Hoạt động</option>
        <option value="0">Dừng hoạt động</option>
      </select>

      <button
        className="flex items-center gap-2 text-red-500 px-4 py-2 disabled:opacity-50"
        onClick={handleClear}
        disabled={statusFilter === ""}
      >
        <FiRefreshCcw /> Xóa lọc
      </button>
    </div>
  );
}
