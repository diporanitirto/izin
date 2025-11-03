import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="max-w-[1100px] mx-auto mb-4 sm:mb-6 bg-gradient-to-b from-beige to-[#efe4cd] border-2 border-mediumBrown rounded-lg shadow-lg" role="banner">
      <div className="flex items-center justify-between gap-2 sm:gap-4 px-2 sm:px-5 pt-3 sm:pt-[18px] pb-2 sm:pb-3">
        <div className="grid place-items-center flex-shrink-0" aria-hidden="true">
          <Image 
            src="/assets/logo-sma.png" 
            alt="" 
            width={40} 
            height={40} 
            className="object-contain w-[40px] h-[40px] sm:w-[56px] sm:h-[56px]"
          />
        </div>
        <div className="flex-1 text-center min-w-0 px-1">
          <h1 className="mb-0.5 sm:mb-1.5 text-mediumBrown text-base sm:text-xl md:text-[1.6rem] font-semibold leading-tight">
            Surat Ijin Tidak Mengikuti Pramuka
          </h1>
          <p className="text-[#6d4c41] font-medium text-[0.65rem] sm:text-sm md:text-base leading-snug">
            <i className="fas fa-compass text-lightBrown mr-1 sm:mr-2 text-[0.6rem] sm:text-sm" aria-hidden="true"></i>
            <span className="hidden sm:inline">Dewan Ambalan DIPORANI · Gudep 3089/3090 · SMA Negeri 1 Kasihan</span>
            <span className="sm:hidden">DIPORANI · SMA N 1 Kasihan</span>
          </p>
        </div>
        <div className="grid place-items-center flex-shrink-0" aria-hidden="true">
          <Image 
            src="/assets/logo-diporani.png" 
            alt="" 
            width={40} 
            height={40} 
            className="object-contain mix-blend-multiply w-[40px] h-[40px] sm:w-[56px] sm:h-[56px]"
          />
        </div>
      </div>
      
      {/* Navigation */}
      <div className="px-4 pb-3">
        <div className="flex items-center justify-center gap-2 sm:gap-4">
          <Link 
            href="/"
            className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/50 hover:bg-white border border-mediumBrown/30 hover:border-mediumBrown transition-all text-xs sm:text-sm font-medium text-mediumBrown hover:shadow-md"
          >
            <i className="fas fa-home text-[0.7rem] sm:text-xs"></i>
            <span className="hidden sm:inline">Beranda</span>
          </Link>
          <Link 
            href="/workflow"
            className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-amber-500 hover:bg-amber-600 border border-amber-600 transition-all text-xs sm:text-sm font-semibold text-white hover:shadow-md"
          >
            <i className="fas fa-question-circle text-[0.7rem] sm:text-xs"></i>
            <span>Cara Pakai</span>
          </Link>
        </div>
      </div>
      
      <div className="rope-divider" aria-hidden="true"></div>
    </header>
  );
}
