"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  User,
  MapPin,
  Lock,
  LogOut,
  Mail,
  Phone,
  Calendar,
  Edit2,
  Save,
  Eye,
  EyeOff,
  FileX,
} from "lucide-react";
import { toast } from "sonner";
import { useAppContext } from "@/app/AppProvider";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import RatingModel from "@/components/RatingModel";

// Types
interface UserInfo {
  name: string;
  email: string;
  phone: string;
  birthdate: string;
  address: string;
  roleCode: "USER";
  roleName: "Người dùng";
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
}

interface Tour {
  name: string;
  date: string;
  status: string;
}

interface Passwords {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}
interface TourItem {
  adultCount: number;
  childCount: number;
  departureDate: number[]; // [year, month, day]
  departureLocation: string;
  id: number;
  infantCount: number;
  pricePerAdult: number;
  pricePerChild: number;
  pricePerInfant: number;
  subTotal: number;
  tourId: number;
  tourName: string;
}
interface PaymentMethod {
  id: number;
  name: string;
  // Thêm các field khác nếu cần
}
interface Booking {
  createdBy: string | null;
  created_at: number[]; // [year, month, day, hour, minute, second]
  customerName: string;
  customerNote: string;
  customerPhone: string;
  discount: number;
  finalPrice: number;
  id: number;
  items: TourItem[];
  note: string | null;
  paymentMethodName: string;
  paymentMethods: PaymentMethod[];
  paymentStatus: number;
  status: number; // Booking status: 0=CREATED, 1=CONFIRMED, 2=COMPLETED, 3=CANCELLED
  totalPrice: number;
  updatedBy: string | null;
  updated_at: number[] | null;
  userId: number;
}
type BookingListResponse = Booking[];

// Props Types
interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
  userInfo: UserInfo;
  onLogout: () => void;
}

interface ProfileDetailsProps {
  userId: string;
  userInfo: UserInfo;
  setUserInfo: (info: UserInfo) => void;
}
interface ChangePasswordProps {
  userId: string;
}
interface MyToursProps {
  tourorder: BookingListResponse | undefined;
  userId: string;
}
interface SubitemProps {
  touritem: TourItem;
  bookingStatus: number;
  userId: string;
}

