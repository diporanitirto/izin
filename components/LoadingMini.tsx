'use client';

import Image from 'next/image';

export default function LoadingMini() {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="text-center">
        {/* Logo with scale animation */}
        <div className="mb-3">
          <Image
            src="/assets/logo-diporani.png"
            alt="DIPORANI"
            width={60}
            height={60}
            className="mx-auto animate-scale"
            priority
          />
        </div>

        {/* Loading Text */}
        <p className="text-gray-500 text-sm">
          Memuat<span className="animate-dots"></span>
        </p>
      </div>

      <style jsx>{`
        @keyframes scale {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.15);
          }
        }
        
        @keyframes dots {
          0% {
            content: '.';
          }
          33% {
            content: '..';
          }
          66% {
            content: '...';
          }
          100% {
            content: '.';
          }
        }
        
        .animate-scale {
          animation: scale 1.2s ease-in-out infinite;
          will-change: transform;
        }
        
        .animate-dots::after {
          content: '.';
          animation: dots 1.2s steps(3, end) infinite;
        }
      `}</style>
    </div>
  );
}
