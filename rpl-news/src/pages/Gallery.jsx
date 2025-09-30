import React, { useState, useEffect } from 'react';
import { X, ZoomIn } from 'lucide-react';
import Layout from '../layout/Layout';
import useGallery from '../api/hooks/useGallery';
// Ambil cache key dan fungsi getCache dari useGallery.js
const CACHE_KEY = "news_cache";
const getCache = () => {
  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) {
    const parsed = JSON.parse(cached);
    if (Date.now() - parsed.timestamp < 5 * 60 * 1000) {
      return parsed.data;
    }
  }
  return null;
};
import { FaCalendarAlt } from 'react-icons/fa';

// Loading skeleton component
const LoadingSkeleton = () => (
  <div className="animate-pulse">
    <div className="relative overflow-hidden rounded-xl bg-[#CCD4DF]/40 dark:bg-[#323954]/40 border border-[#CCD4DF] dark:border-[#323954] shadow-lg h-[500px]">
      <div className="h-[300px] bg-[#3D53A0]/20 dark:bg-[#081030]/40"></div>
      <div className="p-6 space-y-3">
        <div className="h-6 bg-[#3D53A0]/20 dark:bg-[#5A77DF]/20 rounded w-3/4"></div>
        <div className="h-4 bg-[#3D53A0]/20 dark:bg-[#5A77DF]/20 rounded w-full"></div>
        <div className="h-4 bg-[#3D53A0]/20 dark:bg-[#5A77DF]/20 rounded w-2/3"></div>
      </div>
    </div>
  </div>
);

