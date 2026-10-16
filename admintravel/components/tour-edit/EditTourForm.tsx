"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useFilePond } from "@/hooks/useFilePond";
import ScheduleSection from "../tour-create/ScheduleSection";
import { ScheduleItemType } from "@/schemaValidations/tour.schema";
import {
  updateTour,
  uploadTourImages,
  type TourAdminRequest,
  type LocationResponse,
  type TourTypeResponse,
  getTourAdminData,
  TourAdminResponse,
} from "@/app/api/tourApi";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import FilePondWrapper from "../tour-create/FilePondWrapper";

// Dynamically import TinyEditor with SSR disabled
const TinyEditor = dynamic(() => import("../tour-create/TinyEditor"), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});

interface EditTourFormProps {
  tourId: number;
}

export default function EditTourForm({ tourId }: EditTourFormProps) {
  // ==================== State Management ====================
  const [schedules, setSchedules] = useState<ScheduleItemType[]>([
    { id: "schedule-1", title: "", content: "" },
    { id: "schedule-2", title: "", content: "" },
  ]);

  const [informationContent, setInformationContent] = useState("");
  const [locations, setLocations] = useState<LocationResponse[]>([]);
  const [tourTypes, setTourTypes] = useState<TourTypeResponse[]>([]);
  const [tourData, setTourData] = useState<TourAdminResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  // ==================== Load Tour Data & Init Data ====================
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Load init data (locations, tourTypes) và tour detail song song
        const [tourResponse] = await Promise.all([getTourAdminData(tourId)]);

        // Set locations và tourTypes
        setLocations(tourResponse.data.locations);
        setTourTypes(tourResponse.data.tourTypes);

        // Set tour data
        const tour = tourResponse.data;
        setTourData(tour);

        // Set information content
        setInformationContent(tour.tourDetail || "");

        // Set schedules
        if (tour.schedules && tour.schedules.length > 0) {
          setSchedules(
            tour.schedules.map((schedule, index) => ({
              id: `schedule-${index + 1}`,
              title: schedule.title,
              content: schedule.description,
            }))
          );
        }

        console.log("✅ Loaded tour data:", tour);
        console.log("✅ Loaded init data:", tourResponse.data);
      } catch (error: any) {
        console.error("❌ Error loading data:", error);
        alert(
          "Không thể tải dữ liệu tour. Vui lòng thử lại sau!\n" +
            (error.response?.data?.message || error.message)
);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tourId]);

  // ==================== Helper Functions ====================
  /**
   * Parse duration từ string sang số ngày
   * VD: "3 ngày 2 đêm" -> 3
   */
  console.log(tourData?.images);
  const parseDuration = (timeStr: string): number => {
    const match = timeStr.match(/(\d+)\s*ngày/i);
    return match ? parseInt(match[1]) : 1;
  };

  /**
   * Format date từ YYYY-MM-DD sang dd/MM/yyyy
   */
  const formatDate = (dateStr: string): string => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  /**
   * Parse date từ [year, month, day] sang YYYY-MM-DD
   */
  const parseStartDate = (startDate: [number, number, number]): string => {
    if (!startDate || startDate.length !== 3) return "";
    const [year, month, day] = startDate;
    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(
      2,
      "0"
    )}`;
  };
  /**
   * Lấy locationIds từ checkboxes
   */
  const getSelectedLocationIds = (formData: FormData): number[] => {
    const locationValues = formData.getAll("locations") as string[];
    return locations
      .filter((loc) => locationValues.includes(loc.id.toString()))
      .map((loc) => loc.id);
  };

  const formatDuration = (days: number): string => {
    if (!days || days <= 0) return "";
    const nights = days - 1;
    return `${days} ngày ${nights} đêm`;
  };

  const parseDateArray = (dateArray: [number, number, number]): string => {
    if (!dateArray || dateArray.length !== 3) return "";
    const [year, month, day] = dateArray;
    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(
      2,
      "0"
    )}`;
  };

  const getSelectedTourTypeId = (): number | undefined => {
    if (!tourData?.tourTypes || tourData.tourTypes.length === 0)
      return undefined;
    const selectedType =
      tourData.tourTypes.find((t) => t.selected) || tourData.tourTypes[0];
    return selectedType?.id;
  };

  // ==================== Form Submit ====================
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (submitting) return;

    setSubmitting(true);

    try {
      const formElement = e.currentTarget;
      const formData = new FormData(formElement);

      // ===== Validation =====
      const name = formData.get("name") as string;
      const tourTypeId = formData.get("category") as string;

      if (!name || name.trim().length < 3) {
        alert("Tên tour phải có ít nhất 3 ký tự!");
        return;
      }

      if (!tourTypeId) {
        alert("Vui lòng chọn danh mục!");
        return;
      }

      // ===== Prepare TourAdminRequest =====
      const timeStr = (formData.get("time") as string) || "1 ngày";
      const departureDateStr = formData.get("departureDate") as string;
const tourRequest: TourAdminRequest = {
        name: name.trim(),
        tourTypeId: parseInt(tourTypeId),
        priceAdult: parseFloat(formData.get("priceAdult") as string) || 0,
        priceChild: parseFloat(formData.get("priceChildren") as string) || 0,
        priceInfant: parseFloat(formData.get("priceBaby") as string) || 0,
        remainAdult: parseInt(formData.get("stockAdult") as string) || 0,
        remainChild: parseInt(formData.get("stockChildren") as string) || 0,
        remainInfant: parseInt(formData.get("stockBaby") as string) || 0,
        duration: parseDuration(timeStr),
        transport: (formData.get("vehicle") as string) || "",
        departureDates: formatDate(departureDateStr),
        status: parseInt(formData.get("status") as string) || 1,
        tourDetail: informationContent,
        locationIds: getSelectedLocationIds(formData),
        schedules: schedules.map((s) => ({
          title: s.title,
          description: s.content,
        })),
      };



      // ===== Step 1: Update Tour =====
      await updateTour(tourId, tourRequest);

      console.log("✅ Tour updated successfully");

      // ===== Step 2: Upload Images (if any) =====
      if (uploadedFiles.length > 0) {
        console.log("📤 Uploading images...");
        await uploadTourImages(tourId, uploadedFiles);
        console.log("✅ Images uploaded successfully");
      }

      // ===== Success =====
      alert(
        `🎉 Cập nhật tour thành công!\n\nĐang chuyển về danh sách tours...`
      );

      // Redirect to tours list
      setTimeout(() => {
        window.location.href = "/home/tours";
      }, 1000);
    } catch (error: any) {
      console.error("❌ Error updating tour:", error);

      let errorMessage = "Có lỗi xảy ra khi cập nhật tour!";

      if (error.response?.data) {
        if (typeof error.response.data === "string") {
          errorMessage = error.response.data;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      alert("❌ " + errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  // ==================== Loading State ====================
  if (loading) {
    return (
      <div className="section-8">
        <div
          style={{
            textAlign: "center",
            padding: "50px",
            fontSize: "18px",
            color: "#666",
          }}
        >
          Đang tải dữ liệu...
        </div>
      </div>
    );
  }

  if (!tourData) {
    return (
      <div className="section-8">
        <div
          style={{
            textAlign: "center",
            padding: "50px",
            fontSize: "18px",
            color: "#666",
          }}
        >
          Không tìm thấy tour!
        </div>
      </div>
    );
  }
// ==================== Render Form ====================
  return (
    <div className="section-8">
      <form id="tour-edit-form" onSubmit={handleSubmit}>
        <div className="inner-group">
          <label className="inner-label" htmlFor="name">
            Tên tour <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            defaultValue={tourData.name}
          />
        </div>

        <div className="inner-group">
          <label className="inner-label" htmlFor="category">
            Danh mục <span style={{ color: "red" }}>*</span>
          </label>
          <select
            id="category"
            name="category"
            required
            defaultValue={getSelectedTourTypeId() || ""}
          >
            <option value="">-- Chọn danh mục --</option>
            {tourTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        <div className="inner-group">
          <label className="inner-label" htmlFor="status">
            Trạng thái
          </label>
          <select
            id="status"
            name="status"
            defaultValue={tourData.status?.toString() || "1"}
          >
            <option value="1">Hoạt động</option>
            <option value="0">Tạm dừng</option>
          </select>
        </div>

        {/* ✅ Upload ảnh */}
        <div className="inner-group inner-two-col">
          <label className="inner-label" htmlFor="avatar">
            Ảnh đại diện (Tối đa 5 ảnh)
          </label>
          <div className="filepond-image">
            <FilePondWrapper
              initialFiles={tourData.images || []}
              onChange={setUploadedFiles}
            />
          </div>
        </div>

        <div className="inner-group">
          <label className="inner-label">Giá cũ</label>
          <div className="inner-input-list">
            <div className="inner-input-item">
              <label htmlFor="priceAdult">Người lớn</label>
              <input
                type="number"
                name="priceAdult"
                id="priceAdult"
                defaultValue={tourData.priceAdult || 0}
                min="0"
              />
            </div>
            <div className="inner-input-item">
              <label htmlFor="priceChildren">Trẻ em</label>
              <input
                type="number"
                name="priceChildren"
                id="priceChildren"
                defaultValue={tourData.priceChild || 0}
                min="0"
              />
            </div>
            <div className="inner-input-item">
              <label htmlFor="priceBaby">Em bé</label>
              <input
                type="number"
                name="priceBaby"
id="priceBaby"
                defaultValue={tourData.priceInfant || 0}
                min="0"
              />
            </div>
          </div>
        </div>

        <div className="inner-group">
          <label className="inner-label">Số lượng còn lại</label>
          <div className="inner-input-list">
            <div className="inner-input-item">
              <label htmlFor="stockAdult">Người lớn</label>
              <input
                type="number"
                name="stockAdult"
                id="stockAdult"
                defaultValue={tourData.remainAdult || 0}
                min="0"
              />
            </div>
            <div className="inner-input-item">
              <label htmlFor="stockChildren">Trẻ em</label>
              <input
                type="number"
                name="stockChildren"
                id="stockChildren"
                defaultValue={tourData.remainChild || 0}
                min="0"
              />
            </div>
            <div className="inner-input-item">
              <label htmlFor="stockBaby">Em bé</label>
              <input
                type="number"
                name="stockBaby"
                id="stockBaby"
                defaultValue={tourData.remainInfant || 0}
                min="0"
              />
            </div>
          </div>
        </div>

        <div className="inner-group">
          <label className="inner-label">Địa điểm có tour</label>
          <div className="inner-checkbox-list">
            {locations.map((location) => (
              <div key={location.id} className="inner-checkbox-item">
                <input
                  className="inner-check"
                  type="checkbox"
                  name="locations"
                  value={location.id}
                  id={`location-${location.id}`}
                  defaultChecked={Boolean(location.selected)}
                />
                <label htmlFor={`location-${location.id}`}>
                  {location.name}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="inner-group">
          <label className="inner-label" htmlFor="time">
            Thời gian
          </label>
          <input
            type="text"
            id="time"
            name="time"
            placeholder="VD: 3 ngày 2 đêm"
            defaultValue={formatDuration(tourData.duration)}
          />
        </div>

        <div className="inner-group">
          <label className="inner-label" htmlFor="vehicle">
            Phương tiện
          </label>
          <input
            type="text"
            id="vehicle"
            name="vehicle"
            placeholder="VD: Máy bay, Xe khách"
            defaultValue={tourData.transport || ""}
          />
        </div>

        <div className="inner-group">
          <label className="inner-label" htmlFor="departureDate">
Ngày khởi hành
          </label>
          <input
            type="date"
            id="departureDate"
            name="departureDate"
            defaultValue={
              tourData.departureDate
                ? parseDateArray(tourData.departureDate)
                : ""
            }
          />
        </div>

        <div className="inner-group inner-two-col">
          <label className="inner-label" htmlFor="information">
            Thông tin tour
          </label>
          <TinyEditor
            initialValue={tourData.tourDetail || ""}
            height={400}
            onEditorChange={(content) => setInformationContent(content)}
          />
        </div>

        {/* ✅ Lịch trình tour */}
        <div className="inner-group inner-two-col">
          <label className="inner-label">Lịch trình tour</label>
          <ScheduleSection
            schedules={schedules}
            onSchedulesChange={setSchedules}
          />
        </div>

        <div className="inner-button inner-two-col">
          <button type="submit" disabled={submitting}>
            {submitting ? "Đang xử lý..." : "Cập nhật"}
          </button>
        </div>
      </form>

      <div className="inner-back">
        <a href="/home/tours">Quay lại danh sách</a>
      </div>
    </div>
  );
}