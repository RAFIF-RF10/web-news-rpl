import React, { useState } from 'react'
import { useLocation } from 'react-router-dom';
import SidebarAdmin from '../components/SidebarAdmin';

// Komponen utama
const LayoutAdmin = ({children}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  // Jika di halaman login, jangan tampilkan sidebar
  if (location.pathname === '/login') {
    return (
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <SidebarAdmin isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div className={`flex-1 min-w-screen min-h-screen overflow-auto transition-all duration-300 ${isSidebarOpen ? 'pl-64' : 'pl-20'}`}>
        {children}
      </div>
    </div>
  )
}

export default LayoutAdmin;