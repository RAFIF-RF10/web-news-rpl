import React from "react";
import { Link } from "react-router-dom";
import { FiAlertTriangle } from "react-icons/fi";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center px-4">
      <FiAlertTriangle className="text-yellow-500 text-6xl mb-4" />
      <h1 className="text-4xl font-bold text-gray-800 mb-2">404 - Halaman Tidak Ditemukan</h1>
      <p className="text-gray-600 mb-6">
        Ups! URL yang kamu tuju tidak tersedia atau sudah dipindahkan.
      </p>
      <Link
        to="/"
        className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition"
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
};

export default NotFound;
