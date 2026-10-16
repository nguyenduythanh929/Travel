import StatusBadge from "./StatusBadge";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

export default function TableRow({
  name,
  img,
  pos,
  creator,
  updated,
}: any) {
  return (
    <tr className="border-b">
      <td className="p-3">
        <input type="checkbox" />
      </td>

      <td className="p-3">{name}</td>

      <td className="p-3">
        <img src={img} className="w-12 h-12 object-cover rounded-lg" />
      </td>

      <td className="p-3 text-center">{pos}</td>

      <td className="p-3">
        <StatusBadge status="Hoạt động" />
      </td>

      <td className="p-3">
        <div>{creator}</div>
        <div className="text-xs text-gray-500">{updated}</div>
      </td>

      <td className="p-3">
        <div className="flex gap-2">
        </div>
      </td>
    </tr>
  );
}