// Component Sidebar
const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  setActivePage,
  userInfo,
  onLogout,
}) => {
  const menuItems: MenuItem[] = [
    { id: "details", label: "Chi tiết", icon: User },
    { id: "tours", label: "Tour của bạn", icon: MapPin },
    { id: "password", label: "Đổi mật khẩu", icon: Lock },
    { id: "logout", label: "Đăng xuất", icon: LogOut },
  ];
  const a = userInfo?.name.split(" ");
  const subname = `${a[0][0]?.toLocaleUpperCase()}${a[
    a.length - 1
  ][0]?.toLocaleUpperCase()}`;
  console.log(subname);
  function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  const bgfrom = useMemo(() => {
    return getRandomColor();
  }, []);
  const bgto = useMemo(() => {
    return getRandomColor();
  }, []);

  return (
    <aside className="w-64 bg-white shadow-xl h-screen sticky top-0">
      {/* Avatar Section */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div
              className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-3xl font-bold"
              style={{
                background: `linear-gradient(to bottom right, ${bgfrom}, ${bgto})`,
              }}
            >
              {subname}
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white hover:bg-blue-600 transition-colors">
              <Edit2 size={14} />
            </button>
          </div>
          <h3 className="mt-4 text-lg font-semibold text-gray-800">
            {userInfo.name}
          </h3>
          <p className="text-sm text-gray-500">{userInfo.email}</p>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === "logout") {
                  onLogout();
                } else {
                  setActivePage(item.id);
                }
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors mb-2 ${
                activePage === item.id && item.id !== "logout"
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                  : item.id === "logout"
                  ? "text-red-600 hover:bg-red-50"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

// Component Chi tiết
const ProfileDetails: React.FC<ProfileDetailsProps> = ({
  userId,
  userInfo,
  setUserInfo,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  console.log("useinfo", userInfo);

  const handleSave = async (): void => {
    setIsEditing(false);
    try {
      const res = await fetch(`http://localhost:8088/api/users/${userId}`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "PUT",
        credentials: "include",
        body: JSON.stringify({ ...userInfo }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error("that bai roi me oi");
      }
      console.log("data after update", data);
    } catch (error: any) {
      console.log(error.message);
    }
    console.log("info user", userInfo);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Thông tin cá nhân</h2>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Edit2 size={18} />
            <span>Chỉnh sửa</span>
          </button>
        ) : (
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <Save size={18} />
            <span>Lưu</span>
          </button>
        )}
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Họ và tên
          </label>
          <div className="relative">
            <User className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              value={userInfo.name}
              onChange={(e) =>
                setUserInfo({ ...userInfo, name: e.target.value })
              }
              disabled={!isEditing}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="email"
              value={userInfo.email}
              onChange={(e) =>
                setUserInfo({ ...userInfo, email: e.target.value })
              }
              disabled={!isEditing}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Số điện thoại
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="tel"
              value={userInfo.phone}
              onChange={(e) =>
                setUserInfo({ ...userInfo, phone: e.target.value })
              }
              disabled={!isEditing}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ngày sinh
          </label>
          <div className="relative">
            <Calendar
              className="absolute left-3 top-3 text-gray-400"
              size={20}
            />
            <input
              type="text"
              value={userInfo.birthdate}
              onChange={(e) =>
                setUserInfo({ ...userInfo, birthdate: e.target.value })
              }
              disabled={!isEditing}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Địa chỉ
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              value={userInfo.address}
              onChange={(e) =>
                setUserInfo({ ...userInfo, address: e.target.value })
              }
              disabled={!isEditing}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Component Tours

const MyTours = ({ tourorder, userId }: MyToursProps) => {
  const [isopen, setIsopen] = useState(false);
  const [idorder, setIdorder] = useState<number>();
  const route = useRouter();
  const format = (date: number[]) => {
    return `${date[0]}/${date[1]}${date[2]} ${date[3]}:${date[4]}:${date[5]}`;
  };

  // Helper function to get booking status display
  const getBookingStatusDisplay = (status: number) => {
    switch (status) {
      case 0: // CREATED
        return {
          label: "Đã tạo",
          bgColor: "bg-blue-100",
          textColor: "text-blue-700",
        };
      case 1: // CONFIRMED
        return {
          label: "Đã xác nhận",
          bgColor: "bg-green-100",
          textColor: "text-green-700",
        };
      case 2: // COMPLETED
        return {
          label: "Hoàn thành",
          bgColor: "bg-purple-100",
          textColor: "text-purple-700",
        };
      case 3: // CANCELLED
        return {
          label: "Đã hủy",
          bgColor: "bg-red-100",
          textColor: "text-red-700",
        };
      default:
        return {
          label: "Chưa xác định",
          bgColor: "bg-gray-100",
          textColor: "text-gray-700",
        };
    }
  };

  console.log("id", idorder);
  const Subitem = ({ touritem, bookingStatus, userId }: SubitemProps) => {
    const format = (arr: number[]) => {
      return `${arr[2]}/${arr[1]}/${arr[0]}`;
    };
    const routetour = () => {
      route.push(`profile/${touritem.tourId}`);
    };

    return (
      <div
        onClick={routetour}
        className="flex  justify-between border p-5 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-1 transition
            duration-200 ease-out gap-5"
      >
        <div className="flex flex-col justify-between">
          <h2 className="text-2xl text-blue-500">{touritem?.tourName}</h2>
          <p>Ngày khởi hành:{format(touritem?.departureDate)}</p>
        </div>
        <div className="flex flex-col">
          <span>Người lớn: {touritem?.adultCount}</span>
          <span>Trẻ nhỏ: {touritem?.childCount}</span>
          <span>Trẻ sơ sinh: {touritem?.infantCount}</span>
          <span className="text-blue-700 font-bold">
            Tổng tiền: {touritem?.subTotal.toLocaleString("vi-VN")}đ
          </span>
        </div>
        <div onClick={(e) => e.stopPropagation()}>
          <RatingModel
            bookingStatus={bookingStatus}
            tourId={touritem.tourId}
            userId={userId}
          />
        </div>
      </div>
    );
  };
  const TourOrderDetail = () => {
    useEffect(() => {
      document.body.classList.add("overflow-hidden");
      return () => document.body.classList.remove("overflow-hidden");
    }, []);
    const list = tourorder?.find((x) => x.id === idorder);
    return (
      <div className="fixed inset-0 z-20 bg-black/50 flex justify-center items-center ">
        <div className="p-8 bg-white flex flex-col gap-4 border rounded-2xl w-[800px]">
          <button className="mb-4" onClick={() => setIsopen(false)}>
            {" "}
            <X />
          </button>
          {list?.items.map((item, idx) => (
            <Subitem
              touritem={item}
              bookingStatus={list.status}
              userId={userId}
              key={idx}
            />
          ))}
        </div>
      </div>
    );
  };
  console.log(isopen);

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 relative">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Tour của bạn</h2>
      <div className="space-y-4">
        {tourorder?.map((tour, idx) => {
          const statusDisplay = getBookingStatusDisplay(tour.status);
          return (
            <div
              onClick={() => {
                setIdorder(tour.id), setIsopen(true);
              }}
              key={idx}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 mb-1">
                    Đơn {idx + 1}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Ngày đặt: {format(tour.created_at)}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Tổng tiền: {tour.finalPrice.toLocaleString("vi-VN")}đ
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${statusDisplay.bgColor} ${statusDisplay.textColor}`}
                >
                  {statusDisplay.label}
                </span>
              </div>
            </div>
          );
        })}
        {isopen && <TourOrderDetail />}
      </div>
    </div>
  );
};

// Component Đổi mật khẩu
const ChangePassword = ({ userId }: ChangePasswordProps) => {
  const [passwords, setPasswords] = useState<Passwords>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // State để quản lý hiển thị mật khẩu
  const [showPassword, setShowPassword] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const handleChangePassword = async (): Promise<void> => {
    if (
      !passwords.oldPassword?.trim() ||
      !passwords.newPassword?.trim() ||
      !passwords.confirmPassword?.trim()
    ) {
      toast.warning("Vui lòng điền đầy đủ thông tin");
      return;
    }
    if (passwords.newPassword.length < 6) {
      toast.warning("Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.warning("Mật khẩu xác nhận không khớp");
      return;
    }
    if (passwords.newPassword === passwords.oldPassword) {
      toast.warning("Mật khẩu mới phải khác mật khẩu cũ");
      return;
    }
    try {
      const res = await fetch(
        `http://localhost:8088/api/users/change-password/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            oldPassword: passwords.oldPassword,
            newPassword: passwords.newPassword,
            confirmPassword: passwords.confirmPassword,
          }),
        }
      );

      if (!res.ok) {
        // Xử lý các loại error cụ thể
        switch (res.status) {
          case 400:
            throw new Error("Thông tin không hợp lệ");
          case 401:
            throw new Error("Mật khẩu cũ không đúng");
          case 404:
            throw new Error("Người dùng không tồn tại");
          case 500:
            throw new Error("Lỗi server, vui lòng thử lại sau");
          default:
            throw new Error("Đổi mật khẩu thất bại");
        }
      }

      console.log(res.status);
      toast.success("Đổi mật khẩu thành công");
      setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setShowPassword({
        oldPassword: false,
        newPassword: false,
        confirmPassword: false,
      });
    } catch (error: any) {
      toast.error("Không thành công");
      console.log(error);
    }
  };

  // Function toggle hiển thị mật khẩu
  const togglePasswordVisibility = (field: keyof typeof showPassword): void => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <div className="bg-white max-w-[600px] rounded-xl shadow-lg p-8 flex flex-col">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Đổi mật khẩu</h2>
      <div className="space-y-6 max-w-md">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mật khẩu hiện tại
          </label>
          <div className="relative">
            <input
              type={showPassword.oldPassword ? "text" : "password"}
              value={passwords.oldPassword}
              onChange={(e) =>
                setPasswords({ ...passwords, oldPassword: e.target.value })
              }
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("oldPassword")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              {showPassword.oldPassword ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mật khẩu mới
          </label>
          <div className="relative">
            <input
              type={showPassword.newPassword ? "text" : "password"}
              value={passwords.newPassword}
              onChange={(e) =>
                setPasswords({ ...passwords, newPassword: e.target.value })
              }
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("newPassword")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              {showPassword.newPassword ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Xác nhận mật khẩu mới
          </label>
          <div className="relative">
            <input
              type={showPassword.confirmPassword ? "text" : "password"}
              value={passwords.confirmPassword}
              onChange={(e) =>
                setPasswords({ ...passwords, confirmPassword: e.target.value })
              }
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("confirmPassword")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              {showPassword.confirmPassword ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>
          </div>
        </div>

        <button
          onClick={handleChangePassword}
          className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
        >
          Đổi mật khẩu
        </button>
      </div>
    </div>
  );
};

// Component chính - Profile Page (Desktop)
const ProfilePage: React.FC = () => {
  const router = useRouter();
  const { userId } = useAppContext();
  const [activePage, setActivePage] = useState<string>("details");
  const [tourorder, setTourorder] = useState<BookingListResponse>();
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: "",
    email: "",
    phone: "",
    birthdate: "",
    address: "",
    roleCode: "USER",
    roleName: "Người dùng",
  });

  const handleLogout = async (): void => {
    const user = await fetch("/api/logout", {
      method: "POST",
      credentials: "include",
    });
    router.refresh();
    router.push("/login");
  };

  const renderContent = () => {
    switch (activePage) {
      case "details":
        return (
          <ProfileDetails
            userId={userId}
            userInfo={userInfo}
            setUserInfo={setUserInfo}
          />
        );
      case "tours":
        return <MyTours tourorder={tourorder} userId={userId} />;
      case "password":
        return <ChangePassword userId={userId} />;
      default:
        return (
          <ProfileDetails
            userId={userId}
            userInfo={userInfo}
            setUserInfo={setUserInfo}
          />
        );
    }
  };

  useEffect(() => {
    try {
      const fetchuser = async () => {
        const res = await fetch(`http://localhost:8088/api/users/${userId}`, {
          credentials: "include",
        });
        if (!res.ok) {
          throw new Error("That bai");
        }
        const data = await res.json();
        setUserInfo((prev) => ({
          ...prev,
          name: data.name,
          email: data.email,
          phone: data.phone ? data.phone : "",
          address: data.address ? data.address : "",
          birthdate: data.birthdate ? data.birthdate : "",
        }));
        console.log("user", data);
      };
      const fetchtour = async () => {
        const res = await fetch(
          `http://localhost:8088/api/bookings/user/${userId}/all`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        if (!res.ok) {
          throw new Error("That bai");
        }
        setTourorder(data);
        console.log("tour dat 1", data);
      };
      fetchuser();
      fetchtour();
    } catch (error) {
      console.log(error);
    }
  }, [userId]);
  console.log("tour da dat", tourorder);
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="flex">
        <Sidebar
          activePage={activePage}
          setActivePage={setActivePage}
          userInfo={userInfo}
          onLogout={handleLogout}
        />

        <main className="flex-1 p-8">{renderContent()}</main>
      </div>
    </div>
  );
};

export default ProfilePage;
