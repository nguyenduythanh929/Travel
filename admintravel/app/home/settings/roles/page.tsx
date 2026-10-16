"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FaPenToSquare, FaTrashCan } from "react-icons/fa6";
import {
  getRoles,
  deleteRole,
  deleteMultipleRoles,
  RoleResponse,
} from "@/app/api/roleApi";

export default function RolesListPage() {
  const [roles, setRoles] = useState<RoleResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [keyword, setKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [limit] = useState(10);

  // Fetch roles
  const fetchRoles = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getRoles(keyword, currentPage, limit);
      setRoles(response.data.roles);
      setTotalPages(response.data.totalPages);
      setTotalItems(response.data.totalItems);
    } catch (err: any) {
      setError(err.message || "Không thể tải danh sách nhóm quyền");
      console.error("Error fetching roles:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, [currentPage, keyword]);

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
    setCurrentPage(0); // Reset to first page on search
  };

  // Handle select all
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(roles.map((role) => role.id));
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

  // Handle delete single role
  const handleDeleteOne = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa nhóm quyền này?")) return;

    try {
      await deleteRole(id);
      alert("Xóa nhóm quyền thành công");
      fetchRoles();
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
    } catch (err: any) {
      alert(err.message || "Không thể xóa nhóm quyền");
      console.error("Error deleting role:", err);
    }
  };

  // Handle batch delete
  const handleBatchDelete = async () => {
    if (selectedIds.length === 0) {
      alert("Vui lòng chọn ít nhất một nhóm quyền để xóa");
      return;
    }

    if (!confirm(`Bạn có chắc chắn muốn xóa ${selectedIds.length} nhóm quyền?`)) return;

    try {
      await deleteMultipleRoles(selectedIds);
      alert("Xóa nhóm quyền thành công");
      fetchRoles();
      setSelectedIds([]);
    } catch (err: any) {
      alert(err.message || "Không thể xóa nhóm quyền");
      console.error("Error deleting roles:", err);
    }
  };

  // Handle page change
  const handlePageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentPage(parseInt(e.target.value));
  };

  return (
    <>
      <h1 className="box-title">Nhóm quyền</h1>
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
              value={keyword}
              onChange={handleSearch}
            />
          </div>
          <Link
            className="inner-button-create"
            href="/home/settings/roles/create"
          >
            + Tạo mới
          </Link>
        </div>
      </div>

      {error && (
        <div style={{ padding: "10px", background: "#ffebee", color: "#c62828", marginBottom: "10px" }}>
          {error}
        </div>
      )}

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
                        checked={selectedIds.length === roles.length && roles.length > 0}
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
                <th className="text-left">Tên nhóm quyền</th>
                <th className="text-left">Mô tả ngắn</th>
                <th className="text-left">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="text-left">Đang tải...</td>
                </tr>
              ) : roles.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-left">Không có dữ liệu</td>
                </tr>
              ) : (
                roles.map((role) => (
                  <tr key={role.id}>
                    <td className="text-left">
                      <div className="checkbox-wrapper-30">
                        <span className="checkbox">
                          <input
                            className="inner-check"
                            type="checkbox"
                            checked={selectedIds.includes(role.id)}
                            onChange={() => handleSelectOne(role.id)}
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
                    <td className="text-left">{role.name}</td>
                    <td className="text-left">{role.description}</td>
                    <td className="text-left">
                      <div className="box-actions">
                        <Link className="inner-edit" href={`/home/settings/roles/edit/${role.id}`}>
                          <FaPenToSquare />
                        </Link>
                        <button
                          className="inner-remove"
                          onClick={() => handleDeleteOne(role.id)}
                          style={{ background: "none", border: "none", cursor: "pointer" }}
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
      <div className="section-7">
        <span className="inner-label">
          Hiển thị {roles.length > 0 ? currentPage * limit + 1 : 0} - {Math.min((currentPage + 1) * limit, totalItems)} của {totalItems}
        </span>
        <select className="inner-pagination" value={currentPage} onChange={handlePageChange}>
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
