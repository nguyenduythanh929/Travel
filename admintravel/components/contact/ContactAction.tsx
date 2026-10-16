"use client";

import { addContact } from "@/app/api/contactApi";
import { useState, useEffect } from "react";

interface Props {
  reRender: (rerender: boolean) => void;
  onSearch?: (keyword: string) => void;
}

export default function ContactAction({ reRender, onSearch }: Props) {
  const [showform, setShowform] = useState(false);
  const [email, setEmail] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");

  // Debounce search - trigger after 300ms of no typing
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch?.(searchKeyword);
    }, 300);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchKeyword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try{
      const res =await addContact(email);
      reRender((prev)=>!prev);
      setShowform(false);
    }catch (error) {
      console.error("Error submitting contact:", error);
    }
  }
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-4 flex items-center justify-between">

      <div className="flex items-center gap-2">
        <select className="border px-3 py-2 rounded-lg">
          <option>-- Hành động --</option>
          <option>Xóa</option>
        </select>

        <button className="px-4 py-2 bg-red-500 text-white rounded-lg">
          Áp dụng
        </button>
      </div>

    <div className="flex">
    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg mr-2" onClick={() => setShowform(!showform)}>Thêm liên hệ</button>
    <div className="flex items-center gap-2 border px-3 py-2 rounded-lg w-72">
          <span className="text-gray-500">🔍</span>
          <input
            type="text"
            className="flex-1 outline-none"
            placeholder="Tìm kiếm theo email"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
      </div>
    </div>
    {showform && (
       <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Nền phủ */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowform(false)}
          />

          {/* Modal */}
          <div className="relative z-10 w-full max-w-md bg-white rounded-lg p-6 shadow-xl">
            {/* Nút đóng */}
            <button
              onClick={() => setShowform(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
            >
              ✕
            </button>

            <h2 className="text-xl font-semibold mb-4">
              Liên hệ
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                placeholder="Nhập email liên hệ"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border px-3 py-2 rounded"
              />

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded"
              >
                Gửi
              </button>
            </form>
          </div>
        </div>
    )}

    </div>
  );
}
