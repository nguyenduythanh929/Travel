"use client";
import React from 'react';
import { LogIn } from 'lucide-react';
import {useRouter} from 'next/navigation';

export default function AdminWelcome() {
  const router = useRouter();
  const handleLogin = () => {
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white rounded-full blur-3xl"></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      {/* Main Content */}
      <div className="relative z-10 text-center">
        
        {/* Logo */}
        <div className="mb-8">
          <div className="w-24 h-24 bg-white rounded-full mx-auto flex items-center justify-center shadow-2xl">
            <span className="text-5xl font-bold bg-gradient-to-br from-blue-600 to-blue-700 bg-clip-text text-transparent">A</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
          Admin Dashboard
        </h1>
        
        <p className="text-xl text-white/90 mb-12 drop-shadow">
          Hệ thống quản trị
        </p>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          className="group bg-white text-blue-600 px-10 py-4 rounded-full text-lg font-semibold hover:bg-blue-50 transform hover:scale-105 transition-all duration-300 shadow-2xl flex items-center gap-3 mx-auto"
        >
          <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          Đăng Nhập
        </button>

        {/* Footer */}
        <div className="mt-16 text-white/70 text-sm">
          <p>© 2026 Admin System</p>
        </div>
      </div>

    </div>
  );
}