import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, "...", totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    return pages;
  };

  return (
    <nav className="flex justify-center mt-10">
      <ul className="flex items-center gap-2 bg-white dark:bg-[#232a45] rounded-2xl px-4 py-3 shadow-lg border border-[#CCD4DF]">
        {/* Prev Button */}
        <li>
          <button
            className="px-3 py-2 rounded-full bg-blue-50 dark:bg-[#323954] text-blue-600 dark:text-[#ECEEF0] font-semibold hover:bg-blue-100 dark:hover:bg-[#3D53A0] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <FaChevronLeft />
          </button>
        </li>

        {/* Page Numbers */}
        {getPageNumbers().map((page, index) => (
          <li key={index}>
            {page === "..." ? (
              <span className="px-3 py-2 text-gray-400 dark:text-gray-500">...</span>
            ) : (
              <button
                className={`px-4 py-2 rounded-full font-semibold transition-all duration-200 mx-0.5
                  ${
                    page === currentPage
                      ? "bg-blue-600 text-white shadow-md ring-2 ring-blue-400 scale-110"
                      : "bg-blue-50 dark:bg-[#323954] text-blue-600 dark:text-[#ECEEF0] hover:bg-blue-100 dark:hover:bg-[#3D53A0]"
                  }`}
                onClick={() => onPageChange(page)}
                disabled={page === currentPage}
              >
                {page}
              </button>
            )}
          </li>
        ))}

        {/* Next Button */}
        <li>
          <button
            className="px-3 py-2 rounded-full bg-blue-50 dark:bg-[#323954] text-blue-600 dark:text-[#ECEEF0] font-semibold hover:bg-blue-100 dark:hover:bg-[#3D53A0] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <FaChevronRight />
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
