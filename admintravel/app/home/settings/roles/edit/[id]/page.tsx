"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  getAllPermissions,
  getRoleById,
  updateRole,
  PermissionGroupResponse,
  RoleRequest,
} from "@/app/api/roleApi";

export default function RoleEditPage() {
  const params = useParams();
  const router = useRouter();
  const roleId = parseInt(params.id as string);

  const [permissionGroups, setPermissionGroups] = useState<PermissionGroupResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    permissionIds: [] as number[],
  });

  // Fetch role data and permissions
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch permissions and role data in parallel
        const [permissionsResponse, roleResponse] = await Promise.all([
          getAllPermissions(),
          getRoleById(roleId),
        ]);

        setPermissionGroups(permissionsResponse.data);

        // Set form data with existing role data
        setFormData({
          name: roleResponse.data.name,
          code: roleResponse.data.code,
          description: roleResponse.data.description,
          permissionIds: roleResponse.data.permissions.map((p) => p.id),
        });
      } catch (err: any) {
        setError(err.message || "Không thể tải dữ liệu");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [roleId]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle permission checkbox change
  const handlePermissionChange = (permissionId: number) => {
    setFormData((prev) => {
      const isSelected = prev.permissionIds.includes(permissionId);
      return {
        ...prev,
        permissionIds: isSelected
          ? prev.permissionIds.filter((id) => id !== permissionId)
          : [...prev.permissionIds, permissionId],
      };
    });
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Vui lòng nhập tên nhóm quyền");
      return;
    }

    if (formData.permissionIds.length === 0) {
      alert("Vui lòng chọn ít nhất một quyền");
      return;
    }

    try {
      setSubmitting(true);
      const requestData: RoleRequest = {
        name: formData.name,
        code: formData.code,
        description: formData.description,
        permissionIds: formData.permissionIds,
      };

      await updateRole(roleId, requestData);
      alert("Cập nhật nhóm quyền thành công");
      router.push("/home/settings/roles");
    } catch (err: any) {
      alert(err.message || "Không thể cập nhật nhóm quyền");
      console.error("Error updating role:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <h1 className="box-title">Sửa nhóm quyền</h1>
        <div className="section-8">
          <div>Đang tải...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <h1 className="box-title">Sửa nhóm quyền</h1>
      <div className="section-8">
        {error && (
          <div style={{ padding: "10px", background: "#ffebee", color: "#c62828", marginBottom: "10px" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} id="setting-role-edit-form">
          <div className="inner-group">
            <label className="inner-label" htmlFor="name">
              Tên nhóm quyền
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
            <label className="inner-label" htmlFor="code">
              Mã nhóm quyền
            </label>
            <input
              type="text"
              id="code"
              name="code"
              value={formData.code}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="inner-group">
            <label className="inner-label" htmlFor="description">
              Mô tả ngắn
            </label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>
          <div className="inner-group">
            <label className="inner-label">Phân quyền</label>
            <div className="inner-checkbox-list">
              {permissionGroups.map((group) => (
                <div key={group.module}>
                  <h3 style={{ marginTop: "20px", marginBottom: "10px", fontSize: "16px", fontWeight: "bold" }}>
                    {group.moduleName || group.module}
                  </h3>
                  {group.permissions.map((permission) => (
                    <div key={permission.id} className="inner-checkbox-item">
                      <div className="checkbox-wrapper-30">
                        <span className="checkbox">
                          <input
                            className="inner-check"
                            type="checkbox"
                            name={`permission-${permission.id}`}
                            id={`permission-${permission.id}`}
                            checked={formData.permissionIds.includes(permission.id)}
                            onChange={() => handlePermissionChange(permission.id)}
                          />
                          <svg>
                            <use className="checkbox" xlinkHref="#checkbox-30"></use>
                          </svg>
                        </span>
                        <svg style={{ display: "none" }} xmlns="http://www.w3.org/2000/svg">
                          <symbol id="checkbox-30" viewBox="0 0 22 22">
                            <path
                              d="M5.5,11.3L9,14.8L20.2,3.3l0,0c-0.5-1-1.5-1.8-2.7-1.8h-13c-1.7,0-3,1.3-3,3v13c0,1.7,1.3,3,3,3h13 c1.7,0,3-1.3,3-3v-13c0-0.4-0.1-0.8-0.3-1.2"
                              stroke="currentColor"
                              fill="none"
                            ></path>
                          </symbol>
                        </svg>
                      </div>
                      <label htmlFor={`permission-${permission.id}`}>
                        {permission.name}
                        {permission.description && (
                          <span style={{ fontSize: "12px", color: "#666", marginLeft: "5px" }}>
                            ({permission.description})
                          </span>
                        )}
                      </label>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="inner-button inner-two-col">
            <button type="submit" disabled={submitting}>
              {submitting ? "Đang cập nhật..." : "Cập nhật"}
            </button>
          </div>
        </form>
        <div className="inner-back">
          <Link href="/home/settings/roles">Quay lại danh sách</Link>
        </div>
      </div>
    </>
  );
}
