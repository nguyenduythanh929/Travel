"use client";

import { useEffect, useState } from "react";
import {
  getTours,
  restoreTour,
  permanentDeleteTour,
  type TourResponse,
   TourAdminRequest,

} from "@/app/api/tourApi";
import Link from "next/link";
import { toast } from "sonner";
import { formatCurrency, formatDateTime } from "@/app/lib/utils";
import { FaRotateLeft, FaMagnifyingGlass, FaTrashCan } from "react-icons/fa6";

export default function ToursTrashPage() {
  const [tours, setTours] = useState<TourResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const limit = 10;

  useEffect(() => {
    fetchTours();
  }, [currentPage, searchTerm]);

  const fetchTours = async () => {
    try {
      setLoading(true);
      const offset = (currentPage - 1) * limit;

      const response = await getTours(
        offset,
        limit,
        null,
        searchTerm,
        undefined,
        undefined,
        undefined,
        0 // status = 0 (deleted tours only)
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

  const handleRestore = async (tourId: number, data: TourAdminRequest) => {
    if (!confirm("Bạn có chắc chắn muốn khôi phục tour này?")) return;
    console.log("Restoring tour with data:", data , tourId);
    try {
      await restoreTour(tourId, data);
      toast.success("Khôi phục tour thành công");
      fetchTours();
    } catch (error) {
      console.error("Error restoring tour:", error);
      toast.error("Không thể khôi phục tour");
    }
  };

  const handlePermanentDelete = async (id: number) => {
    if (
      !confirm(
        "Bạn có chắc chắn muốn xóa vĩnh viễn tour này? Hành động này không thể hoàn tác!"
      )
    )
      return;

    try {
      await permanentDeleteTour(id);
      toast.success("Xóa vĩnh viễn tour thành công");
      fetchTours();
    } catch (error) {
      console.error("Error permanently deleting tour:", error);
      toast.error("Không thể xóa vĩnh viễn tour");
    }
  };

  const handleBulkAction = async (action: string, data: TourAdminRequest) => {
    if (selectedIds.length === 0) {
      toast.error("Vui lòng chọn ít nhất một tour");
      return;
    }

    switch (action) {
      case "restore":
        if (
          confirm(`Bạn có chắc chắn muốn khôi phục ${selectedIds.length} tour?`)
        ) {
          try {
            await Promise.all(selectedIds.map((id) => restoreTour(id,data)));
            toast.success("Đã khôi phục các tour đã chọn");
            fetchTours();
            setSelectedIds([]);
          } catch (error) {
            toast.error("Không thể khôi phục một số tour");
          }
        }
        break;
      case "permanent-delete":
        if (
          confirm(
            `Bạn có chắc chắn muốn xóa vĩnh viễn ${selectedIds.length} tour? Hành động này không thể hoàn tác!`
          )
        ) {
          try {
            await Promise.all(selectedIds.map((id) => permanentDeleteTour(id)));
            toast.success("Đã xóa vĩnh viễn các tour đã chọn");
            fetchTours();
            setSelectedIds([]);
          } catch (error) {
            toast.error("Không thể xóa vĩnh viễn một số tour");
          }
        }
        break;
    }
  };

  return (
    <>
      <h1 className="box-title">Thùng rác tour</h1>

      {/* Actions Section */}
      <div className="section-5">
        <div className="inner-wrap">
          <div className="inner-change-status">
            <div className="inner-item">
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    handleBulkAction(e.target.value);
                    e.target.value = "";
                  }
                }}
                defaultValue=""
              >
                <option value="">-- Hành động --</option>
                <option value="restore">Khôi phục</option>
                <option value="permanent-delete">Xóa vĩnh viễn</option>
              </select>
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

          <Link className="inner-button-create" href="/home/tours">
            Quay lại danh sách
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
                  <th className="text-center">Trạng thái</th>
                  <th className="text-center">Tạo bởi</th>
                  <th className="text-center">Xóa bởi</th>
                  <th className="text-left">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {tours.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-4">
                      Không có tour nào trong thùng rác
                    </td>
                  </tr>
                ) : (
                  tours.map((tour) => { 
                     const data: TourAdminRequest = {
                      ...tour,
                      status: 1, // set status to active
                    }
                    // const id = parseInt(tour.id)
                    const id = tour.id
                    console.log("Tour ID:", id, typeof id);
                    return (
                   
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
                            src={`http://localhost:8088/api/tours/images/${tour.imageUrl}`}
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
                        <div className="badge badge-red">Đã xóa</div>
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
                          <button
                            className="inner-edit"
                            onClick={() => handleRestore(id, data)}
                            style={{
                              border: "none",
                              background: "none",
                              cursor: "pointer",
                            }}
                            title="Khôi phục"
                          >
                            <FaRotateLeft />
                          </button>
                          <button
                            className="inner-remove"
                            onClick={() => handlePermanentDelete(tour.id)}
                            style={{
                              border: "none",
                              background: "none",
                              cursor: "pointer",
                            }}
                            title="Xóa vĩnh viễn"
                          >
                            <FaTrashCan />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )})
                )}
              </tbody>
            </table>
          )}
        
        
        </div>
      </div>

      {/* Pagination Section */}
      <div className="section-7">
        <span className="inner-label">
          Hiển thị {Math.min((currentPage - 1) * limit + 1, totalItems)} -{" "}
          {Math.min(currentPage * limit, totalItems)} của {totalItems}
        </span>
        <select
          className="inner-pagination"
          value={currentPage}
          onChange={(e) => setCurrentPage(Number(e.target.value))}
        >
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <option key={page} value={page}>
              Trang {page}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}
