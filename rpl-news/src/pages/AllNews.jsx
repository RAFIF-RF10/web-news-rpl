import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaTrophy,
  FaSearch,
  FaSort,
  FaCalendar,
  FaMapMarkerAlt,
  FaTag,
  FaTimes,
} from "react-icons/fa";
import useNews from "../api/hooks/useNews";
import Layout from "../layout/Layout";
import { Skeleton } from "@heroui/skeleton";
import { Card } from "@heroui/card";
import DOMPurify from "dompurify";

const AllNews = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [category, setCategory] = useState("all");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const { newsData, loading, error, refetch } = useNews();

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("id-ID", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return dateString;
    }
  };

  const sortNews = (news) => {
    return [...news].sort((a, b) => {
      const dateA = new Date(a.created_at || a.date);
      const dateB = new Date(b.created_at || b.date);
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });
  };

  const filteredNews = (newsData || []).filter((item) => {
    const matchesSearch = item.title
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

    let matchesCategory = true;
    if (category !== "all") {
      const cat = item.category?.toLowerCase() || "";
      const tag = item.tag?.toLowerCase() || "";

      if (category === "news") {
        matchesCategory =
          !cat.includes("kompetisi") &&
          !cat.includes("competition") &&
          !tag.includes("juara") &&
          !tag.includes("place");
      } else if (category === "competition") {
        matchesCategory =
          cat.includes("kompetisi") ||
          cat.includes("competition") ||
          tag.includes("juara") ||
          tag.includes("place");
      } else if (category === "alumni") {
        matchesCategory = cat.includes("alumni") || tag.includes("alumni");
      } else if (category === "kerjasama") {
        matchesCategory =
          cat.includes("kerjasama") || tag.includes("kerjasama");
      }
    }

    return matchesSearch && matchesCategory;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentNews = sortNews(filteredNews).slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Reset filter
  const handleResetFilter = () => {
    setSearchTerm("");
    setSortOrder("newest");
    setCategory("all");
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchTerm !== "" || category !== "all" || sortOrder !== "newest";

  if (error) {
    return (
      <Layout>
        <div className="px-6 md:px-10 py-8 pt-28 bg-[#ECEEF0] dark:bg-[#08112F] min-h-screen">
          <div className="flex flex-col justify-center items-center h-64">
            <div className="text-red-600 mb-4 text-center font-medium">
              Error loading news: {error.message || "Something went wrong"}
            </div>
            <button
              onClick={refetch}
              className="bg-gradient-to-r from-[#3E53A0] to-[#5A77DF] text-white px-6 py-2 rounded-lg hover:opacity-90 transition-all duration-200 font-medium shadow-md"
            >
              Try Again
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-6 md:px-10 py-8 pt-28 bg-[#ECEEF0] dark:bg-[#08112F] min-h-screen">
        {/* Back button */}
        <div className="mb-6 justify-start flex">
          <Link
            to="/"
            className="inline-block bg-white dark:bg-[#323954] px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg text-[#3E53A0] font-medium transition-all duration-200 hover:bg-[#CCD4DE] dark:hover:bg-[#3E53A0] border border-[#CCD4DE] dark:border-[#3E53A0]"
          >
            ← Kembali
          </Link>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[#323954] dark:text-[#ECEEF0] mb-2">
            Artikel Terbaru
          </h2>
          <p className="text-[#3E53A0] dark:text-[#CCD4DE]">
            Ikuti perkembangan terbaru dan prestasi siswa SMK Negeri 8 Jember
          </p>
        </div>

        {/* Filter section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-center">
            {/* Search */}
            <div className="w-full lg:w-[300px] relative group">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <FaSearch className="text-[#3E53A0] group-hover:text-[#5A77DF] transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Cari berita..."
                className="w-full pl-10 pr-4 py-3 border-2 border-[#CCD4DE] rounded-xl
                  focus:outline-none focus:border-[#5A77DF] focus:ring-4 focus:ring-[#5A77DF]/30
                  transition-all duration-300 bg-white dark:bg-[#323954] text-[#323954] dark:text-[#ECEEF0] placeholder:text-[#3E53A0]"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            {/* Category */}
            <div className="w-full flex flex-wrap gap-2 justify-center items-center lg:justify-center mb-2">
              {[
                { id: "all", label: "Semua" },
                { id: "news", label: "Berita" },
                { id: "competition", label: "Kompetisi" },
                { id: "alumni", label: "Alumni" },
                { id: "kerjasama", label: "Kerjasama" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setCategory(tab.id);
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-150 border shadow-sm
                    ${
                      category === tab.id
                        ? "bg-gradient-to-r from-[#3E53A0] to-[#5A77DF] text-white border-[#5A77DF] shadow-md"
                        : "bg-white dark:bg-[#323954] border-[#CCD4DE] dark:border-[#3E53A0] text-[#323954] dark:text-[#CCD4DE] hover:bg-[#ECEEF0] dark:hover:bg-[#3E53A0]"
                    }
                  `}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Sort */}
            <div className="lg:w-[160px] relative">
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className={`w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl
                  border-2 transition-all duration-200 font-medium shadow-sm
                  ${
                    showSortDropdown
                      ? "border-[#5A77DF] bg-[#CCD4DE] dark:bg-[#3E53A0] text-[#3E53A0] dark:text-[#ECEEF0]"
                      : "border-[#CCD4DE] bg-white dark:bg-[#323954] text-[#323954] dark:text-[#ECEEF0] hover:bg-[#ECEEF0] dark:hover:bg-[#3E53A0]"
                  }`}
              >
                <FaSort
                  className={`transform transition-transform duration-200 ${
                    showSortDropdown ? "rotate-180" : ""
                  }`}
                />
                <span className="text-sm">
                  {sortOrder === "newest" ? "Terbaru" : "Terlama"}
                </span>
              </button>

              {showSortDropdown && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl shadow-xl bg-white dark:bg-[#323954] border border-[#CCD4DE] dark:border-[#3E53A0] overflow-hidden z-20">
                  {[
                    { id: "newest", label: "Terbaru ke Lama" },
                    { id: "oldest", label: "Lama ke Baru" },
                  ].map((option) => (
                    <button
                      key={option.id}
                      onClick={() => {
                        setSortOrder(option.id);
                        setShowSortDropdown(false);
                        setCurrentPage(1);
                      }}
                      className={`block w-full px-4 py-3 text-sm text-left transition-colors duration-150
                        ${
                          sortOrder === option.id
                            ? "bg-[#5A77DF]/10 text-[#3E53A0] font-semibold dark:text-[#ECEEF0]"
                            : "text-[#323954] dark:text-[#CCD4DE] hover:bg-[#ECEEF0] dark:hover:bg-[#3E53A0]"
                        }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Count + Reset */}
        <div className="mb-6 flex flex-wrap gap-2 justify-between items-center">
          <div className="text-[#323954] dark:text-[#ECEEF0] text-sm font-medium bg-white dark:bg-[#323954] px-4 py-2 rounded-lg shadow-sm border border-[#CCD4DE] dark:border-[#3E53A0]">
            Menampilkan{" "}
            <span className="font-bold text-[#3E53A0] dark:text-[#5A77DF]">
              {filteredNews.length}
            </span>{" "}
            dari <span className="font-bold">{newsData?.length || 0}</span>{" "}
            artikel
          </div>
          {hasActiveFilters && (
            <button
              onClick={handleResetFilter}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg shadow-sm border border-red-200 hover:bg-red-100 transition-colors"
            >
              <FaTimes />
              Reset Filter
            </button>
          )}
        </div>

        {/* Grid News */}
        <Card className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading
            ? Array.from({ length: 6 }).map((_, idx) => (
                <Card
                  key={idx}
                  className="rounded-2xl shadow-lg dark:shadow-accent/10 p-4 space-y-4 bg-white dark:bg-[#323954]"
                >
                  <Skeleton className="h-52 w-full rounded-lg bg-[#CCD4DE] dark:bg-[#3E53A0]" />
                  <div className="space-y-3">
                    <Skeleton className="h-5 w-3/4 rounded-lg" />
                    <Skeleton className="h-4 w-1/2 rounded-lg" />
                    <Skeleton className="h-4 w-full rounded-lg" />
                  </div>
                </Card>
              ))
            : currentNews.map((item) => (
                <Link
                  key={item.id}
                  to={`/news/${item.id}`}
                  className="hover:no-underline group"
                >
                  <div className="rounded-2xl shadow-lg overflow-hidden bg-white dark:bg-[#323954] hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-[#CCD4DE] dark:border-[#3E53A0] flex flex-col h-[500px]">
                    {/* Gambar */}
                    <div className="relative h-52 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      {/* Badge */}
                      <div
                        className={`absolute top-3 left-3 px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-lg backdrop-blur-sm ${
                          item.tag?.includes("Place") ||
                          item.tag?.toLowerCase().includes("juara") ||
                          item.category?.includes("Place") ||
                          item.category?.toLowerCase().includes("juara")
                            ? "bg-gradient-to-r from-yellow-400 to-orange-500"
                            : "bg-gradient-to-r from-[#3E53A0] to-[#5A77DF]"
                        }`}
                      >
                        {item.tag?.includes("Place") ||
                        item.tag?.toLowerCase().includes("juara") ? (
                          <div className="flex items-center gap-1.5">
                            <FaTrophy className="text-xs" />
                            {item.tag || item.category}
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <FaTag className="text-xs" />
                            {item.category || item.tag}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Konten */}
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="font-bold text-lg text-[#323954] dark:text-[#ECEEF0] mb-3 line-clamp-2 group-hover:text-[#5A77DF] transition-colors duration-200 leading-tight">
                        {item.title}
                      </h3>

                      <p
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(item.sub),
                        }}
                        className="text-[#3E53A0] dark:text-[#CCD4DE] text-sm mb-4 line-clamp-3 leading-relaxed flex-grow"
                      ></p>

                      <div className="border-t border-[#CCD4DE] dark:border-[#3E53A0] pt-4 space-y-2 text-xs text-[#3E53A0] dark:text-[#ECEEF0]">
                        <div className="flex items-center">
                          <FaCalendar className="mr-2 text-[#5A77DF]" />
                          <span className="font-medium">
                            {formatDate(item.created_at || item.date)}
                          </span>
                        </div>
                        {item.location && (
                          <div className="flex items-center">
                            <FaMapMarkerAlt className="mr-2 text-red-400" />
                            <span>{item.location}</span>
                          </div>
                        )}
                      </div>

                      <div className="mt-4 pt-3 border-t border-[#CCD4DE] dark:border-[#3E53A0]">
                        <span className="inline-flex items-center text-[#3E53A0] dark:text-[#5A77DF] text-sm font-medium group-hover:text-[#5A77DF]">
                          Baca selengkapnya
                          <svg
                            className="ml-1 w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 5l7 7-7 7"
                            ></path>
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
        </Card>

        {/* Pagination */}
        {totalPages > 1 && !loading && (
          <div className="flex flex-col items-center space-y-4 mt-8">
            <p className="text-[#3E53A0] dark:text-[#CCD4DE] text-sm font-medium">
              Halaman {currentPage} dari {totalPages}
            </p>
            <div className="flex items-center space-x-2">
              {/* Tombol Sebelumnya */}
              <button
                disabled={currentPage === 1}
                onClick={() => paginate(currentPage - 1)}
                className={`px-3 py-1.5 rounded-lg border text-sm transition ${
                  currentPage === 1
                    ? "text-gray-400 border-gray-200 bg-gray-50 cursor-not-allowed"
                    : "bg-white dark:bg-[#323954] hover:bg-[#ECEEF0] dark:hover:bg-[#3E53A0] text-[#323954] dark:text-[#ECEEF0] border-[#CCD4DE] dark:border-[#3E53A0]"
                }`}
              >
                Sebelumnya
              </button>

              {/* Nomor Halaman */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (number) => (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={`w-9 h-9 rounded-lg border flex items-center justify-center text-sm font-medium transition ${
                      currentPage === number
                        ? "bg-gradient-to-r from-[#3E53A0] to-[#5A77DF] text-white border-[#5A77DF]"
                        : "bg-white dark:bg-[#323954] text-[#323954] dark:text-[#ECEEF0] hover:bg-[#ECEEF0] dark:hover:bg-[#3E53A0] border-[#CCD4DE] dark:border-[#3E53A0]"
                    }`}
                  >
                    {number}
                  </button>
                )
              )}

              {/* Tombol Berikutnya */}
              <button
                disabled={currentPage === totalPages}
                onClick={() => paginate(currentPage + 1)}
                className={`px-3 py-1.5 rounded-lg border text-sm transition ${
                  currentPage === totalPages
                    ? "text-gray-400 border-gray-200 bg-gray-50 cursor-not-allowed"
                    : "bg-white dark:bg-[#323954] hover:bg-[#ECEEF0] dark:hover:bg-[#3E53A0] text-[#323954] dark:text-[#ECEEF0] border-[#CCD4DE] dark:border-[#3E53A0]"
                }`}
              >
                Berikutnya
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AllNews;
