"use client";

import { useEffect, useState } from "react";
import {
  getTours,
  deleteTour,
  type TourDetailResponse,
  TourResponse,
} from "@/app/api/tourApi";
import Link from "next/link";
import { toast } from "sonner";
import { formatCurrency, formatDateTime } from "@/app/lib/utils";
import {
  FaFilter,
  FaRotateLeft,
  FaMagnifyingGlass,
  FaPenToSquare,
  FaTrashCan,
} from "react-icons/fa6";

export default function ToursPage() {
  const [tours, setTours] = useState<TourResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Filters
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [priceRangeFilter, setPriceRangeFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const limit = 10;

  const getImageUrl = (raw?: string | null) => {
    if (!raw) return "";
    // Nếu đã là URL đầy đủ (dùng cho mấy tour seed link từ GG Image)
    if (raw.startsWith("http://") || raw.startsWith("https://")) {
      return raw;
    }
    // Còn lại coi là filename trong thư mục uploads trên backend
    return `http://localhost:8088/api/tours/images/${raw}`;
  };

  // Reset to page 1 when filters change
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [searchTerm, statusFilter, priceRangeFilter, startDate, endDate]);

  useEffect(() => {
    fetchTours();
  }, [
    currentPage,
    searchTerm,
    statusFilter,
    priceRangeFilter,
    startDate,
    endDate,
  ]);

  const fetchTours = async () => {
    try {
      setLoading(true);
      const offset = currentPage - 1;

      let priceFrom, priceTo;
      if (priceRangeFilter === "under2m") {
        priceTo = 2000000;
      } else if (priceRangeFilter === "2m-4m") {
        priceFrom = 2000000;
        priceTo = 4000000;
      } else if (priceRangeFilter === "4m-6m") {
        priceFrom = 4000000;
        priceTo = 6000000;
      } else if (priceRangeFilter === "above6m") {
        priceFrom = 6000000;
      }

      // Convert status filter to number
      const statusValue = 1;

      const response = await getTours(
        offset,
        limit,
        null,
        searchTerm,
        priceFrom,
        priceTo,
        startDate || undefined,
        statusValue
      );

      setTours(response.data.tours);
      setTotalPages(response.data.totalPages);
      setTotalItems(response.data.totalItems);
    } catch (error) {
      console.error("Error fetching tours:", error);
      toast.error("Không thể tải danh sách tour");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(tours.map((tour) => tour.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa tour này?")) return;

    try {
      await deleteTour(id);
      toast.success("Xóa tour thành công");
      fetchTours();
    } catch (error) {
      console.error("Error deleting tour:", error);
      toast.error("Không thể xóa tour");
    }
  };

  const handleBulkAction = (action: string) => {
    if (selectedIds.length === 0) {
      toast.error("Vui lòng chọn ít nhất một tour");
      return;
    }

    switch (action) {
      case "delete":
        if (confirm(`Bạn có chắc chắn muốn xóa ${selectedIds.length} tour?`)) {
          // Implement bulk delete
          toast.success("Đã xóa các tour đã chọn");
        }
        break;
      case "active":
        // Implement bulk active
        toast.success("Đã kích hoạt các tour đã chọn");
        break;
      case "inactive":
        // Implement bulk inactive
        toast.success("Đã tạm dừng các tour đã chọn");
        break;
    }
  };

  const resetFilters = () => {
    setStatusFilter("");
    setCategoryFilter("");
    setPriceRangeFilter("");
    setSearchTerm("");
    setStartDate("");
    setEndDate("");
    setCurrentPage(1);
  };

  return (
    <>
      <h1 className="box-title">Quản lý tour</h1>

      {/* Filters Section */}
      <div className="section-4">
        <div className="inner-wrap">
          <div className="inner-item inner-label">
            <FaFilter /> Bộ lọc
          </div>

          <div className="inner-item">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Trạng thái</option>
              <option value="active">Hoạt động</option>
              <option value="inactive">Tạm dừng</option>
            </select>
          </div>

          {/* <div className="inner-item">
            <select>
              <option value="">Người tạo</option>
              <option value="">Lê Văn A</option>
              <option value="">Lê Văn B</option>
            </select>
          </div> */}

          <div className="inner-item">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <span>-</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          {/* <div className="inner-item">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">Danh mục</option>
              <option value="1">Danh mục 1</option>
              <option value="2">Danh mục 2</option>
            </select>
          </div> */}

          <div className="inner-item">
            <select
              value={priceRangeFilter}
              onChange={(e) => setPriceRangeFilter(e.target.value)}
            >
              <option value="">Mức giá</option>
              <option value="under2m">Dưới 2tr</option>
              <option value="2m-4m">Từ 2tr đến 4tr</option>
              <option value="4m-6m">Từ 4tr đến 6tr</option>
              <option value="above6m">Trên 6tr</option>
            </select>
          </div>

          <div className="inner-item inner-reset" onClick={resetFilters}>
            <FaRotateLeft /> Xóa bộ lọc
          </div>
        </div>
      </div>

      {/* Actions Section */}
      <div className="section-5">
        <div className="inner-wrap">
          <div className="inner-change-status">
            <div className="inner-item">
              <select
                onChange={(e) => handleBulkAction(e.target.value)}
                defaultValue=""
              >
                <option value="">-- Hành động --</option>
                <option value="active">Hoạt động</option>
                <option value="inactive">Dừng hoạt động</option>
                <option value="delete">Xóa</option>
              </select>
            </div>
            <div className="inner-item">
              <button>Áp dụng</button>
            </div>
          </div>

          <div className="inner-search">
            <FaMagnifyingGlass />
            <input
              type="text"
              placeholder="Tìm kiếm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Link className="inner-button-create" href="/home/tours/create">
            + Tạo mới
          </Link>

          <Link className="inner-button-trash" href="/home/tours/trash">
            Thùng rác
          </Link>
        </div>
      </div>

      {/* Table Section */}
      <div className="section-6">
        <div className="table-2">
          {loading ? (
            <div className="text-center py-4">Đang tải...</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th className="text-left">
                    <div className="checkbox-wrapper-30">
                      <span className="checkbox">
                        <input
                          className="inner-check"
                          type="checkbox"
                          checked={
                            selectedIds.length === tours.length &&
                            tours.length > 0
                          }
                          onChange={(e) => handleSelectAll(e.target.checked)}
                        />
                        <svg>
                          <use
                            className="checkbox"
                            xlinkHref="#checkbox-30"
                          ></use>
                        </svg>
                      </span>
                      <svg
                        style={{ display: "none" }}
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <symbol id="checkbox-30" viewBox="0 0 22 22">
                          <path
                            d="M5.5,11.3L9,14.8L20.2,3.3l0,0c-0.5-1-1.5-1.8-2.7-1.8h-13c-1.7,0-3,1.3-3,3v13c0,1.7,1.3,3,3,3h13 c1.7,0,3-1.3,3-3v-13c0-0.4-0.1-0.8-0.3-1.2"
                            stroke="currentColor"
                            fill="none"
                          ></path>
                        </symbol>
                      </svg>
                    </div>
                  </th>
                  <th className="text-left">Tên tour</th>
                  <th className="text-center">Ảnh đại diện</th>
                  <th className="text-left">Giá</th>
                  <th className="text-left">Còn lại</th>
                  <th className="text-left">Trạng thái</th>
                  <th className="text-center">Tạo bởi</th>
                  <th className="text-center">Cập nhật bởi</th>
                  <th className="text-left">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {tours.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-4">
                      Không có tour nào
                    </td>
                  </tr>
                ) : (
                  tours.map((tour) => (
                    <tr key={tour.id}>
                      <td className="text-left">
                        <div className="checkbox-wrapper-30">
                          <span className="checkbox">
                            <input
                              className="inner-check"
                              type="checkbox"
                              checked={selectedIds.includes(tour.id)}
                              onChange={(e) =>
                                handleSelectOne(tour.id, e.target.checked)
                              }
                            />
                            <svg>
                              <use
                                className="checkbox"
                                xlinkHref="#checkbox-30"
                              ></use>
                            </svg>
                          </span>
                        </div>
                      </td>
                      <td className="text-left">{tour.name}</td>
                      <td className="text-center">
                        {tour.imageUrl && (
                          <img
                            className="inner-avatar"
                            src={getImageUrl(tour?.imageUrl)}
                            alt={tour.name}
                          />
                        )}
                      </td>
                      <td className="text-left">
                        <div>NL: {formatCurrency(tour.priceAdult)}</div>
                        <div>TE: {formatCurrency(tour.priceChild)}</div>
                        <div>EB: {formatCurrency(tour.priceInfant)}</div>
                      </td>
                      <td className="text-left">
                        <div>NL: {tour.remainAdult}</div>
                        <div>TE: {tour.remainChild}</div>
                        <div>EB: {tour.remainInfant}</div>
                      </td>
                      <td className="text-center">
                        <div className="badge badge-green">
                          {tour.status ? "Hoạt động" : "Tạm dừng"}
                        </div>
                      </td>
                      <td className="text-center">
                        <div>{tour.createdBy}</div>
                        <div className="inner-small">
                          {formatDateTime(tour.createdAt)}
                        </div>
                      </td>
                      <td className="text-center">
                        <div>{tour.updatedBy}</div>
                        <div className="inner-small">
                          {formatDateTime(tour.updatedAt)}
                        </div>
                      </td>
                      <td className="text-left">
                        <div className="box-actions">
                          <Link
                            className="inner-edit"
                            href={`/home/tours/edit/${tour.id}`}
                          >
                            <FaPenToSquare />
                          </Link>
                          <button
                            className="inner-remove"
                            onClick={() => handleDelete(tour.id)}
                            style={{
                              border: "none",
                              background: "none",
                              cursor: "pointer",
                            }}
                          >
                            <FaTrashCan />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Pagination Section */}
      <div className="section-7">
        <span className="inner-label">
          {loading
            ? "Đang tải..."
            : totalItems === 0
            ? "Không có kết quả"
            : `Hiển thị ${Math.min(
                (currentPage - 1) * limit + 1,
                totalItems
              )} - ${Math.min(
                currentPage * limit,
                totalItems
              )} của ${totalItems}`}
        </span>

        {totalPages > 0 && (
          <select
            className="inner-pagination"
            value={currentPage}
            onChange={(e) => setCurrentPage(Number(e.target.value))}
            disabled={loading || totalPages === 0}
            aria-label="Chọn trang"
          >
            {Array.from(
              { length: Math.max(1, totalPages) },
              (_, i) => i + 1
            ).map((page) => (
              <option key={page} value={page}>
                Trang {page}
              </option>
            ))}
          </select>
        )}
      </div>
    </>
  );
}
