import Image from 'next/image';

export default function Header() {
  return (
    <header className="bg-white sticky top-0 z-50 shadow-sm border-b border-scoutBrown-200" role="banner">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-3 sm:py-4 flex items-center justify-between gap-3">
          <div className="flex-shrink-0">
            <Image
              src="/assets/logo-sma.png"
              alt="Logo SMA"
              width={40}
              height={40}
              className="object-contain w-9 h-9 sm:w-10 sm:h-10"
              priority
            />
          </div>

          <div className="flex-1 text-center min-w-0">
            <h1 className="text-scoutBrown-900 text-lg sm:text-xl font-bold tracking-tight">
              SURAT IZIN PRAMUKA
            </h1>
            <p className="text-scoutBrown-500 font-medium text-[0.65rem] sm:text-xs tracking-wider uppercase mt-0.5">
              Ambalan Diporani • SMAN 1 Kasihan
            </p>
          </div>

          <div className="flex-shrink-0">
            <Image
              src="/assets/logo-diporani.png"
              alt="Logo Diporani"
              width={40}
              height={40}
              className="object-contain mix-blend-multiply w-9 h-9 sm:w-10 sm:h-10"
              priority
            />
          </div>
        </div>
      </div>
    </header>
  );
}
