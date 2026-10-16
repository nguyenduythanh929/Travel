import TableRow from "./TableRow";

export default function CategoryTable() {
  const data = [
    {
      name: "Danh mục 1",
      img: "/mountain.jpg",
      pos: 1,
      creator: "Lê Văn A",
      updated: "16:30 - 20/10/2024",
    },
    {
      name: "Danh mục 1",
      img: "/mountain.jpg",
      pos: 1,
      creator: "Lê Văn A",
      updated: "16:30 - 20/10/2024",
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-3"></th>
            <th className="p-3">Tên danh mục</th>
            <th className="p-3">Ảnh đại diện</th>
            <th className="p-3">Vị trí</th>
            <th className="p-3">Trạng thái</th>
            <th className="p-3">Tạo bởi</th>
            <th className="p-3">Hành động</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item, i) => (
            <TableRow key={i} {...item} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
