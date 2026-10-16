import FilterBar from "@/components/category/FilterBar";
import ActionBar from "@/components/category/ActionBar";
import CategoryTable from "@/components/category/CategoryTable";
import Pagination from "@/components/category/Pagination";

export default function CategoryPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Quản lý danh mục</h1>

      <FilterBar />
      <ActionBar />
      <CategoryTable />
      <Pagination />
    </div>
  );
}
