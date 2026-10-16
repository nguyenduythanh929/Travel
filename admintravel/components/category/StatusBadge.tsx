export default function StatusBadge({ status }: { status: string }) {
  const styles =
    status === "Hoạt động"
      ? "bg-green-100 text-green-600"
      : "bg-gray-200 text-gray-700";

  return (
    <span className={`px-3 py-1 rounded-lg text-sm font-medium ${styles}`}>
      {status}
    </span>
  );
}
