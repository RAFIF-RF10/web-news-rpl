import React from "react";
import { Link } from "react-router-dom";
import { FaExternalLinkAlt } from "react-icons/fa";

const Partner = () => {
  // Data manual dulu
  const partnerData = [
    {
      id: 1,
      name: "PT. Industri Digital",
      logo: "/images/logo1.png",
      description: "Perusahaan teknologi mitra RPL dalam kelas industri.",
      website: "https://industri.com",
    },
    {
      id: 2,
      name: "TAF RPL",
      logo: "/images/logo2.png",
      description: "Teaching Factory RPL sebagai tempat praktek nyata.",
      website: "https://tafrpl.com",
    },
    {
      id: 3,
      name: "Tech Academy",
      logo: "/images/logo3.png",
      description: "Lembaga pelatihan teknologi untuk siswa RPL.",
      website: "https://techacademy.com",
    },
  ];

  return (
    
    <div id="partners" className="w-full bg-gray-50">
      {/* Hero Section */}
      <div className="relative w-full h-64 sm:h-80 md:h-96">
        <img
          src="/images/partner-hero.jpg" // ganti dengan gambar utama
          alt="Partner RPL"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-center px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
            Partner RPL
          </h2>
          <p className="text-gray-200 mt-2 text-sm sm:text-base max-w-xl">
            Kolaborasi bersama dunia industri dan Teaching Factory RPL
          </p>
        </div>
      </div>

      {/* Partner Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-10">
        <h3 className="text-center text-xl sm:text-2xl font-semibold text-gray-800 mb-8">
          Mitra Kami
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {partnerData.map((partner) => (
            <div
              key={partner.id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition flex flex-col items-center p-6 text-center"
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="h-24 w-24 object-contain mb-4"
              />
              <h4 className="text-lg font-semibold text-gray-800">
                {partner.name}
              </h4>
              <p className="text-gray-600 text-sm mt-2 line-clamp-3">
                {partner.description}
              </p>
              {partner.website && (
                <Link
                  to={partner.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1 text-sm text-[#5996eb] hover:text-blue-700"
                >
                  Kunjungi <FaExternalLinkAlt className="text-xs" />
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Dokumentasi Foto */}
      <div className="bg-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10">
          <h3 className="text-center text-xl sm:text-2xl font-semibold text-gray-800 mb-8">
            Dokumentasi Kegiatan
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {/* contoh foto dokumentasi */}
            <img
              src="/images/doc1.jpg"
              alt="Dokumentasi 1"
              className="rounded-lg object-cover h-40 w-full"
            />
            <img
              src="/images/doc2.jpg"
              alt="Dokumentasi 2"
              className="rounded-lg object-cover h-40 w-full"
            />
            <img
              src="/images/doc3.jpg"
              alt="Dokumentasi 3"
              className="rounded-lg object-cover h-40 w-full"
            />
            <img
              src="/images/doc4.jpg"
              alt="Dokumentasi 4"
              className="rounded-lg object-cover h-40 w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Partner;
