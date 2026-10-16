"use client";
import React, { useEffect, useState } from "react";
import {
  getCurrentUser,
  updateUser,
  changePassword,
  type UserDetail,
  type ChangePasswordPayload,
} from "@/app/api/userApi";

type FormFieldProps = {
  label: string;
  children: React.ReactNode;
};

const FormField: React.FC<FormFieldProps> = ({ label, children }) => (
  <div className="flex flex-col gap-2">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    {children}
  </div>
);

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  // Password form states
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const userData = await getCurrentUser();
        setUser(userData);
        setFormData({
          name: userData.name || "",
          email: userData.email || "",
          phone: userData.phone || "",
          address: userData.address || "",
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Không thể tải thông tin người dùng"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle profile update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      await updateUser(user.id, formData);
      setSuccess("Cập nhật thông tin thành công!");

      // Refresh user data
      const updatedUser = await getCurrentUser();
      setUser(updatedUser);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Không thể cập nhật thông tin"
      );
    } finally {
      setSaving(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      await changePassword(user.id, passwordData as ChangePasswordPayload);
      setSuccess("Đổi mật khẩu thành công!");
      setShowPasswordModal(false);
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể đổi mật khẩu");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6">
        <div className="text-center text-red-600">
          Không thể tải thông tin người dùng. Vui lòng đăng nhập lại.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Thông tin cá nhân</h1>

      {/* Success/Error Messages */}
      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700">
          {success}
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <div className="bg-white border-gray-300 rounded-2xl shadow-sm p-8">
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Họ tên + Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Họ tên">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </FormField>

            <FormField label="Email">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </FormField>
          </div>

          {/* SĐT + Địa chỉ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Số điện thoại">
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </FormField>

            <FormField label="Địa chỉ">
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </FormField>
          </div>

          {/* Nhóm quyền (readonly) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Nhóm quyền">
              <input
                type="text"
                value={user.roleName || "N/A"}
                disabled
                className="w-full rounded-lg border border-gray-200 bg-gray-100 px-4 py-3 outline-none cursor-not-allowed"
              />
            </FormField>

            <div /> {/* cột trống để cân layout */}
          </div>

          {/* Nút hành động */}
          <div className="pt-4 flex flex-col items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="w-64 rounded-full bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Đang lưu..." : "Cập nhật"}
            </button>

            <button
              type="button"
              onClick={() => setShowPasswordModal(true)}
              className="text-blue-600 text-sm font-medium hover:underline"
            >
              Đổi mật khẩu
            </button>
          </div>
        </form>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-6">Đổi mật khẩu</h2>

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <FormField label="Mật khẩu cũ">
                <input
                  type="password"
                  value={passwordData.oldPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      oldPassword: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </FormField>

              <FormField label="Mật khẩu mới">
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      newPassword: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </FormField>

              <FormField label="Xác nhận mật khẩu mới">
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </FormField>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordData({
                      oldPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    });
                    setError(null);
                  }}
                  className="flex-1 rounded-full border border-gray-300 px-6 py-3 font-semibold hover:bg-gray-50 transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-full bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? "Đang lưu..." : "Đổi mật khẩu"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
