"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  createAdmin,
  AdminCreateRequest,
  RoleDTO,
} from "@/app/api/adminApi";
import { getRoles } from "@/app/api/roleApi";

export default function AdminCreatePage() {
  const router = useRouter();
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    roleId: 0,
    status: 1,
  });

  // Fetch roles
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setLoading(true);
        const response = await getRoles();
        setRoles(response.data.roles);
      } catch (err: any) {
        setError(err.message || "Không thể tải danh sách nhóm quyền");
        console.error("Error fetching roles:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "roleId" || name === "status" ? parseInt(value) : value,
    }));
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Vui lòng nhập họ tên");
      return;
    }

    if (!formData.email.trim()) {
      alert("Vui lòng nhập email");
      return;
    }

    if (!formData.password.trim()) {
      alert("Vui lòng nhập mật khẩu");
      return;
    }

    if (formData.roleId === 0) {
      alert("Vui lòng chọn nhóm quyền");
      return;
    }

    try {
      setSubmitting(true);

      const selectedRole = roles.find(r => r.id === formData.roleId);
      if (!selectedRole) {
        alert("Nhóm quyền không hợp lệ");
        return;
      }

      const requestData: AdminCreateRequest = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        address: formData.address,
        status: formData.status,
        roleCode: selectedRole.code || "",
        roles: [
          {
            id: selectedRole.id,
            name: selectedRole.name,
            code: selectedRole.code || "",
          },
        ],
      };

      await createAdmin(requestData);
      alert("Tạo tài khoản quản trị thành công");
      router.push("/home/settings/admins");
    } catch (err: any) {
      alert(err.message || "Không thể tạo tài khoản quản trị");
      console.error("Error creating admin:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <h1 className="box-title">Tạo tài khoản quản trị</h1>
      <div className="section-8">
        {error && (
          <div style={{ padding: "10px", background: "#ffebee", color: "#c62828", marginBottom: "10px" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} id="setting-account-admin-create-form">
          <div className="inner-group">
            <label className="inner-label" htmlFor="name">
              Họ tên *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="inner-group">
            <label className="inner-label" htmlFor="email">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="inner-group">
            <label className="inner-label" htmlFor="phone">
              Số điện thoại *
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
            />
          </div>
          <div className="inner-group">
            <label className="inner-label" htmlFor="roleId">
              Nhóm quyền *
            </label>
            <select
              id="roleId"
              name="roleId"
              value={formData.roleId}
              onChange={handleInputChange}
              required
            >
              <option value="0">-- Chọn nhóm quyền --</option>
              {loading ? (
                <option disabled>Đang tải...</option>
              ) : (
                roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))
              )}
            </select>
          </div>
          <div className="inner-group">
            <label className="inner-label" htmlFor="address">
              Địa chỉ
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
            />
          </div>
          <div className="inner-group">
            <label className="inner-label" htmlFor="status">
              Trạng thái
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
            >
              <option value="1">Hoạt động</option>
              <option value="0">Tạm dừng</option>
            </select>
          </div>
          <div className="inner-group">
            <label className="inner-label" htmlFor="password">
              Mật khẩu *
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="inner-button inner-two-col">
            <button type="submit" disabled={submitting}>
              {submitting ? "Đang tạo..." : "Tạo mới"}
            </button>
          </div>
        </form>
        <div className="inner-back">
          <Link href="/home/settings/admins">Quay lại danh sách</Link>
        </div>
      </div>
    </>
  );
}
