"use client";

import { useState } from "react";
import { FiFilter, FiRefreshCcw } from "react-icons/fi";
import { ContactFilterParams } from "@/app/api/contactApi";

interface Props {
  onFilterChange?: (filters: Partial<ContactFilterParams>) => void;
}

export default function ContactFilter({ onFilterChange }: Props) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleApplyFilter = () => {
    if (onFilterChange) {
      onFilterChange({
        start_date: startDate ? new Date(startDate).toISOString() : undefined,
        end_date: endDate ? new Date(endDate).toISOString() : undefined,
      });
    }
  };

  const handleClearFilter = () => {
    setStartDate("");
    setEndDate("");
    if (onFilterChange) {
      onFilterChange({
        start_date: undefined,
        end_date: undefined,
        keyword: undefined,
      });
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-4 flex items-center gap-4">
      <button
        className="flex items-center gap-2 px-4 py-2 border rounded-lg"
        onClick={handleApplyFilter}
      >
        <FiFilter /> Bộ lọc
      </button>

      <div className="flex items-center gap-2">
        <input
          type="date"
          className="border px-3 py-2 rounded-lg"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <span>-</span>
        <input
          type="date"
          className="border px-3 py-2 rounded-lg"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

      <button
        className="flex items-center gap-2 text-red-500 px-4 py-2"
        onClick={handleClearFilter}
      >
        <FiRefreshCcw /> Xóa bộ lọc
      </button>
    </div>
  );
}
