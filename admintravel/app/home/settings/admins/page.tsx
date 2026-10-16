"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FaPenToSquare, FaTrashCan } from "react-icons/fa6";
import {
  getAdminAccounts,
  deleteAdmin,
  deleteMultipleAdmins,
  UserResponse,
  AdminFilterRequest,
} from "@/app/api/adminApi";
import { getRoles } from "@/app/api/roleApi";

export default function AdminAccountsListPage() {
  const [admins, setAdmins] = useState<UserResponse[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Filter states
  const [filters, setFilters] = useState<AdminFilterRequest>({
    keyword: "",
    status: undefined,
    roleId: undefined,
    startDate: undefined,
    endDate: undefined,
  });

  // Pagination states
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [limit] = useState(10);

  // Fetch roles for filter
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await getRoles();
        setRoles(response.data.roles);
      } catch (err) {
        console.error("Error fetching roles:", err);
      }
    };
    fetchRoles();
  }, []);

  // Fetch admin accounts
  const fetchAdmins = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAdminAccounts(
        filters,
        currentPage * limit,
        limit
      );
      setAdmins(response.data.users);
      setTotalPages(response.data.totalPages);
      setTotalItems(response.data.totalItems);
    } catch (err: any) {
      setError(err.message || "Không thể tải danh sách tài khoản quản trị");
      console.error("Error fetching admins:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, [currentPage, filters]);

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentPage(0);
    setFilters((prev) => ({ ...prev, keyword: e.target.value }));
  };

  // Handle filter change
  const handleFilterChange = (name: string, value: any) => {
    setCurrentPage(0);
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Handle reset filter
  const handleResetFilter = () => {
    setCurrentPage(0);
    setFilters({
      keyword: "",
      status: undefined,
      roleId: undefined,
      startDate: undefined,
      endDate: undefined,
    });
  };

  // Handle select all
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(admins.map((admin) => admin.id));
    } else {
      setSelectedIds([]);
    }
  };

  // Handle select single
  const handleSelectOne = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Handle delete single admin
  const handleDeleteOne = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa tài khoản này?")) return;

    try {
      await deleteAdmin(id);
      alert("Xóa tài khoản thành công");
      fetchAdmins();
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
    } catch (err: any) {
      alert(err.message || "Không thể xóa tài khoản");
      console.error("Error deleting admin:", err);
    }
  };

  // Handle batch delete
  const handleBatchDelete = async () => {
    if (selectedIds.length === 0) {
      alert("Vui lòng chọn ít nhất một tài khoản để xóa");
      return;
    }

    if (!confirm(`Bạn có chắc chắn muốn xóa ${selectedIds.length} tài khoản?`))
      return;

    try {
      await deleteMultipleAdmins(selectedIds);
      alert("Xóa tài khoản thành công");
      fetchAdmins();
      setSelectedIds([]);
    } catch (err: any) {
      alert(err.message || "Không thể xóa tài khoản");
      console.error("Error deleting admins:", err);
    }
  };

  // Handle page change
  const handlePageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentPage(parseInt(e.target.value));
  };

  return (
    <>
      <h1 className="box-title">Tài khoản quản trị</h1>

      {/* Filters Section */}
      <div className="section-4">
        <div className="inner-wrap">
          <div className="inner-item inner-label">
            <i className="fa-solid fa-filter"></i> Bộ lọc
          </div>
          <div className="inner-item">
            <select
              value={filters.status || ""}
              onChange={(e) =>
                handleFilterChange(
                  "status",
                  e.target.value ? parseInt(e.target.value) : undefined
                )
              }
            >
              <option value="">Trạng thái</option>
              <option value="1">Hoạt động</option>
              <option value="0">Tạm dừng</option>
            </select>
          </div>
          <div className="inner-item">
            <input
              type="date"
              value={filters.startDate || ""}
              onChange={(e) => handleFilterChange("startDate", e.target.value)}
            />
            <span>-</span>
            <input
              type="date"
              value={filters.endDate || ""}
              onChange={(e) => handleFilterChange("endDate", e.target.value)}
            />
          </div>
          <div className="inner-item">
            <select
              value={filters.roleId || ""}
              onChange={(e) =>
                handleFilterChange(
                  "roleId",
                  e.target.value ? parseInt(e.target.value) : undefined
                )
              }
            >
              <option value="">Nhóm quyền</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>
          <div
            className="inner-item inner-reset"
            onClick={handleResetFilter}
            style={{ cursor: "pointer" }}
          >
            <i className="fa-solid fa-rotate-left"></i> Xóa bộ lọc
          </div>
        </div>
      </div>

      {/* Actions and Search Section */}
      <div className="section-5">
        <div className="inner-wrap">
          <div className="inner-change-status">
            <div className="inner-item">
              <select>
                <option value="">-- Hành động --</option>
                <option value="delete">Xóa</option>
              </select>
            </div>
            <div className="inner-item">
              <button onClick={handleBatchDelete}>Áp dụng</button>
            </div>
          </div>
          <div className="inner-search">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
              type="text"
              placeholder="Tìm kiếm"
              value={filters.keyword}
              onChange={handleSearch}
            />
          </div>
          <Link
            className="inner-button-create"
            href="/home/settings/admins/create"
          >
            + Tạo mới
          </Link>
        </div>
      </div>

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

      {/* Table Section */}
      <div className="section-6">
        <div className="table-2">
          <table>
            <thead>
              <tr>
                <th className="text-left">
                  <div className="checkbox-wrapper-30">
                    <span className="checkbox">
                      <input
                        className="inner-check"
                        type="checkbox"
                        checked={
                          selectedIds.length === admins.length &&
                          admins.length > 0
                        }
                        onChange={handleSelectAll}
                      />
                      <svg>
                        <use
                          className="checkbox"
                          xlinkHref="#checkbox-30"
                        ></use>
                      </svg>
                    </span>
                    <svg
                      style={{ display: "none" }}
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <symbol id="checkbox-30" viewBox="0 0 22 22">
                        <path
                          d="M5.5,11.3L9,14.8L20.2,3.3l0,0c-0.5-1-1.5-1.8-2.7-1.8h-13c-1.7,0-3,1.3-3,3v13c0,1.7,1.3,3,3,3h13 c1.7,0,3-1.3,3-3v-13c0-0.4-0.1-0.8-0.3-1.2"
                          stroke="currentColor"
                          fill="none"
                        ></path>
                      </symbol>
                    </svg>
                  </div>
                </th>
                <th className="text-left">Họ tên</th>
                <th className="text-center">Ảnh đại diện</th>
                <th className="text-left">Email</th>
                <th className="text-left">Số điện thoại</th>
                <th className="text-left">Nhóm quyền</th>
                <th className="text-center">Trạng thái</th>
                <th className="text-left">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-left">
                    Đang tải...
                  </td>
                </tr>
              ) : admins.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-left">
                    Không có dữ liệu
                  </td>
                </tr>
              ) : (
                admins.map((admin) => (
                  <tr key={admin.id}>
                    <td className="text-left">
                      <div className="checkbox-wrapper-30">
                        <span className="checkbox">
                          <input
                            className="inner-check"
                            type="checkbox"
                            checked={selectedIds.includes(admin.id)}
                            onChange={() => handleSelectOne(admin.id)}
                          />
                          <svg>
                            <use
                              className="checkbox"
                              xlinkHref="#checkbox-30"
                            ></use>
                          </svg>
                        </span>
                        <svg
                          style={{ display: "none" }}
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <symbol id="checkbox-30" viewBox="0 0 22 22">
                            <path
                              d="M5.5,11.3L9,14.8L20.2,3.3l0,0c-0.5-1-1.5-1.8-2.7-1.8h-13c-1.7,0-3,1.3-3,3v13c0,1.7,1.3,3,3,3h13 c1.7,0,3-1.3,3-3v-13c0-0.4-0.1-0.8-0.3-1.2"
                              stroke="currentColor"
                              fill="none"
                            ></path>
                          </symbol>
                        </svg>
                      </div>
                    </td>
                    <td className="text-left">{admin.name}</td>
                    <td className="text-center">
                      {admin?.avatar ? (
                        <img
                          src={admin?.avatar}
                          alt={admin?.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div
                          className={`w-12 h-12 rounded-4xl flex items-center justify-center ${(() => {
                            const colors = [
                              "bg-amber-200",
                              "bg-blue-200",
                              "bg-emerald-200",
                              "bg-purple-200",
                              "bg-pink-200",
                              "bg-teal-200",
                            ];
                            const index = admin.id % colors.length;
                            return colors[index];
                          })()}`}
                        >
                          {admin?.name[0].toUpperCase()}
                        </div>
                      )}
                    </td>
                    <td className="text-left">{admin.email}</td>
                    <td className="text-left">{admin.phone || "-"}</td>
                    <td className="text-left">
                      {admin.currentRole?.name || "-"}
                    </td>
                    <td className="text-center">
                      <div
                        className={`badge ${
                          admin.status === 1 ? "badge-green" : "badge-red"
                        }`}
                      >
                        {admin.status === 1 ? "Hoạt động" : "Tạm dừng"}
                      </div>
                    </td>
                    <td className="text-left">
                      <div className="box-actions">
                        <Link
                          className="inner-edit"
                          href={`/home/settings/admins/edit/${admin.id}`}
                        >
                          <FaPenToSquare />
                        </Link>
                        <button
                          className="inner-remove"
                          onClick={() => handleDeleteOne(admin.id)}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                          }}
                        >
                          <FaTrashCan />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Section */}
      <div className="section-7">
        <span className="inner-label">
          Hiển thị {admins.length > 0 ? currentPage * limit + 1 : 0} -{" "}
          {Math.min((currentPage + 1) * limit, totalItems)} của {totalItems}
        </span>
        <select
          className="inner-pagination"
          value={currentPage}
          onChange={handlePageChange}
        >
          {Array.from({ length: totalPages }, (_, i) => (
            <option key={i} value={i}>
              Trang {i + 1}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}
