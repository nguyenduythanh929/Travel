interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
}

export default function ContactPagination({ currentPage, totalPages, onPageChange }: Props) {
  const pages = Array.from({ length: totalPages }, (_, i) => i);

  return (
    <div className="flex items-center justify-between mt-4 text-sm">
      <span>Trang {currentPage + 1} / {totalPages || 1}</span>

      <select
        className="border px-3 py-2 rounded-lg"
        value={currentPage}
        onChange={(e) => onPageChange?.(Number(e.target.value))}
      >
        {pages.length > 0 ? (
          pages.map((page) => (
            <option key={page} value={page}>
              Trang {page + 1}
            </option>
          ))
        ) : (
          <option value={0}>Trang 1</option>
        )}
      </select>
    </div>
  );
}
