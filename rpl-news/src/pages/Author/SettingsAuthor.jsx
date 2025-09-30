import React, { useState, useEffect } from 'react';
import { useAuth } from '../../api/hooks/useAuth';

const SettingsAuthor = () => {
 const { user, updateUser, changePassword, actionLoading, getUser } = useAuth();
   const [activeTab, setActiveTab] = useState('profile');
   const [profileForm, setProfileForm] = useState({
     id: '',
     name: '',
     email: '',
     profile_image: null,
   });
   const [previewImg, setPreviewImg] = useState('');
   // Ambil data user terbaru saat mount
   useEffect(() => {
     const fetchUser = async () => {
       const result = await getUser();
       if (result && result.success && result.data) {
         setProfileForm({
           id: result.data.id || '',
           name: result.data.name || '',
           email: result.data.email || '',
           profile_image: null,
         });
         setPreviewImg(result.data.profile_image || '');
       }
     };
     fetchUser();
   }, [getUser]);
   const [pwForm, setPwForm] = useState({
     old_password: '',
     new_password: '',
     confirm_password: '',
   });
   const [profileMsg, setProfileMsg] = useState('');
   const [pwMsg, setPwMsg] = useState('');
 
   const handleProfileChange = (e) => {
     const { name, value, files } = e.target;
     if (name === 'profile_image' && files && files[0]) {
       setProfileForm((prev) => ({
         ...prev,
         profile_image: files[0],
       }));
       setPreviewImg(URL.createObjectURL(files[0]));
     } else {
       setProfileForm((prev) => ({
         ...prev,
         [name]: value,
       }));
     }
   };
   
 const handleProfileSubmit = async (e) => {
   e.preventDefault();
   setProfileMsg('');
 
   let result;
 
   if (profileForm.profile_image) {
     // Kalau ada file, pakai FormData
     const formData = new FormData();
     formData.append('name', profileForm.name);
     formData.append('email', profileForm.email);
     formData.append('profile_image', profileForm.profile_image);
 
     result = await updateUser(profileForm.id, formData, true);
   } else {
     // Kalau tidak ada file, kirim JSON biasa tanpa profile_image
     const sendData = {
       name: profileForm.name,
       email: profileForm.email,
     };
     result = await updateUser(profileForm.id, sendData);
   }
 
   if (result.success) {
     setProfileMsg('Profil berhasil diperbarui!');
     const userRes = await getUser();
     if (userRes && userRes.success && userRes.data) {
       setProfileForm({
         id: userRes.data.id || '',
         name: userRes.data.name || '',
         email: userRes.data.email || '',
         profile_image: null, // reset file input
       });
       setPreviewImg(userRes.data.profile_image || '');
     }
     setTimeout(() => setProfileMsg(''), 5000);
   } else {
     setProfileMsg(result.error || 'Gagal update profil');
     setTimeout(() => setProfileMsg(''), 5000);
   }
 };
 
 
   const handlePwChange = (e) => {
     const { name, value } = e.target;
     setPwForm((prev) => ({ ...prev, [name]: value }));
   };
 
   const handlePwSubmit = async (e) => {
     e.preventDefault();
     setPwMsg('');
     if (pwForm.new_password !== pwForm.confirm_password) {
       setPwMsg('Konfirmasi password tidak cocok');
       setTimeout(() => setPwMsg(''), 5000);
       return;
     }
     const result = await changePassword(pwForm.old_password, pwForm.new_password);
     if (result.success) {
       setPwMsg('Password berhasil diubah!');
       setPwForm({ old_password: '', new_password: '', confirm_password: '' });
       setTimeout(() => setPwMsg(''), 5000);
     } else {
       setPwMsg(result.message || 'Gagal ganti password');
       setTimeout(() => setPwMsg(''), 5000);
     }
   };
 
   const getPasswordStrength = (password) => {
     if (!password) return { strength: 0, label: '', color: '' };
     
     let strength = 0;
     if (password.length >= 8) strength++;
     if (/[a-z]/.test(password)) strength++;
     if (/[A-Z]/.test(password)) strength++;
     if (/\d/.test(password)) strength++;
     if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
 
     const levels = [
       { strength: 0, label: '', color: '' },
       { strength: 1, label: 'Sangat Lemah', color: 'bg-red-500' },
       { strength: 2, label: 'Lemah', color: 'bg-orange-500' },
       { strength: 3, label: 'Sedang', color: 'bg-yellow-500' },
       { strength: 4, label: 'Kuat', color: 'bg-blue-500' },
       { strength: 5, label: 'Sangat Kuat', color: 'bg-green-500' },
     ];
 
     return levels[strength];
   };
 
   const passwordStrength = getPasswordStrength(pwForm.new_password);
 
   return (
     <div className="min-h-screen dark:bg-[#252e4b] bg-gray-50 py-8">
       <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
         {/* Header */}
         <div className="mb-8">
           <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Pengaturan Akun</h1>
           <p className="text-gray-600 dark:text-gray-400 mt-2">Kelola profil dan keamanan akun Anda</p>
         </div>
 
         {/* Navigation Tabs */}
         <div className="bg-white dark:bg-[#1E253A] rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
           <div className="border-b border-gray-200 dark:border-gray-700">
             <nav className="-mb-px flex space-x-8 px-6">
               <button
                 onClick={() => setActiveTab('profile')}
                 className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                   activeTab === 'profile'
                     ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                     : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                 }`}
               >
                 <span className="flex items-center gap-2">
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                   </svg>
                   Profil
                 </span>
               </button>
               <button
                 onClick={() => setActiveTab('security')}
                 className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                   activeTab === 'security'
                     ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                     : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                 }`}
               >
                 <span className="flex items-center gap-2">
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                   </svg>
                   Keamanan
                 </span>
               </button>
             </nav>
           </div>
         </div>
 
         {/* Profile Tab */}
         {activeTab === 'profile' && (
           <div className="bg-white dark:bg-[#1E253A] rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
             <div className="p-6 border-b border-gray-200 dark:border-gray-700">
               <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Informasi Profil</h2>
               <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Perbarui foto profil dan informasi pribadi Anda</p>
             </div>
             
             <form onSubmit={handleProfileSubmit} className="p-6">
               {/* Profile Image Section */}
               <div className="flex items-start gap-6 mb-8">
                 <div className="flex-shrink-0">
                   <div className="relative group">
                     <img
                       src={previewImg ? previewImg : `https://ui-avatars.com/api/?name=${encodeURIComponent(profileForm.name || 'User')}&background=3B82F6&color=ffffff&size=128`}
                       alt="Profile"
                       className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-lg ring-2 ring-gray-100 dark:ring-gray-600"
                     />
                     <div className="absolute inset-0 rounded-full bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center cursor-pointer">
                       <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                       </svg>
                     </div>
                     <input
                       type="file"
                       name="profile_image"
                       accept="image/*"
                       onChange={handleProfileChange}
                       className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                       title="Ganti Foto Profil"
                     />
                   </div>
                 </div>
                 <div className="flex-1 min-w-0">
                   <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Foto Profil</h3>
                   <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                     Klik pada foto untuk mengganti. Ukuran maksimal 5MB. Format yang didukung: JPG, PNG, GIF.
                   </p>
                   <div className="flex gap-3">
                     <button
                       type="button"
                       onClick={() => document.querySelector('input[name="profile_image"]').click()}
                       className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 transition-colors"
                     >
                       <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                       </svg>
                       Pilih Foto
                     </button>
                   </div>
                 </div>
               </div>
 
               {/* Form Fields */}
               <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                 <div>
                   <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                     Nama Lengkap
                   </label>
                   <input
                     id="name"
                     type="text"
                     name="name"
                     value={profileForm.name}
                     onChange={handleProfileChange}
                     className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                     placeholder="Masukkan nama lengkap"
                     required
                   />
                 </div>
                 <div>
                   <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                     Email
                   </label>
                   <input
                     id="email"
                     type="email"
                     name="email"
                     value={profileForm.email}
                     onChange={handleProfileChange}
                     className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                     placeholder="Masukkan alamat email"
                     required
                   />
                 </div>
               </div>
 
               {/* Message Display */}
               {profileMsg && (
                 <div className={`mt-6 p-4 rounded-lg border ${
                   profileMsg.includes('berhasil') 
                     ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300' 
                     : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300'
                 }`}>
                   <div className="flex items-center">
                     <svg className={`w-5 h-5 mr-3 ${
                       profileMsg.includes('berhasil') ? 'text-green-400' : 'text-red-400'
                     }`} fill="currentColor" viewBox="0 0 20 20">
                       <path fillRule="evenodd" d={
                         profileMsg.includes('berhasil') 
                           ? "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                           : "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                       } clipRule="evenodd" />
                     </svg>
                     <span className="text-sm font-medium">{profileMsg}</span>
                   </div>
                 </div>
               )}
 
               {/* Action Buttons */}
               <div className="mt-8 flex justify-end gap-4">
                 <button
                   type="button"
                   className="px-6 py-3 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 transition-colors"
                 >
                   Batal
                 </button>
                 <button
                   type="submit"
                   disabled={actionLoading}
                   className="px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg font-medium shadow hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 transition-colors disabled:bg-blue-400 dark:disabled:bg-blue-700 disabled:cursor-not-allowed inline-flex items-center"
                 >
                   {actionLoading && (
                     <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                     </svg>
                   )}
                   {actionLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
                 </button>
               </div>
             </form>
           </div>
         )}
 
         {/* Security Tab */}
         {activeTab === 'security' && (
           <div className="bg-white dark:bg-[#1E253A] rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
             <div className="p-6 border-b border-gray-200 dark:border-gray-700">
               <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Keamanan Akun</h2>
               <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Perbarui password untuk menjaga keamanan akun Anda</p>
             </div>
             
             <form onSubmit={handlePwSubmit} className="p-6">
               <div className="max-w-md space-y-6">
                 <div>
                   <label htmlFor="old_password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                     Password Saat Ini
                   </label>
                   <input
                     id="old_password"
                     type="password"
                     name="old_password"
                     value={pwForm.old_password}
                     onChange={handlePwChange}
                     className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                     placeholder="Masukkan password saat ini"
                     required
                   />
                 </div>
 
                 <div>
                   <label htmlFor="new_password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                     Password Baru
                   </label>
                   <input
                     id="new_password"
                     type="password"
                     name="new_password"
                     value={pwForm.new_password}
                     onChange={handlePwChange}
                     className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                     placeholder="Masukkan password baru"
                     required
                   />
                   
                   {/* Password Strength Indicator */}
                   {pwForm.new_password && (
                     <div className="mt-2">
                       <div className="flex justify-between items-center mb-1">
                         <span className="text-xs text-gray-600 dark:text-gray-400">Kekuatan Password</span>
                         <span className={`text-xs font-medium ${
                           passwordStrength.strength <= 2 ? 'text-red-600 dark:text-red-400' :
                           passwordStrength.strength <= 3 ? 'text-yellow-600 dark:text-yellow-400' :
                           'text-green-600 dark:text-green-400'
                         }`}>
                           {passwordStrength.label}
                         </span>
                       </div>
                       <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                         <div
                           className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                           style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                         ></div>
                       </div>
                     </div>
                   )}
                 </div>
 
                 <div>
                   <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                     Konfirmasi Password Baru
                   </label>
                   <input
                     id="confirm_password"
                     type="password"
                     name="confirm_password"
                     value={pwForm.confirm_password}
                     onChange={handlePwChange}
                     className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                     placeholder="Konfirmasi password baru"
                     required
                   />
                   {pwForm.confirm_password && pwForm.new_password !== pwForm.confirm_password && (
                     <p className="mt-1 text-sm text-red-600 dark:text-red-400">Password tidak cocok</p>
                   )}
                 </div>
 
                 {/* Password Requirements */}
                 <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                   <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Syarat Password:</h4>
                   <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                     <li className="flex items-center gap-2">
                       <span className={`w-2 h-2 rounded-full ${pwForm.new_password?.length >= 8 ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></span>
                       Minimal 8 karakter
                     </li>
                     <li className="flex items-center gap-2">
                       <span className={`w-2 h-2 rounded-full ${/[a-z]/.test(pwForm.new_password) ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></span>
                       Huruf kecil (a-z)
                     </li>
                     <li className="flex items-center gap-2">
                       <span className={`w-2 h-2 rounded-full ${/[A-Z]/.test(pwForm.new_password) ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></span>
                       Huruf besar (A-Z)
                     </li>
                     <li className="flex items-center gap-2">
                       <span className={`w-2 h-2 rounded-full ${/\d/.test(pwForm.new_password) ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></span>
                       Angka (0-9)
                     </li>
                     <li className="flex items-center gap-2">
                       <span className={`w-2 h-2 rounded-full ${/[!@#$%^&*(),.?":{}|<>]/.test(pwForm.new_password) ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></span>
                       Karakter khusus (!@#$%^&*)
                     </li>
                   </ul>
                 </div>
 
                 {/* Message Display */}
                 {pwMsg && (
                   <div className={`p-4 rounded-lg border ${
                     pwMsg.includes('berhasil') 
                       ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300' 
                       : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300'
                   }`}>
                     <div className="flex items-center">
                       <svg className={`w-5 h-5 mr-3 ${
                         pwMsg.includes('berhasil') ? 'text-green-400' : 'text-red-400'
                       }`} fill="currentColor" viewBox="0 0 20 20">
                         <path fillRule="evenodd" d={
                           pwMsg.includes('berhasil') 
                             ? "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                             : "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                         } clipRule="evenodd" />
                       </svg>
                       <span className="text-sm font-medium">{pwMsg}</span>
                     </div>
                   </div>
                 )}
 
                 {/* Action Buttons */}
                 <div className="flex justify-end gap-4 pt-4">
                   <button
                     type="button"
                     onClick={() => setPwForm({ old_password: '', new_password: '', confirm_password: '' })}
                     className="px-6 py-3 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 transition-colors"
                   >
                     Batal
                   </button>
                   <button
                     type="submit"
                     disabled={actionLoading || pwForm.new_password !== pwForm.confirm_password}
                     className="px-6 py-3 bg-green-600 dark:bg-green-500 text-white rounded-lg font-medium shadow hover:bg-green-700 dark:hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-800 transition-colors disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed inline-flex items-center"
                   >
                     {actionLoading && (
                       <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                       </svg>
                     )}
                     {actionLoading ? 'Menyimpan...' : 'Ganti Password'}
                   </button>
                 </div>
               </div>
             </form>
           </div>
         )}
       </div>
     </div>
   );
 };

export default SettingsAuthor;