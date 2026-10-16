export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-blue-600 text-lg font-medium">
          Đang tải dữ liệu...
        </p>
      </div>
    </div>
  );
}
