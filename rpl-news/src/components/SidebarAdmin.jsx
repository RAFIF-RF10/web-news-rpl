import React from "react";
import {
  FiHome,
  FiBookOpen,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { FaUsersGear } from "react-icons/fa6";
import { GrGallery } from "react-icons/gr";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../api/hooks/useAuth";
import Swal from "sweetalert2";
import { useTheme } from "../contexts/ThemeProvider";
import ThemeSwitch from "./themeSwitc";

const SidebarAdmin = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const location = useLocation();
  const { logout, user: contextUser } = useAuth();
  const { theme } = useTheme ? useTheme() : { theme: "light" };

  const user = contextUser || JSON.parse(localStorage.getItem("user"));

  const handleLogout = async () => {
    Swal.fire({
      title: "Yakin ingin logout?",
      icon: "warning",
      showCancelButton: true,
    }).then(async (res) => {
      if (res.isConfirmed) {
        try {
          await logout();
          window.location.href = "/login";
        } catch (e) {
          alert("Gagal logout");
        }
      }
    });
  };

  // Menu untuk admin
  const adminMenu = [
    { icon: FiHome, label: "Dashboard", id: "dashboard", path: "/admin" },
    { icon: FiBookOpen, label: "Berita", id: "news", path: "/admin/news" },
    {
      icon: GrGallery,
      label: "Gallery",
      id: "gallery",
      path: "/admin/galleryAdmin",
    },
    {
      icon: FaUsersGear,
      label: "UserManagement",
      id: "UserManagement",
      path: "/admin/userManagement",
    },
    { icon: FiSettings, label: "Settings", id: "settings", path: "/admin/settings" },
  ];

  // Menu untuk author
  const authorMenu = [
    { icon: FiHome, label: "Dashboard", id: "dashboard", path: "/author" },
    { icon: FiBookOpen, label: "Berita Saya", id: "mynews", path: "/author/news" },
    { icon: FiSettings, label: "Settings", id: "settings", path: "/author/settings" },
  ];

  const menuItems =
    user?.role === "admin"
      ? adminMenu
      : user?.role === "author"
      ? authorMenu
      : [];

  const isDark = theme === "dark";

  return (
    <div
      className={`${
        isSidebarOpen ? "w-64" : "w-20"
      } min-h-screen fixed top-0 left-0 shadow-lg transition-all duration-300 ease-in-out 
      ${isDark ? "bg-[#1E293B] text-gray-200" : "bg-[#3D53A0] text-white"}`}
    >
      {/* Header */}
      <div
        className={`p-4 flex items-center justify-between border-b ${
          isDark ? "border-gray-700" : "border-blue-800"
        }`}
      >
        <div
          className={`flex items-center ${
            !isSidebarOpen && "justify-center w-full"
          }`}
        >
          <img src="/image/logo-rpl.png" alt="Logo" className="h-8 w-8" />
          {isSidebarOpen && (
            <span
              className={`ml-3 font-semibold text-xl ${
                isDark ? "text-gray-100" : "text-white"
              }`}
            >
              RPL News
            </span>
          )}
        </div>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={`p-1 rounded-lg ${
            isDark ? "hover:bg-gray-700" : "hover:bg-blue-700"
          }`}
        >
          {isSidebarOpen ? (
            <FiX className={`w-6 h-6 ${isDark ? "text-gray-200" : "text-white"}`} />
          ) : (
            <FiMenu className={`w-6 h-6 ${isDark ? "text-gray-200" : "text-white"}`} />
          )}
        </button>
      </div>

      {/* Menu */}
<nav className="mt-6">
  {menuItems.map((item) => {
    const active = location.pathname === item.path;
    return (
      <Link
        key={item.id}
        to={item.path}
        className={`w-full flex items-center p-3 my-2 transition-colors duration-200
          ${
            active
              ? isDark
                ? "bg-blue-600 text-white font-semibold"
                : "bg-white text-blue-700 font-semibold"
              : isDark
              ? "text-gray-300 hover:bg-gray-700 hover:text-white"
              : "text-white hover:bg-blue-700 hover:text-white"
          }
          ${!isSidebarOpen && "justify-center"}
          rounded-l-full rounded-r-lg
        `}
      >
        <item.icon className={`w-6 h-6 ${isSidebarOpen && "mr-3"}`} />
        {isSidebarOpen && <span>{item.label}</span>}
      </Link>
    );
  })}
</nav>


      {/* Logout + Theme Switch */}
      <div className="absolute bottom-4 w-full">
        <div
          className={`flex items-center justify-between px-4 mb-3 ${
            !isSidebarOpen && "justify-center"
          }`}
        >
          {isSidebarOpen && <span className="text-sm text-white">Mode</span>}
          <ThemeSwitch />
        </div>
        <button
          onClick={handleLogout}
          className={`w-full flex items-center p-3 rounded-lg text-red-500 transition-colors duration-200
            ${isDark ? "hover:bg-gray-700" : "hover:bg-red-200 hover:text-red-600"}
            ${!isSidebarOpen && "justify-center"}
          `}
        >
          <FiLogOut className={`w-6 h-6 ${isSidebarOpen && "mr-3"}`} />
          {isSidebarOpen && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default SidebarAdmin;
