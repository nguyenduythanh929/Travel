import ContactRow from "./ContactRow";
import { ContactListResponse } from "@/app/api/contactApi";

interface Props {
  data: ContactListResponse | null;
  setRerender: (rerender: boolean) => void;
}

export default function ContactTable({data, setRerender}:Props) {
  const datacontact = data?.data
  console.log("data contact",datacontact)

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-3"></th>
            <th className="p-3">Email</th>
            <th className="p-3">Ngày tạo</th>
            <th className="p-3">Hành động</th>
          </tr>
        </thead>

        <tbody>
          {datacontact?.map((item, i) => (
            <ContactRow key={i} {...item} setRerender={setRerender} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
