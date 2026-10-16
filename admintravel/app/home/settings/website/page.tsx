"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  getWebsiteSettings,
  updateWebsiteSettings,
  WebsiteSettingRequest,
} from "@/app/api/websiteApi";

export default function WebsiteInfoPage() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    websiteName: "",
    phone: "",
    email: "",
    address: "",
  });

  // Fetch website settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const response = await getWebsiteSettings();
        setFormData({
          websiteName: response.data.websiteName || "",
          phone: response.data.phone || "",
          email: response.data.email || "",
          address: response.data.address || "",
        });
      } catch (err: any) {
        setError(err.message || "Không thể tải thông tin website");
        console.error("Error fetching website settings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.websiteName.trim()) {
      alert("Vui lòng nhập tên website");
      return;
    }

    try {
      setSubmitting(true);
      const requestData: WebsiteSettingRequest = {
        websiteName: formData.websiteName,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
      };

      await updateWebsiteSettings(requestData);
      alert("Cập nhật thông tin website thành công");
    } catch (err: any) {
      alert(err.message || "Không thể cập nhật thông tin website");
      console.error("Error updating website settings:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <h1 className="box-title">Thông tin website</h1>
        <div className="section-8">
          <div>Đang tải...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <h1 className="box-title">Thông tin website</h1>
      <div className="section-8">
        {error && (
          <div
            style={{
              padding: "10px",
              background: "#ffebee",
              color: "#c62828",
              marginBottom: "10px",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} id="setting-website-info-form">
          <div className="inner-group">
            <label className="inner-label" htmlFor="websiteName">
              Tên website
            </label>
            <input
              type="text"
              id="websiteName"
              name="websiteName"
              value={formData.websiteName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="inner-group">
            <label className="inner-label" htmlFor="phone">
              Số điện thoại
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
            />
          </div>
          <div className="inner-group">
            <label className="inner-label" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="inner-group">
            <label className="inner-label" htmlFor="address">
              Địa chỉ
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
            />
          </div>
          <div className="inner-button inner-two-col">
            <button type="submit" disabled={submitting}>
              {submitting ? "Đang cập nhật..." : "Cập nhật"}
            </button>
          </div>
        </form>
        <div className="inner-back">
          <Link href="/home/settings">Quay lại danh sách</Link>
        </div>
      </div>
    </>
  );
}
