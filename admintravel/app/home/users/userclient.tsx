"use client";
import UserAction from "@/components/users/UserAction";
import UserTable from "@/components/users/UserTable";
import UserEditModal from "@/components/users/UserEditModal";
import { useEffect, useState } from "react";

export interface Role {
  id: number;
  name: string;
  code: number;
  description: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  avatar: string;
  status: number;
  availableRoles: Role[];
  currentRole: string;
  roleCode: string;
}
export interface DataUsers {
  users: User[];
  currentPage: number;
  totalItems: number;
  totalPAges: number;
  pageSize: number;
}
export default function UsersPageClient() {
  const [reloadKey, setReloadKey] = useState<number>(0);
  const [datauser, setDataUser] = useState<DataUsers | undefined>();
  const [ids, setIds] = useState<number[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [keyword, setKeyword] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const limit = 10;

  // Reset to page 1 when keyword changes
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [keyword]);

  useEffect(() => {
    const fetchuser = async () => {
      try {
        setLoading(true);
        const baseUrl = "http://localhost:8088/api";
        const trimmedKeyword = keyword.trim();

        // Backend uses PageRequest.of(offset, limit) which expects page number (0-indexed)
        // So we send currentPage - 1 as the offset parameter
        const offset = currentPage - 1;

        const params = new URLSearchParams({
          offset: String(offset),
          limit: String(limit),
        });
        if (trimmedKeyword) {
          params.set("keyword", trimmedKeyword);
        }

        // Use the new API to find only USER role
        const url = `${baseUrl}/users/role/USER?${params.toString()}`;
        const res = await fetch(url, {
          credentials: "include",
        });
        const data = await res.json();
        setDataUser(data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchuser();
  }, [reloadKey, keyword, currentPage]);

  const refreshUsers = () => setReloadKey((prev) => prev + 1);
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Quản lý người dùng</h1>

      <UserAction
        ids={ids}
        setIds={setIds}
        refreshUsers={refreshUsers}
        keyword={keyword}
        setKeyword={setKeyword}
      />
      <UserTable
        data={datauser}
        ids={ids}
        setIds={setIds}
        refreshUsers={refreshUsers}
        onEdit={(user) => setEditingUser(user)}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        loading={loading}
        limit={limit}
      />
      <UserEditModal
        user={editingUser}
        onClose={() => setEditingUser(null)}
        refreshUsers={refreshUsers}
      />
    </div>
  );
}
