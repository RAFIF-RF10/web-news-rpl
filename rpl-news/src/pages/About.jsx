import React from 'react';
import { FaSchool } from 'react-icons/fa';

export default function About() {
  return (
    <div id='about' className="w-screen py-16  px-4 sm:px-6 lg:px-20 dark:bg-[#081030]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="lg:w-1/2 w-full">
            <h2 className="text-3xl sm:text-4xl dark:text-[#5A77DF] lg:text-5xl font-bold text-foreground mb-6 dark:text- leading-tight text-left">
              Tentang Jurusan RPL
            </h2>
            
            <div className="space-y-6 mb-8 text-left">
              <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
                Jurusan Rekayasa Perangkat Lunak (RPL) SMK Negeri 8 Jember bukan hanya tempat belajar, 
                tetapi juga ruang untuk bertumbuh bersama teknologi. Kami menjalin kolaborasi erat 
                dengan dunia industri untuk menciptakan lulusan yang siap kerja dan berjiwa wirausaha.
              </p>
              
              <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
                Teaching Factory (TEFA) RPL bekerja sama dengan Smartlogy dan Hummasoft / Hummatech 
                (PT Humma Teknologi Indonesia) sebagai mitra kelas industri, agar siswa dapat belajar 
                langsung dari praktik dunia kerja sesungguhnya.
              </p>
            </div>

            {/* Partnership Logos & Stats */}
            <div className="grid grid-cols-2 gap-2 md:grid-cols-2 md:gap-6 mb-10">
              <div className="text-left">
                <img
                  src="image/hummatect.png"
                  alt="Kelas Industri Hummatech"
                  className="w-20 mb-2 dark:brightness-90"
                />
                <p className="text-muted-foreground text-sm">Kelas Industri Hummatech</p>
              </div>
              <div className="text-left">
                <img
                  src="image/smartlogy-logo.png"
                  alt="Smartlogy Logo"
                  className="w-20 mb-2 dark:brightness-90"
                />
                <p className="text-muted-foreground text-sm">Smartlogy</p>
              </div>
              <div className="text-left">
                <div className="text-primary text-3xl sm:text-4xl font-bold mb-2">100%</div>
                <p className="text-muted-foreground text-sm">Lulusan Terserap Industri</p>
              </div>
            </div>

      
          </div>

          <div className="lg:w-1/2 w-full relative">
            <div className="relative">
              <img
                src="image/kelas-industri.jpg"
                alt="Kegiatan Kelas Industri"
                className="w-80 h-64 md:w-full lg:h-96 rounded-2xl shadow-2xl dark:shadow-accent/20 object-cover"
              />
              
              <div className="absolute bottom-6 left-6 bg-white/10 dark:bg-black/20 backdrop-blur-md px-6 py-3 rounded-xl shadow-lg dark:shadow-accent/10 flex items-center gap-3 text-white">
                <FaSchool className="text-white" size={20} />
                <span className="font-semibold text-sm sm:text-base">Kelas Industri</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}