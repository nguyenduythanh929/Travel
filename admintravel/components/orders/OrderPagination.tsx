export default function OrderPagination() {
  return (
    <div className="flex items-center justify-between mt-4 text-sm">
      <span>Hiển thị 1 - 9 của 78</span>

      <select className="border px-3 py-2 rounded-lg">
        <option>Trang 1</option>
        <option>Trang 2</option>
        <option>Trang 3</option>
      </select>
    </div>
  );
}
