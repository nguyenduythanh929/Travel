"use client";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { User } from "@/app/home/users/userclient";
import { deleteUsers } from "@/app/api/userApi";

type UserRowProps = {
  user: User;
  ids: number[];
  setIds: React.Dispatch<React.SetStateAction<number[]>>;
  refreshUsers: () => void;
  onEdit: (user: User) => void;
};

export default function UserRow({
  user,
  ids,
  setIds,
  refreshUsers,
  onEdit,
}: UserRowProps) {
  const randomBg = (() => {
    const colors = [
      "bg-amber-200",
      "bg-blue-200",
      "bg-emerald-200",
      "bg-purple-200",
      "bg-pink-200",
      "bg-teal-200",
    ];
    if (!user?.id) return colors[0];
    const index = user.id % colors.length;
    return colors[index];
  })();
  const handleDeleteUsers = async (selectedIds: number[]) => {
    if (!selectedIds.length) return;
    try {
      await deleteUsers(selectedIds);
      setIds((prev) => prev.filter((id) => !selectedIds.includes(id)));
      refreshUsers();
    } catch (error) {
      console.error("Error deleting users:", error);
    }
  };

  const handleCheckboxChange = (id: number, checked: boolean) => {
    setIds((prev) =>
      checked ? [...prev, id] : prev.filter((item) => item !== id)
    );
  };
  return (
    <tr className="border-b">
      <td className="p-3">
        <input
          type="checkbox"
          checked={user?.id !== undefined && ids.includes(user.id)}
          onChange={(e) =>
            handleCheckboxChange(user.id, e.currentTarget.checked)
          }
          aria-label={`Chọn người dùng ${user?.name}`}
        />
      </td>

      <td className="p-3">{user?.name}</td>

      <td className="p-3">
        {user?.avatar ? (
          <img
            src={user?.avatar}
            alt={user?.name}
            className="w-12 h-12 rounded-lg object-cover"
          />
        ) : (
          <div
            className={`w-12 h-12 rounded-4xl flex items-center justify-center ${randomBg}`}
          >
            {user?.name[0].toUpperCase()}
          </div>
        )}
      </td>

      <td className="p-3">{user?.email}</td>

      <td className="p-3">{user?.phone}</td>

      <td className="p-3">
        <span className="block max-w-[200px] truncate" title={user?.address}>
          {user?.address}
        </span>
      </td>

      <td className="p-3">
        {user?.status === 1 ? (
          <span className="px-3 py-1 rounded-lg text-sm font-medium bg-green-100 text-green-600">
            Hoạt động
          </span>
        ) : (
          <span className="px-3 py-1 rounded-lg text-sm font-medium bg-yellow-100 text-yellow-600">
            Dừng hoạt động
          </span>
        )}
      </td>

      <td className="p-3">
        <div className="flex items-center gap-2">
          <button
            className="w-10 h-10 flex items-center justify-center rounded-lg border hover:bg-gray-50"
            aria-label={`Chỉnh sửa ${user?.name}`}
            onClick={() => onEdit(user)}
          >
            <FiEdit2 />
          </button>

          <button
            onClick={() => handleDeleteUsers([user.id])}
            className="w-10 h-10 flex items-center justify-center rounded-lg border border-red-100 text-red-500 hover:bg-red-50"
            aria-label={`Xóa ${user?.name}`}
          >
            <FiTrash2 />
          </button>
        </div>
      </td>
    </tr>
  );
}
