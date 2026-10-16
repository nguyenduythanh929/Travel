"use client";

import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { deleteUsers, updateUser } from "@/app/api/userApi";

type UserActionProps = {
  ids: number[];
  setIds: React.Dispatch<React.SetStateAction<number[]>>;
  refreshUsers: () => void;
  keyword: string;
  setKeyword: React.Dispatch<React.SetStateAction<string>>;
};

export default function UserAction({
  ids,
  setIds,
  refreshUsers,
  keyword,
  setKeyword,
}: UserActionProps) {
  const [selectedAction, setSelectedAction] = useState<string>("");
  const [isApplying, setIsApplying] = useState(false);
  console.log('ids',ids)
  const handleApply = async () => {
    if (!selectedAction || !ids.length) {
      return;
    }

    
    setIsApplying(true);
    try {
      if (selectedAction === "delete") {
        await deleteUsers(ids);
      } else if (selectedAction === "active" || selectedAction === "stop") {
        const statusValue = selectedAction === "active" ? 1 : 0;
        await Promise.all(ids.map((id) => updateUser(id, { status: statusValue })));
      }
      setIds([]);
      refreshUsers();
    } catch (error) {
      console.error("Error applying action:", error);
    } finally {
      setIsApplying(false);
      setSelectedAction("");
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-4 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <select
          className="border px-3 py-2 rounded-lg"
          value={selectedAction}
          onChange={(e) => setSelectedAction(e.target.value)}
          aria-label="Chọn hành động người dùng"
        >
          <option value="">-- Hành động --</option>
          <option value="active">Hoạt động</option>
          <option value="stop">Dừng hoạt động</option>
          <option value="delete">Xóa</option>
        </select>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded-lg disabled:opacity-60 disabled:cursor-not-allowed"
          onClick={handleApply}
          disabled={!ids.length || !selectedAction || isApplying}
        >
          {isApplying ? "Đang áp dụng..." : "Áp dụng"}
        </button>
      </div>

      <div className="flex-1 min-w-[260px] max-w-xl flex items-center gap-2 border px-3 py-2 rounded-lg">
        <FiSearch />
        <input
          type="text"
          className="flex-1 outline-none"
          placeholder="Tìm kiếm theo tên / email / số điện thoại"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </div>
    </div>
  );
}
