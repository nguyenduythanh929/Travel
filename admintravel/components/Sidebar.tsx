"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MdDashboard,
  MdCategory,
  MdTour,
  MdListAlt,
  MdPeople,
  MdMail,
  MdSettings,
  MdManageAccounts,
  MdPowerSettingsNew,
 
} from "react-icons/md";
import { TicketSlash,UsersRound  } from 'lucide-react';

const logout = () => {
  // Xoá token khỏi localStorage hoặc cookie
  localStorage.removeItem("sessionToken");
  // Chuyển hướng về trang đăng nhập
  window.location.href = "/";
}

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 h-full border-r border-gray-300  bg-white px-4 py-6 flex flex-col gap-6">

  

      {/* Menu chính */}
      <ul className="flex flex-col gap-1">
        <SidebarItem to="/home" icon={<MdDashboard size={20} />} label="Tổng quan" />
        <SidebarItem to="/home/category" icon={<MdCategory size={20} />} label="Quản lý danh mục" />
        <SidebarItem to="/home/tours" icon={<MdTour size={20} />} label="Quản lý tour" />
        <SidebarItem to="/home/order" icon={<MdListAlt size={20} />} label="Quản lý đơn hàng" />
        <SidebarItem to="/home/users" icon={<MdPeople size={20} />} label="Quản lý người dùng" />
        <SidebarItem to="/home/contact" icon={<MdMail size={20} />} label="Thông tin liên hệ" />
        <SidebarItem to="/home/vouchers" icon={<TicketSlash size={20} />} label="Vouchers" />
        <SidebarItem to="/home/members" icon={<UsersRound size={20} />} label="Nhân viên" />
      </ul>

      <hr className="my-4" />

      {/* Menu phụ */}
      <ul className="flex flex-col gap-1">
        <SidebarItem to="/home/settings" icon={<MdSettings size={20} />} label="Cài đặt chung" />
        <SidebarItem to="/home/profile" icon={<MdManageAccounts size={20} />} label="Thông tin cá nhân" />

        {/* Logout */}
        <li>
          <button onClick={logout} className="flex items-center gap-3 text-red-500 px-3 py-2 rounded-lg hover:bg-red-50 w-full">
            <MdPowerSettingsNew size={20} />
            <span>Đăng xuất</span>
          </button>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;

/* Component item nhỏ */
const SidebarItem = ({
  to,
  icon,
  label,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
}) => {
    const pathname = usePathname();
  const isActive:boolean = pathname === to;
  return (
  <li>
    <Link
      href={to}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all select-none 
          ${isActive ? "bg-blue-600 text-white" : "text-gray-800 hover:bg-gray-100"}
        `}
    >
      {icon}
      <span>{label}</span>
    </Link>
  </li>)
};
