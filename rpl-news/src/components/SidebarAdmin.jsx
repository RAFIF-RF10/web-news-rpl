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
import { FaUser } from "react-icons/fa";

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
      icon: FaUsersGear  ,
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
    // { icon: GrGallery, label: "Gallery", id: "gallery", path: "/author/gallery" },
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
      ${isDark ? "bg-[#081030] text-gray-200" : "bg-[#ECEEF0] text-gray-800"}`}
    >
      {/* Header */}
      <div
        className={`p-4 flex items-center justify-between border-b ${
          isDark ? "border-gray-700" : "border-gray-200"
        }`}
      >
        <div
          className={`flex items-center ${
            !isSidebarOpen && "justify-center w-full"
          }`}
        >
          <img src="/image/logo-rpl.png" alt="Logo" className={`h-8 w-8`} />
          {isSidebarOpen && (
            <span className="ml-3 font-semibold text-xl">RPL News</span>
          )}
        </div>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={`p-1 rounded-lg ${
            isDark ? "hover:bg-[#323954]" : "hover:bg-gray-100"
          }`}
        >
          {isSidebarOpen ? (
            <FiX className="w-6 h-6" />
          ) : (
            <FiMenu className="w-6 h-6" />
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
              className={`w-full flex items-center p-4 transition-colors duration-200
                ${
                  active
                    ? isDark
                      ? "bg-[#3D53A0] text-white"
                      : "bg-blue-50 text-blue-700"
                    : isDark
                    ? "text-gray-300 hover:bg-[#323954]"
                    : "text-gray-600 hover:bg-[#CCD4DF]"
                }
                ${!isSidebarOpen && "justify-center"}
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
          {isSidebarOpen && <span className="text-sm">Mode</span>}
          <ThemeSwitch />
        </div>
        <button
          onClick={handleLogout}
          className={`w-full flex items-center p-4 text-red-600 transition-colors duration-200
            ${isDark ? "hover:bg-[#323954]" : "hover:bg-red-50"}
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
