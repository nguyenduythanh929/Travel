"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  getAdminById,
  updateAdmin,
  AdminUpdateRequest,
} from "@/app/api/adminApi";
import { getRoles } from "@/app/api/roleApi";

export default function AdminEditPage() {
  const params = useParams();
  const router = useRouter();
  const adminId = parseInt(params.id as string);

  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    roleId: 0,
    status: 1,
  });

  // Fetch admin data and roles
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch roles and admin data in parallel
        const [rolesResponse, adminResponse] = await Promise.all([
          getRoles(),
          getAdminById(adminId),
        ]);

        setRoles(rolesResponse.data.roles);

        // Determine the current role ID
        let currentRoleId = 0;

        // Check currentRole first
        if (adminResponse.data.currentRole?.id) {
          currentRoleId = adminResponse.data.currentRole.id;
        }
        // If no currentRole, check availableRoles array
        else if (
          adminResponse.data.availableRoles &&
          adminResponse.data.availableRoles.length > 0
        ) {
          currentRoleId = adminResponse.data.availableRoles[0].id;
        }

        console.log("Admin data loaded:", adminResponse.data);
        console.log("Selected role ID:", currentRoleId);

        // Set form data with existing admin data
        setFormData({
          name: adminResponse.data.name,
          email: adminResponse.data.email,
          phone: adminResponse.data.phone || "",
          address: adminResponse.data.address || "",
          roleId: currentRoleId,
          status: adminResponse.data.status,
        });
      } catch (err: any) {
        setError(err.message || "Không thể tải dữ liệu");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [adminId]);

  // Handle input change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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

    if (formData.roleId === 0) {
      alert("Vui lòng chọn nhóm quyền");
      return;
    }

    try {
      setSubmitting(true);

      const selectedRole = roles.find((r) => r.id === formData.roleId);
      console.log("Selected Role: ", selectedRole);
      if (!selectedRole) {
        alert("Nhóm quyền không hợp lệ");
        return;
      }

      const requestData: AdminUpdateRequest = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        status: formData.status,
        roleCode: selectedRole.code || "",
        roles: [
          {
            id: selectedRole.id,
            name: selectedRole.name,
            code: selectedRole.code,
          },
        ],
      };

      await updateAdmin(adminId, requestData);
      alert("Cập nhật tài khoản quản trị thành công");
      router.push("/home/settings/admins");
    } catch (err: any) {
      alert(err.message || "Không thể cập nhật tài khoản quản trị");
      console.error("Error updating admin:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <h1 className="box-title">Sửa tài khoản quản trị</h1>
        <div className="section-8">
          <div>Đang tải...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <h1 className="box-title">Sửa tài khoản quản trị</h1>
      <div className="section-8">
        {error && (
          <div
            style={{
              padding: "10px",
              background: "#ffebee",
              color: "#c62828",
              marginBottom: "10px",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} id="setting-account-admin-edit-form">
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
              Số điện thoại
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
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
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
          <div className="inner-button inner-two-col">
            <button type="submit" disabled={submitting}>
              {submitting ? "Đang cập nhật..." : "Cập nhật"}
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
