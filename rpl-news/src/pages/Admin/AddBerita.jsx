import React, { useState } from "react";
import useNews from "../../api/hooks/useNews";
import { Editor } from "@tinymce/tinymce-react";

const AddBerita = () => {
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    category: "",
    image: null,
    sub: "",
    content: "",
    status: "draft",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { createNews, actionLoading, error } = useNews();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(false);
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Token tidak ditemukan. Silakan login ulang.");
      return;
    }
    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("location", formData.location);
    formDataToSend.append("category", formData.category);
    formDataToSend.append("sub", formData.sub);
    formDataToSend.append("content", formData.content);
    formDataToSend.append("status", formData.status || "draft");

    if (formData.image) {
      formDataToSend.append("image", formData.image);
    }

    const result = await createNews(formDataToSend);

    if (result.success) {
      setIsSubmitted(true);
      setFormData({
        title: "",
        location: "",
        category: "",
        image: null,
        sub: "",
        content: "",
        status: "draft",
      });
      const fileInput = document.getElementById("image");
      if (fileInput) {
        fileInput.value = "";
      }

      setTimeout(() => setIsSubmitted(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br p-8 bg-[#272E4B]">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
                Buat Berita Baru
              </h1>
              <p className="text-slate-300 text-base">
                Bagikan informasi terbaru untuk komunitas RPL SMKN 8 Jember
              </p>
            </div>
            {/* <button className="px-5 py-2 bg-blue-700 text-white rounded-lg text-sm font-semibold shadow hover:bg-blue-800 transition-colors">
              Preview
            </button> */}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Column - Form */}
          <div className="lg:col-span-2 space-y-10">
            {/* Basic Information */}
            <div className=" rounded-2xl p-8 shadow-lg bg-[#323955]">
              <div className="flex items-center mb-6">
                <div className="w-4 h-4 bg-blue-500 rounded-md mr-3"></div>
                <h2 className="text-xl font-semibold text-white">
                  Informasi Dasar
                </h2>
              </div>

              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Judul Berita <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                    placeholder="Masukkan judul berita"
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Kategori <span className="text-red-400">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                    required
                  >
                    <option value="">Pilih Kategori</option>
                    <option value="news">Berita</option>
                    <option value="competition">Kompetisi</option>
                    <option value="alumni">Alumni</option>
                    <option value="kerjasama">Kerjasama</option>
                  </select>
                  <p className="text-xs text-slate-400 mt-2">
                    Asal dapat mengikuti kategori baru atau menarik segi artikel
                    yang tersedia
                  </p>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Lokasi <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                    placeholder="Contoh: Jakarta, Indonesia"
                    required
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Status <span className="text-red-400">*</span>
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                    required
                  >
                    <option value="">Pilih Status</option>
                    <option value="draft">Draft</option>
                    <option value="published">Publish</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div className="bg-[#323955] rounded-2xl p-8 shadow-lg ">
              <div className="flex items-center mb-6">
                <div className="w-4 h-4 bg-green-500 rounded-md mr-3"></div>
                <h2 className="text-xl font-semibold text-white">
                  Gambar Berita
                </h2>
              </div>

              <div className="border-2 border-dashed border-blue-700 rounded-xl p-8 text-center hover:border-blue-500 transition-colors bg-slate-900/40">
                {formData.image ? (
                  <div className="space-y-4">
                    <div className="w-24 h-24 mx-auto bg-slate-700 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">🖼️</span>
                    </div>
                    <p className="text-slate-300 text-sm">
                      File terpilih:{" "}
                      <span className="font-semibold">
                        {formData.image.name}
                      </span>
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, image: null }));
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
                      <span className="text-4xl">🍦</span>
                    </div>
                    <div>
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
                      />
                      <label
                        htmlFor="image"
                        className="inline-block px-4 py-2 bg-slate-700 text-slate-300 rounded-lg text-sm hover:bg-slate-600 cursor-pointer transition-colors"
                      >
                        Upload Gambar (Drag & Drop atau Klik)
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="bg-[#323955] rounded-2xl p-8 shadow-lg ">
              <div className="flex items-center mb-6">
                <div className="w-4 h-4 bg-purple-500 rounded-md mr-3"></div>
                <h2 className="text-xl font-semibold text-white">Konten</h2>
              </div>

              <div className="space-y-6">
                {/* Sub title */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Deskripsi Berita <span className="text-red-400">*</span>
                  </label>
                  <Editor
                    apiKey="jmrh98xg19rj2c10p2xrlk0kjoq88z5o7iovujw9e2thixsl"
                    value={formData.sub}
                    onEditorChange={(content) =>
                      setFormData((prev) => ({ ...prev, sub: content }))
                    }
                    init={{
                      menubar: false,
                      plugins: [
                        "lists link image charmap preview anchor",
                        "searchreplace visualblocks code fullscreen",
                        "insertdatetime media table code help wordcount",
                      ],
                      toolbar:
                        "undo redo | formatselect | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help",
                      skin: "oxide-dark",
                      content_css: "dark",
                      height: 200,
                    }}
                  />
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-xs text-slate-400">
                      Tulis deskripsi yang informatif dan menarik.
                    </p>
                  </div>
                </div>

                {/* Content with rich text editor style */}
                {/* <div>
                  <div className="bg-slate-700 border border-slate-600 rounded-lg overflow-hidden">
                    <div className="flex items-center gap-1 p-3 border-b border-slate-600 bg-slate-750">
                      <button
                        type="button"
                        className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-600 text-slate-300"
                      >
                        <span className="text-sm font-bold">B</span>
                      </button>
                      <button
                        type="button"
                        className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-600 text-slate-300"
                      >
                        <span className="text-sm italic">I</span>
                      </button>
                      <button
                        type="button"
                        className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-600 text-slate-300"
                      >
                        <span className="text-sm underline">U</span>
                      </button>
                      <div className="w-px h-6 bg-slate-600 mx-1"></div>
                      <button
                        type="button"
                        className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-600 text-slate-300"
                      >
                        <span className="text-xs">H1</span>
                      </button>
                      <button
                        type="button"
                        className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-600 text-slate-300"
                      >
                        <span className="text-xs">H2</span>
                      </button>
                      <div className="w-px h-6 bg-slate-600 mx-1"></div>
                      <button
                        type="button"
                        className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-600 text-slate-300"
                      >
                        <span className="text-sm">🔗</span>
                      </button>
                      <button
                        type="button"
                        className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-600 text-slate-300"
                      >
                        <span className="text-sm">📋</span>
                      </button>
                      <div className="ml-auto">
                        <select className="bg-slate-600 text-slate-300 text-xs px-2 py-1 rounded border-none outline-none">
                          <option>Styles</option>
                        </select>
                      </div>
                    </div>

                    <textarea
                      name="content"
                      value={formData.content}
                      onChange={handleChange}
                      rows={12}
                      className="w-full bg-transparent border-none px-4 py-3 text-white placeholder-slate-400 focus:outline-none resize-none"
                      placeholder="Tuliskan konten berita lengkap di sini"
                      required
                    />
                  </div>
                </div> */}
                <Editor
                  value={formData.content}
                  onEditorChange={(content) => setFormData((prev) => ({ ...prev, content }))}
                  apiKey="jmrh98xg19rj2c10p2xrlk0kjoq88z5o7iovujw9e2thixsl"
                  init={{
                    plugins: [
                      // Core editing features
                      "anchor",
                      "autolink",
                      "charmap",
                      "codesample",
                      "emoticons",
                      "link",
                      "lists",
                      "media",
                      "searchreplace",
                      "table",
                      "visualblocks",
                      "wordcount",
                      // Your account includes a free trial of TinyMCE premium features
                      // Try the most popular premium features until Sep 28, 2025:
                      "checklist",
                      "mediaembed",
                      "casechange",
                      "formatpainter",
                      "pageembed",
                      "a11ychecker",
                      "tinymcespellchecker",
                      "permanentpen",
                      "powerpaste",
                      "advtable",
                      "advcode",
                      "advtemplate",
                      "ai",
                      "uploadcare",
                      "mentions",
                      "tinycomments",
                      "tableofcontents",
                      "footnotes",
                      "mergetags",
                      "autocorrect",
                      "typography",
                      "inlinecss",
                      "markdown",
                      "importword",
                      "exportword",
                      "exportpdf",
                    ],
                    toolbar:
                      "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography uploadcare | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
                    tinycomments_mode: "embedded",
                    tinycomments_author: "Author name",
                    mergetags_list: [
                      { value: "First.Name", title: "First Name" },
                      { value: "Email", title: "Email" },
                    ],
                    ai_request: (request, respondWith) =>
                      respondWith.string(() =>
                        Promise.reject("See docs to implement AI Assistant")
                      ),
                    uploadcare_public_key: "9dc9499ff020020d0b67",
                  }}
                  initialValue="Welcome to TinyMCE!"
                />
                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
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
                    {actionLoading
                      ? "Mengirim ke API..."
                      : "Publikasikan Berita"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Info Panel */}
          <div className="space-y-6">
            {/* Publication Info */}
            <div className="bg-slate-800 rounded-2xl p-8 shadow-lg border border-slate-700">
              <div className="flex items-center mb-6">
                <div className="w-4 h-4 bg-blue-500 rounded-md mr-3"></div>
                <h2 className="text-xl font-semibold text-white">
                  Info Publikasi
                </h2>
              </div>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Status:</span>
                  <span className="text-green-400 bg-green-900/30 px-2 py-1 rounded text-xs">
                    {formData.status === "published" ? "Published" : "Draft"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Tanggal:</span>
                  <span className="text-slate-300">6 September 2024</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Penulis:</span>
                  <span className="text-slate-300">Admin TKR</span>
                </div>
              </div>
            </div>

            {/* Guidelines */}
            <div className="bg-slate-800 rounded-2xl p-8 shadow-lg border border-slate-700">
              <div className="flex items-center mb-6">
                <div className="w-4 h-4 bg-yellow-500 rounded-md mr-3"></div>
                <h2 className="text-xl font-semibold text-white">
                  Panduan Penulisan
                </h2>
              </div>

              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span>Gunakan judul yang jelas dan menarik</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span>Pilih kategori yang sesuai</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span>Sertakan gambar berkualitas tinggi</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span>Tulis konten yang informatif dan mudah dibaca</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span>Gunakan preview untuk memeriksa hasil</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Success/Error Messages */}
        {isSubmitted && (
          <div className="fixed bottom-8 right-8 bg-green-600 text-white px-8 py-5 rounded-xl shadow-2xl z-50 border-2 border-green-700 animate-bounceIn">
            <div className="flex items-center">
              <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center mr-4">
                <span className="text-green-600 text-lg font-bold">✓</span>
              </div>
              <span className="text-base font-semibold">
                Berita berhasil disimpan dan dikirim!
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
                Terjadi kesalahan:{" "}
                {error.response?.data?.message ||
                  error.message ||
                  "Gagal mengirim ke API"}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddBerita;
