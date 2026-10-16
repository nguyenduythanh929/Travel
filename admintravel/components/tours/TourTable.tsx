import TourRow from "./TourRow";

export default function TourTable() {
  const data = [
    {
      name: "Tour Hạ Long",
      image: "/tour-halongsample.jpg", // đổi đúng path ảnh của bạn
      price: {
        adult: "1.900.000đ",
        child: "1.600.000đ",
        baby: "1.000.000đ",
      },
      remain: {
        adult: 30,
        child: 20,
        baby: 10,
      },
      position: 1,
      status: "Hoạt động",
      createdBy: "Lê Văn A",
      createdAt: "16:30 - 20/10/2024",
      updatedBy: "Lê Văn A",
      updatedAt: "16:30 - 20/10/2024",
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-3 w-10">
              <input type="checkbox" />
            </th>
            <th className="p-3">Tên tour</th>
            <th className="p-3">Ảnh đại diện</th>
            <th className="p-3">Giá</th>
            <th className="p-3">Còn lại</th>
            <th className="p-3 text-center">Vị trí</th>
            <th className="p-3">Trạng thái</th>
            <th className="p-3">Tạo bởi</th>
            <th className="p-3">Cập nhật bởi</th>
            <th className="p-3">Hành động</th>
          </tr>
        </thead>

        <tbody>
          {data.map((tour, i) => (
            <TourRow key={i} {...tour} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
