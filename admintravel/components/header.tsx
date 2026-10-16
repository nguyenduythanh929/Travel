"use client";

import { useEffect, useState, useRef } from "react";
import { MdNotifications } from "react-icons/md";
import { useAppContext } from "@/app/AppProvider";
import { getUserById, UserDetail } from "@/app/api/userApi";
import {
  useNotifications,
  getNotificationIcon,
  formatNotificationTime,
} from "@/app/hooks/useNotifications";

export default function Header() {
  const { userId } = useAppContext();
  const [user, setUser] = useState<UserDetail | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    notifications,
    unreadCount,
    isConnected,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  useEffect(() => {
    if (userId) {
      getUserById(parseInt(userId))
        .then((data) => setUser(data))
        .catch((err) => console.error("Failed to fetch user:", err));
    }
  }, [userId]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="w-full h-16 border-b border-gray-300 bg-white flex items-center fixed top-0 justify-between px-6 z-10">
      {/* Logo */}
      <div className="text-2xl font-bold flex items-center gap-1">
        <span className="text-blue-600">TRAVEL</span>
        <span>Admin</span>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-6">
        {/* Connection Status */}
        <div className="flex items-center gap-1">
          <div
            className={`w-2 h-2 rounded-full ${
              isConnected ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <span className="text-xs text-gray-500">
            {isConnected ? "Online" : "Offline"}
          </span>
        </div>

        {/* Notification */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="relative cursor-pointer p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <MdNotifications size={28} className="text-blue-600" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {showDropdown && (
            <div className="absolute right-0 top-12 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-[500px] overflow-hidden">
              {/* Header */}
              <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <h3 className="font-semibold text-gray-800">Thong bao</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Danh dau da doc
                  </button>
                )}
              </div>

              {/* Notification List */}
              <div className="overflow-y-auto max-h-[400px]">
                {notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center text-gray-500">
                    Khong co thong bao nao
                  </div>
                ) : (
                  notifications.map((notification, index) => (
                    <div
                      key={`${notification.bookingId}-${index}`}
                      onClick={() => markAsRead(notification.bookingId)}
                      className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                        !notification.read ? "bg-blue-50" : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-xl">
                          {getNotificationIcon(notification.notificationType)}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <p className="font-medium text-gray-800 text-sm">
                              {notification.bookingCode}
                            </p>
                            <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                              {formatNotificationTime(notification.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-0.5">
                            {notification.message}
                          </p>
                          {notification.customerName && (
                            <p className="text-xs text-gray-500 mt-1">
                              Khach: {notification.customerName}
                              {notification.totalAmount && (
                                <span className="ml-2">
                                  -{" "}
                                  {notification.totalAmount.toLocaleString(
                                    "vi-VN"
                                  )}{" "}
                                  VND
                                </span>
                              )}
                            </p>
                          )}
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="px-4 py-2 border-t border-gray-200 bg-gray-50">
                  <a
                    href="/home/order"
                    className="text-sm text-blue-600 hover:text-blue-800 block text-center"
                  >
                    Xem tat ca don hang
                  </a>
                </div>
              )}
            </div>
          )}
        </div>

        {/* User */}
        <div className="flex items-center gap-3 cursor-pointer">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${(() => {
              const colors = [
                "bg-amber-200",
                "bg-blue-200",
                "bg-emerald-200",
                "bg-purple-200",
                "bg-pink-200",
                "bg-teal-200",
              ];
              const index = (user?.id || 0) % colors.length;
              return colors[index];
            })()}`}
          >
            {user?.name ? user.name[0].toUpperCase() : "?"}
          </div>
          <div>
            <div className="font-semibold">{user?.name || "Loading..."}</div>
            <div className="text-gray-500 text-sm -mt-1">
              {user?.roleName || ""}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
