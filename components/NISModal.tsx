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
    <div className="fixed inset-0 bg-scoutKhaki-50 flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full border border-scoutBrown-200">
        <div className="p-8">
          <div className="text-center mb-6">
            <div className="inline-block p-3 rounded-xl bg-scoutKhaki-50 mb-4 border border-scoutBrown-100">
              <Image
                src="/assets/logo-diporani.png"
                alt="Logo Diporani"
                width={56}
                height={56}
                className="object-contain"
                priority
              />
            </div>

            <h2 className="text-xl font-bold text-scoutBrown-800 mb-1">
              Selamat Datang
            </h2>
            <p className="text-sm text-scoutBrown-500">
              Masukkan NIS untuk melanjutkan
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label
                htmlFor="nis-input"
                className="block text-sm font-medium text-scoutBrown-700 mb-2"
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
                className="w-full px-4 py-3 border border-scoutBrown-200 rounded-lg focus:outline-none focus:border-scoutBrown-500 focus:ring-1 focus:ring-scoutBrown-500 text-center font-medium bg-white text-scoutBrown-900"
                autoFocus
              />
              {error && (
                <div className="mt-3 p-3 rounded-lg bg-red-50 border border-red-200">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || nis.length < 4}
              className="w-full bg-scoutBrown-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-scoutBrown-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Memverifikasi...' : 'Masuk'}
            </button>
          </form>

          <Link
            href="/workflow"
            className="w-full mt-3 bg-scoutKhaki-100 text-scoutBrown-600 py-2.5 px-6 rounded-lg font-medium hover:bg-scoutKhaki-200 transition-colors flex items-center justify-center gap-2 border border-scoutBrown-100"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Panduan
          </Link>

          <p className="text-xs text-scoutBrown-400 text-center mt-4">
            Data Anda aman dan terlindungi
          </p>
        </div>
      </div>
    </div>
  );
}
