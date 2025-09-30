import React, { useEffect, useState } from 'react';
import { useAuthorNews } from '../../api/hooks/useNews'; // pastikan deleteNews di-import
import { useAuth } from '../../api/hooks/useAuth';
import Swal from 'sweetalert2';
import { FiFileText, FiEye } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import MoonLoader from "react-spinners/MoonLoader";

const AuthorDashboard = () => {
  const { getUser } = useAuth();
  const [author, setAuthor] = useState({ name: '', email: '', profile_image: '', id: null });
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deletingId, setDeletingId] = useState(null); // track ID yg sedang dihapus

  useEffect(() => {
    const fetchAuthor = async () => {
      const res = await getUser();
      if (res && res.success && res.data) {
        setAuthor({
          id: res.data.id,
          name: res.data.name || '',
          email: res.data.email || '',
          profile_image: res.data.profile_image || '',
        });
      }
    };
    fetchAuthor();
  }, [getUser]);

  const { newsData, loading, error, refetch } = useAuthorNews(author.id);
  
  // Statistik langsung dari newsData
  const stats = {
    totalNews: newsData?.length || 0,
    totalViews: newsData?.reduce((acc, n) => acc + (n.views || 0), 0) || 0,
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    const res = await deleteNews(id); 
    if (res.success) {
      Swal.fire('Berhasil', 'Berita dihapus', 'success');
      refetch();
    } else {
      Swal.fire('Gagal', res.error || 'Gagal hapus berita', 'error');
    }
    setDeletingId(null);
  };

  return (
    <div className="bg-white h-full dark:bg-[#252E4B] ">
      <div className="w-full overflow-auto">
        {/* Header */}
        <div className="bg-white dark:bg-[#2C3560] shadow-sm px-8 py-4 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Dashboard Author</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Selamat datang {author?.name}</p>
            </div>
            <div className="flex items-center space-x-3">
              <img
                src={author?.profile_image ? author.profile_image : `https://ui-avatars.com/api/?name=${encodeURIComponent(author?.name || 'Author')}&background=0D8ABC&color=fff`}
                alt={author?.name}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-medium text-gray-800 dark:text-gray-100">{author?.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{author?.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 mt-8 space-y-10">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-[#2E3B5B] rounded-xl shadow-md p-6 border border-blue-100 dark:border-blue-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Berita</p>
                  <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mt-1">{stats.totalNews}</h3>
                </div>
                <div className="bg-blue-100 dark:bg-blue-500/30 p-3 rounded-full">
                  <FiFileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-[#2E3B5B] rounded-xl shadow-md p-6 border border-green-100 dark:border-green-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Views</p>
                  <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mt-1">{stats.totalViews}</h3>
                </div>
                <div className="bg-green-100 dark:bg-green-500/30 p-3 rounded-full">
                  <FiEye className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </div>
          </div>

          {/* News Table or Hero UI */}
          <div className="bg-white dark:bg-[#2E3B5B] rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Berita Saya</h2>
              <Link to={'news/add-author'}
                className="px-5 py-2 text-sm font-medium text-white dark:bg-[#5A77DF] bg-blue-600 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600"
                onClick={() => { setEditData(null); setShowForm(true); }}
              >
                Tambah Berita
              </Link>
            </div>
            
            {loading ? (
              <div className="flex flex-col items-center py-10">
                <MoonLoader color="#3B82F6" size={40} />
                <span className="mt-3 text-gray-500 dark:text-gray-400">Memuat data...</span>
              </div>
            ) : newsData && newsData.length === 0 ? (
              // Hero UI untuk data kosong
              <div className="text-center py-20">
                <div className="flex justify-center mb-4">
                  <FiFileText className="w-20 h-20 text-blue-400 opacity-75" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-2">Belum ada berita yang kamu buat.</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">Ayo mulai tulis berita pertamamu sekarang!</p>
                <button
                  className="px-6 py-3 text-sm font-medium text-white bg-blue-600 dark:bg-[#5A77DF] rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                  onClick={() => { setEditData(null); setShowForm(true); }}
                >
                  Buat Berita Baru
                </button>
              </div>
            ) : (
              // Tampilan tabel jika ada data
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-[#3B4672]">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-200 uppercase">Judul</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-200 uppercase">Tanggal</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-200 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-200 uppercase">Views</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-200 uppercase">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-[#1E253A] divide-y divide-gray-200 dark:divide-gray-600">
                    {newsData.map((n) => (
                      <tr key={n.id} className="hover:bg-gray-50 dark:hover:bg-[#2C3560]">
                        <td className="px-6 py-4 text-gray-800 dark:text-gray-100">{n.title}</td>
                        <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{n.created_at}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 inline-flex text-xs font-semibold rounded-full 
                            ${n.status === 'published'
                                ? 'bg-green-100 text-green-800 dark:bg-green-500/30 dark:text-green-300'
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/30 dark:text-yellow-300'
                              }`}>
                            {n.status === 'published' ? 'Sudah Diapprove' : 'Menunggu/Rejected'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">{n.views}</td>
                        <td className="px-6 py-4 flex gap-2">
                          <button
                            className="px-3 py-1 text-xs bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                            onClick={() => { setEditData(n); setShowForm(true); }}
                          >
                            Edit
                          </button>
                          <button
                            className="px-3 py-1 text-xs bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center"
                            onClick={() => handleDelete(n.id)}
                            disabled={deletingId === n.id}
                          >
                            {deletingId === n.id ? (
                              <MoonLoader color="#fff" size={15} />
                            ) : (
                              "Hapus"
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {showForm && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-[#232B45] rounded-lg shadow-lg p-8 w-full max-w-lg">
                <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">{editData ? 'Edit Berita' : 'Tambah Berita'}</h2>
                <button className="mt-6 px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-100 rounded" onClick={() => setShowForm(false)}>Tutup</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthorDashboard;
