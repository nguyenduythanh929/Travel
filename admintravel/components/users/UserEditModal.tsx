"use client";

import { useEffect, useState } from "react";
import { updateUser, UpdateUserPayload } from "@/app/api/userApi";
import { User } from "@/app/home/users/userclient";

type UserEditModalProps = {
  user: User | null;
  onClose: () => void;
  refreshUsers: () => void;
};

const DEFAULT_FORM: UpdateUserPayload = {
  name: "",
  email: "",
  phone: "",
  address: "",
  roleCode: "USER",
  status: 1,
};

export default function UserEditModal({
  user,
  onClose,
  refreshUsers,
}: UserEditModalProps) {
  const [formData, setFormData] = useState<UpdateUserPayload>(DEFAULT_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        avatar: user.avatar,
        roleCode: "USER",
        status: user.status,
      });
      setError(null);
    } else {
      setFormData(DEFAULT_FORM);
    }
  }, [user]);

  if (!user) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "status" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await updateUser(user.id, formData);
      refreshUsers();
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Không thể cập nhật người dùng"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-user-title"
    >
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 id="edit-user-title" className="text-xl font-semibold">
            Chỉnh sửa người dùng
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Đóng"
            disabled={isSubmitting}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-1">Họ tên</label>
            <input
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Số điện thoại
            </label>
            <input
              name="phone"
              value={formData.phone || ""}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Địa chỉ</label>
            <input
              name="address"
              value={formData.address || ""}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Trạng thái</label>
            <select
              name="status"
              value={formData.status ?? 1}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value={1}>Hoạt động</option>
              <option value={0}>Dừng hoạt động</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              className="px-4 py-2 rounded-lg border"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-60"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
