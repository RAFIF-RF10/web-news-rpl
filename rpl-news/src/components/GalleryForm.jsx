// GalleryForm.js
import React, { useState } from "react";

const GalleryForm = ({ initialData, onSubmit, onClose }) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);

    // Hanya tambahkan file gambar jika ada file baru yang dipilih
    if (image) {
      formData.append("image", image);
    }

    // Panggil fungsi onSubmit yang dikirim dari parent (GalleryAdmin)
    // Fungsi ini akan menerima formData yang sudah lengkap
    await onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-card rounded-xl p-6 w-full max-w-md space-y-4 shadow-xl"
      >
        <h2 className="text-xl font-semibold text-foreground">
          {initialData ? "Edit Image" : "Add New Image"}
        </h2>

        {/* Title */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:ring focus:ring-primary"
            required
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:ring focus:ring-primary"
          />
        </div>

        {/* Image */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2"
            {...(!initialData && { required: true })}
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90"
          >
            {initialData ? "Update" : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GalleryForm;
