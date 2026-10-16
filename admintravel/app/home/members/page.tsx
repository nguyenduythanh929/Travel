"use client";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { FiTrash2 } from "react-icons/fi";
import {
  getUsersByRoleCode,
  createUser,
  deleteUsers,
  UserDetail,
  UserListResponse,
  CreateUserPayload,
} from "../../api/userApi";

const MemberItem = ({
  id,
  name,
  email,
  phone,
  setRerender,
}: UserDetail & { setRerender: (fn: (prev: boolean) => boolean) => void }) => {
  const handleDelete = async () => {
    const ok = confirm("Bạn chắc chắn muốn xóa?");
    if (!ok) return;
    try {
      await deleteUsers([id]);
      alert("Xóa nhân viên thành công");
      setRerender((prev) => !prev);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <tr className="border-b">
      <td className="p-3">
        <input type="checkbox" />
      </td>
      <td className="p-3 text-center">{name}</td>
      <td className="p-3 text-center">{email}</td>
      <td className="p-3 text-center">{phone || "-"}</td>
      <td className="p-3 flex justify-center">
        <button
          onClick={handleDelete}
          className="w-10 h-10 flex items-center justify-center rounded-lg border border-red-100 text-red-500 hover:bg-red-50"
        >
          <FiTrash2 />
        </button>
      </td>
    </tr>
  );
};

export default function MembersPage() {
  const [showForm, setShowForm] = useState(false);
  const [rerender, setRerender] = useState(false);
  const [data, setData] = useState<UserListResponse | null>(null);
  const [keyword, setKeyword] = useState("");
  const [formData, setFormData] = useState<CreateUserPayload>({
    name: "",
    email: "",
    phone: "",
    address: "",
    roleCode: "STAFF",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getUsersByRoleCode("STAFF", keyword, 0, 10);
        setData(response);
      } catch (error) {
        console.error("Error fetching staff:", error);
      }
    };
    fetchData();
  }, [rerender, keyword]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setRerender((prev) => !prev);
    }, 300);
    return () => clearTimeout(timer);
  }, [keyword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUser(formData);
      setRerender((prev) => !prev);
      setShowForm(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        roleCode: "STAFF",
      });
    } catch (error) {
      console.error("Error creating staff:", error);
      alert(error instanceof Error ? error.message : "Lỗi khi thêm nhân viên");
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Quản lý nhân viên</h1>
      <div className="flex justify-between mt-10">
        <div className="border border-gray-400 p-2 rounded-xl inline-block max-w-[300px] w-full flex items-center">
          <Search className="inline-block mr-2 text-gray-500" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, email"
            className="outline-none flex-1"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
        <div>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md mr-3"
            onClick={() => setShowForm(true)}
          >
            Thêm nhân viên
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden mt-10">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3"></th>
              <th className="p-3">Tên</th>
              <th className="p-3">Email</th>
              <th className="p-3">Số điện thoại</th>
              <th className="p-3">Hành động</th>
            </tr>
          </thead>

          <tbody>
            {data?.users?.map((item) => (
              <MemberItem key={item.id} {...item} setRerender={setRerender} />
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        Tổng: {data?.totalItems || 0} nhân viên
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowForm(false)}
          />

          <div className="relative z-10 w-full max-w-md bg-white rounded-lg p-6 shadow-xl">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
            >
              ✕
            </button>

            <h2 className="text-xl font-semibold mb-4">Thêm nhân viên</h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Tên *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="w-full border px-3 py-2 rounded"
                  placeholder="Nhập tên nhân viên"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  className="w-full border px-3 py-2 rounded"
                  placeholder="Nhập email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Số điện thoại
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full border px-3 py-2 rounded"
                  placeholder="Nhập số điện thoại"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Địa chỉ
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="w-full border px-3 py-2 rounded"
                  placeholder="Nhập địa chỉ"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded mt-4"
              >
                Thêm nhân viên
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
