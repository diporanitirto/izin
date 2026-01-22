'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface SiswaData {
  kelas: string;
  nama: string;
  presensi: number;
  nis: number;
  sangga: string | null;
}

interface NISModalProps {
  isOpen: boolean;
  onSubmit: (nis: string, siswaData: SiswaData) => void;
}

export default function NISModal({ isOpen, onSubmit }: NISModalProps) {
  const [nis, setNis] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Reset when modal opens
    if (isOpen) {
      setNis('');
      setError(null);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (nis.length < 4) {
      setError('NIS harus minimal 5 digit');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/data-siswa.json');
      if (!res.ok) {
        throw new Error('Gagal memuat data siswa');
      }
      const dataSiswa: SiswaData[] = await res.json();
      const siswa = dataSiswa.find((s) => s.nis === parseInt(nis));

      if (siswa) {
        onSubmit(nis, siswa);
      } else {
        setError('NIS tidak ditemukan dalam database. Periksa kembali NIS Anda.');
      }
    } catch (err) {
      console.error('Error loading siswa data:', err);
      setError('Gagal memuat data siswa. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-scoutBrown-900/90 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-scale-in relative">
        <div className="h-1.5 w-full pattern-hasduk relative z-10"></div>
        <div className="p-8">
          <div className="text-center mb-6">
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-xl bg-gradient-to-br from-scoutKhaki-50 to-white mb-4 shadow-lg border border-scoutBrown-200 p-2">
              <Image
                src="/assets/logo-diporani.png"
                alt="Logo Diporani"
                width={64}
                height={64}
                className="object-contain mix-blend-multiply"
                priority
              />
            </div>
            <h2 className="text-2xl font-bold text-scoutBrown-900 mb-2">
              Selamat Datang!
            </h2>
            <p className="text-sm text-scoutBrown-600">
              Masukkan NIS untuk melanjutkan
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label
                htmlFor="nis-input"
                className="block text-sm font-semibold text-scoutBrown-800 mb-3"
              >
                Nomor Induk Siswa (NIS)
              </label>
              <input
                id="nis-input"
                type="number"
                value={nis}
                onChange={(e) => setNis(e.target.value)}
                placeholder="Masukkan NIS"
                required
                inputMode="numeric"
                pattern="[0-9]*"
                className="w-full px-4 py-3 border-2 border-scoutBrown-300 rounded-lg focus:outline-none focus:border-scoutBrown-600 focus:ring-2 focus:ring-scoutBrown-200 transition-all text-lg text-center font-semibold bg-white hover:border-scoutBrown-400 placeholder:text-scoutBrown-300 text-scoutBrown-900"
                autoFocus
              />
              {error && (
                <div className="mt-3 p-3 rounded-lg border border-red-300 bg-red-50 animate-shake">
                  <p className="text-sm text-red-700 flex items-center gap-2 font-medium">
                    <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                  </p>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || nis.length < 4}
              className="w-full bg-gradient-to-r from-scoutBrown-700 to-scoutBrown-900 text-white py-3 px-6 rounded-lg font-semibold hover:from-scoutBrown-800 hover:to-scoutBrown-950 focus:outline-none focus:ring-2 focus:ring-scoutBrown-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl active:scale-[0.98] flex items-center justify-center gap-2 group mb-3"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Memverifikasi...</span>
                </>
              ) : (
                <>
                  <span>Masuk</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Panduan - Outside form, always clickable */}
          <Link
            href="/workflow"
            className="w-full mt-4 bg-scoutKhaki-100 text-scoutBrown-700 py-3 px-6 rounded-lg font-semibold hover:bg-scoutKhaki-200 hover:text-scoutBrown-900 transition-all flex items-center justify-center gap-2 group border border-scoutBrown-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span>Panduan</span>
          </Link>

          <div className="mt-4 pt-4 border-t border-scoutBrown-200">
            <p className="text-xs text-scoutBrown-600 text-center flex items-center justify-center gap-2">
              <svg className="w-4 h-4 text-scoutBrown-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Data Anda aman dan terlindungi
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
