import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaEnvelope,
} from "react-icons/fa";
import { useTheme } from "../contexts/ThemeProvider";

const Footer = () => {
  const { theme } = useTheme ? useTheme() : { theme: "light" };
  const isDark = theme === "dark";
  // Custom color palette for dark/light mode
  const bgColor = isDark ? "bg-gradient-to-br from-[#0a183a] via-[#14224a] to-[#1a2a4d]" : "bg-gradient-to-br from-[#ECEEF0] via-[#e3e8f0] to-[#dbeafe]";
  const textColor = isDark ? "text-[#cfd8e3]" : "text-[#22223b]";
  const accentColor = isDark ? "text-[#5A77DF]" : "text-[#3D53A0]";
  const linkColor = isDark ? "text-[#8ab4f8] hover:text-[#fff]" : "text-[#2563eb] hover:text-[#1e40af]";
  const borderColor = isDark ? "border-[#22325c]" : "border-[#cbd5e1]";

  return (
    <footer
      className={`w-screen py-10 transition-colors duration-300 ${bgColor} ${textColor}`}
    >
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10 text-left break-words overflow-hidden">
        {/* Logo + Deskripsi */}
        <div className="whitespace-normal text-center md:text-left">
          <div className={`text-2xl font-bold mb-3 ${accentColor}`}>
            RPL SMKN 8 Jember
          </div>
          <p
            className={`text-sm leading-relaxed ${isDark ? "text-[#8ca0c6]" : "text-[#475569]"}`}
          >
            SMKN 8 Jember Jurusan Rekayasa Perangkat Lunak adalah lembaga
            pendidikan yang berkomitmen menghasilkan lulusan unggul dan kompeten
            di bidang teknologi informasi, dengan standar industri yang tinggi.
          </p>
        </div>

        {/* Kontak */}
        <div className="whitespace-normal text-center md:text-left">
          <h4 className={`text-lg font-semibold mb-3 ${accentColor}`}>Kontak</h4>
          <ul className={`space-y-2 text-sm ${isDark ? "text-[#8ca0c6]" : "text-[#475569]"}`}>
            <li>
              Email:{" "}
              <a
                href="mailto:smknegeri08jember@gmail.com"
                className={`break-all transition-colors ${linkColor}`}
              >
                smknegeri08jember@gmail.com
              </a>
            </li>
            <li>Alamat: Jl. Pelita No. 27, Sidomekar - Semboro, Jember, Jawa Timur</li>
            <li>Telp: (0336) 444112</li>
          </ul>
        </div>

        {/* Sosial Media */}
        <div className="whitespace-normal flex flex-col items-center md:items-start">
          <h4 className={`text-lg font-semibold mb-3 ${accentColor}`}>Ikuti Kami</h4>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 text-lg">
            {[
              { icon: <FaFacebookF />, href: "#", color: isDark ? "#8ab4f8" : "#2563eb" },
              { icon: <FaTwitter />, href: "#", color: isDark ? "#1da1f2" : "#3b82f6" },
              { icon: <FaInstagram />, href: "#", color: isDark ? "#e1306c" : "#d946ef" },
              { icon: <FaEnvelope />, href: "mailto:smknegeri08jember@gmail.com", color: isDark ? "#fbbc05" : "#f59e42" },
            ].map((item, idx) => (
              <a
                key={idx}
                href={item.href}
                className={`transition-colors ${linkColor}`}
                style={{ color: item.color }}
              >
                {item.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Tentang Kami */}
        <div className="whitespace-normal text-center md:text-left">
          <h4 className={`text-lg font-semibold mb-3 ${accentColor}`}>Tentang Kami</h4>
          <p
            className={`text-sm leading-relaxed ${isDark ? "text-[#8ca0c6]" : "text-[#475569]"}`}
          >
            Website resmi jurusan RPL SMKN 8 Jember sebagai media informasi dan
            publikasi kegiatan jurusan kepada siswa, guru, alumni, serta
            masyarakat luas.
          </p>
        </div>
      </div>

      {/* Copyright */}
      <div
        className={`mt-10 pt-5 text-sm text-center px-6 max-w-7xl mx-auto break-words border-t transition-colors ${borderColor} ${isDark ? "text-[#7b8bbd]" : "text-[#64748b]"}`}
      >
        &copy; {new Date().getFullYear()} RPL SMKN 8 Jember. Semua hak cipta dilindungi.
      </div>
    </footer>
  );
};

export default Footer;
