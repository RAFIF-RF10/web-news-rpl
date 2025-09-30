import React from "react";
import { Link } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaNewspaper,
  FaTrophy,
  FaArrowRight,
} from "react-icons/fa";
import DOMPurify from "dompurify";  
import useNews from "../api/hooks/useNews";
import { Skeleton } from "../components/ui/skeleton";

const tagColor = {
  "1st Place":
    "bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg",
  "2nd Place":
    "bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-lg",
  "3rd Place":
    "bg-gradient-to-r from-orange-400 to-orange-600 text-white shadow-lg",
  News: "bg-gradient-to-r from-[#3D53A0] to-[#5A77DF] text-white shadow-lg",
};

// Skeleton component for main featured card
const MainCardSkeleton = () => (
  <div className="bg-white dark:bg-[#323954] rounded-2xl shadow-lg overflow-hidden h-full flex flex-col border border-[#CCD4DF]">
    <Skeleton className="h-64 md:h-80 w-full" />
    <div className="p-6 flex-1 flex flex-col">
      <Skeleton className="h-6 w-3/4 mb-3" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-2/3 mb-4" />
      <div className="flex-1 space-y-2 mb-4">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <div className="border-t border-[#CCD4DF] pt-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </div>
  </div>
);

// Skeleton component for side cards
const SideCardSkeleton = () => (
  <div className="bg-white dark:bg-[#323954] rounded-2xl shadow-lg overflow-hidden flex flex-col border border-[#CCD4DF]">
    <Skeleton className="h-44 w-full" />
    <div className="p-4 flex-1 flex flex-col">
      <Skeleton className="h-5 w-3/4 mb-2" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-2/3 mb-3" />
      <div className="border-t border-[#CCD4DF] pt-3">
        <div className="flex items-center gap-3">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-12" />
        </div>
      </div>
    </div>
  </div>
);

// Skeleton component for bottom cards
const BottomCardSkeleton = () => (
  <div className="bg-white dark:bg-[#323954] rounded-2xl shadow-lg overflow-hidden flex flex-col border border-[#CCD4DF]">
    <Skeleton className="h-44 w-full" />
    <div className="p-4 flex-1 flex flex-col">
      <Skeleton className="h-5 w-3/4 mb-2" />
      <Skeleton className="h-4 w-full mb-3" />
      <div className="border-t border-[#CCD4DF] pt-3">
        <div className="flex items-center gap-3">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-12" />
        </div>
      </div>
    </div>
  </div>
);

// Image component with loading state
const ImageWithLoading = ({ src, alt, className, children }) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);

  return (
    <div className="relative overflow-hidden">
      {isLoading && <Skeleton className={`absolute inset-0 ${className}`} />}
      <img
        src={src}
        alt={alt}
        className={`${className} ${
          isLoading ? "opacity-0" : "opacity-100"
        } transition-opacity duration-300`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
      />
      {!isLoading && !hasError && children}
    </div>
  );
};

