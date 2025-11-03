'use client';

import { useState, useEffect } from 'react';

interface SiswaData {
  kelas: string;
  nama: string;
  presensi: number;
  nis: number;
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
      setError('NIS harus minimal 4 digit');
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 sm:p-8 animate-fade-in">
        <div className="text-center mb-6">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-mediumBrown bg-opacity-10 mb-4">
            <i className="fas fa-id-card text-mediumBrown text-3xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-darkBrown mb-2">
            Selamat Datang
          </h2>
          <p className="text-gray-600 text-sm">
            Silakan masukkan NIS Anda untuk melanjutkan
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              htmlFor="nis-input"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              <i className="fas fa-id-card text-lightBrown mr-2"></i>
              Nomor Induk Siswa (NIS)
            </label>
            <input
              id="nis-input"
              type="number"
              value={nis}
              onChange={(e) => setNis(e.target.value)}
              placeholder="Contoh: 11803"
              required
              inputMode="numeric"
              pattern="[0-9]*"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-mediumBrown transition-colors text-lg text-center font-semibold"
              autoFocus
            />
            {error && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <i className="fas fa-exclamation-circle mr-2"></i>
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || nis.length < 4}
            className="w-full bg-mediumBrown text-white py-3 px-4 rounded-lg font-semibold hover:bg-darkBrown transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Memverifikasi...
              </>
            ) : (
              <>
                <i className="fas fa-arrow-right mr-2"></i>
                Lanjutkan
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            <i className="fas fa-info-circle mr-1"></i>
            NIS Anda digunakan untuk mengisi data otomatis dan melacak riwayat izin
          </p>
        </div>
      </div>
    </div>
  );
}
