import Image from 'next/image';

export default function Header() {
  return (
    <header className="bg-white border-b border-scoutBrown-200/50 shadow-sm sticky top-0 z-50 backdrop-blur-lg bg-white/95" role="banner">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main header content */}
        <div className="py-3 sm:py-4">
          <div className="flex items-center justify-between gap-3 sm:gap-4">
            {/* Left Logo */}
            <div className="flex-shrink-0">
              <div className="bg-gradient-to-br from-scoutKhaki-50 to-white p-1.5 rounded-lg shadow-sm border border-scoutBrown-200/50">
                <Image 
                  src="/assets/logo-sma.png" 
                  alt="Logo SMA" 
                  width={40} 
                  height={40}
                  className="object-contain w-8 h-8 sm:w-10 sm:h-10"
                />
              </div>
            </div>
            
            {/* Center Title */}
            <div className="flex-1 text-center min-w-0 px-2">
              <h1 className="text-scoutBrown-900 text-base sm:text-xl md:text-2xl font-bold leading-tight">
                Surat Izin Pramuka
              </h1>
              <p className="text-scoutBrown-600 font-medium text-[0.65rem] sm:text-xs md:text-sm mt-0.5">
                Pramuka Ambalan DIPORANI • Kelas X • Tugas XII
              </p>
            </div>
            
            {/* Right Logo */}
            <div className="flex-shrink-0">
              <div className="bg-gradient-to-br from-scoutKhaki-50 to-white p-1.5 rounded-lg shadow-sm border border-scoutBrown-200/50">
                <Image 
                  src="/assets/logo-diporani.png" 
                  alt="Logo Diporani" 
                  width={40} 
                  height={40}
                  className="object-contain mix-blend-multiply w-8 h-8 sm:w-10 sm:h-10"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}