// Gallery item component (Card)
const GalleryItem = ({ item, onClick }) => (
  <div
    className="group relative cursor-pointer transform transition-all duration-500 hover:scale-[1.02]"
    onClick={() => onClick(item)}
  >
    <div className="relative overflow-hidden rounded-xl bg-[#ECEEF0] dark:bg-[#323954]/60 border border-[#CCD4DF] dark:border-[#323954] shadow-lg hover:shadow-[#1d4ed8]/30 dark:hover:shadow-[#5A77DF]/30 transition-all duration-500 h-[500px]">
      {/* Image section */}
      <div className="relative h-[300px] overflow-hidden">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#081030]/80 via-[#323954]/30 to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-500"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#1d4ed8]/30 via-[#5A77DF]/20 to-[#1d4ed8]/30 opacity-0 group-hover:opacity-100 transition-all duration-500">
          <div className="flex items-center justify-center h-full">
            <div className="transform scale-75 group-hover:scale-100 transition-transform duration-300">
              <ZoomIn className="w-10 h-10 text-[#ECEEF0]" />
            </div>
          </div>
        </div>
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 text-xs font-semibold text-[#ECEEF0] bg-gradient-to-r from-[#1d4ed8] to-[#5A77DF] rounded-full backdrop-blur-sm shadow-lg">
            {item.category || 'Galeri'}
          </span>
        </div>
      </div>

      {/* Content section */}
      <div className="p-6 space-y-3 h-[200px] flex flex-col bg-[#ECEEF0] dark:bg-[#081030]">
        <h3 className="text-xl font-bold text-[#081030] dark:text-[#ECEEF0] group-hover:text-[#1d4ed8] dark:group-hover:text-[#5A77DF] transition-all duration-300 line-clamp-2">
          {item.title}
        </h3>
        <p className="text-[#323954] dark:text-[#CCD4DF] text-sm line-clamp-3 flex-grow">
          {item.description}
        </p>
        <div className="pt-3 border-t flex gap-8 border-[#CCD4DF] dark:border-[#3D53A0]">
          <span className="text-sm text-[#1d4ed8] dark:text-[#5A77DF] flex items-center gap-2">
            <span className="w-2 h-2 bg-[#1d4ed8] dark:bg-[#5A77DF] rounded-full animate-pulse"></span>
            View Details
          </span>
          <span className="text-sm text-[#1d4ed8] dark:text-[#5A77DF] flex items-center gap-2">
            <FaCalendarAlt className="text-[#1d4ed8] dark:text-[#5A77DF]" />
            {item.created_at}
          </span>
        </div>
      </div>
    </div>
  </div>
);

// Modal component
const ImageModal = ({ image, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#ECEEF0]/95 dark:bg-[#081030]/95 backdrop-blur-md animate-in fade-in duration-300">
    <div className="relative max-w-4xl w-full max-h-[90vh] bg-[#ECEEF0] dark:bg-[#081030] rounded-3xl overflow-hidden shadow-2xl border border-[#CCD4DF] dark:border-[#323954] animate-in zoom-in duration-300">
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-10 p-3 rounded-full bg-[#CCD4DF] dark:bg-[#323954] text-[#1d4ed8] dark:text-[#5A77DF] hover:bg-[#1d4ed8]/10 dark:hover:bg-[#5A77DF]/20 transition-colors duration-200 shadow-lg"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="grid md:grid-cols-2 gap-0 h-full">
        {/* Left: Image */}
        <div className="relative">
          <img
            src={image.image}
            alt={image.title}
            className="w-full h-64 md:h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#3D53A0]/20 md:block hidden"></div>
        </div>

        {/* Right: Text */}
        <div className="p-8 md:p-12 flex flex-col justify-start space-y-6 bg-gradient-to-br from-[#CCD4DF]/60 to-[#ECEEF0] dark:from-[#323954]/60 dark:to-[#081030]">
          <div className="flex items-center space-x-2">
            <span className="px-4 py-2 text-sm font-bold text-[#ECEEF0] bg-gradient-to-r from-[#1d4ed8] to-[#5A77DF] rounded-full shadow-lg">
              {image.category || 'Galeri'}
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#1d4ed8] to-[#5A77DF]">
            {image.title}
          </h2>

          <p className="text-[#323954] dark:text-[#CCD4DF] leading-relaxed text-lg">
            {image.description}
          </p>

          <div className="pt-6 border-t border-[#CCD4DF] dark:border-[#3D53A0]">
            <div className="flex flex-wrap gap-4 text-sm text-[#1d4ed8] dark:text-[#5A77DF]">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-[#5A77DF] rounded-full animate-pulse"></div>
                <span>High Resolution</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-[#1d4ed8] rounded-full animate-pulse"></div>
                <span>Professional Quality</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Main Gallery component
const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [initialGallery, setInitialGallery] = useState([]);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const { galleryData = [], loading, error, refetch } = useGallery();

  // Ambil cache saat mount
  useEffect(() => {
    const cached = getCache();
    if (cached && Array.isArray(cached)) {
      setInitialGallery(cached);
      setShowSkeleton(false);
    } else {
      setShowSkeleton(true);
    }
  }, []);

  // Jika data baru sudah didapat, matikan skeleton
  useEffect(() => {
    if (galleryData && galleryData.length > 0) {
      setShowSkeleton(false);
    }
  }, [galleryData]);

  return (
    <Layout>
      <section className="md:w-full w-screen min-h-screen bg-[#CCD4DF] dark:bg-[#081030] py-20 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5 xl md:text-6xl font-bold text-[#1d4ed8] dark:text-[#5A77DF] mb-6">
              Gallery
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-[#1d4ed8] to-[#5A77DF] mx-auto mb-6 rounded-full"></div>
            <p className="text-[#323954] dark:text-[#CCD4DF] text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Jelajahi koleksi visual yang memukau dengan detail dan keindahan yang tak terlupakan
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {showSkeleton &&
              (initialGallery.length > 0
                ? initialGallery.slice(0, 6).map((item) => (
                    <GalleryItem key={item.id} item={item} onClick={setSelectedImage} />
                  ))
                : [...Array(6)].map((_, index) => <LoadingSkeleton key={index} />)
              )}

            {!showSkeleton && error && (
              <div className="col-span-3 text-center text-[#1d4ed8] dark:text-[#5A77DF]">
                <p className="text-xl">Gagal memuat galeri. {error.message}</p>
                <button
                  onClick={refetch}
                  className="mt-4 px-4 py-2 bg-[#1d4ed8] dark:bg-[#5A77DF] text-[#ECEEF0] rounded-lg hover:bg-[#5A77DF] dark:hover:bg-[#1d4ed8] transition-colors"
                >
                  Coba Lagi
                </button>
              </div>
            )}

            {!showSkeleton && !error &&
              (galleryData.length > 0
                ? galleryData.slice(0, 6).map((item) => (
                    <GalleryItem key={item.id} item={item} onClick={setSelectedImage} />
                  ))
                : null
              )}
          </div>
        </div>
      </section>

      {selectedImage && (
        <ImageModal image={selectedImage} onClose={() => setSelectedImage(null)} />
      )}
    </Layout>
  );
};

export default Gallery;
