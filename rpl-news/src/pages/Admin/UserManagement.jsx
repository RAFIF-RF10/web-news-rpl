import React, { useEffect, useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useAuth } from "../../api/hooks/useAuth";
import Swal from "sweetalert2";
import { FiEdit, FiTrash2, FiUserPlus, FiX } from "react-icons/fi";

const UserManagement = () => {
  const { getAllUsers, register, updateProfile, deleteUser, actionLoading, user } =
    useAuth();
  const [users, setUsers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "author",
    profile_image: null,
  });
  const [selectedId, setSelectedId] = useState(null);
  const [previewImg, setPreviewImg] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const result = await getAllUsers();
    if (result.success) setUsers(result.data);
  };

  const handleOpenModal = (edit = false, userData = null) => {
    setEditMode(edit);
    setModalOpen(true);
    if (edit && userData) {
      setForm({
        name: userData.name,
        email: userData.email,
        password: "",
        role: userData.role,
        profile_image: null,
      });
      setSelectedId(userData.id);
      setPreviewImg(userData.profile_image || "");
    } else {
      setForm({
        name: "",
        email: "",
        password: "",
        role: "author",
        profile_image: null,
      });
      setSelectedId(null);
      setPreviewImg("");
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profile_image" && files && files[0]) {
      setForm((prev) => ({ ...prev, profile_image: files[0] }));
      setPreviewImg(URL.createObjectURL(files[0]));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === "profile_image") {
        if (value) formData.append("profile_image", value);
      } else {
        // password opsional saat edit
        if (editMode && key === "password" && !value) return;
        formData.append(key, value);
      }
    });

    if (editMode) {
      const result = await updateProfile(selectedId, formData);
      if (result.success) {
        Swal.fire("Berhasil", "User diperbarui", "success");
        fetchUsers();
        setModalOpen(false);
      } else {
        Swal.fire("Gagal", result.error || "Gagal update user", "error");
      }
    } else {
      const result = await register(formData);
      if (result.success) {
        Swal.fire("Berhasil", "User ditambahkan", "success");
        fetchUsers();
        setModalOpen(false);
      } else {
        Swal.fire("Gagal", result.error || "Gagal tambah user", "error");
      }
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Hapus User?",
      text: "Data user akan dihapus permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await deleteUser(id);
        if (res.success) {
          Swal.fire("Berhasil", "User dihapus", "success");
          fetchUsers();
        } else {
          Swal.fire("Gagal", res.error || "Gagal hapus user", "error");
        }
      }
    });
  };

  return (
    <div className="h-full w-full bg-[#ECEEF0] dark:bg-[#252e4b] py-12 px-2 md:px-6 transition-colors duration-300">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white ">
          Kelola User
        </h1>
        <button
          onClick={() => handleOpenModal(false)}
          className="flex items-center gap-2 px-4 py-2 bg-[#3D53A0] dark:bg-[#5A77DF] text-white rounded-lg shadow hover:bg-[#5A77DF] dark:hover:bg-[#3D53A0] transition"
        >
          <FiUserPlus className="w-5 h-5" />
          Tambah User
        </button>
      </div>

      {/* Card Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {users.map((u) => (
          <div
            key={u.id}
            className="bg-white dark:bg-[#0B1220] rounded-xl shadow p-6 flex flex-col items-center"
          >
            <img
              src={u.profile_image || "/default-avatar.png"}
              alt={u.name}
              className="w-20 h-20 rounded-full object-cover border"
            />
            <h2 className="mt-3 font-bold text-lg text-gray-800 dark:text-gray-200">
              {u.name}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{u.email}</p>
            <span
              className={`mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
                u.role === "admin"
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                  : "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
              }`}
            >
              {u.role}
            </span>

            {/* Tombol aksi */}
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => handleOpenModal(true, u)}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-lg transition"
              >
                <FiEdit /> Edit
              </button>
              {u.id !== user?.id && (
                <button
                  onClick={() => handleDelete(u.id)}
                  className="flex items-center gap-1 px-3 py-1 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition"
                >
                  <FiTrash2 /> Hapus
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal pakai HeadlessUI */}
      <Transition appear show={modalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setModalOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40" />
          </Transition.Child>

          <div className="fixed inset-0 flex items-center justify-center p-2">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="bg-white dark:bg-[#081030] rounded-xl shadow-2xl p-6 md:p-10 w-full max-w-2xl border border-[#CCD4DF] dark:border-[#323954]">
                <div className="flex justify-between items-center mb-4">
                  <Dialog.Title className="text-xl md:text-2xl font-bold text-[#3D53A0] dark:text-[#5A77DF]">
                    {editMode ? "Edit User" : "Tambah User"}
                  </Dialog.Title>
                  <button onClick={() => setModalOpen(false)}>
                    <FiX className="w-6 h-6 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium mb-1">Nama</label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#3D53A0] dark:bg-[#323954] dark:text-white"
                        required
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium mb-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#3D53A0] dark:bg-[#323954] dark:text-white"
                        required
                      />
                    </div>
                  </div>

                  {/* Password opsional saat edit */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Password {editMode && "(kosongkan jika tidak diganti)"}
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#3D53A0] dark:bg-[#323954] dark:text-white"
                      required={!editMode}
                    />
                  </div>

                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium mb-1">Role</label>
                      <select
                        name="role"
                        value={form.role}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#3D53A0] dark:bg-[#323954] dark:text-white"
                      >
                        <option value="admin">Admin</option>
                        <option value="author">Author</option>
                      </select>
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium mb-1">Foto Profil</label>
                      <input
                        type="file"
                        name="profile_image"
                        accept="image/*"
                        onChange={handleChange}
                        className="w-full dark:bg-[#323954] dark:text-white"
                      />
                      {previewImg && (
                        <img
                          src={previewImg}
                          alt="Preview"
                          className="mt-3 w-14 h-14 rounded-full object-cover border mx-auto"
                        />
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setModalOpen(false)}
                      className="px-4 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-[#323954]"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={actionLoading}
                      className="px-4 py-2 bg-[#3D53A0] dark:bg-[#5A77DF] text-white rounded-lg hover:bg-[#5A77DF]"
                    >
                      {actionLoading ? "Menyimpan..." : "Simpan"}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default UserManagement;
