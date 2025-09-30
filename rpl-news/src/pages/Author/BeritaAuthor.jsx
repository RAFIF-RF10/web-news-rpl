import React, { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import { Link } from "react-router-dom";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiGrid,
  FiList,
  FiSearch,
  FiUser,
  FiCalendar,
  FiEye,
  FiFileText,
  FiX,
} from "react-icons/fi";
import Swal from "sweetalert2";

import { useAuth } from "../../api/hooks/useAuth";
import useNews, { useAuthorNews } from "../../api/hooks/useNews";

const BeritaAuthor = () => {
  const { getUser } = useAuth();

  const [author, setAuthor] = useState({
    id: null,
    name: "",
    email: "",
    profile_image: "",
  });

  const categories = [
    { value: "Semua", label: "Semua Kategori" },
    { value: "news", label: "Berita" },
    { value: "competition", label: "Kompetisi" },
    { value: "alumni", label: "Alumni" },
    { value: "kerjasama", label: "Kerjasama" },
  ];

  const statusOptions = [
    { value: "Semua", label: "Semua Status" },
    { value: "draft", label: "Draft" },
    { value: "published", label: "Published" },
  ];

  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [selectedStatus, setSelectedStatus] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState("grid");
  const [deletingId, setDeletingId] = useState(null);
  const perPage = 6;

  useEffect(() => {
    const fetchAuthor = async () => {
      const res = await getUser();
      if (res && res.success && res.data) {
        setAuthor({
          id: res.data.id,
          name: res.data.name || "",
          email: res.data.email || "",
          profile_image: res.data.profile_image || "",
        });
      }
    };
    fetchAuthor();
  }, [getUser]);

  const { deleteNews } = useNews(true);
  const { newsData, loading, error, refetch } = useAuthorNews(author.id);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Apakah anda yakin?",
      text: "Data yang dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });
    if (!result.isConfirmed) return;

    try {
      setDeletingId(id);
      const res = await deleteNews(id);
      if (res.success) {
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Berita berhasil dihapus",
          timer: 1500,
          showConfirmButton: false,
        });
        refetch();
      } else {
        throw res.error || new Error("Gagal menghapus");
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Terjadi kesalahan saat menghapus berita",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleClearFilters = () => {
    setSelectedCategory("Semua");
    setSelectedStatus("Semua");
    setSearchQuery("");
    setPage(1);
  };

  const items = Array.isArray(newsData) ? newsData : [];

  // Filtering
  const filteredData = items
    .filter((item) =>
      selectedCategory === "Semua" ? true : item.category === selectedCategory
    )
    .filter((item) =>
      selectedStatus === "Semua" ? true : item.status === selectedStatus
    )
    .filter(
      (item) =>
        (item.title || "")
          .toLowerCase()
          .includes((searchQuery || "").toLowerCase()) ||
        (item.sub || "")
          .toLowerCase()
          .includes((searchQuery || "").toLowerCase()) ||
        (item.content || "")
          .toLowerCase()
          .includes((searchQuery || "").toLowerCase())
    );

  const totalPages = Math.max(1, Math.ceil(filteredData.length / perPage));
  const paginatedData = filteredData.slice(
    (page - 1) * perPage,
    page * perPage
  );

  // Skeleton Loader Grid
  const SkeletonGrid = () => (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: perPage }).map((_, i) => (
        <div
          key={i}
          className="bg-white dark:bg-[#1E253A] rounded-xl shadow-md border border-gray-100 dark:border-[#323954] animate-pulse"
        >
          <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-t-xl" />
          <div className="p-6 space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );

  // Skeleton Loader List
  const SkeletonList = () => (
    <div className="space-y-4">
      {Array.from({ length: perPage }).map((_, i) => (
        <div
          key={i}
          className="bg-white dark:bg-[#1E253A] rounded-xl shadow-md border border-gray-100 dark:border-[#323954] animate-pulse"
        >
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/4 h-32 md:h-full bg-gray-200 dark:bg-gray-700" />
            <div className="md:w-3/4 p-6 space-y-3">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderGridView = () => (
    <div
      className={`grid gap-6 ${
        paginatedData.length === 1
          ? "grid-cols-1 md:grid-cols-1 lg:grid-cols-1 max-w-md mx-auto"
          : paginatedData.length === 2
          ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-2"
          : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      }`}
    >
      {paginatedData.map((item) => (
        <div
          key={item.id}
          className="bg-white dark:bg-[#1E253A] rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full min-h-[400px] flex flex-col border border-gray-100 dark:border-[#323954]"
        >
          <div className="relative">
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-48 object-cover"
              onError={(e) => {
                e.target.src = "/placeholder.jpg";
              }}
            />
            <div className="absolute top-3 left-3 flex gap-2">
              <span
                className={`px-2 py-1 text-xs font-semibold rounded-full backdrop-blur-sm
                  ${
                    item.status === "published"
                      ? "bg-green-500/20 text-green-800 border border-green-300 dark:bg-green-500/30 dark:text-green-300"
                      : "bg-yellow-500/20 text-yellow-800 border border-yellow-300 dark:bg-yellow-500/30 dark:text-yellow-300"
                  }`}
              >
                {item.status === "draft" ? "Draft" : "Published"}
              </span>
              <span className="bg-blue-500/20 text-blue-800 dark:bg-blue-500/30 dark:text-blue-300 px-2 py-1 text-xs font-semibold rounded-full backdrop-blur-sm border border-blue-300">
                {categories.find((cat) => cat.value === item.category)?.label ||
                  item.category}
              </span>
            </div>
          </div>

          <div className="p-6 flex-1 flex flex-col">
            <h3 className="text-lg font-bold text-gray-800 dark:text-[#ECEEF0] mb-3 line-clamp-2 leading-tight">
              {item.title}
            </h3>

            {item.sub && (
              <div className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2 font-medium">
                <span
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(item.sub),
                  }}
                />
              </div>
            )}

            <div className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-3 flex-1">
              <span
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(item.content || ""),
                }}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500 mb-4 pt-3 border-t border-gray-100 dark:border-gray-600">
              <div className="flex items-center gap-2">
                <FiUser className="w-3 h-3" />
                <span>{item.user?.name || author?.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiCalendar className="w-3 h-3" />
                <span>{item.created_at}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500">
                <FiEye className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {item.views || 0} views
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  to={`/author/news/edit/${item.id}`}
                  className="p-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-500/20 rounded-lg transition-colors"
                >
                  <FiEdit className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => handleDelete(item.id)}
                  disabled={deletingId === item.id}
                  className="p-2 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-500/20 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center min-w-[32px] min-h-[32px]"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderListView = () => (
    <div className="space-y-4">
      {paginatedData.map((item) => (
        <div
          key={item.id}
          className="bg-white dark:bg-[#1E253A] rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-[#323954]"
        >
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/4 relative">
              <img
                src={item.image || "/placeholder.jpg"}
                alt={item.title}
                className="w-full h-32 md:h-full object-cover"
                onError={(e) => {
                  e.target.src = "/placeholder.jpg";
                }}
              />
              <div className="absolute top-2 left-2 flex gap-1 flex-wrap">
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full backdrop-blur-sm
                    ${
                      item.status === "published"
                        ? "bg-green-500/20 text-green-800 border border-green-300 dark:bg-green-500/30 dark:text-green-300"
                        : "bg-yellow-500/20 text-yellow-800 border border-yellow-300 dark:bg-yellow-500/30 dark:text-yellow-300"
                    }`}
                >
                  {item.status === "draft" ? "Draft" : "Published"}
                </span>
                <span className="bg-blue-500/20 text-blue-800 dark:bg-blue-500/30 dark:text-blue-300 px-2 py-1 text-xs font-semibold rounded-full backdrop-blur-sm border border-blue-300">
                  {categories.find((cat) => cat.value === item.category)
                    ?.label || item.category}
                </span>
              </div>
            </div>

            <div className="md:w-3/4 p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-[#ECEEF0] mb-2 line-clamp-2">
                  {item.title}
                </h3>

                {item.sub && (
                  <div className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2 font-medium">
                    <span
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(item.sub),
                      }}
                    />
                  </div>
                )}

                <div className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                  <span
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(item.content || ""),
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6 text-xs text-gray-400 dark:text-gray-500">
                  <div className="flex items-center gap-1">
                    <FiUser className="w-3 h-3" />
                    <span>{item.user?.name || author?.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FiCalendar className="w-3 h-3" />
                    <span>{item.created_at}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FiEye className="w-3 h-3" />
                    <span>{item.views || 0} views</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    to={`/author/news/edit/${item.id}`}
                    className="p-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-500/20 rounded-lg transition-colors"
                  >
                    <FiEdit className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(item.id)}
                    disabled={deletingId === item.id}
                    className="p-2 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-500/20 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center min-w-[32px] min-h-[32px]"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="w-full bg-[#CCD4DF] dark:bg-[#252e4b] p-8 min-h-screen">
        <div className="max-w-6xl mx-auto">
          {viewMode === "grid" ? <SkeletonGrid /> : <SkeletonList />}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#CCD4DF] dark:bg-[#252e4b] p-8 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-[#ECEEF0]">
            Berita Saya
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Tambah, edit, dan kelola berita kamu
          </p>
        </div>
        <Link
          to={"news/add-author"}
          className="flex items-center gap-2 bg-[#5A77DF] text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
        >
          <FiPlus className="w-5 h-5" />
          TAMBAHKAN BERITA
        </Link>
      </div>

      {/* Enhanced Search & Filter Section */}
      <div className="bg-white dark:bg-[#2E3B5B] rounded-xl shadow-md p-6 mb-8 border border-gray-100 dark:border-[#323954]">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1">
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Cari berdasarkan judul, sub judul, atau konten..."
                className="w-full pl-12 pr-4 py-3 border border-gray-200 dark:border-[#323954] rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all bg-white dark:bg-[#232B45] text-gray-800 dark:text-[#ECEEF0] placeholder:text-gray-400 dark:placeholder:text-[#CCD4DF]"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <select
              className="px-4 py-3 border border-gray-200 dark:border-[#323954] rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white dark:bg-[#232B45] font-medium text-gray-700 dark:text-[#ECEEF0] min-w-[140px] transition-all"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setPage(1);
              }}
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>

            <select
              className="px-4 py-3 border border-gray-200 dark:border-[#323954] rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white dark:bg-[#232B45] font-medium text-gray-700 dark:text-[#ECEEF0] min-w-[120px] transition-all"
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setPage(1);
              }}
            >
              {statusOptions.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>

            {/* Clear Filters Button */}
            {(selectedCategory !== "Semua" ||
              selectedStatus !== "Semua" ||
              searchQuery) && (
              <button
                onClick={handleClearFilters}
                className="px-4 py-3 border border-gray-200 dark:border-[#323954] rounded-lg hover:bg-gray-50 dark:hover:bg-[#3B4672] transition-colors font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"
              >
                <FiX className="w-4 h-4" />
                Clear
              </button>
            )}

            {/* View Toggle */}
            <div className="flex bg-gray-100 dark:bg-[#323954] rounded-lg p-1 border border-gray-200 dark:border-[#323954]">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "grid"
                    ? "bg-white dark:bg-[#232B45] text-blue-600 shadow-sm"
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
                }`}
              >
                <FiGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "list"
                    ? "bg-white dark:bg-[#232B45] text-blue-600 shadow-sm"
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
                }`}
              >
                <FiList className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-[#323954]">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Menampilkan{" "}
            <span className="font-semibold text-gray-800 dark:text-gray-200">
              {paginatedData.length}
            </span>{" "}
            dari{" "}
            <span className="font-semibold text-gray-800 dark:text-gray-200">
              {filteredData.length}
            </span>{" "}
            berita
            {(selectedCategory !== "Semua" ||
              selectedStatus !== "Semua" ||
              searchQuery) && (
              <span className="text-blue-600 dark:text-blue-400 ml-1">
                (filtered)
              </span>
            )}
          </div>
          {filteredData.length === 0 && (
            <div className="text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/20 px-3 py-1 rounded-full">
              Tidak ada berita yang sesuai dengan filter
            </div>
          )}
        </div>
      </div>

      {/* Content Area */}
      {filteredData.length === 0 ? (
        <div className="bg-white dark:bg-[#1E253A] rounded-xl shadow-md p-12 text-center border border-gray-100 dark:border-[#323954]">
          <div className="w-16 h-16 bg-gray-100 dark:bg-[#2E3B5B] rounded-full mx-auto mb-4 flex items-center justify-center">
            <FiSearch className="w-8 h-8 text-gray-400 dark:text-gray-300" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
            Tidak ada berita ditemukan
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {items.length === 0
              ? "Belum ada berita yang kamu buat. Ayo mulai tulis berita pertamamu!"
              : "Coba ubah filter pencarian untuk menemukan berita yang kamu cari"}
          </p>
          {items.length === 0 ? (
            <Link
              to={"news/add-author"}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-[#5A77DF] rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
            >
              <FiPlus className="w-4 h-4 mr-2" />
              Buat Berita Baru
            </Link>
          ) : (
            <button
              onClick={handleClearFilters}
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
            >
              Clear semua filter
            </button>
          )}
        </div>
      ) : (
        <>
          {viewMode === "grid" ? renderGridView() : renderListView()}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-4">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-[#2E3B5B] border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-[#3B4672] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Sebelumnya
              </button>

              <div className="flex items-center gap-2">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        page === pageNum
                          ? "bg-blue-600 dark:bg-[#5A77DF] text-white"
                          : "text-gray-700 dark:text-gray-300 bg-white dark:bg-[#2E3B5B] border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-[#3B4672]"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                {totalPages > 5 && (
                  <>
                    <span className="px-2 text-gray-500 dark:text-gray-400">
                      ...
                    </span>
                    <button
                      onClick={() => setPage(totalPages)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        page === totalPages
                          ? "bg-blue-600 dark:bg-[#5A77DF] text-white"
                          : "text-gray-700 dark:text-gray-300 bg-white dark:bg-[#2E3B5B] border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-[#3B4672]"
                      }`}
                    >
                      {totalPages}
                    </button>
                  </>
                )}
              </div>

              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-[#2E3B5B] border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-[#3B4672] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Selanjutnya
              </button>
            </div>
          )}
        </>
      )}

      {/* Stats Footer */}
      <div className="mt-8 text-center">
        <div className="inline-flex items-center gap-6 px-6 py-3 bg-white dark:bg-[#2E3B5B] rounded-lg shadow-sm border border-gray-100 dark:border-gray-600">
          <div className="flex items-center gap-2 text-sm">
            <FiFileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="font-medium text-gray-700 dark:text-gray-300">
              Total Berita:
            </span>
            <span className="font-bold text-gray-900 dark:text-gray-100">
              {items.length}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <FiEye className="w-4 h-4 text-green-600 dark:text-green-400" />
            <span className="font-medium text-gray-700 dark:text-gray-300">
              Total Views:
            </span>
            <span className="font-bold text-gray-900 dark:text-gray-100">
              {items.reduce((acc, item) => acc + (item.views || 0), 0)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeritaAuthor;
