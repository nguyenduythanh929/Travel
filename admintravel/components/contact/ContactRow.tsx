"use client";
import { deleteContacts, ContactItem, DateArray } from "@/app/api/contactApi";
import { FiTrash2 } from "react-icons/fi";

interface Props extends ContactItem {
  setRerender: (rerender: boolean) => void;
}

export default function ContactRow({ id, email, created_at, setRerender }: Props) {
  // Format date array [year, month, day, hour, minute, second] to string
  const formatDate = (dateArr: DateArray) => {
    if (!dateArr || !Array.isArray(dateArr) || dateArr.length < 3) return "";
    const [year, month, day] = dateArr;
    return `${day}/${month}/${year}`;
  };

  const handleDeleteContact = async (contactId: number) => {
    const ok = confirm("Bạn chắc chắn muốn xóa?");
    if (!ok) {
      return;
    }
    try {
      await deleteContacts([contactId]);
      setRerender((prev: boolean) => !prev);
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  };
  return (
    <tr className="border-b">
      <td className="p-3">
        <input type="checkbox" />
      </td>

      <td className="p-3 text-center">{email}</td>

      <td className="p-3 text-center">{formatDate(created_at)}</td>

      <td className="p-3 flex justify-center">
         <button
            onClick={() => handleDeleteContact(id)}
            className="w-10 h-10 flex items-center justify-center rounded-lg border border-red-100 text-red-500 hover:bg-red-50"
            // aria-label={`Xóa ${user?.name}`}
          >
            <FiTrash2 />
          </button>
      </td>
    </tr>
  );
}
