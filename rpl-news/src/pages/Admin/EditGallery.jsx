import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useGallery from "../../api/hooks/useGallery";

const EditGallery = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { show, updateGallery, actionLoading, error } = useGallery();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const result = await show(id);
      if (result.success) {
        const g = result.data;
        setFormData({
          title: g.title || "",
          description: g.description || "",
          image: null,
        });
        setImagePreview(g.image_url || "");
      }
    };
    fetchData();
  }, [id, show]);

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

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("_method", "put");

    if (formData.image instanceof File) {
      formDataToSend.append("image", formData.image);
    }

    const result = await updateGallery(id, formDataToSend, true);

    if (result.success) {
      navigate("/admin/gallery");
    }
  };

  return (
    <div className="min-h-screen p-8 bg-[#272E4B]">
      <div className="max-w-3xl mx-auto bg-[#323955] p-8 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold text-white mb-6">Edit Gallery</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm text-slate-300 mb-2">Judul</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white"
              placeholder="Masukkan judul gallery"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-2">Deskripsi</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white"
              placeholder="Masukkan deskripsi"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-2">Gambar</label>
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-40 h-40 object-cover rounded-lg mb-3"
              />
            )}
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="block text-slate-300"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2 bg-slate-600 text-slate-300 rounded-lg hover:bg-slate-500"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {actionLoading ? "Menyimpan..." : "Update"}
            </button>
          </div>
        </form>
        {error && (
          <p className="text-red-400 mt-4">
            Terjadi kesalahan: {error.response?.data?.message || error.message}
          </p>
        )}
      </div>
    </div>
  );
};

export default EditGallery;
