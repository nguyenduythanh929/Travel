"use client";
import React from "react";
import Link from "next/link";
import { FiInfo, FiUser, FiUsers } from "react-icons/fi";

type SettingsCardProps = {
  icon: React.ReactNode;
  title: string;
  href: string;
};

const SettingsCard: React.FC<SettingsCardProps> = ({ icon, title, href }) => {
  return (
    <Link
      href={href}
      className="bg-white rounded-2xl shadow-sm px-10 py-8 flex items-center gap-6
                 hover:-translate-y-1 hover:shadow-md transition cursor-pointer"
    >
      <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
        {icon}
      </div>
      <div className="text-lg font-semibold text-gray-900">{title}</div>
    </Link>
  );
};

const SettingsPage: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Cài đặt chung</h1>

      <div className="grid gap-6 md:grid-cols-3">
        <SettingsCard
          icon={<FiInfo size={30} />}
          title="Thông tin website"
          href="/home/settings/website"
        />
        <SettingsCard
          icon={<FiUser size={30} />}
          title="Tài khoản quản trị"
          href="/home/settings/admins"
        />
        <SettingsCard
          icon={<FiUsers size={30} />}
          title="Nhóm quyền"
          href="/home/settings/roles"
        />
      </div>
    </div>
  );
};

export default SettingsPage;
