// src/components/auth/ForgotPasswordModal.tsx
"use client";

import React, { useState } from "react";
import { toast } from "sonner";

type ForgotPasswordModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newpass , setNewpass] = useState("")
  const [cfpass , setCfpass] = useState("")
  const [step, setStep] = useState<"email" | "otp"|"reset-pass">("email");

  if (!isOpen) return null;

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: call API gửi OTP
  
  try {
    const res = await fetch("http://localhost:8088/api/users/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email }),
    });

    if (!res.ok) {
      // xử lý lỗi từ backend
      const errorData = await res.json();
      console.error(errorData);
      return;
    }

    const data = await res.json();
    console.log("OTP sent:", data);
    setStep("otp");
  } catch (err) {
    console.error("Error:", err);
  }
  };

  const handleVerifyOtp = async(e: React.FormEvent) => {
    e.preventDefault();
     
  try {
    const res = await fetch("http://localhost:8088/api/users/verify-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ otp: otp , email : email }),
    });

    if (!res.ok) {
      // xử lý lỗi từ backend
      const errorData = await res.json();
      console.error(errorData);
      return;
    }
  const data = await res.json();
    console.log("OTP sent:", data);
    setStep("reset-pass");
  }catch (err) {
    console.error("Error:", err);
  }
}
  const handleNewpass = async(e: React.FormEvent)=>{
 e.preventDefault();
    if(newpass !== cfpass){
      toast.warning("Mật khẩu chưa khớp!")
      return
    }
    try {
    const res = await fetch("http://localhost:8088/api/users/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ otp: otp , email : email ,newPassword:newpass , confirmPassword:cfpass }),
    });

    if (!res.ok) {
      // xử lý lỗi từ backend
      const errorData = await res.json();
      console.error(errorData);
      return;
    }
  const data = await res.json();
    console.log("OTP sent:", data);
    toast.success("Đổi mật khẩu thành công")
    onClose();
  }catch (err) {
    console.error("Error:", err);
  }
  }

  const resetStateAndClose = () => {
    setEmail("");
    setOtp("");
    setStep("email");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Quên mật khẩu</h2>
          <button
            type="button"
            onClick={resetStateAndClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {/* Step 1: nhập email */}
        {step === "email" && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div className="text-sm text-gray-600">
              Nhập email của bạn, chúng tôi sẽ gửi mã OTP để xác nhận đặt lại
              mật khẩu.
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nhapemail@domain.com"
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
           
              type="submit"
              className="w-full rounded-lg bg-blue-600 text-white py-2.5 font-semibold hover:bg-blue-700 transition"
            >
              Gửi mã OTP
            </button>
          </form>
        )}

        {/* Step 2: nhập OTP */}
        {step === "otp" && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="text-sm text-gray-600">
              Mã OTP đã được gửi đến:{" "}
              <span className="font-semibold">{email}</span>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Mã OTP
              </label>
              <input
                type="text"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Nhập mã OTP"
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 tracking-[0.3em] text-center"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 text-white py-2.5 font-semibold hover:bg-blue-700 transition"
            >
              Xác nhận
            </button>

            <button
              type="button"
              onClick={() => setStep("email")}
              className="w-full text-sm text-gray-500 hover:text-gray-700"
            >
              ← Nhập lại email
            </button>
          </form>
        )}
        {/* Step 3: nhap lai pass */}
        {step === "reset-pass" &&
         (<form onSubmit={handleNewpass} className="space-y-4">
            {/* <div className="text-sm text-gray-600">
              Mã OTP đã được gửi đến:{" "}
              <span className="font-semibold">{email}</span>
            </div> */}

            <div>
              <label className="block text-sm font-medium mb-1">
                New Password
              </label>
              <input
                type="text"
                required
                value={newpass}
                onChange={(e) => setNewpass(e.target.value)}
                placeholder="New Password"
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 tracking-[0.3em] text-center"
              />
            </div>
              <div>
              <label className="block text-sm font-medium mb-1">
                New Password
              </label>
              <input
                type="text"
                required
                value={cfpass}
                onChange={(e) => setCfpass(e.target.value)}
                placeholder="Confirm Password"
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 tracking-[0.3em] text-center"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 text-white py-2.5 font-semibold hover:bg-blue-700 transition"
            >
              Xác nhận
            </button>

            {/* <button
              type="button"
              onClick={() => setStep("email")}
              className="w-full text-sm text-gray-500 hover:text-gray-700"
            >
              ← Nhập lại email
            </button> */}
          </form>) }
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
