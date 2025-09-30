import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useGallery from "../../api/hooks/useGallery";

const AddGallery = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();
  const { addGallery, actionLoading, error } = useGallery();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files && files[0]) {
      setFormData((prev) => ({ ...prev, image: files[0] }));
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(files[0]);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Anda harus login terlebih dahulu");
      return;
    }
    const fd = new FormData();
  fd.append("title", formData.title);
  // Hilangkan tag HTML dari deskripsi
  const plainDescription = formData.description.replace(/<[^>]+>/g, "");
  fd.append("description", plainDescription);
  if (formData.image) fd.append("image", formData.image);
    const result = await addGallery(fd);
    if (result?.success) {
      setIsSubmitted(true);
      setTimeout(() => navigate("/admin/galleryAdmin"), 1200);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#272E4B] to-[#1e2238] p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
            Tambah Gallery Baru
          </h1>
          <p className="text-slate-300 text-base">
            Masukkan detail gambar untuk ditambahkan ke galeri RPL
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-10">
            {/* Basic Info */}
            <div className="bg-[#323955] rounded-2xl p-8 shadow-lg">
              <div className="flex items-center mb-6">
                <div className="w-4 h-4 bg-blue-500 rounded-md mr-3"></div>
                <h2 className="text-xl font-semibold text-white">
                  Informasi Gambar
                </h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Judul <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                    placeholder="Masukkan judul gallery"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Deskripsi
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors resize-none"
                    placeholder="Tambahkan deskripsi singkat gambar"
                  />
                </div>
              </div>
            </div>

            {/* Upload */}
            <div className="bg-[#323955] rounded-2xl p-8 shadow-lg">
              <div className="flex items-center mb-6">
                <div className="w-4 h-4 bg-green-500 rounded-md mr-3"></div>
                <h2 className="text-xl font-semibold text-white">
                  Upload Gambar
                </h2>
              </div>

              <div className="border-2 border-dashed border-blue-700 rounded-xl p-8 text-center hover:border-blue-500 transition-colors bg-slate-900/40">
                {imagePreview ? (
                  <div className="space-y-4">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-40 h-40 object-cover rounded-lg mx-auto border border-slate-600"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, image: null }));
                        setImagePreview(null);
                        const fileInput = document.getElementById("image");
                        if (fileInput) fileInput.value = "";
                      }}
                      className="text-red-400 text-sm hover:text-red-300"
                    >
                      ✕ Hapus gambar
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="w-24 h-24 mx-auto bg-orange-100 rounded-lg flex items-center justify-center">
                      <span className="text-4xl">🖼️</span>
                    </div>
                    <p className="text-slate-300 text-sm mb-2">
                      Klik untuk mengganti gambar atau drag file ke sini
                    </p>
                    <input
                      type="file"
                      id="image"
                      name="image"
                      accept="image/*"
                      onChange={handleChange}
                      className="hidden"
                      required
                    />
                    <label
                      htmlFor="image"
                      className="inline-block px-4 py-2 bg-slate-700 text-slate-300 rounded-lg text-sm hover:bg-slate-600 cursor-pointer transition-colors"
                    >
                      Upload Gambar
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Action */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => navigate("/admin/GalleryAdmin")}
                className="px-6 py-2 bg-slate-600 text-slate-300 rounded-lg hover:bg-slate-500 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={actionLoading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionLoading ? "Menyimpan..." : "Simpan Gallery"}
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-800 rounded-2xl p-8 shadow-lg border border-slate-700">
              <div className="flex items-center mb-6">
                <div className="w-4 h-4 bg-yellow-500 rounded-md mr-3"></div>
                <h2 className="text-xl font-semibold text-white">
                  Panduan Upload
                </h2>
              </div>
              <ul className="space-y-3 text-sm text-slate-300">
                <li>Gunakan gambar dengan kualitas baik</li>
                <li>Tambahkan judul yang jelas</li>
                <li>Deskripsi opsional untuk memberi konteks</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Success / Error */}
        {isSubmitted && (
          <div className="fixed bottom-8 right-8 bg-green-600 text-white px-8 py-5 rounded-xl shadow-2xl z-50 border-2 border-green-700 animate-bounceIn">
            <div className="flex items-center">
              <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center mr-4">
                <span className="text-green-600 text-lg font-bold">✓</span>
              </div>
              <span className="text-base font-semibold">
                Gambar berhasil ditambahkan!
              </span>
            </div>
          </div>
        )}

        {error && (
          <div className="fixed bottom-8 right-8 bg-red-600 text-white px-8 py-5 rounded-xl shadow-2xl z-50 border-2 border-red-700 animate-bounceIn">
            <div className="flex items-center">
              <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center mr-4">
                <span className="text-red-600 text-lg font-bold">✕</span>
              </div>
              <span className="text-base font-semibold">
                Terjadi kesalahan: {error.message || "Gagal menyimpan gallery"}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddGallery;
