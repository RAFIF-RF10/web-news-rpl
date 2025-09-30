import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import useNews from "../api/hooks/useNews";
import { FaMapMarkerAlt, FaCalendarAlt, FaShareAlt, FaWhatsapp, FaFacebook, FaLinkedin, FaLink } from "react-icons/fa";
import Layout from "../layout/Layout";
import DOMPurify from "dompurify"; 
import { FiArrowLeft } from "react-icons/fi";

const tagColor = {
  "1st Place": "bg-yellow-400 text-yellow-900",
  "3rd Place": "bg-orange-300 text-orange-900",
  News: "bg-gray-300 text-gray-800",
};

const NewsDetail = () => {
  const { id } = useParams();
  const [copied, setCopied] = useState(false);

  // Use the custom hook to fetch news data
  const { newsData, loading, error, refetch } = useNews();  

  const berita = newsData?.find((item) => item.id === parseInt(id));

  // Handle loading state
  if (loading) {
    return (
      <Layout>
        <div className="bg-blue-50 min-h-screen pt-28 pb-10 px-4 md:px-10">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              <span className="ml-3 text-gray-600">Loading article...</span>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Handle error state
  if (error) {
    return (
      <Layout>
        <div className="bg-blue-50 min-h-screen pt-28 pb-10 px-4 md:px-10">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col justify-center items-center h-64">
              <div className="text-red-500 mb-4 text-center">
                Error loading article: {error.message || "Something went wrong"}
              </div>
              <button
                onClick={refetch}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Handle article not found
  if (!berita) {
    return (
      <Layout>
        <div className="bg-blue-50 min-h-screen pt-28 pb-10 px-4 md:px-10">
          <div className="max-w-6xl mx-auto">
            <div className="mb-4 flex justify-start">
              <Link
                to="/news"
                className="inline-flex items-center gap-2 text-[#5996eb] border border-[#5996eb] px-4 py-2 rounded hover:bg-[#5996eb] hover:text-white transition text-sm"
              >
                <FiArrowLeft className="text-base" />
                Kembali
              </Link>
            </div>
            <div className="text-center py-12">
              <div className="text-red-600 text-lg mb-2">Berita tidak ditemukan</div>
              <div className="text-gray-500 text-sm">
                Artikel yang Anda cari mungkin telah dihapus atau tidak tersedia
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Get related news (excluding current article and filtered by category)
  const relatedNews = newsData
    ?.filter((item) => item.id !== berita.id && item.category === berita.category)
    .slice(0, 4) || [];

  // Function to handle link copy
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset "Copied" text after 2 seconds
  };

  // Share URLs
  const shareTitle = encodeURIComponent(berita.title);
  const shareUrl = encodeURIComponent(window.location.href);
  const whatsappUrl = `https://wa.me/?text=${shareTitle}%20%28${shareUrl}%29`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`;

  return (
    <Layout>
  <div className="min-h-screen pt-28 pb-10 px-4 md:px-10 bg-gray-50 dark:bg-[#081030]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="md:col-span-2">
            <div className="mb-4 flex justify-start">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-[#5996eb] border border-[#5996eb] px-4 py-2 rounded hover:bg-[#5996eb] hover:text-white transition text-sm"
              >
                <FiArrowLeft className="text-base" />
                Kembali
              </Link>
            </div>
            <div className="bg-white dark:bg-[#323954] p-6 md:p-8 rounded-lg shadow-md border border-gray-200 dark:border-[#323954]">
              <span
                className={`inline-block mb-2 text-xs font-bold px-3 py-1 rounded-full ${
                  tagColor[berita.category] || "bg-gradient-to-r from-[#3D53A0] to-[#5A77DF] text-white shadow-lg"
                }`}
               
              >
                {berita.category}
              </span>

              <p className="text-xl text-start md:text-2xl font-bold text-gray-800 dark:text-[#ECEEF0] mb-4">
                {berita.title}
              </p>
              <p className="text-gray-600 dark:text-[#CCD4DF] text-start text-sm mb-4"  dangerouslySetInnerHTML={{
                  __html:DOMPurify.sanitize(berita.sub),
                }}>
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-[#CCD4DF] mb-6">
                <div className="flex items-center gap-1">
                  <FaCalendarAlt className="text-[#5996eb]" />
                  <span>{berita.created_at}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaMapMarkerAlt className="text-[#5996eb]" />
                  <span>{berita.location}</span>
                </div>
              </div>

              <div className="w-full aspect-video mb-6">
                <img
                  src={berita.image}
                  alt={berita.title}
                  className="w-full h-full object-cover rounded-lg shadow-md bg-white dark:bg-[#232B45]"
                />
              </div>

              {/* Tombol Share */}
              <div className="flex flex-col sm:flex-row items-center justify-between py-4 mb-6 border-y border-gray-200 dark:border-[#323954]">
                <div className="flex items-center text-sm font-medium text-gray-700 dark:text-[#ECEEF0] mb-2 sm:mb-0">
                  <FaShareAlt className="mr-2 text-lg text-gray-500 dark:text-[#ECEEF0]" /> Bagikan Artikel:
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition"
                    aria-label="Share on WhatsApp"
                  >
                    <FaWhatsapp className="text-lg" />
                  </a>
                  <a
                    href={facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"
                    aria-label="Share on Facebook"
                  >
                    <FaFacebook className="text-lg" />
                  </a>
                  <a
                    href={linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-blue-700 text-white hover:bg-blue-800 transition"
                    aria-label="Share on LinkedIn"
                  >
                    <FaLinkedin className="text-lg" />
                  </a>
                  <button
                    onClick={handleCopyLink}
                    className="p-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                    aria-label="Copy Link"
                  >
                    <FaLink className="text-lg" />
                  </button>
                  {copied && <span className="text-green-600 text-sm font-medium ml-2">Tersalin!</span>}
                </div>
              </div>

              <div  dangerouslySetInnerHTML={{
                  __html:DOMPurify.sanitize(berita.content),
                }} className="text-gray-800 dark:text-[#ECEEF0] leading-relaxed text-justify whitespace-pre-line">
              </div>
            </div>
          </div>

          <div className="space-y-4 md:space-y-6">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-[#ECEEF0] border-b border-gray-200 dark:border-[#323954] pb-2">
              Artikel Serupa
            </h2>
            {relatedNews.length > 0 ? (
              relatedNews.map((item) => (
                <Link
                  to={`/news/${item.id}`}
                  key={item.id}
                  className="flex gap-4 p-4 rounded-lg bg-white dark:bg-[#232B45] border border-gray-200 dark:border-[#323954] shadow-sm transition hover:shadow-md hover:border-blue-300 dark:hover:border-blue-400"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-24 h-24 object-cover rounded-md flex-shrink-0"
                  />
                  <div className="flex-1">
                    <span className="text-xs font-medium text-blue-600">
                      {item.category}
                    </span>
                    <h3 className="text-sm font-semibold text-gray-800 dark:text-[#ECEEF0] hover:text-blue-600 transition">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-[#CCD4DF]">{item.created_at}</p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-gray-500 dark:text-[#CCD4DF] text-sm p-4 bg-white dark:bg-[#232B45] rounded-lg border border-gray-200 dark:border-[#323954] shadow-sm">
                Tidak ada artikel serupa
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NewsDetail;