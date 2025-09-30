import React, { useState } from "react";
import {
  FiSearch,
  FiPlus,
  FiImage,
  FiEdit2,
  FiTrash2,
  FiEdit,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import useGallery from "../../api/hooks/useGallery";
import { Skeleton } from "@heroui/skeleton";
import { Card } from "@heroui/card";
import Swal from "sweetalert2";

const GalleryAdmin = () => {
  const {
    galleryData,
    loading,
    error,
    refetch,
    deleteGallery,
  } = useGallery();
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // filter pencarian
  const filteredGallery = galleryData.filter(
    (item) =>
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // delete pakai SweetAlert2
  const handleDelete = async (id, title) => {
    const result = await Swal.fire({
      title: "Hapus Gallery?",
      text: `Yakin ingin menghapus "${title}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
      background: "#ffffff",
      color: "#08112F",
    });

    if (result.isConfirmed) {
      await deleteGallery(id);
      Swal.fire("Dihapus!", "Gallery berhasil dihapus.", "success");
    }
  };

  return (
    <div className="min-h-screen bg-[#ECEEF0] dark:bg-[#252e4b] py-8 text-[#323954] dark:text-[#ECEEF0]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Gallery Management</h1>
            <p className="text-[#3E53A0] dark:text-[#CCD4DE]">
              Kelola semua gambar dan konten gallery Anda.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/admin/gallery/add")}
            className="flex items-center gap-2 px-5 py-2.5 
                       bg-[#5A77DF] 
                       text-white rounded-lg font-medium shadow 
                       hover:opacity-90 transition"
          >
            <FiPlus className="w-5 h-5" />
            Tambah Gallery
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#CCD4DE]" />
          <input
            type="text"
            placeholder="Cari gambar di gallery..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-[#5A77DF]
                       bg-white dark:bg-[#323954] 
                       border-[#CCD4DE] dark:border-[#3E53A0]
                       text-[#323954] dark:text-[#ECEEF0] 
                       placeholder:text-[#CCD4DE]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            Array.from({ length: 8 }).map((_, idx) => (
              <Card
                key={idx}
                className="p-4 space-y-4 bg-white dark:bg-[#323954] 
                           border border-[#CCD4DE] dark:border-[#3E53A0]"
              >
                <Skeleton className="h-40 w-full rounded-lg" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </Card>
            ))
          ) : error ? (
            <div className="col-span-full flex flex-col items-center justify-center text-red-600 space-y-2">
              <span>Gagal memuat gallery: {error.message}</span>
              <button
                onClick={refetch}
                className="text-sm underline hover:text-red-700"
              >
                Coba lagi
              </button>
            </div>
          ) : filteredGallery.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-[#CCD4DE] space-y-2">
              <FiImage className="w-12 h-12" />
              <p>Tidak ada gambar ditemukan</p>
            </div>
          ) : (
            filteredGallery.map((item) => (
              <Card
                key={item.id}
                className="overflow-hidden rounded-xl 
                           bg-white dark:bg-[#1E253A] 
                           border border-[#CCD4DE] dark:border-[#3E53A0] 
                           shadow hover:shadow-lg transition flex flex-col"
              >
                {/* Gambar */}
                <div className="relative">
                  <img
                    src={item.image_url || item.image}
                    alt={item.title}
                    className="w-full h-40 object-cover"
                  />
                </div>

                {/* Isi Card */}
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="font-bold text-[#323954] dark:text-white text-lg mb-1 line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#3E53A0] dark:text-[#CBD5E1] mb-3 line-clamp-2">
                    {item.description}
                  </p>

                  {/* Footer */}
                  <div className="mt-auto border-t border-gray-300 dark:border-gray-600 pt-3 flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {item.created_at || item.date}
                    </span>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        className="text-blue-500 hover:text-blue-600"
                        onClick={() =>
                          navigate(`/admin/gallery/edit/${item.id}`)
                        }
                      >
                        <FiEdit className="w-5 h-5" />
                      </button>
                      <button
                        type="button"
                        className="text-red-500 hover:text-red-600"
                        onClick={() => handleDelete(item.id, item.title)}
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default GalleryAdmin;
