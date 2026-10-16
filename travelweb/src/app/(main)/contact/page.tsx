"use client";

import { useState } from "react";
import { createContact } from "@/app/api/contactApi";
import { useWebsiteSettings } from "@/app/WebsiteSettingsProvider";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function ContactPage() {
  const { settings } = useWebsiteSettings();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      await createContact({ email });
      setSubmitStatus({
        type: "success",
        message: "Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất.",
      });
      setEmail("");
    } catch (error: any) {
      setSubmitStatus({
        type: "error",
        message: error.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#4502C7] mb-4">Liên Hệ</h1>
          <p className="text-gray-600 text-lg">
            Hãy để lại thông tin, chúng tôi sẽ liên hệ với bạn sớm nhất
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Thông Tin Liên Hệ
            </h2>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#4502C7]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-[#4502C7]" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Địa chỉ</h3>
                  <p className="text-gray-600 mt-1">
                    {settings?.address || "Đang tải..."}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#4502C7]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-[#4502C7]" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Điện thoại</h3>
                  <p className="text-gray-600 mt-1">
                    {settings?.phone || "Đang tải..."}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#4502C7]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-[#4502C7]" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Email</h3>
                  <p className="text-gray-600 mt-1">
                    {settings?.email || "Đang tải..."}
                  </p>
                </div>
              </div>
            </div>

            {/* Map placeholder */}
            <div className="mt-8 h-48 bg-gray-200 rounded-xl flex items-center justify-center">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3725.292274421955!2d105.78573047507576!3d20.980921889613!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135accdd8a1ad71%3A0xa2f9b16036648187!2zxJAuIENoaeG6v24gVGjhuq9uZywgSMOgIMSQw7RuZywgSMOgIE7hu5lpLCBWaWV0bmFt!5e0!3m2!1sen!2s!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0, borderRadius: "12px" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Gửi Liên Hệ
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email của bạn <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="example@email.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4502C7] focus:border-transparent outline-none transition-all"
                />
              </div>

              {/* Status message */}
              {submitStatus.type && (
                <div
                  className={`p-4 rounded-xl ${
                    submitStatus.type === "success"
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}
                >
                  {submitStatus.message}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#4502C7] text-white py-3 px-6 rounded-xl font-medium hover:bg-[#3a02a8] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Đang gửi...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Gửi Liên Hệ
                  </>
                )}
              </button>
            </form>

            {/* Additional info */}
            <div className="mt-8 p-4 bg-[#4502C7]/5 rounded-xl">
              <p className="text-sm text-gray-600">
                Bạn cũng có thể liên hệ trực tiếp với chúng tôi qua hotline{" "}
                <span className="font-semibold text-[#4502C7]">
                  {settings?.phone}
                </span>{" "}
                để được tư vấn nhanh nhất.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
