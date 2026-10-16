// src/app/api/adminApi.ts
// Service để gọi API backend Spring Boot cho Admin Accounts Management

import api from "@/app/lib/axios";

// ============== TYPES ==============

export interface RoleDTO {
  id: number;
  name: string;
  code: string;
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  avatar: string;
  status: number;
  availableRoles: RoleDTO[];
  currentRole: RoleDTO;
  roleCode: string;
}

export interface UserListResponse {
  users: UserResponse[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
  pageSize: number;
}

export interface AdminCreateRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  avatar?: string;
  status: number;
  roleCode: string;
  roles: RoleDTO[];
}

export interface AdminUpdateRequest {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  avatar?: string;
  status: number;
  roleCode: string;
  roles: RoleDTO[];
}

export interface AdminFilterRequest {
  keyword?: string;
  status?: number;
  roleId?: number;
  startDate?: string;
  endDate?: string;
}

// ============== API FUNCTIONS ==============

/**
 * Lấy danh sách admin accounts với filters và pagination
 */
export const getAdminAccounts = async (
  filters: AdminFilterRequest,
  offset: number = 0,
  limit: number = 10
) => {
  console.log("🚀 Calling getAdminAccounts API:", { filters, offset, limit });
  return api.get<UserListResponse>("/users/admins/search", {
    params: {
      ...filters,
      offset,
      limit,
    },
  });
};

/**
 * Lấy chi tiết một admin account theo ID
 */
export const getAdminById = async (id: number) => {
  console.log("🚀 Calling getAdminById API:", id);
  return api.get<UserResponse>(`/users/${id}`);
};

/**
 * Tạo admin account mới
 */
export const createAdmin = async (data: AdminCreateRequest) => {
  console.log("🚀 Calling createAdmin API:", data);
  return api.post<UserResponse>("/users", data);
};

/**
 * Cập nhật admin account
 */
export const updateAdmin = async (id: number, data: AdminUpdateRequest) => {
  console.log("🚀 Calling updateAdmin API:", id, data);
  return api.put<UserResponse>(`/users/${id}`, data);
};

/**
 * Xóa một admin account
 */
export const deleteAdmin = async (id: number) => {
  console.log("🚀 Calling deleteAdmin API:", id);
  return api.delete("/users", {
    data: [id],
  });
};

/**
 * Xóa nhiều admin accounts cùng lúc
 */
export const deleteMultipleAdmins = async (ids: number[]) => {
  console.log("🚀 Calling deleteMultipleAdmins API:", ids);
  return api.delete("/users", {
    data: ids,
  });
};