const News = () => {
  const { newsData, loading, error, refetch } = useNews();
  const latestNews = newsData ? newsData.slice(0, 6) : [];

  if (error) {
    return (
      <div className="px-4 sm:px-6 md:px-10 py-8 dark:bg-[#081030] sm:py-12 w-screen">
        <div className="mb-8 sm:mb-10">
          <h2 className="text-3xl sm:text-4xl text-black dark:text-[#ECEEF0] font-extrabold text-center mb-2">
            Informasi Terbaru
          </h2>
          <p className="text-center text-sm sm:text-base text-gray-600 dark:text-[#CCD4DF] font-medium">
            Rekayasa Perangkat Lunak
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-[#3D53A0] to-[#5A77DF] mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="flex flex-col justify-center items-center h-64">
          <div className="text-red-500 mb-4 font-medium">
            Error loading news: {error.message}
          </div>
          <button
            onClick={refetch}
            className="bg-[#5A77DF] text-white px-6 py-2.5 rounded-lg hover:bg-[#3D53A0] transition-all duration-200 font-medium shadow-md hover:shadow-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      id="news"
      className="px-4 dark:bg-[#081030] sm:px-6 md:px-10 py-8 sm:py-12 w-screen"
    >
      <div className="mb-8 sm:mb-10">
        <h2 className="text-3xl dark:text-[#ECEEF0] sm:text-4xl text-black font-extrabold text-center mb-2">
          Informasi Terbaru
        </h2>
        <p className="text-center text-sm sm:text-base text-gray-400 dark:text-[#CCD4DF] font-medium">
          Rekayasa Perangkat Lunak
        </p>
        <div className="w-24 h-1 bg-gradient-to-r from-[#3D53A0] to-[#5A77DF] mx-auto mt-4 rounded-full"></div>
      </div>

      {/* Header card */}
      <div className="flex items-center justify-between mb-6 bg-white dark:bg-[#323954] rounded-xl p-4 shadow-md border border-[#CCD4DF]">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-2 bg-blue-100 dark:bg-[#3D53A0] rounded-lg">
            <FaNewspaper className="text-blue-600 dark:text-[#ECEEF0] text-lg sm:text-xl" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-[#ECEEF0]">
              Artikel Terbaru
            </h3>
            <p className="text-sm text-gray-500 dark:text-[#CCD4DF]">
              Update terkini dari SMK Negeri 8 Jember
            </p>
          </div>
        </div>
        <Link
          to="/news/all"
          className="group flex items-center gap-2 text-[#3D53A0] border-2 border-[#3D53A0] px-4 sm:px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#3D53A0] hover:text-white transition-all duration-200 shadow-sm hover:shadow-md"
        >
          View All
          <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-200" />
        </Link>
      </div>

      {/* Main + side cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main card */}
        <div className="lg:col-span-2">
          {loading ? (
            <MainCardSkeleton />
          ) : latestNews[0] ? (
            <Link
              to={`/news/${latestNews[0].id}`}
              className="group block h-full"
            >
              <div className="bg-white dark:bg-[#323954] rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden h-full flex flex-col transform hover:-translate-y-1 border border-[#CCD4DF]">
                <ImageWithLoading
                  src={latestNews[0].image}
                  alt={latestNews[0].title}
                  className="h-64 w-full object-cover md:h-80 transition-transform duration-300 group-hover:scale-105"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div
                    className={`absolute top-4 left-4 px-3 py-1.5 text-sm font-bold rounded-full backdrop-blur-sm ${
                      tagColor[latestNews[0].tag] || tagColor.News
                    }`}
                  >
                    {latestNews[0].tag?.includes("Place") ? (
                      <div className="flex items-center gap-1.5">
                        <FaTrophy className="text-xs" />
                        {latestNews[0].tag}
                      </div>
                    ) : (
                      latestNews[0].tag
                    )}
                  </div>
                </ImageWithLoading>
                <div className="p-6 flex-1 flex flex-col">
                  <h4 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-[#5A77DF] transition-colors duration-200 leading-tight dark:text-[#ECEEF0]">
                    {latestNews[0].title}
                  </h4>
                  <p
                    className="text-gray-600 dark:text-[#CCD4DF] text-sm mb-3 line-clamp-2 font-medium"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(latestNews[0].sub),
                    }}
                  ></p>
                  <p className="text-gray-600 dark:text-[#ECEEF0] text-sm mb-4 line-clamp-3 leading-relaxed flex-1"  dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(latestNews[0].content),
                    }}>
                   
                  </p>
                  <div className="border-t border-[#CCD4DF] pt-4">
                    <div className="flex items-center text-xs text-gray-500 dark:text-[#ECEEF0] gap-4">
                      <div className="flex items-center gap-1.5">
                        <FaCalendarAlt className="text-[#5A77DF]" />
                        <span className="font-medium">
                          {latestNews[0].created_at}
                        </span>
                      </div>
                      <span className="text-gray-300 dark:text-[#CCD4DF]">
                        |
                      </span>
                      <div className="flex items-center gap-1.5">
                        <FaMapMarkerAlt className="text-red-400" />
                        <span>{latestNews[0].location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ) : null}
        </div>

        {/* Side cards */}
        <div className="flex flex-col gap-8">
          {loading ? (
            <>
              <SideCardSkeleton />
              <SideCardSkeleton />
            </>
          ) : (
            latestNews.slice(1, 3).map((item) => (
              <Link
                key={item.id}
                to={`/news/${item.id}`}
                className="group block"
              >
                <div className="bg-white dark:bg-[#323954] rounded-2xl shadow-lg h-full hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col transform hover:-translate-y-1 border border-[#CCD4DF]">
                  <ImageWithLoading
                    src={item.image}
                    alt={item.title}
                    className="h-44 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div
                      className={`absolute top-3 left-3 px-2.5 py-1 text-xs font-bold rounded-full backdrop-blur-sm ${
                        tagColor[item.tag] || tagColor.News
                      }`}
                    >
                      {item.tag?.includes("Place") ? (
                        <div className="flex items-center gap-1">
                          <FaTrophy className="text-xs" />
                          {item.tag}
                        </div>
                      ) : (
                        item.tag
                      )}
                    </div>
                  </ImageWithLoading>
                  <div className="p-4 flex-1 flex flex-col">
                    <h4 className="text-base font-bold mb-2 line-clamp-2 group-hover:text-[#5A77DF] transition-colors duration-200 leading-tight dark:text-[#ECEEF0]">
                      {item.title}
                    </h4>
                    <p className="text-gray-600 dark:text-[#CCD4DF] text-sm mb-2 line-clamp-2 font-medium" dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(item.sub),
                    }}>
                    </p>
                    {/* <p className="text-gray-600 dark:text-[#ECEEF0] text-sm mb-3 line-clamp-2 leading-relaxed flex-1">
                      {item.content}
                    </p> */}
                    <div className="border-t border-[#CCD4DF] pt-3">
                      <div className="flex items-center text-xs text-gray-500 dark:text-[#ECEEF0] gap-3">
                        <div className="flex items-center gap-1.5">
                          <FaCalendarAlt className="text-[#5A77DF]" />
                          <span className="font-medium">{item.created_at}</span>
                        </div>
                        <span className="text-gray-300 dark:text-[#CCD4DF]">
                          |
                        </span>
                        <div className="flex items-center gap-1.5">
                          <FaMapMarkerAlt className="text-red-400" />
                          <span>{item.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* Bottom cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-0 mt-8">
        {loading ? (
          <>
            <BottomCardSkeleton />
            <BottomCardSkeleton />
            <BottomCardSkeleton />
          </>
        ) : (
          latestNews.slice(3, 6).map((item) => (
            <Link
              key={item.id}
              to={`/news/${item.id}`}
              className="group block h-full "
            >
              <div className="bg-white dark:bg-[#323954] rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col transform hover:-translate-y-1 border border-[#CCD4DF]">
                <ImageWithLoading
                  src={item.image}
                  alt={item.title}
                  className="h-44 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div
                    className={`absolute top-3 left-3 px-2.5 py-1 text-xs font-bold rounded-full backdrop-blur-sm ${
                      tagColor[item.tag] || tagColor.News
                    }`}
                  >
                    {item.tag?.includes("Place") ? (
                      <div className="flex items-center gap-1">
                        <FaTrophy className="text-xs" />
                        {item.tag}
                      </div>
                    ) : (
                      item.tag
                    )}
                  </div>
                </ImageWithLoading>
                <div className="p-4 flex-1 flex flex-col">
                  <h4 className="text-base font-bold mb-2 line-clamp-2 group-hover:text-[#5A77DF] transition-colors duration-200 leading-tight dark:text-[#ECEEF0]">
                    {item.title}
                  </h4>
                  <p className="text-gray-600 dark:text-[#CCD4DF] text-sm mb-3 line-clamp-2 font-medium flex-1"dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(item.sub),
                    }}>
                  </p>
                  <div className="border-t border-[#CCD4DF] pt-3">
                    <div className="flex items-center text-xs text-gray-500 dark:text-[#ECEEF0] gap-3">
                      <div className="flex items-center gap-1.5">
                        <FaCalendarAlt className="text-[#5A77DF]" />
                        <span className="font-medium">{item.created_at}</span>
                      </div>
                      <span className="text-gray-300 dark:text-[#CCD4DF]">
                        |
                      </span>
                      <div className="flex items-center gap-1.5">
                        <FaMapMarkerAlt className="text-red-400" />
                        <span>{item.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default News;
