import { FiEdit2, FiTrash2 } from "react-icons/fi";

type TourRowProps = {
  name: string;
  imageUrl: string;
  price: {
    adult: string;
    child: string;
    baby: string;
  };
  remain: {
    adult: number;
    child: number;
    baby: number;
  };
  position: number;
  status: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
};


export default function TourRow(props: TourRowProps) {
  const {
    name,
    imageUrl,
    price,
    remain,
    position,
    status,
    createdBy,
    createdAt,
    updatedBy,
    updatedAt,
  } = props;

  console.log(imageUrl)
   
  return (
    <tr className="border-b">
      <td className="p-3">
        <input type="checkbox" />
      </td>

      <td className="p-3">{name}</td>

      <td className="p-3">
        <img
          src={`/uploads/${imageUrl}`}
          className="w-16 h-16 object-cover rounded-lg"
          alt={name}
        />
      </td>

      <td className="p-3 text-sm">
        NL: {price.adult}
        <br />
        TE: {price.child}
        <br />
        EB: {price.baby}
      </td>

      <td className="p-3 text-sm">
        NL: {remain.adult}
        <br />
        TE: {remain.child}
        <br />
        EB: {remain.baby}
      </td>

      <td className="p-3 text-center">{position}</td>

      <td className="p-3">
        <span className="px-3 py-1 rounded-lg text-sm font-medium bg-green-100 text-green-600">
          {status}
        </span>
      </td>

      <td className="p-3 text-sm">
        <div>{createdBy}</div>
        <div className="text-xs text-gray-500">{createdAt}</div>
      </td>

      <td className="p-3 text-sm">
        <div>{updatedBy}</div>
        <div className="text-xs text-gray-500">{updatedAt}</div>
      </td>

      <td className="p-3">
        <div className="flex items-center gap-2">
          <button className="w-10 h-10 flex items-center justify-center rounded-lg border hover:bg-gray-50">
            <FiEdit2 />
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-red-100 text-red-500 hover:bg-red-50">
            <FiTrash2 />
          </button>
        </div>
      </td>
    </tr>
  );
}
