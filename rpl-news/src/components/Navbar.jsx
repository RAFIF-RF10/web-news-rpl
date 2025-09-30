import React, { useEffect, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { useLocation } from "react-router-dom";
import ThemeSwitch from "./themeSwitc";
import { useTheme } from "../contexts/ThemeProvider";

const Navbar = ({ forceScrolledStyle = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const location = useLocation();
  const { theme } = useTheme ? useTheme() : { theme: "light" };
  const isNewsPage = location.pathname.includes('/news');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const showScrolledStyle = isScrolling || forceScrolledStyle || isNewsPage;
  const isDark = theme === "dark";

  return (
    <>
      <nav
        className={`fixed top-0 left-0 z-50 w-screen h-16 px-6 md:px-12 flex items-center justify-between transition-all duration-300
          ${showScrolledStyle
            ? isDark
              ? "bg-gradient-to-r from-blue-600 to-blue-500 shadow-lg dark:bg-primary/50 dark:backdrop-blur-sm"
              : "bg-white shadow-lg"
            : isDark
              ? "bg-transparent"
              : "bg-white/80 backdrop-blur-md"}
        `}
      >
        {/* Logo */}
        <div className="flex items-center">
          <img
            src="/image/logo-rpl.png"
            alt="Logo RPL"
            className="h-10 md:h-18 transition-transform duration-300 hover:scale-105"
          />
        </div>

        <div className="hidden md:flex items-center space-x-8">
          <ul className="flex items-center space-x-8">
            {[
              { href: "/#home", label: "Home" },
              { href: "/#about", label: "About" },
              { href: "/#news", label: "News & Events" },
              { href: "/gallery", label: "Gallery" },
            ].map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className={`font-medium transition-all duration-300 py-2 relative
                    ${isDark
                      ? showScrolledStyle
                        ? "text-white hover:text-blue-100"
                        : "text-white hover:text-blue-200"
                      : showScrolledStyle
                        ? "text-blue-900 hover:text-blue-700"
                        : "text-blue-700 hover:text-blue-900"}
                    after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-0.5
                    ${isDark ? "after:bg-white" : "after:bg-blue-700"} after:transition-all after:duration-300 hover:after:w-full
                  `}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <div className={`border-l pl-8 ${isDark ? "border-white/20" : "border-blue-200"}`}>
            <ThemeSwitch />
          </div>
        </div>

        <div className="md:hidden flex items-center gap-4">
          <ThemeSwitch />
          <button
            className="md:hidden focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation menu"
          >
            {isOpen ? (
              <FiX className={isDark ? "text-white w-7 h-7" : "text-blue-900 w-7 h-7"} />
            ) : (
              <FiMenu className={isDark ? "text-white w-7 h-7" : "text-blue-900 w-7 h-7"} />
            )}
          </button>
        </div>
      </nav>

      <div
        className={`fixed top-16 left-0 w-screen md:hidden z-40 transition-all duration-300 ease-in-out
          ${isDark
            ? "bg-gradient-to-r from-blue-600 to-blue-500 shadow-lg dark:bg-primary/50 dark:backdrop-blur-sm"
            : "bg-white shadow-lg backdrop-blur-md"}
          ${isOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}`}
      >
        <ul className="flex flex-col items-center py-6 space-y-4">
          {[
            { href: "/#home", label: "Home" },
            { href: "/#about", label: "About" },
            { href: "/#news", label: "News & Events" },
            { href: "/gallery", label: "Gallery" },
          ].map((item) => (
            <li key={item.label} className="w-full">
              <a
                href={item.href}
                className={`block py-2 px-4 font-medium transition-all duration-300 w-full text-center
                  ${isDark
                    ? "text-white hover:bg-blue-400/20"
                    : "text-blue-900 hover:bg-blue-100"}
                `}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Navbar;
