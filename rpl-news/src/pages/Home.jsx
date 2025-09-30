
import React, { useEffect, useRef } from "react";
import { MapPin, Medal, Newspaper, X } from "lucide-react";


export default function Home() {
  const sliderRef = useRef(null);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    let animationFrame;
    let scrollPosition = 0;
    const speed = 1;

    const animate = () => {
      scrollPosition += speed;

      if (scrollPosition >= slider.scrollWidth / 4) {
        scrollPosition = 0;
      }

      slider.scrollLeft = scrollPosition;
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  const logoItems = [
    { src: "/image/smartlogy-logo.png", alt: "Smartlogy", grayscale: true },
    { src: "/image/ubig.png", alt: "UBIG", grayscale: false },
    { src: "/image/mascitra.png", alt: "Mascitra", grayscale: true },
    { src: "/image/hummatect.png", alt: "Hummatect", grayscale: true },
    { src: "/image/pringapus.png", alt: "Pringapus", grayscale: true },
    { src: "/image/tamara.png", alt: "Tamara", grayscale: true },
  ];

  return (
    <>
      {/* Hero Section */}
      <div
        id="home"
        className="relative md:w-full w-screen min-h-screen overflow-hidden  bg-gradient-to-br from-[#1e3a8a] via-[#2563eb] to-[#1d4ed8] dark:from-[#081030] dark:via-[#081030] dark:to-[#081030]"
      >
        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto min-h-screen flex items-center px-6 md:px-12 py-10 md:py-0">
          <div className="grid md:grid-cols-2 gap-10 items-center w-full">
            {/* Kolom Kiri: Teks */}
            <div className="text-center md:text-left space-y-6 text-[#ffffff] dark:text-[#CCD4DF]">
              <h2 className="text-sm sm:text-base md:text-lg font-medium tracking-wide uppercase text-white dark:text-blue-200">
                Portal Berita
              </h2>

              <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold leading-tight drop-shadow-md text-slate-300 dark:text-white">
                Rekayasa Perangkat Lunak <br />
                <span className="text-blue-300 dark:text-[#5A77DF]">SMKN 8 Jember</span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl max-w-lg mx-auto md:mx-0 leading-relaxed text-white dark:text-blue-100/90">
                Menjadi generasi{" "}
                <span className="font-semibold text-white dark:text-white">
                  unggul, berkarakter
                </span>
                , dan siap menghadapi tantangan era digital.
              </p>

              {/* Badge */}
              <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-6">
                <a
                  href="#about"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
                >
                  <Medal size={16} />
                  About RPL
                </a>
                <a
                  href="#news"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 bg-gray-700 text-white hover:bg-gray-600 dark:bg-[#323954] dark:hover:bg-[#232a3a]"
                >
                  <Newspaper size={16} />
                  Berita
                </a>
              </div>
            </div>

            {/* Kolom Kanan: Gambar */}
            <div className="flex justify-center md:justify-end mt-8 md:mt-0 items-end">
              <div className="relative w-full max-w-[320px] sm:max-w-[360px] md:max-w-[480px] p-3 transform hover:scale-105 transition">
                <img
                  src="/image/siswa-rpl.png"
                  alt="Siswa RPL"
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#1f86fd] to-[#2c7be8] py-6 md:py-8 overflow-hidden dark:bg-[#323954] dark:from-[#323954] dark:to-[#232a3a]">
        <div
          ref={sliderRef}
          className="flex items-center space-x-4 md:space-x-12 px-2 md:px-8 scrollbar-hide whitespace-nowrap overflow-hidden"
          style={{ scrollBehavior: "auto" }}
        >
          {[...Array(4)].map((_, setIndex) => (
            <React.Fragment key={setIndex}>
              {logoItems.map((logo, index) => (
                <div
                  key={`${setIndex}-${index}`}
                  className="flex-shrink-0 group w-14 h-10 md:w-24 md:h-18 flex items-center justify-center"
                >
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    className={`max-w-full max-h-full object-contain opacity-60 group-hover:opacity-100 transition-all duration-300 filter drop-shadow-lg ${
                      logo.grayscale ? "grayscale group-hover:grayscale-0" : ""
                    }`}
                  />
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </>
  );
}
