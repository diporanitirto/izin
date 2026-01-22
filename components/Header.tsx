import Image from 'next/image';

export default function Header() {
  return (
    <header className="bg-white/95 backdrop-blur-lg sticky top-0 z-50 transition-all duration-300 shadow-md transform" role="banner">
      {/* Top Hasduk Line */}
      <div className="h-1.5 w-full pattern-hasduk relative z-50 shadow-sm opacity-90"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main header content */}
        <div className="py-3 sm:py-4">
          <div className="flex items-center justify-between gap-3 sm:gap-4">
            {/* Left Logo */}
            <div className="flex-shrink-0">
              <div className="bg-gradient-to-br from-white to-scoutKhaki-50 p-1.5 rounded-xl shadow-md border border-scoutBrown-200/50 hover:scale-105 transition-transform duration-300">
                <Image
                  src="/assets/logo-sma.png"
                  alt="Logo SMA"
                  width={48}
                  height={48}
                  className="object-contain w-9 h-9 sm:w-11 sm:h-11 drop-shadow-sm"
                  priority
                />
              </div>
            </div>

            {/* Center Title */}
            <div className="flex-1 text-center min-w-0 px-2 flex flex-col items-center justify-center">
              <h1 className="text-scoutBrown-900 text-lg sm:text-2xl font-bold leading-tight tracking-tight font-display drop-shadow-sm">
                SURAT IZIN PRAMUKA
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="h-px w-6 bg-scoutBrown-300 hidden sm:block"></span>
                <p className="text-scoutBrown-700 font-semibold text-[0.7rem] sm:text-xs tracking-wider uppercase">
                  Ambalan Diporani • SMAN 1 Kasihan
                </p>
                <span className="h-px w-6 bg-scoutBrown-300 hidden sm:block"></span>
              </div>
            </div>

            {/* Right Logo */}
            <div className="flex-shrink-0">
              <div className="bg-gradient-to-br from-white to-scoutKhaki-50 p-1.5 rounded-xl shadow-md border border-scoutBrown-200/50 hover:scale-105 transition-transform duration-300">
                <Image
                  src="/assets/logo-diporani.png"
                  alt="Logo Diporani"
                  width={48}
                  height={48}
                  className="object-contain mix-blend-multiply w-9 h-9 sm:w-11 sm:h-11 drop-shadow-sm"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Rope Divider (Mockup) */}
      <div className="rope-divider w-full relative z-40"></div>
    </header>
  );
}