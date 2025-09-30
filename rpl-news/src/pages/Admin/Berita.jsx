import React, { useState } from "react";
import DOMPurify from "dompurify";
import Pagination from "../../components/Pagination";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiEye,
  FiSearch,
  FiFilter,
  FiCalendar,
  FiUser,
  FiUpload,
  FiX,
  FiGrid,
  FiList,
} from "react-icons/fi";
import useNews from "../../api/hooks/useNews";
import { Link } from "react-router-dom";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";

import Swal from "sweetalert2";

const Berita = () => {
  const { newsData, refetch, deleteNews, updateNews } = useNews(true);

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
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const perPage = 6;

  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState({
    id: "",
    title: "",
    sub: "",
    content: "",
    image: null,
    imagePreview: "",
    location: "",
    category: "",
    status: "draft",
  });

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
      const result = await deleteNews(id);
      if (result.success) {
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Berita berhasil dihapus",
          timer: 1500,
          showConfirmButton: false,
        });
        refetch();
      } else {
        throw new Error(result.message || "Gagal menghapus berita");
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Terjadi kesalahan saat menghapus berita",
      });
    }
  };

  const handleOpenEdit = (item) => {
    setEditData({
      id: item.id,
      title: item.title,
      sub: item.sub || "",
      content: item.content || "",
      image: null,
      imagePreview: item.image || "",
      location: item.location || "",
      category: item.category,
      status: item.status || "draft",
    });
    setOpenEdit(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditData({
        ...editData,
        image: file,
        imagePreview: URL.createObjectURL(file),
      });
    }
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", editData.title);
      formData.append("sub", editData.sub);
      formData.append("content", editData.content);
      formData.append("location", editData.location);
      formData.append("category", editData.category);
      formData.append("status", editData.status);

      if (editData.image) {
        formData.append("image", editData.image);
      }

      const result = await updateNews(editData.id, formData);
      if (result.success) {
        await Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Berita berhasil diperbarui",
          timer: 1500,
          showConfirmButton: false,
        });
        setOpenEdit(false);
        refetch();
      } else {
        let errorMsg = "Gagal memperbarui berita";
        if (
          result.error &&
          result.error.response &&
          result.error.response.status === 404
        ) {
          errorMsg = "Berita tidak ditemukan. Mungkin sudah dihapus.";
        } else if (
          result.error &&
          result.error.response &&
          result.error.response.data &&
          result.error.response.data.message
        ) {
          errorMsg = result.error.response.data.message;
        }
        await Swal.fire({
          icon: "error",
          title: "Oops...",
          text: errorMsg,
        });
      }
    } catch (err) {
      console.error(err);
      await Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Terjadi kesalahan saat mengupdate berita",
      });
    }
  };

  const handleClearFilters = () => {
    setSelectedCategory("Semua");
    setSelectedStatus("Semua");
    setSearchQuery("");
    setPage(1);
  };

  // Filter data
  const filteredData = newsData
    .filter((item) =>
      selectedCategory === "Semua" ? true : item.category === selectedCategory
    )
    .filter((item) =>
      selectedStatus === "Semua" ? true : item.status === selectedStatus
    )
    .filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.sub &&
          item.sub.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.content &&
          item.content.toLowerCase().includes(searchQuery.toLowerCase()))
    );

  const totalPages = Math.ceil(filteredData.length / perPage);
  const paginatedData = filteredData.slice(
    (page - 1) * perPage,
    page * perPage
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
            />
            <div className="absolute top-3 left-3 flex gap-2">
              <span
                className={`px-2 py-1 text-xs font-semibold rounded-full backdrop-blur-sm
                  ${
                    item.status === "published"
                      ? "bg-green-500/20 text-green-800 border border-green-300"
                      : "bg-yellow-500/20 text-yellow-800 border border-yellow-300"
                  }`}
              >
                {item.status === "draft" ? "Draft" : "Published"}
              </span>
              <span className="bg-blue-500/20 text-blue-800 px-2 py-1 text-xs font-semibold rounded-full backdrop-blur-sm border border-blue-300">
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
              <div className="text-gray-600 text-sm mb-3 line-clamp-2 font-medium">
                <span
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(item.sub),
                  }}
                />
              </div>
            )}

            <div className="text-gray-500 text-sm mb-4 line-clamp-3 flex-1">
              <span
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(item.content || ""),
                }}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-gray-400 mb-4 pt-3 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <FiUser className="w-3 h-3" />
                <span>{item.user?.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiCalendar className="w-3 h-3" />
                <span>{item.created_at}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-400">
                <FiEye className="w-4 h-4" />
                <span className="text-sm font-medium">{item.views} views</span>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  to={`/admin/news/edit/${item.id}`}
                  className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <FiEdit className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
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
                src={item.image}
                alt={item.title}
                className="w-full h-32 md:h-full object-cover"
              />
              <div className="absolute top-2 left-2 flex gap-1 flex-wrap">
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full backdrop-blur-sm
                    ${
                      item.status === "published"
                        ? "bg-green-500/20 text-green-800 border border-green-300"
                        : "bg-yellow-500/20 text-yellow-800 border border-yellow-300"
                    }`}
                >
                  {item.status === "draft" ? "Draft" : "Published"}
                </span>
                <span className="bg-blue-500/20 text-blue-800 px-2 py-1 text-xs font-semibold rounded-full backdrop-blur-sm border border-blue-300">
                  {categories.find((cat) => cat.value === item.category)
                    ?.label || item.category}
                </span>
              </div>
            </div>

            <div className="md:w-3/4 p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                  {item.title}
                </h3>

                {item.sub && (
                  <div className="text-gray-600 text-sm mb-3 line-clamp-2 font-medium">
                    <span
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(item.sub),
                      }}
                    />
                  </div>
                )}

                <div className="text-gray-500 text-sm mb-4 line-clamp-2">
                  <span
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(item.content || ""),
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6 text-xs text-gray-400">
                  <div className="flex items-center gap-1">
                    <FiUser className="w-3 h-3" />
                    <span>{item.user?.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FiCalendar className="w-3 h-3" />
                    <span>{item.created_at}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FiEye className="w-3 h-3" />
                    <span>{item.views} views</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    to={`/admin/news/edit/${item.id}`}
                    className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <FiEdit className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
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

  return (
  <div className="w-full bg-[#CCD4DF] dark:bg-[#252e4b] p-8 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-[#ECEEF0]">
            Kelola Berita
          </h1>
          <p className="text-gray-600 mt-1">
            Tambah, edit, dan kelola berita RPL
          </p>
        </div>
        <Link
          to={"/admin/news/add"}
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
                className="px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700 flex items-center gap-2"
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
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <FiGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "list"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <FiList className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Results Info */}
  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-[#323954]">
          <div className="text-sm text-gray-600">
            Menampilkan{" "}
            <span className="font-semibold">{paginatedData.length}</span> dari{" "}
            <span className="font-semibold">{filteredData.length}</span> berita
            {(selectedCategory !== "Semua" ||
              selectedStatus !== "Semua" ||
              searchQuery) && (
              <span className="text-blue-600 ml-1">(filtered)</span>
            )}
          </div>
          {filteredData.length === 0 && (
            <div className="text-sm text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
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
            Coba ubah filter pencarian atau tambah berita baru
          </p>
          <button
            onClick={handleClearFilters}
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
          >
            Clear semua filter
          </button>
        </div>
      ) : (
        <>
          {viewMode === "grid" ? renderGridView() : renderListView()}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          )}
        </>
      )}

      {/* Modal Edit */}
      <Modal
        isOpen={openEdit}
        onOpenChange={setOpenEdit}
        backdrop="blur"
        placement="center"
        size="xl"
        motionProps={{
          variants: {
            enter: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.3, ease: "easeOut" },
            },
            exit: {
              opacity: 0,
              y: -20,
              transition: { duration: 0.2, ease: "easeIn" },
            },
          },
        }}
      >
        <ModalContent className="bg-white dark:bg-[#2E3B5B] shadow-lg rounded-lg max-h-[85vh] overflow-y-auto border border-gray-100 dark:border-[#323954]">
          {(onClose) => (
            <>
              <ModalHeader className="flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-gray-100 p-4 border-b border-gray-100 dark:border-[#323954]">
                <FiEdit className="w-5 h-5 text-blue-500" />
                Edit Berita
              </ModalHeader>

              <form onSubmit={handleSubmitEdit}>
                <ModalBody className="p-4 w-full space-y-4">
                  {/* Image Preview & Upload */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      Gambar Berita
                    </label>
                    <div className="relative">
                      {editData.imagePreview ? (
                        <div className="relative rounded-lg overflow-hidden h-48 group">
                          <img
                            src={editData.imagePreview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                              type="button"
                              onClick={() =>
                                setEditData({
                                  ...editData,
                                  image: null,
                                  imagePreview: "",
                                })
                              }
                              className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                            >
                              <FiX className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-gray-300 dark:border-[#323954] rounded-lg cursor-pointer hover:border-blue-500 transition-colors bg-white dark:bg-[#232B45]">
                          <FiUpload className="w-6 h-6 text-gray-400 dark:text-gray-300 mb-2" />
                          <span className="text-sm text-gray-500 dark:text-gray-300">
                            Klik untuk upload gambar
                          </span>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                        </label>
                      )}
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                        Judul Berita
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-[#323954] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-[#232B45] text-gray-800 dark:text-[#ECEEF0]"
                        placeholder="Masukkan judul berita"
                        value={editData.title}
                        onChange={(e) =>
                          setEditData({ ...editData, title: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                        Sub Judul
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-[#323954] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-[#232B45] text-gray-800 dark:text-[#ECEEF0]"
                        placeholder="Masukkan sub judul"
                        value={editData.sub}
                        onChange={(e) =>
                          setEditData({ ...editData, sub: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                        Deskripsi
                      </label>
                      <textarea
                        className="w-full px-3 py-2 border border-gray-300 dark:border-[#323954] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-[#232B45] text-gray-800 dark:text-[#ECEEF0]"
                        placeholder="Masukkan deskripsi berita"
                        value={editData.content}
                        onChange={(e) =>
                          setEditData({ ...editData, content: e.target.value })
                        }
                        rows="4"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                        Lokasi
                      </label>
                      <textarea
                        className="w-full px-3 py-2 border border-gray-300 dark:border-[#323954] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-[#232B45] text-gray-800 dark:text-[#ECEEF0]"
                        placeholder="Masukkan lokasi"
                        value={editData.location}
                        onChange={(e) =>
                          setEditData({ ...editData, location: e.target.value })
                        }
                        rows="2"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                          Kategori
                        </label>
                        <select
                          className="w-full px-3 py-2 border border-gray-300 dark:border-[#323954] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-[#232B45] text-gray-800 dark:text-[#ECEEF0]"
                          value={editData.category}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              category: e.target.value,
                            })
                          }
                        >
                          <option value="">Pilih Kategori</option>
                          <option value="news">Berita</option>
                          <option value="competition">Kompetisi</option>
                          <option value="alumni">Alumni</option>
                          <option value="kerjasama">Kerjasama</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                          Status
                        </label>
                        <select
                          className="w-full px-3 py-2 border border-gray-300 dark:border-[#323954] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-[#232B45] text-gray-800 dark:text-[#ECEEF0]"
                          value={editData.status}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              status: e.target.value,
                            })
                          }
                        >
                          <option value="">Pilih Status</option>
                          <option value="draft">Draft</option>
                          <option value="published">Published</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </ModalBody>

                <ModalFooter className="p-4 border-t border-gray-100 dark:border-[#323954] gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-[#232B45] rounded-md hover:bg-gray-200 dark:hover:bg-[#323954] transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors"
                  >
                    Simpan Perubahan
                  </button>
                </ModalFooter>
              </form>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Berita;
