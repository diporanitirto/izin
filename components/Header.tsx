import Image from 'next/image';

export default function Header() {
  return (
    <header className="max-w-[1100px] mx-auto mb-6 bg-gradient-to-b from-beige to-[#efe4cd] border-2 border-mediumBrown rounded-lg shadow-lg" role="banner">
      <div className="flex items-center justify-between gap-4 px-5 pt-[18px] pb-3">
        <div className="grid place-items-center" aria-hidden="true">
          <Image 
            src="/assets/logo-sma.png" 
            alt="" 
            width={56} 
            height={56} 
            className="object-contain"
          />
        </div>
        <div className="flex-1 text-center">
          <h1 className="mb-1.5 text-mediumBrown text-2xl md:text-[1.6rem] font-semibold">
            Surat Ijin Tidak Mengikuti Pramuka
          </h1>
          <p className="text-[#6d4c41] font-medium">
            <i className="fas fa-compass text-lightBrown mr-2" aria-hidden="true"></i>
            Dewan Ambalan DIPORANI · Gudep 3089/3090 · SMA Negeri 1 Kasihan
          </p>
        </div>
        <div className="grid place-items-center" aria-hidden="true">
          <Image 
            src="/assets/logo-diporani.png" 
            alt="" 
            width={56} 
            height={56} 
            className="object-contain mix-blend-multiply"
          />
        </div>
      </div>
      <div className="rope-divider" aria-hidden="true"></div>
    </header>
  );
}
