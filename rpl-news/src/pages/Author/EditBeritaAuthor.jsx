import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useNews from "../../api/hooks/useNews";
import { Editor } from "@tinymce/tinymce-react";

const EditBeritaAuthor = () => {
  const { id } = useParams(); // 
  const navigate = useNavigate();

  const { getNewsById, updateNews, actionLoading, error } = useNews();

  const [formData, setFormData] = useState({
    title: "",
    location: "",
    category: "",
    image: null,
    sub: "",
    content: "",
    status: "draft",
  });
  const [imagePreview, setImagePreview] = useState(null);

  const [isSubmitted, setIsSubmitted] = useState(false);

  // Ambil data lama buat prefill form
  useEffect(() => {
    const fetchData = async () => {
      const result = await getNewsById(id);
      if (result.success) {
        const news = result.data;
        setFormData({
          title: news.title || "",
          location: news.location || "",
          category: news.category || "",
          image: null,
          sub: news.sub || "",
          content: news.content || "",
          status: news.status || "draft",
        });
        setImagePreview(news.image_url || "");
      }
    };
    fetchData();
  }, [id, getNewsById]);

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
    setIsSubmitted(false);

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("location", formData.location);
    formDataToSend.append("category", formData.category);
    formDataToSend.append("sub", formData.sub);
    formDataToSend.append("content", formData.content);
    formDataToSend.append("status", formData.status);
    formDataToSend.append("_method", "put");

    // ✅ hanya append image kalau user pilih gambar baru
    if (formData.image instanceof File) {
      formDataToSend.append("image", formData.image);
    }

    const result = await updateNews(id, formDataToSend, true); // kasih tanda kalau pakai FormData

    if (result.success) {
      setIsSubmitted(true);
      setTimeout(() => navigate("/admin/news"), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br p-8 bg-[#272E4B]">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
                Edit Berita
              </h1>
              <p className="text-slate-300 text-base">
                Perbarui detail berita yang sudah ada.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Informasi Dasar */}
          <div className="rounded-2xl p-8 shadow-lg bg-[#323955]">
            <div className="flex items-center mb-6">
              <div className="w-4 h-4 bg-blue-500 rounded-md mr-3"></div>
              <h2 className="text-xl font-semibold text-white">
                Informasi Dasar
              </h2>
            </div>
            <div className="space-y-6">
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
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
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
                </select>
              </div>
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
            </div>
          </div>

          {/* Gambar Berita */}
          <div className="bg-[#323955] rounded-2xl p-8 shadow-lg ">
            <div className="flex items-center mb-6">
              <div className="w-4 h-4 bg-green-500 rounded-md mr-3"></div>
              <h2 className="text-xl font-semibold text-white">
                Gambar Berita
              </h2>
            </div>
            <div className="border-2 border-dashed border-blue-700 rounded-xl p-8 text-center hover:border-blue-500 transition-colors bg-slate-900/40">
              {imagePreview ? (
                <div className="space-y-4">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-32 h-32 mx-auto object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, image: null }));
                      setImagePreview(null);
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

          {/* Deskripsi & Konten */}
          <div className="bg-[#323955] rounded-2xl p-8 shadow-lg ">
            <div className="flex items-center mb-6">
              <div className="w-4 h-4 bg-purple-500 rounded-md mr-3"></div>
              <h2 className="text-xl font-semibold text-white">Konten</h2>
            </div>
            <div className="space-y-6">
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
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Konten Berita <span className="text-red-400">*</span>
                </label>
                <Editor
                  value={formData.content}
                  onEditorChange={(content) =>
                    setFormData((prev) => ({ ...prev, content }))
                  }
                  apiKey="jmrh98xg19rj2c10p2xrlk0kjoq88z5o7iovujw9e2thixsl"
                  init={{
                    plugins: [
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
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  className="px-6 py-2 bg-slate-600 text-slate-300 rounded-lg hover:bg-slate-500 transition-colors"
                  onClick={() => navigate(-1)}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {actionLoading ? "Menyimpan..." : "Update Berita"}
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Pesan status */}
        {isSubmitted && (
          <div className="fixed bottom-8 right-8 bg-green-600 text-white px-8 py-5 rounded-xl shadow-2xl z-50 border-2 border-green-700 animate-bounceIn">
            <div className="flex items-center">
              <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center mr-4">
                <span className="text-green-600 text-lg font-bold">✓</span>
              </div>
              <span className="text-base font-semibold">
                Berita berhasil diperbarui!
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
                {error.response?.data?.message || error.message}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditBeritaAuthor;
