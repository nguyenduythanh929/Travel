"use client";
import UserRow from "./UserRow";
import { DataUsers, User } from "@/app/home/users/userclient";

interface Propsuser{
  data: DataUsers | undefined;
  ids: number[];
  setIds: React.Dispatch<React.SetStateAction<number[]>>;
  refreshUsers: () => void;
  onEdit: (user: User) => void;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  loading: boolean;
  limit: number;
}

export default function UserTable({
  data,
  ids,
  setIds,
  refreshUsers,
  onEdit,
  currentPage,
  setCurrentPage,
  loading,
  limit
}: Propsuser) {
    const totalPages = data?.totalPAges ?? 0;
    const totalItems = data?.totalItems ?? 0;

    const allVisibleIds = data?.users.map((u) => u.id) ?? [];
    const isAllChecked =
      allVisibleIds.length > 0 &&
      allVisibleIds.every((id) => ids.includes(id));

    const handleToggleAll = (checked: boolean) => {
      if (!allVisibleIds.length) return;
      if (checked) {
        // chọn tất cả user đang hiển thị
        setIds(allVisibleIds);
      } else {
        // bỏ chọn tất cả user đang hiển thị
        setIds((prev) => prev.filter((id) => !allVisibleIds.includes(id)));
      }
    };
  
    

  return (
    <>
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-3 w-10">
              <input
                type="checkbox"
                checked={isAllChecked}
                onChange={(e) => handleToggleAll(e.target.checked)}
                aria-label="Chọn tất cả người dùng trong trang"
              />
            </th>
            <th className="p-3">Họ tên</th>
            <th className="p-3">Ảnh đại diện</th>
            <th className="p-3">Email</th>
            <th className="p-3">Số điện thoại</th>
            <th className="p-3">Địa chỉ</th>
            <th className="p-3">Trạng thái</th>
            <th className="p-3">Hành động</th>
          </tr>
        </thead>

        <tbody>
          {data?.users.map((u, i) => (
            <UserRow
              key={i}
              user={u}
              ids={ids}
              setIds={setIds}
              refreshUsers={refreshUsers}
              onEdit={onEdit}
            />
          ))}
        </tbody>
      </table>

       
    </div>
       <div className="section-7 mt-5">
        <span className="inner-label">
          {loading
            ? "Đang tải..."
            : totalItems === 0
            ? "Không có kết quả"
            : `Hiển thị ${Math.min(
                (currentPage - 1) * limit + 1,
                totalItems
              )} - ${Math.min(currentPage * limit, totalItems)} của ${totalItems} người dùng`}
        </span>

        {totalPages > 0 && (
          <select
            className="inner-pagination"
            value={currentPage}
            onChange={(e) => setCurrentPage(Number(e.target.value))}
            disabled={loading || totalPages === 0}
            aria-label="Chọn trang người dùng"
          >
            {Array.from(
              { length: Math.max(1, totalPages) },
              (_, i) => i + 1
            ).map((page) => (
              <option key={page} value={page}>
                Trang {page}
              </option>
            ))}
          </select>
        )}
      </div>
      </>
  );
}
