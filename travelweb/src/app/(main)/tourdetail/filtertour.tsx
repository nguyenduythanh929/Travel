"use client";

import { useState, useEffect } from "react";
import { Filter } from "lucide-react";

interface FilterFormData {
  departure: string;
  destination: string;
  date: string;
  adults: number;
  children: number;
  babies: number;
  priceRange: string;
}

interface FilterFormProps {
  onFilterApply?: (filters: {
    startLocation?: string;
    destination?: string;
    departureDate?: string;
    adultCount?: number;
    childCount?: number;
    infantCount?: number;
    priceFrom?: number;
    priceTo?: number;
  }) => void;
}

const FilterForm: React.FC<FilterFormProps> = ({ onFilterApply }) => {
  const [formData, setFormData] = useState<FilterFormData>({
    departure: "",
    destination: "",
    date: "",
    adults: 0,
    children: 0,
    babies: 0,
    priceRange: "",
  });

  useEffect(() => {
    console.log("FilterForm mounted!");
    console.log("onFilterApply prop:", onFilterApply);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const convertPriceRange = (
    range: string
  ): { priceFrom?: number; priceTo?: number } => {
    switch (range) {
      case "duoi10":
        return { priceTo: 10000000 };
      case "10-20":
        return { priceFrom: 10000000, priceTo: 20000000 };
      case "tren20":
        return { priceFrom: 20000000 };
      default:
        return {};
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted!", formData);
    console.log("onFilterApply exists?", !!onFilterApply);

    const priceFilter = convertPriceRange(formData.priceRange);

    const filters = {
      startLocation: formData.departure || undefined,
      destination: formData.destination || undefined,
      departureDate: formData.date || undefined,
      adultCount: formData.adults > 0 ? formData.adults : undefined,
      childCount: formData.children > 0 ? formData.children : undefined,
      infantCount: formData.babies > 0 ? formData.babies : undefined,
      ...priceFilter,
    };

    console.log("Dữ liệu lọc:", filters);

    if (onFilterApply) {
      console.log("Calling onFilterApply...");
      onFilterApply(filters);
    } else {
      console.warn("onFilterApply not provided!");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-[300px] h-[600px] max-w-sm bg-white shadow-lg rounded-2xl p-5 space-y-3"
    >
      <div className="flex items-center gap-2 mb-2">
        <Filter className="text-purple-700" size={20} />
        <h2 className="text-lg font-semibold text-purple-700">Bộ Lọc</h2>
      </div>

      {/* Điểm đi */}
      <div>
        <label className="block text-sm font-medium mb-1">Điểm đi</label>
        <select
          name="departure"
          value={formData.departure}
          onChange={handleChange}
          className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-purple-500"
        >
          <option value="">-- Chọn điểm đi --</option>
          <option value="Hà Nội">Hà Nội</option>
          <option value="TP.HCM">TP.HCM</option>
          <option value="Đà Nẵng">Đà Nẵng</option>
        </select>
      </div>

      {/* Điểm đến */}
      <div>
        <label className="block text-sm font-medium mb-1">Điểm đến</label>
        <select
          name="destination"
          value={formData.destination}
          onChange={handleChange}
          className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-purple-500"
        >
          <option value="">-- Chọn điểm đi --</option>
          <option value="Sapa">Sapa</option>
          <option value="Phú Quốc">Phú Quốc</option>
          <option value="Đà Lạt">Đà Lạt</option>
        </select>
      </div>

      {/* Ngày khởi hành */}
      <div>
        <label className="block text-sm font-medium mb-1">Ngày khởi hành</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Số lượng hành khách */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Số Lượng Hành Khách
        </label>
        <div className="space-y-2">
          <div className="flex justify-between items-center border rounded-lg px-2 py-1">
            <span>Người lớn:</span>
            <input
              type="number"
              name="adults"
              min={0}
              value={formData.adults}
              onChange={handleChange}
              className="w-16 text-right focus:outline-none"
            />
          </div>
          <div className="flex justify-between items-center border rounded-lg px-2 py-1">
            <span>Trẻ em:</span>
            <input
              type="number"
              name="children"
              min={0}
              value={formData.children}
              onChange={handleChange}
              className="w-16 text-right focus:outline-none"
            />
          </div>
          <div className="flex justify-between items-center border rounded-lg px-2 py-1">
            <span>Em bé:</span>
            <input
              type="number"
              name="babies"
              min={0}
              value={formData.babies}
              onChange={handleChange}
              className="w-16 text-right focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Mức giá */}
      <div>
        <label className="block text-sm font-medium mb-1">Mức giá</label>
        <select
          name="priceRange"
          value={formData.priceRange}
          onChange={handleChange}
          className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-purple-500"
        >
          <option value="">-- Chọn khoảng giá --</option>
          <option value="duoi10">Dưới 10 triệu</option>
          <option value="10-20">10 - 20 triệu</option>
          <option value="tren20">Trên 20 triệu</option>
        </select>
      </div>

      {/* Nút áp dụng */}
      <button
        type="submit"
        onClick={(e) => {
          console.log("Button clicked!");
        }}
        className="w-full bg-purple-700 hover:bg-purple-800 text-white font-semibold py-2 rounded-lg transition cursor-pointer"
      >
        Áp Dụng
      </button>
    </form>
  );
};

export default FilterForm;
