import useGallery from '../../api/hooks/useGallery'
import useNews from '../../api/hooks/useNews'
import Swal from 'sweetalert2';
import React, { useState, useEffect } from 'react'
import { useAuth } from '../../api/hooks/useAuth';
import {
  FiEdit, FiTrash2, FiEye, FiUsers, FiFileText, FiHeart,
  FiSettings
} from 'react-icons/fi'
import { Link } from 'react-router-dom';
import { MoonLoader } from 'react-spinners';

export const Dashboard = () => {
  const { getUser } = useAuth();
  const [admin, setAdmin] = useState({ name: '', email: '', profile_image: '' });

  useEffect(() => {
    const fetchAdmin = async () => {
      const res = await getUser();
      if (res && res.success && res.data) {
        setAdmin({
          name: res.data.name || '',
          email: res.data.email || '',
          profile_image: res.data.profile_image || '',
        });
      }
    };
    fetchAdmin();
  }, [getUser]);

  // Ambil data admin (semua berita)
  const { newsData, approveNews, refetch, loading: newsLoading } = useNews(true);
  // Approve/Reject handler
  const handleApprove = async (id, status) => {
    const result = await approveNews(id, status);
    if (result.success) {
      Swal.fire('Berhasil', `Berita ${status === 'published' ? 'diapprove' : 'direject'}!`, 'success');
      refetch();
    } else {
      Swal.fire('Gagal', result.error || 'Gagal update status berita', 'error');
    }
  };

  const { galleryData, loading: galleryLoading } = useGallery();

  const stats = {
    totalNews: newsData.length,
    totalViews: newsData.reduce((acc, n) => acc + (n.views || 0), 0),
    totalEngagement: newsData.reduce((acc, n) => acc + (n.likes || 0), 0), // contoh kalau ada likes
    activeUsers: 0, // nanti bisa diganti kalau ada API
  };

  return (
    <div className="flex w-full bg-white dark:bg-[#252E4B]">
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white dark:bg-[#2C3560] shadow-sm px-8 py-4 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Dashboard Admin</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Selamat datang {admin.name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#3B4672]">
                <FiSettings className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              </button>
              <div className="flex items-center space-x-3">
                <img
                  src={admin.profile_image ? admin.profile_image : `https://ui-avatars.com/api/?name=${encodeURIComponent(admin.name || 'Admin')}&background=0D8ABC&color=fff`}
                  alt={admin.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-medium text-gray-800 dark:text-gray-100">{admin.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{admin.email}</p>
                </div>
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

            <div className="bg-white dark:bg-[#2E3B5B] rounded-xl shadow-md p-6 border border-purple-100 dark:border-purple-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Engagement</p>
                  <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mt-1">{stats.totalEngagement}</h3>
                </div>
                <div className="bg-purple-100 dark:bg-purple-500/30 p-3 rounded-full">
                  <FiHeart className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#2E3B5B] rounded-xl shadow-md p-6 border border-orange-100 dark:border-orange-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Active Users</p>
                  <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mt-1">{stats.activeUsers}</h3>
                </div>
                <div className="bg-orange-100 dark:bg-orange-500/30 p-3 rounded-full">
                  <FiUsers className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </div>
          </div>

          {/* News Table */}
          <div className="bg-white dark:bg-[#2E3B5B] rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Berita Terbaru</h2>
              <Link to="/admin/news/add"
               className="px-5 py-2 text-sm font-medium text-white dark:bg-[#5A77DF] bg-blue-600 rounded-lg hover:bg-blue-700  dark:hover:bg-blue-600">
                Tambah Berita
              </Link>
            </div>
            
            {/* Loader kalau masih loading */}
            {newsLoading ? (
              <div className="flex justify-center items-center py-10">
                <MoonLoader color="#4A90E2" size={40} />
              </div>
            ) : (
              <>
              <div className="overflow-x-auto max-h-96 overflow-y-auto border border-gray-200 dark:border-gray-600 rounded-lg">
                <table className="w-full min-w-full">
                  <thead className="bg-gray-50 dark:bg-[#3B4672] sticky top-0 z-10">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-200 uppercase">No</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-200 uppercase min-w-[200px]">Judul</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-200 uppercase">Tanggal</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-200 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-200 uppercase min-w-[150px]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-[#1E253A] divide-y divide-gray-200 dark:divide-gray-600">
                    {newsData?.map((n, index) => (
                      <tr key={n.id} className="hover:bg-gray-50 dark:hover:bg-[#2C3560]">
                        <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300 font-medium">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 text-gray-800 dark:text-gray-100">
                          <div className="max-w-xs truncate" title={n.title}>
                            {n.title}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                          {new Date(n.created_at).toLocaleDateString('id-ID')}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full 
                            ${n.status === 'published'
                              ? 'bg-green-100 text-green-800 dark:bg-green-500/30 dark:text-green-300'
                              : n.status === 'rejected'
                              ? 'bg-red-100 text-red-800 dark:bg-red-500/30 dark:text-red-300'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/30 dark:text-yellow-300'
                            }`}>
                            {n.status === 'published' ? 'Approved' : 
                             n.status === 'rejected' ? 'Rejected' : 
                             'Pending'}
                          </span>
                        </td>
                       
                        <td className="px-6 py-4">
                          <div className="flex space-x-2 flex-wrap gap-1">
                            {n.status === 'draft' && (
                              <>
                                <button
                                  className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-lg hover:bg-green-200 dark:bg-green-500/30 dark:text-green-300 dark:hover:bg-green-600/40 transition-colors"
                                  onClick={() => handleApprove(n.id, 'published')}
                                  title="Approve berita"
                                >
                                  Approve
                                </button>
                                <button
                                  className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-lg hover:bg-red-200 dark:bg-red-500/30 dark:text-red-300 dark:hover:bg-red-600/40 transition-colors"
                                  onClick={() => handleApprove(n.id, 'rejected')}
                                  title="Reject berita"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            
                            {n.status === 'published' && (
                              <>
                                <button 
                                  className="p-2 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-500/20 rounded-lg transition-colors"
                                  title="Edit berita"
                                >
                                  <FiEdit className="w-4 h-4" />
                                </button>
                                <button 
                                  className="p-2 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-500/20 rounded-lg transition-colors"
                                  title="Hapus berita"
                                >
                                  <FiTrash2 className="w-4 h-4" />
                                </button>
                                <Link 
                                  to={`/news/${n.id}`}
                                  className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-500/20 rounded-lg transition-colors"
                                  title="Lihat berita"
                                >
                                  <FiEye className="w-4 h-4" />
                                </Link>
                              </>
                            )}

                            {n.status === 'rejected' && (
                              <>
                                <button
                                  className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 dark:bg-blue-500/30 dark:text-blue-300 dark:hover:bg-blue-600/40 transition-colors"
                                  onClick={() => handleApprove(n.id, 'published')}
                                  title="Approve berita"
                                >
                                  Re-approve
                                </button>
                                <button 
                                  className="p-2 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-500/20 rounded-lg transition-colors"
                                  title="Hapus berita"
                                >
                                  <FiTrash2 className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Table Footer Info */}
              <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                Total: {newsData?.length || 0} berita
              </div>
              </>
            )}
          </div>

          {/* Gallery */}
          <div className="bg-white dark:bg-[#2E3B5B] rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Gallery Terbaru</h2>
              <button className="px-5 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600">
                Tambah Gallery
              </button>
            </div>

            {/* Loader gallery */}
            {galleryLoading ? (
              <div className="flex justify-center items-center py-10">
                <MoonLoader color="#10B981" size={40} />
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {galleryData?.slice(0, 8).map((g) => (
                  <div key={g.id} className="relative group rounded-lg overflow-hidden shadow-md">
                    <img
                      src={g.imageUrl}
                      alt={g.title}
                      className="w-full h-32 object-cover transform group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition">
                      {g.title}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
